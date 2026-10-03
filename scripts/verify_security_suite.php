<?php
/**
 * Automated Verification Suite for High-Security Architecture
 * Tests:
 * 1. Security Headers & CSRF Engine
 * 2. Sliding-Window Rate Limiter
 * 3. Anti-Brute-Force Lockout Defense
 * 4. Financial Negative-Balance Database Trigger Guard
 * 5. Server Anti-Cheat Move Velocity Telemetry
 * 6. Security Event Auditing Integrity
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/security.php';

echo "====================================================================\n";
echo "       NAIJA DRAUGHTS - HIGH SECURITY SUITE VERIFICATION\n";
echo "====================================================================\n\n";

$db = getDB();
$passed = 0;
$failed = 0;

function assertTest($description, $condition) {
    global $passed, $failed;
    if ($condition) {
        echo "  [PASS] {$description}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$description}\n";
        $failed++;
    }
}

// -------------------------------------------------------------
// TEST 1: CSRF TOKEN ENGINE & TIMING SAFE COMPARISON
// -------------------------------------------------------------
echo "[1] Testing CSRF Token Engine...\n";
$token1 = getCsrfToken();
assertTest("CSRF token is generated with 64 hex characters", strlen($token1) === 64 && ctype_xdigit($token1));
assertTest("Valid CSRF token passes verification", verifyCsrfToken($token1) === true);
assertTest("Altered CSRF token is rejected", verifyCsrfToken($token1 . 'fake') === false);
assertTest("Empty CSRF token is rejected", verifyCsrfToken('') === false);

// -------------------------------------------------------------
// TEST 2: SLIDING-WINDOW RATE LIMITER
// -------------------------------------------------------------
echo "\n[2] Testing Distributed Sliding-Window Rate Limiter...\n";
$testAction = 'test_action_' . bin2hex(random_bytes(3));
$testIdent  = 'ident_' . bin2hex(random_bytes(4));

$hit1 = checkRateLimit($testAction, 3, 60, $testIdent);
assertTest("Rate limit hit 1 of 3 allowed", $hit1['allowed'] === true && $hit1['hits'] === 1);

$hit2 = checkRateLimit($testAction, 3, 60, $testIdent);
assertTest("Rate limit hit 2 of 3 allowed", $hit2['allowed'] === true && $hit2['hits'] === 2);

$hit3 = checkRateLimit($testAction, 3, 60, $testIdent);
assertTest("Rate limit hit 3 of 3 allowed", $hit3['allowed'] === true && $hit3['hits'] === 3);

$hit4 = checkRateLimit($testAction, 3, 60, $testIdent);
assertTest("Rate limit hit 4 is blocked with retry_after", $hit4['allowed'] === false && $hit4['retry_after'] > 0);

// -------------------------------------------------------------
// TEST 3: ANTI-BRUTE-FORCE LOCKOUT & TIMING BACKOFF
// -------------------------------------------------------------
echo "\n[3] Testing Anti-Brute-Force Account & IP Lockout Defense...\n";
$testLogin = 'hacker_target_' . bin2hex(random_bytes(3));
$testIp    = '192.0.2.' . random_int(1, 250);

$preCheck = checkLoginLockout($testLogin, $testIp);
assertTest("New login target is not locked", $preCheck['locked'] === false);

// Record 5 failed attempts
for ($i = 1; $i <= 5; $i++) {
    recordFailedLoginAttempt($testLogin, $testIp);
}

$postCheck = checkLoginLockout($testLogin, $testIp);
assertTest("Target is locked after 5 failed attempts", $postCheck['locked'] === true && $postCheck['retry_after'] > 0);

// Clear failures (e.g. successful login)
clearLoginFailures($testLogin, $testIp);
$clearedCheck = checkLoginLockout($testLogin, $testIp);
assertTest("Lockout is cleanly cleared upon successful authentication", $clearedCheck['locked'] === false);

// -------------------------------------------------------------
// TEST 4: FINANCIAL INTEGRITY & NEGATIVE-BALANCE DATABASE GUARD
// -------------------------------------------------------------
echo "\n[4] Testing Financial Integrity & Negative-Balance Database Guard...\n";
// Create temporary test user
$testUsername = 'sec_test_' . bin2hex(random_bytes(3));
$db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins)
    VALUES (?, ?, 'dummy_hash', 1000.00, 100)
")->execute([$testUsername, "{$testUsername}@test.ng"]);
$testUserId = (int)$db->lastInsertId();

$balBefore = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$testUserId}")->fetchColumn();
assertTest("Test user created with initial balance of ₦1,000", $balBefore == 1000.00);

// Attempt illegal negative balance update
$triggerBlocked = false;
try {
    $db->prepare("UPDATE users SET wallet_balance = -500.00 WHERE id = ?")->execute([$testUserId]);
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Security Violation') !== false || strpos($e->getMessage(), 'Wallet balance cannot be negative') !== false) {
        $triggerBlocked = true;
    }
}
assertTest("Database trigger blocked illegal negative wallet_balance update", $triggerBlocked === true);

// Attempt illegal negative balance insert
$insertBlocked = false;
try {
    $db->prepare("
        INSERT INTO users (username, email, password_hash, wallet_balance, coins)
        VALUES ('neg_test_usr', 'neg@test.ng', 'hash', -100.00, 0)
    ")->execute();
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Security Violation') !== false || strpos($e->getMessage(), 'Wallet balance cannot be negative') !== false) {
        $insertBlocked = true;
    }
}
assertTest("Database trigger blocked illegal negative wallet_balance insert", $insertBlocked === true);

// Verify balance remained intact
$balAfter = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$testUserId}")->fetchColumn();
assertTest("Wallet balance preserved at ₦1,000 without corruption", $balAfter == 1000.00);

// Clean up test user
$db->prepare("DELETE FROM users WHERE id = ?")->execute([$testUserId]);

// -------------------------------------------------------------
// TEST 5: ANTI-CHEAT SERVER-SIDE BOT VELOCITY TELEMETRY
// -------------------------------------------------------------
echo "\n[5] Testing Server-Side Anti-Cheat Move Velocity Telemetry...\n";
$roomCode = 'ND-TEST';
// Human speed (e.g. 1.2 seconds between moves) -> valid
$humanValid = checkMoveVelocitySecurity($roomCode, 'p1', microtime(true) - 1.2);
assertTest("Human response time (1200ms) passes velocity check", $humanValid === true);

// Inhuman bot speed (e.g. 10ms between moves) -> detected & flagged
$botDetected = !checkMoveVelocitySecurity($roomCode, 'p1', microtime(true) - 0.01);
assertTest("Impossible bot speed (10ms) detected & flagged by security engine", $botDetected === true);

// -------------------------------------------------------------
// TEST 6: SECURITY AUDIT FLAGS TABLE INTEGRITY
// -------------------------------------------------------------
echo "\n[6] Testing Security Audit Flags Database...\n";
logSecurityAudit('unit_test_flag', 'medium', ['test' => 'verified'], null);
$flagCheck = $db->query("SELECT id, event_type, severity FROM security_audit_flags WHERE event_type = 'unit_test_flag' ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
assertTest("Security audit event recorded in database", $flagCheck && $flagCheck['event_type'] === 'unit_test_flag');

// Clean up unit test flag
$db->exec("DELETE FROM security_audit_flags WHERE event_type = 'unit_test_flag'");

echo "\n====================================================================\n";
echo "  SUITE RESULTS: Passed: {$passed} | Failed: {$failed}\n";
echo "====================================================================\n\n";

if ($failed === 0) {
    echo ">>> ALL SECURITY LAYERS VERIFIED AND FULLY OPERATIONAL! <<<\n";
    exit(0);
} else {
    echo ">>> WARNING: SOME SECURITY TESTS FAILED. <<<\n";
    exit(1);
}
