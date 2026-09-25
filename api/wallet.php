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
if ($action === 'get_currencies') {
    jsonResponse([
        'success' => true,
        'currencies' => getSupportedCurrencies($db)
    ]);
}
if ($action === 'get_coin_bundles') {
    $curr = $_GET['currency'] ?? 'NGN';
    jsonResponse([
        'success' => true,
        'bundles' => getCoinBundles($curr, $db)
    ]);
}
if ($action === 'get_banks') {
    jsonResponse([
        'success' => true,
        'banks' => getNigerianBanks(),
        'withdrawal_channels' => getWithdrawalChannels()
    ]);
}
if ($action === 'get_withdrawal_channels') {
    jsonResponse([
        'success' => true,
        'channels' => getWithdrawalChannels(),
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

        // ================= INITIALIZE MULTI-CURRENCY DEPOSIT ================= //
        case 'init_deposit':
            $currency = strtoupper(trim($input['currency'] ?? 'NGN'));
            $supported = getSupportedCurrencies($db);
            if (!isset($supported[$currency])) {
                $currency = 'NGN';
            }
            $minDep = (float)($supported[$currency]['min_deposit'] ?? 1.0);
            $amount = (float)($input['amount'] ?? 0);
            $coinsToAdd = (int)($input['coins'] ?? 0);
            $bundleId = trim($input['bundle_id'] ?? '');

            if ($amount < $minDep && $coinsToAdd <= 0) {
                jsonResponse(['success' => false, 'message' => "Minimum deposit for {$currency} is {$supported[$currency]['symbol']}{$minDep}."], 400);
            }

            $metadata = [
                'user_id' => $currentUser['id'],
                'username' => $currentUser['username'],
                'currency' => $currency,
                'coins_to_add' => $coinsToAdd,
                'bundle_id' => $bundleId
            ];

            $initRes = initializeDepositTransaction($currentUser['email'], $amount, $currency, $metadata);
            jsonResponse($initRes);
            break;

        // ================= VERIFY & FINALIZE DEPOSIT ================= //
        case 'deposit':
            $amount = max(0, (float)($input['amount'] ?? 0));
            $currency = strtoupper(trim($input['currency'] ?? 'NGN'));
            $reference = trim($input['reference'] ?? '');
            $channel = trim($input['channel'] ?? 'card');
            $coinsToAdd = (int)($input['coins'] ?? 0);
            $bundleId = trim($input['bundle_id'] ?? '');

            // If reference provided, check for duplicate processing and verify with gateway
            if (!empty($reference)) {
                $checkRef = $db->prepare("SELECT id FROM wallet_transactions WHERE reference = ? AND type IN ('deposit', 'coin_exchange')");
                $checkRef->execute([$reference]);
                if ($checkRef->fetch()) {
                    jsonResponse(['success' => false, 'message' => 'This payment reference has already been processed.'], 409);
                }

                // Verify transaction
                $verifyRes = verifyDepositTransaction($reference);
                if (!$verifyRes['success']) {
                    jsonResponse(['success' => false, 'message' => $verifyRes['message'] ?? 'Payment verification failed.'], 400);
                }

                if (!empty($verifyRes['amount'])) {
                    $amountNaira = (float)$verifyRes['amount'];
                }
                if (!empty($verifyRes['paid_amount'])) {
                    $amount = (float)$verifyRes['paid_amount'];
                }
                if (!empty($verifyRes['currency'])) {
                    $currency = strtoupper($verifyRes['currency']);
                }
                if (!empty($verifyRes['channel'])) {
                    $channel = $verifyRes['channel'];
                }
                if ($coinsToAdd <= 0 && !empty($verifyRes['metadata']['coins_to_add'])) {
                    $coinsToAdd = (int)$verifyRes['metadata']['coins_to_add'];
                }
                if (empty($bundleId) && !empty($verifyRes['metadata']['bundle_id'])) {
                    $bundleId = $verifyRes['metadata']['bundle_id'];
                }
            } else {
                $reference = 'ND_DIR_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(3)));
            }

            $supported = getSupportedCurrencies($db);
            $rateToNaira = $supported[$currency]['rate_to_naira'] ?? 1.0;
            if (empty($amountNaira) && $amount > 0) {
                $amountNaira = round($amount * $rateToNaira, 2);
            }

            if ($amount <= 0 && $amountNaira <= 0 && $coinsToAdd <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid deposit amount.'], 400);
            }

            // Fetch current balance
            $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $currentCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            $db->beginTransaction();
            if ($coinsToAdd > 0) {
                // Direct Global Coin Bundle purchase
                $newCoins = $currentCoins + $coinsToAdd;
                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$coinsToAdd, $currentUser['id']]);

                $symbol = $supported[$currency]['symbol'] ?? '₦';
                $desc = "Global Coin Pack Purchase: +{$coinsToAdd} Coins via {$channel} ({$symbol}" . number_format($amount, 2) . " {$currency})";

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'coin_exchange', ?, ?, ?, 'completed', ?, ?)
                ")->execute([$currentUser['id'], $amountNaira, $coinsToAdd, $currentBal, $reference, $desc]);

                $message = "Coin purchase successful! +{$coinsToAdd} Coins added to your balance.";
            } else {
                // Real-money cash deposit to wallet_balance
                $newBal = $currentBal + $amountNaira;
                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$amountNaira, $currentUser['id']]);

                $symbol = $supported[$currency]['symbol'] ?? '₦';
                $desc = ($currency !== 'NGN')
                    ? "International Deposit: {$symbol}" . number_format($amount, 2) . " {$currency} (@ ₦{$rateToNaira}) via {$channel}"
                    : "Account Deposit via {$channel}";

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'deposit', ?, 0, ?, 'completed', ?, ?)
                ")->execute([$currentUser['id'], $amountNaira, $newBal, $reference, $desc]);

                $message = "Deposit successful! Credited ₦" . number_format($amountNaira, 2) . " to your wallet balance.";
            }
            $db->commit();

            // Refresh user session
            $refresh = $db->query("SELECT wallet_balance, coins FROM users WHERE id = {$currentUser['id']}")->fetch();
            $_SESSION['user']['wallet_balance'] = $refresh['wallet_balance'];
            $_SESSION['user']['coins'] = $refresh['coins'];

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$refresh['wallet_balance'],
                'coins' => (int)$refresh['coins'],
                'amount_credited' => $amountNaira,
                'coins_credited' => $coinsToAdd,
                'reference' => $reference,
                'message' => $message
            ]);
            break;

        // ================= REQUEST MULTI-CHANNEL WITHDRAWAL ================= //
        case 'request_withdrawal':
            $amountNaira = max(0, (float)($input['amount'] ?? 0));
            $channelType = trim($input['channel_type'] ?? 'nigerian_bank');

            $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($amountNaira < 1000.00) {
                jsonResponse(['success' => false, 'message' => 'Minimum withdrawal amount is ₦1,000.00.'], 400);
            }
            if ($currentBal < $amountNaira) {
                jsonResponse([
                    'success' => false,
                    'message' => 'Insufficient wallet balance. Available balance: ₦' . number_format($currentBal, 2)
                ], 400);
            }

            $desc = '';
            $payoutSummary = '';

            if ($channelType === 'nigerian_bank') {
                $bankCode = trim($input['bank_code'] ?? '');
                $bankName = trim($input['bank_name'] ?? '');
                $accountNumber = trim($input['account_number'] ?? '');
                $accountName = trim($input['account_name'] ?? '');

                if (empty($bankName) && !empty($bankCode)) {
                    $banks = getNigerianBanks();
                    foreach ($banks as $b) {
                        if ($b['code'] === $bankCode) { $bankName = $b['name']; break; }
                    }
                }
                if (empty($accountNumber) || strlen($accountNumber) !== 10 || !ctype_digit($accountNumber)) {
                    jsonResponse(['success' => false, 'message' => 'Please provide a valid 10-digit NUBAN account number.'], 400);
                }
                if (empty($bankName) || empty($accountName)) {
                    jsonResponse(['success' => false, 'message' => 'Bank name and account holder name are required.'], 400);
                }
                $desc = "Nigerian Bank Payout: {$bankName} ({$accountNumber} - {$accountName})";
                $payoutSummary = "₦" . number_format($amountNaira, 2) . " to your {$bankName} account";

            } elseif ($channelType === 'usdt_crypto') {
                $walletAddress = trim($input['wallet_address'] ?? '');
                $network = trim($input['network'] ?? 'TRC-20');

                if (empty($walletAddress) || strlen($walletAddress) < 20) {
                    jsonResponse(['success' => false, 'message' => 'Please enter a valid USDT wallet address.'], 400);
                }
                $currencies = getSupportedCurrencies($db);
                $usdRate = $currencies['USD']['rate_to_naira'] ?? 1500.0;
                $estUsdt = round($amountNaira / $usdRate, 2);

                $desc = "USDT Crypto Payout ({$network}): {$walletAddress} (~{$estUsdt} USDT @ ₦{$usdRate})";
                $payoutSummary = "~{$estUsdt} USDT ({$network}) to {$walletAddress}";

            } elseif ($channelType === 'ghana_momo') {
                $momoNumber = trim($input['momo_number'] ?? '');
                $momoNetwork = trim($input['momo_network'] ?? 'MTN');

                if (empty($momoNumber) || strlen($momoNumber) < 9) {
                    jsonResponse(['success' => false, 'message' => 'Please enter a valid Ghana Mobile Money number.'], 400);
                }
                $currencies = getSupportedCurrencies($db);
                $ghsRate = $currencies['GHS']['rate_to_naira'] ?? 100.0;
                $estGhs = round($amountNaira / $ghsRate, 2);

                $desc = "Ghana MoMo Payout ({$momoNetwork}): {$momoNumber} (~GH₵{$estGhs})";
                $payoutSummary = "~GH₵{$estGhs} to {$momoNetwork} ({$momoNumber})";

            } elseif ($channelType === 'kenya_mpesa') {
                $mpesaNumber = trim($input['mpesa_number'] ?? '');

                if (empty($mpesaNumber) || strlen($mpesaNumber) < 9) {
                    jsonResponse(['success' => false, 'message' => 'Please enter a valid M-Pesa phone number.'], 400);
                }
                $currencies = getSupportedCurrencies($db);
                $kesRate = $currencies['KES']['rate_to_naira'] ?? 12.0;
                $estKes = round($amountNaira / $kesRate, 2);

                $desc = "Kenya M-Pesa Payout: {$mpesaNumber} (~KSh{$estKes})";
                $payoutSummary = "~KSh{$estKes} to M-Pesa ({$mpesaNumber})";

            } elseif ($channelType === 'paypal') {
                $paypalEmail = trim($input['paypal_email'] ?? '');

                if (empty($paypalEmail) || !filter_var($paypalEmail, FILTER_VALIDATE_EMAIL)) {
                    jsonResponse(['success' => false, 'message' => 'Please enter a valid PayPal account email address.'], 400);
                }
                $currencies = getSupportedCurrencies($db);
                $usdRate = $currencies['USD']['rate_to_naira'] ?? 1500.0;
                $estUsd = round($amountNaira / $usdRate, 2);

                $desc = "PayPal Global Payout: {$paypalEmail} (~${$estUsd} USD)";
                $payoutSummary = "~${$estUsd} USD to PayPal ({$paypalEmail})";
            } else {
                jsonResponse(['success' => false, 'message' => 'Unsupported withdrawal channel.'], 400);
            }

            $newBal = $currentBal - $amountNaira;

            $db->beginTransaction();
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")
               ->execute([$amountNaira, $currentUser['id']]);

            $ref = 'WD_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(4)));

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'withdrawal_request', ?, 0, ?, 'pending', ?, ?)
            ")->execute([$currentUser['id'], -$amountNaira, $newBal, $ref, $desc]);

            $db->commit();

            $_SESSION['user']['wallet_balance'] = $newBal;

            jsonResponse([
                'success' => true,
                'wallet_balance' => (float)$newBal,
                'reference' => $ref,
                'message' => "Withdrawal request of ₦" . number_format($amountNaira, 2) . " submitted! Payout: {$payoutSummary}."
            ]);
            break;

        // ================= GET NIGERIAN BANKS ================= //
        case 'get_banks':
            jsonResponse([
                'success' => true,
                'banks' => getNigerianBanks(),
                'withdrawal_channels' => getWithdrawalChannels()
            ]);
            break;

        case 'get_currencies':
            jsonResponse([
                'success' => true,
                'currencies' => getSupportedCurrencies($db)
            ]);
            break;

        case 'get_coin_bundles':
            $curr = $_GET['currency'] ?? 'NGN';
            jsonResponse([
                'success' => true,
                'bundles' => getCoinBundles($curr, $db)
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
