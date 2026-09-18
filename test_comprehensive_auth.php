<?php
/**
 * Comprehensive Automated Authentication Verification Suite
 * Tests every edge case and real-world condition for Sign Up & Login.
 */

require_once __DIR__ . '/config/db.php';

echo "====================================================\n";
echo "NAIJA DRAUGHTS COMPREHENSIVE AUTH VERIFICATION SUITE\n";
echo "====================================================\n\n";

$db = getDB();
$cookieFile = __DIR__ . '/scratch/test_suite_cookies.txt';
if (!is_dir(__DIR__ . '/scratch')) {
    mkdir(__DIR__ . '/scratch', 0777, true);
}
if (file_exists($cookieFile)) unlink($cookieFile);

function callAuth($payload, $useCookies = true) {
    global $cookieFile;
    $ch = curl_init('http://localhost/nigerian-draughts/api/auth.php');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    if ($useCookies) {
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    }
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($raw, true) ?: [],
        'raw' => $raw
    ];
}

function callGet($url, $useCookies = true) {
    global $cookieFile;
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    if ($useCookies) {
        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
    }
    $raw = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return [
        'code' => $httpCode,
        'data' => json_decode($raw, true) ?: [],
        'raw' => $raw
    ];
}

function assertTest($condition, $msg) {
    if (!$condition) {
        echo "  ❌ FAIL: {$msg}\n";
        exit(1);
    }
    echo "  ✓ PASS: {$msg}\n";
}

$rnd = rand(10000, 99999);
$testUser = "Chinedu_{$rnd}";
$testEmail = "chinedu_{$rnd}@naijadraughts.ng";
$testPassword = "StrongPassword99!";

// 1. Validation Failures on Sign Up
echo "1. Sign Up Validation Checks:\n";
$res1 = callAuth(['action' => 'register', 'username' => 'ab', 'email' => $testEmail, 'password' => $testPassword]);
assertTest($res1['code'] === 400 && strpos($res1['data']['message'], '3 characters') !== false, "Short username (<3 chars) rejected with 400");

$res2 = callAuth(['action' => 'register', 'username' => $testUser, 'email' => 'invalid-email-format', 'password' => $testPassword]);
assertTest($res2['code'] === 400 && strpos($res2['data']['message'], 'valid email') !== false, "Invalid email format rejected with 400");

$res3 = callAuth(['action' => 'register', 'username' => $testUser, 'email' => $testEmail, 'password' => '123']);
assertTest($res3['code'] === 400 && strpos($res3['data']['message'], '6 characters') !== false, "Short password (<6 chars) rejected with 400");

// 2. Successful Sign Up
echo "\n2. Successful Sign Up & Email Verification Code Generation:\n";
$res4 = callAuth(['action' => 'register', 'username' => $testUser, 'email' => $testEmail, 'password' => $testPassword]);
assertTest($res4['code'] === 200, "Registration returned HTTP 200 OK");
assertTest($res4['data']['success'] === true, "success is true in response");
assertTest($res4['data']['requires_verification'] === true, "requires_verification flag set to true");
assertTest(!empty($res4['data']['dev_otp']) && strlen($res4['data']['dev_otp']) === 6, "6-digit OTP code generated: {$res4['data']['dev_otp']}");

// Verify DB Record
$stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$testUser]);
$dbUser = $stmt->fetch();
assertTest($dbUser !== false, "User record exists in MySQL database");
assertTest((int)$dbUser['is_verified'] === 0, "User is initially unverified (is_verified = 0)");
assertTest((int)$dbUser['rating'] === 1200, "Starting rating is exactly 1200");
assertTest((int)$dbUser['coins'] === 150, "Starting coins is exactly 150");
assertTest((float)$dbUser['wallet_balance'] == 2500.00, "Starting wallet balance is 2,500 NGN");
assertTest($dbUser['verification_code'] === $res4['data']['dev_otp'], "Verification code stored in DB matches OTP");

// 3. Duplicate Registration Prevention
echo "\n3. Duplicate Account Handling:\n";
$resDupUser = callAuth(['action' => 'register', 'username' => $testUser, 'email' => "other_{$rnd}@example.com", 'password' => $testPassword]);
assertTest($resDupUser['code'] === 409, "Duplicate username rejected with 409 Conflict");

$resDupEmail = callAuth(['action' => 'register', 'username' => "Other_{$rnd}", 'email' => $testEmail, 'password' => $testPassword]);
assertTest($resDupEmail['code'] === 409, "Duplicate email rejected with 409 Conflict");

// 4. Login Attempt Prior to Verification
echo "\n4. Login Attempt Prior to Verification:\n";
$resUnverifiedLogin = callAuth(['action' => 'login', 'login' => $testUser, 'password' => $testPassword]);
assertTest($resUnverifiedLogin['code'] === 403, "Unverified login blocked with HTTP 403 Forbidden");
assertTest($resUnverifiedLogin['data']['requires_verification'] === true, "Unverified login returns requires_verification: true");

