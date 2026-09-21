<?php
/**
 * Wallet, Coins, Real-Money Deposits, Withdrawals & Subscription Package API
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

$db = getDB();

// Publicly accessible endpoints (no auth required)
if ($action === 'get_coin_rates') {
    jsonResponse([
        'success' => true,
        'rates' => getCoinRates($db)
    ]);
}
if ($action === 'get_banks') {
    jsonResponse([
        'success' => true,
        'banks' => getNigerianBanks()
    ]);
}

$currentUser = getCurrentUser();
if (!$currentUser) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized. Please log in.'], 401);
}

try {
    switch ($action) {
        // ================= GET WALLET STATUS & HISTORY ================= //
        case 'get_wallet':
            $stmt = $db->prepare("SELECT id, username, wallet_balance, coins, package, package_expiry, daily_games_left FROM users WHERE id = ?");
            $stmt->execute([$currentUser['id']]);
            $user = $stmt->fetch();

            $txStmt = $db->prepare("SELECT id, type, amount, coins, balance_after, status, reference, description, created_at FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 30");
            $txStmt->execute([$currentUser['id']]);
            $transactions = $txStmt->fetchAll();

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$user['wallet_balance'],
                'coins' => (int)$user['coins'],
                'package' => $user['package'],
                'package_expiry' => $user['package_expiry'],
                'daily_games_left' => (int)$user['daily_games_left'],
                'transactions' => $transactions
            ]);
            break;

        // ================= INITIALIZE DEPOSIT ================= //
        case 'init_deposit':
            $amount = max(100, (float)($input['amount'] ?? 0));
            $initRes = initializeDepositTransaction($currentUser['email'], $amount, [
                'user_id' => $currentUser['id'],
                'username' => $currentUser['username']
            ]);

            jsonResponse($initRes);
            break;

        // ================= VERIFY & FINALIZE DEPOSIT ================= //
        case 'deposit':
            $amount = max(0, (float)($input['amount'] ?? 0));
            $reference = trim($input['reference'] ?? '');
            $channel = trim($input['channel'] ?? 'card');
            $coinsToAdd = (int)($input['coins'] ?? 0);

            if ($amount <= 0 && $coinsToAdd <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid deposit amount.'], 400);
            }

            // If reference provided, check for duplicate processing
            if (!empty($reference)) {
                $checkRef = $db->prepare("SELECT id FROM wallet_transactions WHERE reference = ? AND type = 'deposit'");
                $checkRef->execute([$reference]);
                if ($checkRef->fetch()) {
                    jsonResponse(['success' => false, 'message' => 'This payment reference has already been processed.'], 409);
                }

                // Verify transaction
                $verifyRes = verifyDepositTransaction($reference);
                if (!$verifyRes['success']) {
                    jsonResponse(['success' => false, 'message' => $verifyRes['message'] ?? 'Payment verification failed.'], 400);
                }
            } else {
                $reference = 'ND_DIR_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(3)));
            }

            // Fetch current balance
            $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $newBal = $currentBal + $amount;

            // Credit user wallet
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ?, coins = coins + ? WHERE id = ?")
               ->execute([$amount, $coinsToAdd, $currentUser['id']]);

            $desc = $coinsToAdd > 0 ? "Account Top-Up: ₦" . number_format($amount, 2) . " (+{$coinsToAdd} Coins)" : "Account Deposit via {$channel}";

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'deposit', ?, ?, ?, 'completed', ?, ?)
            ")->execute([$currentUser['id'], $amount, $coinsToAdd, $newBal, $reference, $desc]);

            // Refresh user session
            $refresh = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$currentUser['id']}")->fetch();
            $_SESSION['user']['wallet_balance'] = $refresh['wallet_balance'];
            $_SESSION['user']['coins'] = $refresh['coins'];

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$refresh['wallet_balance'],
                'coins' => (int)$refresh['coins'],
                'amount_credited' => $amount,
                'reference' => $reference,
                'message' => "Top-up successful! Credited ₦" . number_format($amount, 2) . " to your wallet balance."
            ]);
            break;

        // ================= REQUEST WITHDRAWAL ================= //
        case 'request_withdrawal':
            $amount = max(0, (float)($input['amount'] ?? 0));
            $bankCode = trim($input['bank_code'] ?? '');
            $bankName = trim($input['bank_name'] ?? '');
            $accountNumber = trim($input['account_number'] ?? '');
            $accountName = trim($input['account_name'] ?? '');

            if (empty($bankName) && !empty($bankCode)) {
                $banks = getNigerianBanks();
                foreach ($banks as $b) {
                    if ($b['code'] === $bankCode) {
                        $bankName = $b['name'];
                        break;
                    }
                }
            }

            if ($amount < 1000.00) {
                jsonResponse(['success' => false, 'message' => 'Minimum withdrawal amount is ₦1,000.00.'], 400);
            }
            if (empty($accountNumber) || strlen($accountNumber) !== 10 || !ctype_digit($accountNumber)) {
                jsonResponse(['success' => false, 'message' => 'Please provide a valid 10-digit NUBAN account number.'], 400);
            }
            if (empty($bankName) || empty($accountName)) {
                jsonResponse(['success' => false, 'message' => 'Bank name and account holder name are required.'], 400);
            }

            $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($currentBal < $amount) {
                jsonResponse([
                    'success' => false,
                    'message' => 'Insufficient wallet balance. Available balance: ₦' . number_format($currentBal, 2)
                ], 400);
            }

            $newBal = $currentBal - $amount;

            // Deduct immediately to prevent double spending
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")
               ->execute([$amount, $currentUser['id']]);

            $ref = 'WD_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(4)));
            $desc = "Withdrawal to {$bankName} ({$accountNumber} - {$accountName})";

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'withdrawal_request', ?, 0, ?, 'pending', ?, ?)
            ")->execute([$currentUser['id'], -$amount, $newBal, $ref, $desc]);

            $_SESSION['user']['wallet_balance'] = $newBal;

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$newBal,
                'reference' => $ref,
                'message' => "Withdrawal request of ₦" . number_format($amount, 2) . " submitted! Funds will be disbursed to your {$bankName} account."
            ]);
            break;

        // ================= GET NIGERIAN BANKS ================= //
        case 'get_banks':
            jsonResponse([
                'success' => true,
                'banks' => getNigerianBanks()
            ]);
            break;

        // ================= GET DYNAMIC COIN EXCHANGE RATES ================= //
        case 'get_coin_rates':
            $rates = getCoinRates($db);
            jsonResponse([
                'success' => true,
                'rates' => $rates
            ]);
            break;

        // ================= EXCHANGE NAIRA FOR COINS (BUY COINS) ================= //
        case 'buy_coins':
        case 'exchange_coins':
            $rates = getCoinRates($db);
            $coinsAmount = max(0, (int)($input['coins_amount'] ?? ($input['coins'] ?? 0)));
            $nairaInput = max(0, (float)($input['naira_amount'] ?? 0));

            // If coins amount not specified but naira provided, calculate coins
            if ($coinsAmount <= 0 && $nairaInput > 0) {
                $coinsAmount = (int)floor($nairaInput / max(0.01, $rates['buy_rate_per_coin']));
            }

            if ($coinsAmount <= 0) {
                jsonResponse(['success' => false, 'message' => 'Please specify a valid number of coins to buy.'], 400);
            }

            // Calculate exact Naira cost at official Buy Rate
            $nairaCost = round($coinsAmount * $rates['buy_rate_per_coin'], 2);

            $currentBalance = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($currentBalance < $nairaCost) {
                $needed = $nairaCost - $currentBalance;
                jsonResponse([
                    'success' => false,
                    'message' => "Insufficient wallet balance! Buying {$coinsAmount} Coins requires ₦" . number_format($nairaCost, 2) . " (@ ₦" . number_format($rates['buy_rate_per_100'], 2) . " per 100 Coins). You need ₦" . number_format($needed, 2) . " more. Please fund your wallet first."
                ], 400);
            }

            $newBal = round($currentBalance - $nairaCost, 2);

            $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ?, coins = coins + ? WHERE id = ?")
               ->execute([$nairaCost, $coinsAmount, $currentUser['id']]);

            $ref = 'BUY-COIN-' . strtoupper(bin2hex(random_bytes(3)));
            $desc = "Purchased {$coinsAmount} Coins for ₦" . number_format($nairaCost, 2) . " (@ ₦" . number_format($rates['buy_rate_per_100'], 2) . " / 100 Coins)";

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'coin_exchange', ?, ?, ?, 'completed', ?, ?)
            ")->execute([$currentUser['id'], -$nairaCost, $coinsAmount, $newBal, $ref, $desc]);

            $refresh = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$currentUser['id']}")->fetch();
            $_SESSION['user']['wallet_balance'] = $refresh['wallet_balance'];
            $_SESSION['user']['coins'] = $refresh['coins'];

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$refresh['wallet_balance'],
                'coins' => (int)$refresh['coins'],
                'cost_naira' => $nairaCost,
                'coins_purchased' => $coinsAmount,
                'message' => "Successfully purchased {$coinsAmount} Coins for ₦" . number_format($nairaCost, 2) . "!"
            ]);
            break;

        // ================= SELL COINS (CONVERT COINS TO NAIRA) ================= //
        case 'sell_coins':
            $rates = getCoinRates($db);
            $coinsToSell = max(0, (int)($input['coins_amount'] ?? ($input['coins'] ?? 0)));

            if ($coinsToSell < 10) {
                jsonResponse(['success' => false, 'message' => 'Minimum coin conversion amount is 10 Coins.'], 400);
            }

            $userRow = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$currentUser['id']}")->fetch(PDO::FETCH_ASSOC);
            $currentCoins = (int)($userRow['coins'] ?? 0);
            $currentBalance = (float)($userRow['wallet_balance'] ?? 0.0);

            if ($currentCoins < $coinsToSell) {
                jsonResponse([
                    'success' => false,
                    'message' => "Insufficient coin balance. You have {$currentCoins} Coins, but tried to sell {$coinsToSell} Coins."
                ], 400);
            }

            // Calculate Naira payout at official Sell Rate
            $nairaPayout = round($coinsToSell * $rates['sell_rate_per_coin'], 2);
            $newBal = round($currentBalance + $nairaPayout, 2);
            $newCoins = $currentCoins - $coinsToSell;

            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ?, coins = coins - ? WHERE id = ?")
               ->execute([$nairaPayout, $coinsToSell, $currentUser['id']]);

            $ref = 'SELL-COIN-' . strtoupper(bin2hex(random_bytes(3)));
            $desc = "Cashed Out {$coinsToSell} Coins for ₦" . number_format($nairaPayout, 2) . " (@ ₦" . number_format($rates['sell_rate_per_100'], 2) . " / 100 Coins)";

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'coin_sell', ?, ?, ?, 'completed', ?, ?)
            ")->execute([$currentUser['id'], $nairaPayout, -$coinsToSell, $newBal, $ref, $desc]);

            $_SESSION['user']['wallet_balance'] = $newBal;
            $_SESSION['user']['coins'] = $newCoins;

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$newBal,
                'coins' => (int)$newCoins,
                'naira_credited' => $nairaPayout,
                'coins_sold' => $coinsToSell,
                'message' => "Successfully converted {$coinsToSell} Coins to ₦" . number_format($nairaPayout, 2) . " cash in your wallet!"
            ]);
            break;

        // ================= UPGRADE SUBSCRIPTION PACKAGE ================= //
        case 'upgrade_package':
            $newPkg = $input['package'] ?? 'silver'; // 'silver', 'gold', 'vip_oba'
            if ($newPkg === 'vip') $newPkg = 'vip_oba';

            $packagesConfig = [
                'silver' => ['price' => 1500.00, 'daily_quota' => 25, 'title' => 'Silver Hustler'],
                'gold'   => ['price' => 3500.00, 'daily_quota' => 50, 'title' => 'Gold Master'],
                'vip_oba'=> ['price' => 7500.00, 'daily_quota' => 999, 'title' => 'Oba VIP Champion']
            ];

            if (!isset($packagesConfig[$newPkg])) {
                jsonResponse(['success' => false, 'message' => 'Invalid subscription package selected.'], 400);
            }

            $pkgInfo = $packagesConfig[$newPkg];
            $price = $pkgInfo['price'];

            $balance = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($balance < $price) {
                $needed = $price - $balance;
                jsonResponse([
                    'success' => false,
                    'message' => "Insufficient wallet balance for {$pkgInfo['title']}! Please top up at least ₦" . number_format($needed, 2) . "."
                ], 400);
            }

            $newBal = $balance - $price;
            $expiry = date('Y-m-d H:i:s', strtotime('+30 days'));

            $db->prepare("
                UPDATE users SET
                    wallet_balance = wallet_balance - ?,
                    package = ?,
                    package_expiry = ?,
                    daily_games_left = ?,
                    updated_at = NOW()
                WHERE id = ?
            ")->execute([$price, $newPkg, $expiry, $pkgInfo['daily_quota'], $currentUser['id']]);

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                VALUES (?, 'package_purchase', ?, 0, ?, 'completed', ?)
            ")->execute([$currentUser['id'], -$price, $newBal, "Upgraded to {$pkgInfo['title']} (30 Days)"]);

            $_SESSION['user']['package'] = $newPkg;
            $_SESSION['user']['daily_games_left'] = $pkgInfo['daily_quota'];
            $_SESSION['user']['wallet_balance'] = $newBal;

            jsonResponse([
                'success' => true,
                'package' => $newPkg,
                'package_title' => $pkgInfo['title'],
                'wallet_balance' => (float)$newBal,
                'daily_games_left' => $pkgInfo['daily_quota'],
                'message' => "Congratulations! You have upgraded to {$pkgInfo['title']} with {$pkgInfo['daily_quota']} daily matches!"
            ]);
            break;

        // ================= AWARD REWARD COINS (TRAP ACADEMY / QUESTS) ================= //
        case 'award_coins':
            $coinsToAdd = max(0, (int)($input['coins'] ?? ($input['amount'] ?? 50)));
            $reason = trim($input['reason'] ?? 'Trap Academy Completion Reward');

            if ($coinsToAdd <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid coins amount.'], 400);
            }

            $coinsToAdd = min(250, $coinsToAdd);

            $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")
               ->execute([$coinsToAdd, $currentUser['id']]);

            $bal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                VALUES (?, 'reward', 0, ?, ?, 'completed', ?)
            ")->execute([$currentUser['id'], $coinsToAdd, $bal, $reason]);

            $refresh = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$currentUser['id']}")->fetch();
            $_SESSION['user']['wallet_balance'] = $refresh['wallet_balance'];
            $_SESSION['user']['coins'] = $refresh['coins'];

            jsonResponse([
                'success' => true,
                'coins' => (int)$refresh['coins'],
                'coins_added' => $coinsToAdd,
                'message' => "Congratulations! Credited +{$coinsToAdd} Coins for {$reason}."
            ]);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid wallet action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Wallet server error: ' . $e->getMessage()], 500);
}
