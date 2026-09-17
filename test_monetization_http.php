<?php
/**
 * Nigerian Draughts - Monetization HTTP Endpoint Verification
 * Tests live HTTP API calls with cookies/sessions:
 *  - api/wallet.php?action=get_banks
 *  - api/wallet.php?action=init_deposit
 *  - api/wallet.php?action=deposit
 *  - api/wallet.php?action=upgrade_package
 *  - api/wallet.php?action=request_withdrawal
 */

require_once __DIR__ . '/config/db.php';

$baseUrl = 'http://localhost/nigerian-draughts/api';
$cookieFile = __DIR__ . '/test_monetize_cookies.txt';
if (file_exists($cookieFile)) unlink($cookieFile);

echo "========================================================\n";
echo "  MONETIZATION HTTP API INTEGRATION TESTS\n";
echo "========================================================\n\n";

function makeRequest($url, $method = 'GET', $data = null) {
    global $cookieFile;
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

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'body' => $response,
        'data' => json_decode($response, true),
        'error' => $err
    ];
}

$db = getDB();
$testEmail = "monetize_http_" . time() . "@example.com";
$testUser = "http_player_" . time();
$passHash = password_hash("NaijaTestPass123!", PASSWORD_BCRYPT);

// Insert verified user with ₦20,000 balance
$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 500, 20000.00, 'free', 1)")
   ->execute([$testUser, $testEmail, $passHash]);
$userId = $db->lastInsertId();

echo "[SETUP] Created test user $testUser (ID: $userId) with ₦20,000\n";

// 1. Log in via auth.php
echo "\n1. Logging in via HTTP:\n";
$loginRes = makeRequest("$baseUrl/auth.php?action=login", 'POST', [
    'login' => $testUser,
    'password' => 'NaijaTestPass123!'
]);
echo "  HTTP Code: {$loginRes['code']}\n";
assert(!empty($loginRes['data']['success']), "Login must succeed");
echo "  ✓ PASS: Logged in successfully. Session cookie established.\n";

// 2. Test get_banks
echo "\n2. Testing get_banks endpoint:\n";
$banksRes = makeRequest("$baseUrl/wallet.php?action=get_banks");
echo "  HTTP Code: {$banksRes['code']}\n";
assert(!empty($banksRes['data']['success']), "get_banks must return success");
assert(count($banksRes['data']['banks']) >= 10, "get_banks must return at least 10 Nigerian banks");
echo "  ✓ PASS: Returned " . count($banksRes['data']['banks']) . " Nigerian banks.\n";

// 3. Test init_deposit
echo "\n3. Testing init_deposit endpoint:\n";
$initRes = makeRequest("$baseUrl/wallet.php?action=init_deposit", 'POST', [
    'amount' => 5000
]);
echo "  HTTP Code: {$initRes['code']}\n";
assert(!empty($initRes['data']['success']), "init_deposit must return success");
$reference = $initRes['data']['reference'] ?? '';
assert(!empty($reference), "init_deposit must return reference");
echo "  ✓ PASS: Deposit initialized with reference: $reference\n";

// 4. Test deposit (verification & credit)
echo "\n4. Testing deposit verification endpoint:\n";
$depositRes = makeRequest("$baseUrl/wallet.php?action=deposit", 'POST', [
    'reference' => $reference,
    'amount' => 5000
]);
echo "  HTTP Code: {$depositRes['code']}\n";
assert(!empty($depositRes['data']['success']), "deposit must return success");
echo "  Balance returned: ₦" . number_format($depositRes['data']['wallet_balance'] ?? 0, 2) . "\n";
assert((float)$depositRes['data']['wallet_balance'] === 25000.00, "Wallet balance should be ₦25,000");
echo "  ✓ PASS: ₦5,000 deposit verified and credited to wallet.\n";

// 5. Test upgrade_package (VIP Oba @ ₦7,500)
echo "\n5. Testing upgrade_package to VIP Oba:\n";
$upgradeRes = makeRequest("$baseUrl/wallet.php?action=upgrade_package", 'POST', [
    'package' => 'vip'
]);
echo "  HTTP Code: {$upgradeRes['code']}\n";
assert(!empty($upgradeRes['data']['success']), "upgrade_package must return success");
echo "  Package after upgrade: {$upgradeRes['data']['package']}\n";
echo "  Balance after upgrade: ₦" . number_format($upgradeRes['data']['wallet_balance'] ?? 0, 2) . "\n";
assert((float)$upgradeRes['data']['wallet_balance'] === 17500.00, "Wallet balance should be ₦17,500 after ₦7,500 deduction");
echo "  ✓ PASS: Package upgraded to VIP Oba.\n";

// 6. Test request_withdrawal (Cashout to GTBank)
echo "\n6. Testing request_withdrawal cashier endpoint:\n";
$withdrawRes = makeRequest("$baseUrl/wallet.php?action=request_withdrawal", 'POST', [
    'amount' => 5000,
    'bank_code' => '058',
    'account_number' => '0123456789',
    'account_name' => 'Ayoade Adeyemi'
]);
echo "  HTTP Code: {$withdrawRes['code']}\n";
assert(!empty($withdrawRes['data']['success']), "request_withdrawal must return success");
echo "  Balance after withdrawal: ₦" . number_format($withdrawRes['data']['wallet_balance'] ?? 0, 2) . "\n";
assert((float)$withdrawRes['data']['wallet_balance'] === 12500.00, "Wallet balance should be ₦12,500 after ₦5,000 deduction");
echo "  Withdrawal Ref: {$withdrawRes['data']['reference']}\n";
echo "  ✓ PASS: Bank cashout requested and balance updated.\n";

// 7. Test invalid withdrawal (< ₦1,000)
echo "\n7. Testing under-minimum withdrawal rejection:\n";
$underMinRes = makeRequest("$baseUrl/wallet.php?action=request_withdrawal", 'POST', [
    'amount' => 200,
    'bank_code' => '058',
    'account_number' => '0123456789',
    'account_name' => 'Ayoade Adeyemi'
]);
assert(empty($underMinRes['data']['success']), "Should reject withdrawal under ₦1,000");
echo "  Rejection message: {$underMinRes['data']['message']}\n";
echo "  ✓ PASS: Properly rejected under-minimum withdrawal.\n";

// Cleanup
$db->prepare("DELETE FROM wallet_transactions WHERE user_id = ?")->execute([$userId]);
$db->prepare("DELETE FROM users WHERE id = ?")->execute([$userId]);
if (file_exists($cookieFile)) unlink($cookieFile);
echo "\n[INFO] Cleaned up temporary HTTP test user and cookies.\n";

echo "\n========================================================\n";
echo "🎉 ALL MONETIZATION HTTP ENDPOINTS VERIFIED SUCCESSFULLY!\n";
echo "========================================================\n";
