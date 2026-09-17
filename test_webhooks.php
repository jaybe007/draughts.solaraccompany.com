<?php
/**
 * Automated Verification of Paystack & Flutterwave Webhook Endpoints
 */

require_once __DIR__ . '/config/db.php';

echo "========================================================\n";
echo "  TESTING PAYMENT WEBHOOKS (PAYSTACK & FLUTTERWAVE)\n";
echo "========================================================\n\n";

$db = getDB();
$testEmail = "webhook_tester_" . time() . "@example.com";
$passHash = password_hash("TestPass123!", PASSWORD_BCRYPT);

// Insert test player with ₦1,000 balance
$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 100, 1000.00, 'free', 1)")
   ->execute(["wh_user_" . time(), $testEmail, $passHash]);
$userId = (int)$db->lastInsertId();

echo "[SETUP] Created test user with ID: $userId, Email: $testEmail, Balance: ₦1,000.00\n\n";

function postWebhook($url, $payload, $headers = []) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $defaultHeaders = ['Content-Type: application/json'];
    curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge($defaultHeaders, $headers));
    $response = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $code, 'data' => json_decode($response, true), 'raw' => $response];
}

// -------------------------------------------------------------
// 1. Paystack Webhook Simulation
// -------------------------------------------------------------
echo "1. Testing Paystack Webhook (charge.success):\n";
$ref1 = "PAYSTACK_WH_" . time() . "_" . rand(1000, 9999);
$paystackPayload = [
    'event' => 'charge.success',
    'data' => [
        'id' => 12345678,
        'reference' => $ref1,
        'amount' => 250000, // ₦2,500.00 in Kobo
        'currency' => 'NGN',
        'channel' => 'card',
        'customer' => ['email' => $testEmail],
        'metadata' => ['user_id' => $userId]
    ]
];

$res1 = postWebhook('http://localhost/nigerian-draughts/api/webhook_paystack.php', $paystackPayload);
assert($res1['code'] === 200, "Paystack webhook must return HTTP 200 (Got: {$res1['code']})");
assert(!empty($res1['data']['status']) && $res1['data']['status'] === 'success', "Status must be 'success'");

$bal1 = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $userId")->fetchColumn();
assert($bal1 === 3500.00, "Wallet balance should be ₦3,500 (1000 + 2500)");
echo "  ✓ PASS: Paystack charge.success credited ₦2,500 (New Bal: ₦" . number_format($bal1, 2) . ")\n";

// Idempotency: Re-send same Paystack webhook
echo "2. Testing Paystack Webhook Replay Protection:\n";
$res1Replay = postWebhook('http://localhost/nigerian-draughts/api/webhook_paystack.php', $paystackPayload);
assert($res1Replay['code'] === 200, "Replay must return HTTP 200");
assert($res1Replay['data']['status'] === 'already_processed', "Replay must indicate 'already_processed'");
$bal1Replay = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $userId")->fetchColumn();
assert($bal1Replay === 3500.00, "Wallet balance must remain unchanged at ₦3,500");
echo "  ✓ PASS: Duplicate webhook ignored without double-crediting.\n\n";

// -------------------------------------------------------------
// 2. Flutterwave Webhook Simulation
// -------------------------------------------------------------
echo "3. Testing Flutterwave Webhook (charge.completed):\n";
$ref2 = "FLW_WH_" . time() . "_" . rand(1000, 9999);
$flwPayload = [
    'event' => 'charge.completed',
    'data' => [
        'id' => 87654321,
        'tx_ref' => $ref2,
        'amount' => 1500.00,
        'currency' => 'NGN',
        'status' => 'successful',
        'customer' => ['email' => $testEmail],
        'meta' => ['user_id' => $userId]
    ]
];

$res2 = postWebhook('http://localhost/nigerian-draughts/api/webhook_flutterwave.php', $flwPayload);
assert($res2['code'] === 200, "Flutterwave webhook must return HTTP 200 (Got: {$res2['code']})");
assert(!empty($res2['data']['status']) && $res2['data']['status'] === 'success', "Status must be 'success'");

$bal2 = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $userId")->fetchColumn();
assert($bal2 === 5000.00, "Wallet balance should be ₦5,000 (3500 + 1500)");
echo "  ✓ PASS: Flutterwave charge.completed credited ₦1,500 (New Bal: ₦" . number_format($bal2, 2) . ")\n";

// Idempotency: Re-send same Flutterwave webhook
echo "4. Testing Flutterwave Webhook Replay Protection:\n";
$res2Replay = postWebhook('http://localhost/nigerian-draughts/api/webhook_flutterwave.php', $flwPayload);
assert($res2Replay['code'] === 200, "Replay must return HTTP 200");
assert($res2Replay['data']['status'] === 'already_processed', "Replay must indicate 'already_processed'");
$bal2Replay = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $userId")->fetchColumn();
assert($bal2Replay === 5000.00, "Wallet balance must remain unchanged at ₦5,000");
echo "  ✓ PASS: Duplicate Flutterwave webhook ignored.\n\n";

// Cleanup
$db->prepare("DELETE FROM wallet_transactions WHERE user_id = ?")->execute([$userId]);
$db->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);

echo "========================================================\n";
echo "🎉 ALL PAYMENT WEBHOOK TESTS PASSED SUCCESSFULLY!\n";
echo "========================================================\n";
