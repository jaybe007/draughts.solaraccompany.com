<?php
/**
 * Test Suite: Verify Intelligent Error Reporting & Diagnostics System
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/error_handler.php';

echo "=== 1. Testing suggestErrorSolution() Knowledge Engine ===\n";

$dbSolution = suggestErrorSolution("SQLSTATE[HY000] [2002] Connection refused", "database", "config/db.php", 47);
echo "Database Solution: " . $dbSolution . "\n";
assert(strpos($dbSolution, 'MySQL') !== false, "DB solution must mention MySQL");

$paySolution = suggestErrorSolution("Paystack secret key is invalid", "payment", "webhook.php", 12);
echo "Payment Solution: " . $paySolution . "\n";
assert(strpos($paySolution, 'Secret Key') !== false, "Payment solution must mention Secret Key");

$gameSolution = suggestErrorSolution("Not your turn", "gameplay", "match.php", 60);
echo "Gameplay Solution: " . $gameSolution . "\n";
assert(strpos($gameSolution, 'Desynchronization') !== false, "Gameplay solution must mention Desynchronization");

echo "✓ Knowledge engine diagnosis passed.\n\n";

echo "=== 2. Testing logSystemError() Insertion ===\n";

$testReportId = logSystemError(
    'critical',
    'database',
    'Table \'naija_draughts.test_dummy_table\' doesn\'t exist in engine query',
    __FILE__,
    __LINE__,
    "#0 test call stack line 1\n#1 test call stack line 2",
    ['test_runner' => 'verify_error_reporting.php', 'env' => 'CLI']
);

echo "Logged Error Report ID: {$testReportId}\n";
assert($testReportId > 0, "Report ID must be > 0");

$db = getDB();
$stmt = $db->prepare("SELECT * FROM system_error_reports WHERE id = ?");
$stmt->execute([$testReportId]);
$record = $stmt->fetch(PDO::FETCH_ASSOC);

echo "Fetched Record Status: {$record['status']}\n";
echo "Suggested Solution: {$record['suggested_solution']}\n";
assert($record['status'] === 'unresolved', "Initial status must be unresolved");
assert(strpos($record['suggested_solution'], 'Missing Database Table') !== false, "Solution must detect missing table");

echo "✓ Direct error logging & diagnosis verification passed.\n\n";

echo "=== 3. Testing Status Transitions ===\n";

// Update to investigating
$stmt = $db->prepare("UPDATE system_error_reports SET status = 'investigating' WHERE id = ?");
$stmt->execute([$testReportId]);
$status = $db->query("SELECT status FROM system_error_reports WHERE id = {$testReportId}")->fetchColumn();
echo "Updated status: {$status}\n";
assert($status === 'investigating', "Status must be investigating");

// Update to resolved
$stmt = $db->prepare("UPDATE system_error_reports SET status = 'resolved', resolved_by = 'GrandmasterAyo', resolved_at = NOW() WHERE id = ?");
$stmt->execute([$testReportId]);
$resolved = $db->query("SELECT status, resolved_by FROM system_error_reports WHERE id = {$testReportId}")->fetch(PDO::FETCH_ASSOC);
echo "Resolved by: {$resolved['resolved_by']} with status {$resolved['status']}\n";
assert($resolved['status'] === 'resolved', "Status must be resolved");

echo "✓ Status transitions passed.\n\n";

echo "=== 4. Testing Frontend Client Error Endpoint Simulation ===\n";

$clientReportId = logSystemError(
    'warning',
    'frontend_js',
    'Uncaught TypeError: Cannot read property \'classList\' of null',
    'https://localhost/js/board.js',
    188,
    "TypeError: Cannot read property 'classList' of null at renderBoard (board.js:188)",
    ['client_url' => 'https://localhost/game.php', 'browser' => 'Chrome Headless']
);

echo "Logged Client JS Report ID: {$clientReportId}\n";
assert($clientReportId > 0, "Client JS report ID must be > 0");

$clientRecord = $db->query("SELECT * FROM system_error_reports WHERE id = {$clientReportId}")->fetch(PDO::FETCH_ASSOC);
echo "Client Error Category: {$clientRecord['category']}\n";
echo "Client Suggested Solution: {$clientRecord['suggested_solution']}\n";
assert($clientRecord['category'] === 'frontend_js', "Category must be frontend_js");

echo "✓ Frontend client error simulation passed.\n\n";

echo "=== 5. Testing Intelligent Error Deduplication ===\n";

$dup1 = logSystemError('error', 'payment', 'Unique webhook timeout error message for test', 'api/webhook.php', 99);
$dup2 = logSystemError('error', 'payment', 'Unique webhook timeout error message for test', 'api/webhook.php', 99);

echo "First report ID: {$dup1}, Second report ID: {$dup2}\n";
assert($dup1 === $dup2, "Identical unresolved errors must return same ID");

$dupRecord = $db->query("SELECT occurrence_count, last_seen_at FROM system_error_reports WHERE id = {$dup1}")->fetch(PDO::FETCH_ASSOC);
echo "Occurrence Count: {$dupRecord['occurrence_count']}, Last Seen: {$dupRecord['last_seen_at']}\n";
assert((int)$dupRecord['occurrence_count'] >= 2, "Occurrence count must be at least 2");

echo "✓ Intelligent deduplication passed.\n\n";

echo "=== ALL ERROR REPORTING TESTS PASSED SUCCESSFULLY! ===\n";