// 5. Code Verification Edge Cases
echo "\n5. Verification Code Processing:\n";
$resBadCode = callAuth(['action' => 'verify_code', 'email' => $testEmail, 'code' => '999999']);
assertTest($resBadCode['code'] === 400 || $resBadCode['data']['success'] === false, "Incorrect verification code rejected");

// Correct Code Verification
$resGoodCode = callAuth(['action' => 'verify_code', 'email' => $testEmail, 'code' => $res4['data']['dev_otp']]);
assertTest($resGoodCode['code'] === 200 && $resGoodCode['data']['success'] === true, "Correct 6-digit code verified successfully");
assertTest(!empty($resGoodCode['data']['user']), "User profile returned on successful verification");

// Check DB updated
$stmt->execute([$testUser]);
$verifiedDbUser = $stmt->fetch();
assertTest((int)$verifiedDbUser['is_verified'] === 1, "is_verified set to 1 in MySQL");
assertTest(empty($verifiedDbUser['verification_code']), "verification_code cleared after activation");
assertTest(!empty($verifiedDbUser['email_verified_at']), "email_verified_at timestamp set");

// 6. Login by Username
echo "\n6. Login by Username:\n";
$resLoginUser = callAuth(['action' => 'login', 'login' => $testUser, 'password' => $testPassword]);
assertTest($resLoginUser['code'] === 200 && $resLoginUser['data']['success'] === true, "Login by username successful");
assertTest($resLoginUser['data']['user']['username'] === $testUser, "Returned username matches: {$testUser}");
assertTest($resLoginUser['data']['user']['email'] === $testEmail, "Returned email matches: {$testEmail}");
assertTest((int)$resLoginUser['data']['user']['coins'] === 150, "Coins balance intact (150)");

// 7. Login by Email
echo "\n7. Login by Email Address:\n";
$resLoginEmail = callAuth(['action' => 'login', 'login' => $testEmail, 'password' => $testPassword]);
assertTest($resLoginEmail['code'] === 200 && $resLoginEmail['data']['success'] === true, "Login by email successful");

// 8. Password Security Checks
echo "\n8. Authentication Security & Bad Credentials:\n";
$resWrongPass = callAuth(['action' => 'login', 'login' => $testUser, 'password' => 'WrongPassword123!']);
assertTest($resWrongPass['code'] === 401 && $resWrongPass['data']['success'] === false, "Incorrect password returns 401 Unauthorized");

$resNonExistent = callAuth(['action' => 'login', 'login' => 'NonExistentPlayer9999', 'password' => $testPassword]);
assertTest($resNonExistent['code'] === 401 && $resNonExistent['data']['success'] === false, "Non-existent player returns 401 Unauthorized");

// 9. Session Persistence & Check (action=me)
echo "\n9. Session State & Profile Check (action=me):\n";
$resMe = callGet('http://localhost/nigerian-draughts/api/auth.php?action=me');
assertTest($resMe['code'] === 200 && $resMe['data']['success'] === true, "action=me returns active session");
assertTest($resMe['data']['user']['username'] === $testUser, "Session user is {$testUser}");

// Also test root forwarder matches session
$resMeRoot = callGet('http://localhost/nigerian-draughts/auth.php?action=me');
assertTest($resMeRoot['code'] === 200 && $resMeRoot['data']['success'] === true, "Root forwarder auth.php?action=me returns active session seamlessly");

// 10. Logout Flow
echo "\n10. Session Termination (Logout):\n";
$resLogout = callAuth(['action' => 'logout']);
assertTest($resLogout['code'] === 200 && $resLogout['data']['success'] === true, "Logout returned 200 OK");

$resMeLoggedOut = callGet('http://localhost/nigerian-draughts/api/auth.php?action=me');
assertTest($resMeLoggedOut['data']['success'] === false && empty($resMeLoggedOut['data']['user']), "action=me after logout returns null user");

// 11. Banned User Security Check
echo "\n11. Suspended / Banned Account Enforcement:\n";
$db->prepare("UPDATE users SET is_banned = 1, ban_reason = 'Suspicious gameplay pattern' WHERE username = ?")
   ->execute([$testUser]);

$resBanned = callAuth(['action' => 'login', 'login' => $testUser, 'password' => $testPassword]);
assertTest($resBanned['code'] === 403, "Banned player login blocked with HTTP 403 Forbidden");
assertTest($resBanned['data']['is_banned'] === true, "is_banned flag returned");
assertTest(strpos($resBanned['data']['message'], 'Suspicious gameplay') !== false, "Ban reason returned to player");

// 12. Cleanup
echo "\n12. Cleaning up test data:\n";
$db->prepare("DELETE FROM users WHERE username = ?")->execute([$testUser]);
if (file_exists($cookieFile)) unlink($cookieFile);
echo "  ✓ PASS: Cleaned up temporary test user.\n\n";

echo "====================================================\n";
echo "ALL 19 COMPREHENSIVE AUTH TESTS PASSED (100% SUCCESS)!\n";
echo "====================================================\n";
