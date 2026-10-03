<?php
/**
 * api/donations.php
 * Handles Community Donations & Grassroots African Draughts Tournament Funding
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

try {
    switch ($action) {
        // ================= GET WALL OF PATRONS & DONATION STATS ================= //
        case 'get_donations':
            $stmt = $db->query("
                SELECT id, donor_name, amount, currency, donation_method, coins_amount,
                       message, is_anonymous, created_at
                FROM donations
                WHERE status = 'completed'
                ORDER BY created_at DESC
                LIMIT 40
            ");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Sanitize names for anonymous donors
            $donations = array_map(function($d) {
                if (!empty($d['is_anonymous'])) {
                    $d['donor_name'] = 'Anonymous Patron';
                }
                return $d;
            }, $rows);

            $stats = $db->query("
                SELECT COUNT(*) as donor_count,
                       COALESCE(SUM(amount), 0) as total_naira,
                       COALESCE(SUM(coins_amount), 0) as total_coins
                FROM donations
                WHERE status = 'completed'
            ")->fetch(PDO::FETCH_ASSOC);

            jsonResponse([
                'success' => true,
                'donations' => $donations,
                'stats' => [
                    'donor_count' => (int)($stats['donor_count'] ?? 0),
                    'total_naira' => (float)($stats['total_naira'] ?? 0),
                    'total_coins' => (int)($stats['total_coins'] ?? 0)
                ]
            ]);
            break;

        // ================= PROCESS NEW DONATION ================= //
        case 'donate':
            $currentUser = getCurrentUser();
            $method = trim($input['method'] ?? 'wallet_balance');
            $amount = max(0, (float)($input['amount'] ?? 0));
            $coinsAmount = max(0, (int)($input['coins_amount'] ?? 0));
            $message = trim($input['message'] ?? '');
            $isAnonymous = !empty($input['is_anonymous']) ? 1 : 0;
            $donorName = trim($input['donor_name'] ?? '');
            $donorEmail = trim($input['donor_email'] ?? '');

            if ($currentUser) {
                if (empty($donorName)) $donorName = $currentUser['username'];
                if (empty($donorEmail)) $donorEmail = $currentUser['email'] ?? '';
            }
            if (empty($donorName)) {
                $donorName = $isAnonymous ? 'Anonymous Patron' : 'Supporter of Naija Draughts';
            }

            // Method 1: Donate via In-Game Wallet Balance (Naira)
            if ($method === 'wallet_balance') {
                if (!$currentUser) {
                    jsonResponse(['success' => false, 'message' => 'Please sign in to donate from your in-game wallet balance.'], 401);
                }
                if ($amount < 100) {
                    jsonResponse(['success' => false, 'message' => 'Minimum donation amount is ₦100.'], 400);
                }

                $db->beginTransaction();
                $userLock = $db->prepare("SELECT id, wallet_balance FROM users WHERE id = ? FOR UPDATE");
                $userLock->execute([$currentUser['id']]);
                $userRow = $userLock->fetch(PDO::FETCH_ASSOC);

                if (!$userRow || (float)$userRow['wallet_balance'] < $amount) {
                    $db->rollBack();
                    jsonResponse([
                        'success' => false,
                        'message' => 'Insufficient wallet balance. You have ₦' . number_format((float)($userRow['wallet_balance'] ?? 0), 2) . '.'
                    ], 400);
                }

                $newBal = (float)$userRow['wallet_balance'] - $amount;
                $db->prepare("UPDATE users SET wallet_balance = ? WHERE id = ?")->execute([$newBal, $currentUser['id']]);

                $ref = 'ND_DON_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(3)));

                // Record transaction
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'donation', ?, 0, ?, 'completed', ?, ?)
                ")->execute([
                    $currentUser['id'],
                    -$amount,
                    $newBal,
                    $ref,
                    'Community Donation for Grassroots Draughts & Prize Pools'
                ]);

                // Record donation
                $db->prepare("
                    INSERT INTO donations (user_id, donor_name, donor_email, amount, currency, donation_method, reference, message, is_anonymous, status)
                    VALUES (?, ?, ?, ?, 'NGN', 'wallet_balance', ?, ?, ?, 'completed')
                ")->execute([
                    $currentUser['id'],
                    $donorName,
                    $donorEmail,
                    $amount,
                    $ref,
                    $message,
                    $isAnonymous
                ]);

                $db->commit();

                // Update session
                if (isset($_SESSION['user']['wallet_balance'])) {
                    $_SESSION['user']['wallet_balance'] = $newBal;
                }

                jsonResponse([
                    'success' => true,
                    'message' => "Ese gan! Thank you {$donorName} for your generous donation of ₦" . number_format($amount, 2) . "!",
                    'wallet_balance' => $newBal,
                    'reference' => $ref
                ]);
            }

            // Method 2: Donate via Platform Coins
            elseif ($method === 'coins') {
                if (!$currentUser) {
                    jsonResponse(['success' => false, 'message' => 'Please sign in to donate platform coins.'], 401);
                }
                if ($coinsAmount < 50) {
                    jsonResponse(['success' => false, 'message' => 'Minimum coin donation is 50 Coins.'], 400);
                }

                $db->beginTransaction();
                $userLock = $db->prepare("SELECT id, coins FROM users WHERE id = ? FOR UPDATE");
                $userLock->execute([$currentUser['id']]);
                $userRow = $userLock->fetch(PDO::FETCH_ASSOC);

                if (!$userRow || (int)$userRow['coins'] < $coinsAmount) {
                    $db->rollBack();
                    jsonResponse([
                        'success' => false,
                        'message' => 'Insufficient coins. You have ' . number_format((int)($userRow['coins'] ?? 0)) . ' Coins.'
                    ], 400);
                }

                $newCoins = (int)$userRow['coins'] - $coinsAmount;
                $db->prepare("UPDATE users SET coins = ? WHERE id = ?")->execute([$newCoins, $currentUser['id']]);

                $ref = 'ND_DON_COIN_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(3)));

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'donation', 0, ?, 0, 'completed', ?, ?)
                ")->execute([
                    $currentUser['id'],
                    -$coinsAmount,
                    $ref,
                    'Coins Donation for African Draughts Community Prize Pools'
                ]);

                $db->prepare("
                    INSERT INTO donations (user_id, donor_name, donor_email, amount, currency, donation_method, coins_amount, reference, message, is_anonymous, status)
                    VALUES (?, ?, ?, 0, 'COINS', 'coins', ?, ?, ?, ?, 'completed')
                ")->execute([
                    $currentUser['id'],
                    $donorName,
                    $donorEmail,
                    $coinsAmount,
                    $ref,
                    $message,
                    $isAnonymous
                ]);

                $db->commit();

                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = $newCoins;
                }

                jsonResponse([
                    'success' => true,
                    'message' => "Thank you {$donorName}! Your contribution of " . number_format($coinsAmount) . " Coins will fund local draughts tourneys.",
                    'coins' => $newCoins,
                    'reference' => $ref
                ]);
            }

            // Method 3: Paystack / Flutterwave Online Payment Gateway
            elseif ($method === 'paystack' || $method === 'flutterwave') {
                if ($amount < 100) {
                    jsonResponse(['success' => false, 'message' => 'Minimum donation amount is ₦100.'], 400);
                }

                $ref = 'ND_DON_' . strtoupper(substr($method, 0, 3)) . '_' . date('YmdHis') . '_' . strtoupper(bin2hex(random_bytes(3)));

                // Check payment dev mode
                $devMode = filter_var(getenv('PAYMENT_DEV_MODE') ?: 'true', FILTER_VALIDATE_BOOLEAN);

                if ($devMode) {
                    // Simulated instant completion in development mode
                    $db->prepare("
                        INSERT INTO donations (user_id, donor_name, donor_email, amount, currency, donation_method, reference, message, is_anonymous, status)
                        VALUES (?, ?, ?, ?, 'NGN', ?, ?, ?, ?, 'completed')
                    ")->execute([
                        $currentUser ? $currentUser['id'] : null,
                        $donorName,
                        $donorEmail,
                        $amount,
                        $method,
                        $ref,
                        $message,
                        $isAnonymous
                    ]);

                    jsonResponse([
                        'success' => true,
                        'message' => "Thank you {$donorName}! Your payment of ₦" . number_format($amount, 2) . " was processed successfully.",
                        'reference' => $ref,
                        'simulated' => true
                    ]);
                }

                // Production gateway initialization
                $callBackUrl = getAppBaseUrl() . 'donate.php?reference=' . urlencode($ref) . '&verified=1';

                $db->prepare("
                    INSERT INTO donations (user_id, donor_name, donor_email, amount, currency, donation_method, reference, message, is_anonymous, status)
                    VALUES (?, ?, ?, ?, 'NGN', ?, ?, ?, ?, 'pending')
                ")->execute([
                    $currentUser ? $currentUser['id'] : null,
                    $donorName,
                    $donorEmail,
                    $amount,
                    $method,
                    $ref,
                    $message,
                    $isAnonymous
                ]);

                if ($method === 'paystack') {
                    $secretKey = getenv('PAYSTACK_SECRET_KEY') ?: '';
                    $initRes = paystackInitializeTransaction([
                        'amount' => (int)($amount * 100), // Kobo
                        'email' => $donorEmail ?: 'patron@solaraccompany.com',
                        'reference' => $ref,
                        'callback_url' => $callBackUrl,
                        'metadata' => [
                            'type' => 'donation',
                            'donor_name' => $donorName,
                            'message' => $message,
                            'is_anonymous' => $isAnonymous
                        ]
                    ], $secretKey);

                    if ($initRes['success'] && !empty($initRes['data']['authorization_url'])) {
                        jsonResponse([
                            'success' => true,
                            'authorization_url' => $initRes['data']['authorization_url'],
                            'reference' => $ref
                        ]);
                    } else {
                        jsonResponse(['success' => false, 'message' => $initRes['message'] ?? 'Could not initialize Paystack checkout.'], 400);
                    }
                } else {
                    $secretKey = getenv('FLUTTERWAVE_SECRET_KEY') ?: '';
                    $initRes = flutterwaveInitializeTransaction([
                        'tx_ref' => $ref,
                        'amount' => $amount,
                        'currency' => 'NGN',
                        'redirect_url' => $callBackUrl,
                        'customer' => [
                            'email' => $donorEmail ?: 'patron@solaraccompany.com',
                            'name' => $donorName
                        ],
                        'meta' => [
                            'type' => 'donation',
                            'is_anonymous' => $isAnonymous
                        ]
                    ], $secretKey);

                    if ($initRes['success'] && !empty($initRes['data']['link'])) {
                        jsonResponse([
                            'success' => true,
                            'authorization_url' => $initRes['data']['link'],
                            'reference' => $ref
                        ]);
                    } else {
                        jsonResponse(['success' => false, 'message' => $initRes['message'] ?? 'Could not initialize Flutterwave checkout.'], 400);
                    }
                }
            } else {
                jsonResponse(['success' => false, 'message' => 'Unsupported donation payment method.'], 400);
            }
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid action.'], 400);
            break;
    }
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
