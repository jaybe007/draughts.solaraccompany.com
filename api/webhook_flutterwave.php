<?php
/**
 * Naija Draughts - Flutterwave Webhook Handler
 * Validates secret hash, prevents duplicate crediting, and credits player wallets.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$signature = $_SERVER['HTTP_VERIF_HASH'] ?? '';

// Verify Flutterwave Secret Hash in Production
$secretHash = getenv('FLUTTERWAVE_SECRET_HASH') ?: getenv('FLUTTERWAVE_SECRET_KEY');
if (!PAYMENT_DEV_MODE && !empty($secretHash)) {
    if (empty($signature) || $signature !== $secretHash) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid webhook secret hash']);
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

    if ($event['event'] === 'charge.completed' && ($event['data']['status'] ?? '') === 'successful') {
        $data = $event['data'] ?? [];
        $reference = trim($data['tx_ref'] ?? ($data['flw_ref'] ?? ''));
        $rawPaidAmount = (float)($data['amount'] ?? 0);
        $paidCurrency = strtoupper(trim($data['currency'] ?? 'NGN'));
        $customerEmail = trim($data['customer']['email'] ?? '');
        $metadata = $data['meta'] ?? [];
        $userId = !empty($metadata['user_id']) ? (int)$metadata['user_id'] : null;
        $coinsToAdd = (int)($metadata['coins_to_add'] ?? 0);

        // Calculate converted Naira amount
        if (!empty($metadata['amount_naira']) && (float)$metadata['amount_naira'] > 0) {
            $amountNaira = (float)$metadata['amount_naira'];
        } else {
            $supported = getSupportedCurrencies();
            $fx = $supported[$paidCurrency]['rate_to_naira'] ?? 1.0;
            $amountNaira = round($rawPaidAmount * $fx, 2);
        }

        if (empty($reference) || ($amountNaira <= 0 && $coinsToAdd <= 0)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid reference or amount']);
            exit;
        }

        // Idempotency check
        $checkStmt = $db->prepare("SELECT id FROM wallet_transactions WHERE reference = ? AND status = 'completed'");
        $checkStmt->execute([$reference]);
        if ($checkStmt->fetch()) {
            http_response_code(200);
            echo json_encode(['status' => 'already_processed', 'reference' => $reference]);
            exit;
        }

        if (!$userId && !empty($customerEmail)) {
            $userStmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $userStmt->execute([$customerEmail]);
            $userId = (int)$userStmt->fetchColumn();
        }

        if (!$userId) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }

        $db->beginTransaction();

        $currentBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$userId}")->fetchColumn();
        $currentCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$userId}")->fetchColumn();

        if ($coinsToAdd > 0) {
            // Direct Coin Pack Purchase
            $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$coinsToAdd, $userId]);
            $newCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$userId}")->fetchColumn();
            $desc = "Global Coin Pack Purchase (+{$coinsToAdd} Coins via Flutterwave {$paidCurrency})";
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
                'total_coins' => $newCoins
            ]);
            exit;
        } else {
            // Real-money Wallet Balance Funding
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")
               ->execute([$amountNaira, $userId]);
            $newBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$userId}")->fetchColumn();

            $desc = ($paidCurrency !== 'NGN')
                ? "International Deposit via Flutterwave ({$paidCurrency} {$rawPaidAmount} -> ₦" . number_format($amountNaira, 2) . ")"
                : "Deposit via Flutterwave Webhook";

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
                'wallet_balance' => $newBal
            ]);
            exit;
        }
    }

    http_response_code(200);
    echo json_encode(['status' => 'ignored']);
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
