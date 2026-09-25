<?php
/**
 * Naija Draughts - Paystack Webhook Handler
 * Receives asynchronous transaction notifications from Paystack servers.
 * Validates HMAC SHA512 signature, prevents double crediting, and credits player wallets.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';

header('Content-Type: application/json; charset=utf-8');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_PAYSTACK_SIGNATURE'] ?? '';

// Verify HMAC SHA512 Signature in Production
if (!PAYMENT_DEV_MODE && !empty(PAYSTACK_SECRET_KEY)) {
    if (empty($signature) || hash_hmac('sha512', $rawInput, PAYSTACK_SECRET_KEY) !== $signature) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid webhook signature']);
        exit;
    }
}

$event = json_decode($rawInput, true);
if (!$event || empty($event['event'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Malformed webhook payload']);
    exit;
}

try {
    $db = getDB();

    switch ($event['event']) {
        case 'charge.success':
            $data = $event['data'] ?? [];
            $reference = trim($data['reference'] ?? '');
            $amountNaira = (float)(($data['amount'] ?? 0) / 100.0); // Kobo to Naira
            $customerEmail = trim($data['customer']['email'] ?? '');
            $metadata = $data['metadata'] ?? [];
            $userId = !empty($metadata['user_id']) ? (int)$metadata['user_id'] : null;

            if (empty($reference) || $amountNaira <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid reference or amount']);
                exit;
            }

            // 1. Idempotency Check: Prevent duplicate processing
            $checkStmt = $db->prepare("SELECT id FROM wallet_transactions WHERE reference = ? AND status = 'completed'");
            $checkStmt->execute([$reference]);
            if ($checkStmt->fetch()) {
                // Already processed, return 200 OK immediately
                http_response_code(200);
                echo json_encode(['status' => 'already_processed', 'reference' => $reference]);
                exit;
            }

            // 2. Identify User
            if (!$userId && !empty($customerEmail)) {
                $userStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
                $userStmt->execute([$customerEmail]);
                $userId = (int)$userStmt->fetchColumn();
            }

            if (!$userId) {
                http_response_code(404);
                echo json_encode(['error' => 'User account not found for payment reference']);
                exit;
            }

            $coinsToAdd = (int)($metadata['coins_to_add'] ?? 0);

            // 3. Credit Wallet & Log Transaction
            $db->beginTransaction();

            $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$userId}")->fetchColumn();
            $channel = $data['channel'] ?? 'paystack';

            if ($coinsToAdd > 0) {
                // Direct Coin Pack Purchase
                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$coinsToAdd, $userId]);
                $newCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$userId}")->fetchColumn();
                $desc = "Global Coin Pack Purchase (+{$coinsToAdd} Coins via Paystack)";
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'coin_exchange', ?, ?, ?, 'completed', ?, ?)
                ")->execute([$userId, $amountNaira, $coinsToAdd, $currentBal, $reference, $desc]);

                $db->commit();
                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'user_id' => $userId,
                    'coins_added' => $coinsToAdd,
                    'total_coins' => $newCoins,
                    'reference' => $reference
                ]);
                break;
            } else {
                // Real-money Wallet Balance Funding
                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")
                   ->execute([$amountNaira, $userId]);

                $newBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$userId}")->fetchColumn();
                $desc = "Deposit via Paystack Webhook ({$channel})";

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'deposit', ?, 0, ?, 'completed', ?, ?)
                ")->execute([$userId, $amountNaira, $newBal, $reference, $desc]);

                $db->commit();

                http_response_code(200);
                echo json_encode([
                    'status' => 'success',
                    'user_id' => $userId,
                    'amount' => $amountNaira,
                    'wallet_balance' => $newBal,
                    'reference' => $reference
                ]);
                break;
            }

        default:
            // Unhandled event type acknowledged
            http_response_code(200);
            echo json_encode(['status' => 'ignored', 'event' => $event['event']]);
            break;
    }
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Server error processing webhook: ' . $e->getMessage()]);
}
