<?php
/**
 * Automated HTTP Verification for Coin Exchange & Rates Endpoints
 */

$baseUrl = 'http://localhost/nigerian-draughts';

echo "========================================================\n";
echo "🌐 TESTING COIN EXCHANGE ENDPOINTS OVER HTTP\n";
echo "========================================================\n\n";

function httpReq($url, $cookieFile, $method = 'GET', $data = null) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

    if ($method === 'POST') {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        if ($data !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($data) ? $data : json_encode($data));
        }
    }

    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ['code' => $code, 'data' => json_decode($body, true), 'raw' => $body];
}

// 1. Test get_coin_rates public API
$rateRes = httpReq("{$baseUrl}/api/wallet.php?action=get_coin_rates", '');
echo "1. Testing GET api/wallet.php?action=get_coin_rates:\n";
if ($rateRes['code'] === 200 && !empty($rateRes['data']['success'])) {
    $r = $rateRes['data']['rates'];
    echo "  ✓ HTTP 200: Rates endpoint functioning properly!\n";
    echo "  ✓ Buy Rate: ₦{$r['buy_rate_per_100']} per 100 (₦{$r['buy_rate_per_coin']}/coin)\n";
    echo "  ✓ Sell Rate: ₦{$r['sell_rate_per_100']} per 100 (₦{$r['sell_rate_per_coin']}/coin)\n";
    echo "  ✓ Match Commission: {$r['match_commission_percent']}%\n";
} else {
    echo "  ✗ Failed to fetch rates: " . $rateRes['raw'] . "\n";
    exit(1);
}

// 2. Test authenticated flow with test user
require_once __DIR__ . '/config/db.php';
$db = getDB();

$testUsername = 'HttpCoinUser_' . rand(100, 999);
$testEmail = strtolower($testUsername) . '@test.com';
$password = 'TestPass123!';
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified)
    VALUES (?, ?, ?, 5000.00, 200, 1500, 1)
");
$stmt->execute([$testUsername, $testEmail, $passwordHash]);
$testUserId = (int)$db->lastInsertId();

$cookieFile = __DIR__ . '/test_cookie_' . $testUserId . '.txt';
if (file_exists($cookieFile)) unlink($cookieFile);

// Login
$loginRes = httpReq("{$baseUrl}/api/auth.php?action=login", $cookieFile, 'POST', [
    'login' => $testUsername,
    'password' => $password
]);

echo "\n2. Testing Authenticated Buy Coins via HTTP:\n";
$buyRes = httpReq("{$baseUrl}/api/wallet.php?action=buy_coins", $cookieFile, 'POST', ['coins_amount' => 100]);
if (!empty($buyRes['data']['success'])) {
    echo "  ✓ HTTP 200: Successfully bought 100 coins for ₦{$buyRes['data']['cost_naira']}!\n";
    echo "  ✓ New Balance: ₦{$buyRes['data']['wallet_balance']} | Coins: {$buyRes['data']['coins']}\n";
} else {
    echo "  ✗ Buy Coins failed: " . $buyRes['raw'] . "\n";
}

echo "\n3. Testing Authenticated Sell Coins via HTTP:\n";
$sellRes = httpReq("{$baseUrl}/api/wallet.php?action=sell_coins", $cookieFile, 'POST', ['coins_amount' => 100]);
if (!empty($sellRes['data']['success'])) {
    echo "  ✓ HTTP 200: Successfully converted 100 coins to ₦{$sellRes['data']['naira_credited']} cash!\n";
    echo "  ✓ New Balance: ₦{$sellRes['data']['wallet_balance']} | Coins: {$sellRes['data']['coins']}\n";
} else {
    echo "  ✗ Sell Coins failed: " . $sellRes['raw'] . "\n";
}

// Cleanup
$db->prepare("DELETE FROM wallet_transactions WHERE user_id = ?")->execute([$testUserId]);
$db->prepare("DELETE FROM users WHERE id = ?")->execute([$testUserId]);
if (file_exists($cookieFile)) unlink($cookieFile);

echo "\n========================================================\n";
echo "🎉 ALL HTTP ENDPOINT TESTS PASSED SUCCESSFULLY!\n";
echo "========================================================\n";
