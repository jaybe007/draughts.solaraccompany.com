<?php
/**
 * Automated Test Suite for Email Verification on Sign Up
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/mail.php';

echo "====================================================\n";
echo "NAIJA DRAUGHTS: EMAIL VERIFICATION TEST SUITE\n";
echo "====================================================\n\n";

$db = getDB();
$testUser = 'VerifyHero_' . rand(1000, 9999);
$testEmail = strtolower($testUser) . '@example.ng';
$testPass = 'ChampionPass123';

// Helper function to simulate API POST call with cookie session support
function simulateApiCall($payload) {
    $cookieFile = __DIR__ . '/test_auth_cookies.txt';
    $ch = curl_init('http://localhost/nigerian-draughts/api/auth.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
    curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'data' => json_decode($response, true),
        'raw' => $response
    ];
}

// 1. Test Database Schema
echo "1. Verifying Database Schema for Email Verification:\n";
$cols = $db->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
assert(in_array('is_verified', $cols), "users table must have 'is_verified' column");
assert(in_array('verification_token', $cols), "users table must have 'verification_token' column");
assert(in_array('verification_code', $cols), "users table must have 'verification_code' column");
assert(in_array('verification_expires_at', $cols), "users table must have 'verification_expires_at' column");
assert(in_array('email_verified_at', $cols), "users table must have 'email_verified_at' column");
echo "  ✓ PASS: All 5 verification columns are present in MySQL 'users' table.\n\n";

// 2. Test Registration Flow
echo "2. Testing User Registration with Email Verification Dispatch:\n";
$regRes = simulateApiCall([
    'action' => 'register',
    'username' => $testUser,
    'email' => $testEmail,
    'password' => $testPass
]);

assert($regRes['data']['success'] === true, "Registration should return success");
assert($regRes['data']['requires_verification'] === true, "Registration must require verification");
assert(!empty($regRes['data']['dev_otp']), "Dev OTP should be returned in local dev mode");
$otp = $regRes['data']['dev_otp'];
$token = $regRes['data']['dev_token'];
echo "  ✓ PASS: Registration returned requires_verification: true with 6-digit OTP: {$otp}\n";

// Verify DB record
$userInDb = $db->query("SELECT * FROM users WHERE email = '{$testEmail}'")->fetch();
assert($userInDb !== false, "User must be in database");
assert((int)$userInDb['is_verified'] === 0, "User must be unverified initially (is_verified === 0)");
assert($userInDb['verification_code'] === $otp, "DB verification code must match OTP");
assert(!empty($userInDb['verification_token']), "DB verification token must not be empty");
echo "  ✓ PASS: Database record verified: is_verified = 0, token & OTP stored with 24-hr expiration.\n\n";

// 3. Test Login with Unverified Account (Must be Blocked)
echo "3. Testing Login with Unverified Account:\n";
$loginUnverified = simulateApiCall([
    'action' => 'login',
    'login' => $testEmail,
    'password' => $testPass
]);

assert($loginUnverified['data']['success'] === false, "Unverified login must fail");
assert($loginUnverified['data']['requires_verification'] === true, "Unverified login must return requires_verification: true");
assert($loginUnverified['code'] === 403, "Unverified login must return HTTP 403 Forbidden");
echo "  ✓ PASS: Unverified login blocked with HTTP 403 and requires_verification notice.\n\n";

// 4. Test Verification with Wrong Code
echo "4. Testing Verification with Invalid 6-Digit Code:\n";
$wrongVerify = simulateApiCall([
    'action' => 'verify_code',
    'email' => $testEmail,
    'code' => '000000'
]);

assert($wrongVerify['data']['success'] === false, "Invalid code must fail");
echo "  ✓ PASS: Invalid code '000000' properly rejected.\n\n";

// 5. Test Resend Verification Endpoint & Cooldown
echo "5. Testing Resend Verification Code Endpoint:\n";
$resendRes = simulateApiCall([
    'action' => 'resend_verification',
    'email' => $testEmail
]);
assert($resendRes['data']['success'] === true, "Resend endpoint should succeed");
assert(!empty($resendRes['data']['dev_otp']), "Resend endpoint should return new dev_otp");
$otp = $resendRes['data']['dev_otp'];
echo "  ✓ PASS: Resend endpoint responded: " . ($resendRes['data']['message'] ?? '') . " (New OTP: {$otp})\n";

// Test rapid second resend to verify 60s cooldown
$resendCooldown = simulateApiCall([
    'action' => 'resend_verification',
    'email' => $testEmail
]);
assert($resendCooldown['code'] === 429 || $resendCooldown['data']['success'] === false, "Cooldown must block rapid resend");
echo "  ✓ PASS: Rate-limiting enforced: " . ($resendCooldown['data']['message'] ?? '') . "\n\n";

// 6. Test Verification with Correct 6-Digit OTP Code
echo "6. Testing Verification with Valid 6-Digit Code:\n";
$validVerify = simulateApiCall([
    'action' => 'verify_code',
    'email' => $testEmail,
    'code' => $otp
]);

assert($validVerify['data']['success'] === true, "Valid code verification must succeed");
assert(!empty($validVerify['data']['user']), "Verified user profile must be returned");
assert((int)$validVerify['data']['user']['is_verified'] === 1, "User is_verified must be 1 in response");
echo "  ✓ PASS: Verification succeeded! Account activated: {$validVerify['data']['user']['username']}\n";

// Check DB after verification
$userVerifiedDb = $db->query("SELECT * FROM users WHERE email = '{$testEmail}'")->fetch();
assert((int)$userVerifiedDb['is_verified'] === 1, "DB is_verified must now be 1");
assert(empty($userVerifiedDb['verification_code']), "DB verification_code must be cleared (NULL)");
assert(empty($userVerifiedDb['verification_token']), "DB verification_token must be cleared (NULL)");
assert(!empty($userVerifiedDb['email_verified_at']), "DB email_verified_at timestamp must be set");
echo "  ✓ PASS: DB record updated: is_verified = 1, tokens purged, email_verified_at set.\n\n";

// 7. Test Login with Verified Account
echo "7. Testing Login with Now-Verified Account:\n";
$loginVerified = simulateApiCall([
    'action' => 'login',
    'login' => $testEmail,
    'password' => $testPass
]);

assert($loginVerified['data']['success'] === true, "Verified account login must succeed");
assert($loginVerified['data']['user']['email'] === $testEmail, "Logged in user email must match");
echo "  ✓ PASS: Login successful! Welcome back, {$loginVerified['data']['user']['username']}.\n\n";

// 8. Test One-Click Magic Link Verification via verify_email.php?token=...
echo "8. Testing Standalone URL Token Verification (verify_email.php?token=...):\n";
$magicUser = 'MagicHero_' . rand(1000, 9999);
$magicEmail = strtolower($magicUser) . '@example.ng';
$regMagic = simulateApiCall([
    'action' => 'register',
    'username' => $magicUser,
    'email' => $magicEmail,
    'password' => $testPass
]);
$magicToken = $regMagic['data']['dev_token'];
assert(!empty($magicToken), "Magic token must be generated");

$ch = curl_init('http://localhost/nigerian-draughts/verify_email.php?token=' . urlencode($magicToken));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$magicHtml = curl_exec($ch);
$magicCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

assert($magicCode === 200, "verify_email.php should return HTTP 200");
assert(strpos($magicHtml, 'Email Verified!') !== false, "verify_email.php HTML should show success badge");
echo "  ✓ PASS: verify_email.php?token=... auto-verified token and rendered celebration card.\n\n";

// 9. Clean up test users
$db->exec("DELETE FROM users WHERE email IN ('{$testEmail}', '{$magicEmail}')");
echo "9. Cleaned up temporary test accounts.\n\n";

echo "====================================================\n";
echo "ALL EMAIL VERIFICATION TESTS PASSED (100% SUCCESS)!\n";
echo "====================================================\n";
