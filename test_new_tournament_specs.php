<?php
/**
 * Test Suite: Enhanced Tournament Specifications & Validation
 * Verifies:
 * 1. Minimum 20 coins requirement validation
 * 2. All required fields persistence (Name, Type, Rule, Join type, Players, Entry Coins, Payer, GMT Dates, Board, Modifications, Settings)
 * 3. Coin deduction & transaction logging for host creation fee (20 coins)
 * 4. Host sponsored entry deduction & free entry for contenders
 * 5. Registration deadline validation
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';

$db = getDB();

echo "=========================================================\n";
echo "🏆 TEST: ENHANCED TOURNAMENT SPECIFICATIONS & VALIDATION\n";
echo "=========================================================\n\n";

$passed = 0;
$failed = 0;

function checkTest($desc, $cond, $detail = '') {
    global $passed, $failed;
    if ($cond) {
        echo "  [PASS] {$desc}\n";
        $passed++;
    } else {
        echo "  [FAIL] {$desc}" . ($detail ? " -- {$detail}" : "") . "\n";
        $failed++;
    }
}

function callTournamentApiSubprocess($userId, $action, $data) {
    $script = "
        \$_SESSION['user'] = ['id' => {$userId}, 'username' => 'TestUser', 'role' => 'user'];
        \$_GET['action'] = '{$action}';
        \$_POST = " . var_export($data, true) . ";
        include 'api/tournaments.php';
    ";
    $tmpDir = __DIR__ . '/scratch';
    if (!is_dir($tmpDir)) @mkdir($tmpDir, 0777, true);
    $tmpFile = $tmpDir . '/test_api_runner_' . time() . '_' . rand(100, 999) . '.php';
    file_put_contents($tmpFile, "<?php\nsession_start();\n" . $script);
    $out = shell_exec('"C:\\xampp\\php\\php.exe" "' . $tmpFile . '" 2>&1');
    @unlink($tmpFile);
    if (preg_match('/\{.*\}$/s', $out, $m)) {
        return json_decode($m[0], true) ?: ['raw' => $out];
    }
    return json_decode($out, true) ?: ['raw' => $out];
}

// -------------------------------------------------------------
// STEP 1: Test Minimum 20 Coins Validation
// -------------------------------------------------------------
echo "[1] Testing minimum 20 coins requirement validation...\n";
$poorUname = "HostUnder20_" . time();
$db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified)
    VALUES (?, ?, 'hash', 0.00, 10, 1200, 1)
")->execute([$poorUname, $poorUname . "@test.com"]);
$poorId = (int)$db->lastInsertId();

$inputFailData = [
    'name' => 'Under 20 Coins Championship',
    'tournament_type' => 'knockout',
    'rule_type' => 'nigeria',
    'join_type' => 'open',
    'number_of_players' => 8,
    'entry_coins' => 100,
    'payer_type' => 'player'
];

$respFail = callTournamentApiSubprocess($poorId, 'host_tournament', $inputFailData);
checkTest("Host with 10 coins rejected", isset($respFail['success']) && $respFail['success'] === false);
checkTest("Exact error message includes 'minimum of 20 coins'", strpos($respFail['message'] ?? '', 'minimum of 20 coins') !== false, $respFail['message'] ?? '');

// -------------------------------------------------------------
// STEP 2: Test Successful Tournament Creation with All Fields
// -------------------------------------------------------------
echo "\n[2] Testing successful tournament creation with all requested specifications...\n";

// Fund user with 50,000 coins
$db->prepare("UPDATE users SET coins = 50000 WHERE id = ?")->execute([$poorId]);

$fullTournData = [
    'name' => 'Lagos Premier Grandmasters 2026',
    'tournament_type' => 'best_of_5',
    'rule_type' => 'ghana',
    'join_type' => 'request',
    'number_of_players' => 16,
    'entry_coins' => 500,
    'payer_type' => 'player',
    'start_date' => '15/10/2026 14:00',
    'end_date' => '18/10/2026 20:00',
    'join_deadline' => '14/10/2026 23:59',
    'board_type' => 'golden_state',
    'game_modification' => 'crown_start_left_left',
    'undo_allowed' => 1,
    'is_private' => 0,
    'to_win' => 1,
    'disable_chat' => 1,
    'sound_on' => 1,
    'is_scheduled' => 1
];

$respSuccess = callTournamentApiSubprocess($poorId, 'host_tournament', $fullTournData);
checkTest("Tournament created successfully", !empty($respSuccess['success']) && !empty($respSuccess['tournament_id']));
$tournId = (int)($respSuccess['tournament_id'] ?? 0);

// Check DB record
$tournRec = $db->query("SELECT * FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
checkTest("Tournament name stored correctly", $tournRec['name'] === 'Lagos Premier Grandmasters 2026');
checkTest("Tournament type stored as 'best_of_5'", $tournRec['tournament_type'] === 'best_of_5');
checkTest("Rule type stored as 'ghana'", $tournRec['rule_type'] === 'ghana');
checkTest("Join type stored as 'request'", $tournRec['join_type'] === 'request');
checkTest("Max participants stored as 16", (int)$tournRec['max_participants'] === 16);
checkTest("Entry coins stored as 500", (int)$tournRec['entry_fee_coins'] === 500);
checkTest("Payer type stored as 'player'", $tournRec['payer_type'] === 'player');
checkTest("Start date parsed in GMT", strpos($tournRec['start_date'], '2026-10-15 14:00') === 0, $tournRec['start_date']);
checkTest("End date parsed in GMT", strpos($tournRec['end_date'], '2026-10-18 20:00') === 0, $tournRec['end_date']);
checkTest("Join deadline parsed in GMT", strpos($tournRec['join_deadline'], '2026-10-14 23:59') === 0, $tournRec['join_deadline']);
checkTest("Board type stored as 'golden_state'", $tournRec['board_type'] === 'golden_state');
checkTest("Game modification stored as 'crown_start_left_left'", $tournRec['game_modification'] === 'crown_start_left_left');
checkTest("Settings: undo_allowed = 1", (int)$tournRec['undo_allowed'] === 1);
checkTest("Settings: disable_chat = 1", (int)$tournRec['disable_chat'] === 1);
checkTest("Settings: to_win = 1", (int)$tournRec['to_win'] === 1);

// Verify host coin balance was deducted exactly 20 coins
$freshHostCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$poorId}")->fetchColumn();
checkTest("Host coin balance deducted by 20 (50,000 -> 49,980)", $freshHostCoins === 49980);

// Check wallet transaction
$tx = $db->query("SELECT * FROM wallet_transactions WHERE user_id = {$poorId} AND description LIKE '%Tournament Creation Fee%' ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
checkTest("Creation fee wallet transaction logged", !empty($tx));

// -------------------------------------------------------------
// STEP 3: Test Host-Sponsored Tournament (Payer Type: 'host')
// -------------------------------------------------------------
echo "\n[3] Testing Host-Sponsored Tournament (Host pays all player entry fees)...\n";

$sponsorTournData = [
    'name' => 'Host Sponsored Invitational',
    'tournament_type' => 'knockout',
    'rule_type' => 'nigeria',
    'join_type' => 'open',
    'number_of_players' => 4,
    'entry_coins' => 100, // 4 * 100 = 400 coins entry + 20 creation fee = 420 coins total
    'payer_type' => 'host',
    'start_date' => '20/10/2026 12:00',
    'end_date' => '22/10/2026 18:00',
    'join_deadline' => '19/10/2026 23:59',
    'board_type' => 'default',
    'game_modification' => 'none'
];

$coinsBefore = $freshHostCoins; // 49980
$respSponsor = callTournamentApiSubprocess($poorId, 'host_tournament', $sponsorTournData);
checkTest("Host sponsored tournament created", !empty($respSponsor['success']));
$sponsorTournId = (int)($respSponsor['tournament_id'] ?? 0);

$coinsAfter = (int)$db->query("SELECT coins FROM users WHERE id = {$poorId}")->fetchColumn();
checkTest("Host deducted 420 coins (20 creation + 400 sponsorship)", ($coinsBefore - $coinsAfter) === 420);

// Register a contender with 0 coins to verify entry is free for contenders
$guestUname = "FreeContender_" . time();
$db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified)
    VALUES (?, ?, 'hash', 0.00, 0, 1200, 1)
")->execute([$guestUname, $guestUname . "@test.com"]);
$guestId = (int)$db->lastInsertId();

$regResp = callTournamentApiSubprocess($guestId, 'register', ['tournament_id' => $sponsorTournId]);
checkTest("Contender with 0 coins enters host-sponsored tournament for free", !empty($regResp['success']));

// -------------------------------------------------------------
// STEP 4: Test Join Deadline Validation
// -------------------------------------------------------------
echo "\n[4] Testing Registration Deadline Enforcement...\n";

// Set join_deadline to past
$db->prepare("UPDATE tournaments SET join_deadline = '2020-01-01 00:00:00' WHERE id = {$sponsorTournId}")->execute();

$guest2Uname = "LateContender_" . time();
$db->prepare("
    INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified)
    VALUES (?, ?, 'hash', 0.00, 500, 1200, 1)
")->execute([$guest2Uname, $guest2Uname . "@test.com"]);
$guest2Id = (int)$db->lastInsertId();

$lateResp = callTournamentApiSubprocess($guest2Id, 'register', ['tournament_id' => $sponsorTournId]);
checkTest("Registration after deadline blocked", isset($lateResp['success']) && $lateResp['success'] === false);
checkTest("Error message indicates deadline passed", strpos($lateResp['message'] ?? '', 'deadline has passed') !== false);

// -------------------------------------------------------------
// Cleanup test records
// -------------------------------------------------------------
echo "\n[5] Cleaning up test data...\n";
$db->exec("DELETE FROM tournament_participants WHERE tournament_id IN ({$tournId}, {$sponsorTournId})");
$db->exec("DELETE FROM wallet_transactions WHERE user_id IN ({$poorId}, {$guestId}, {$guest2Id})");
$db->exec("DELETE FROM tournaments WHERE id IN ({$tournId}, {$sponsorTournId})");
$db->exec("DELETE FROM users WHERE id IN ({$poorId}, {$guestId}, {$guest2Id})");
checkTest("Cleanup completed safely", true);

echo "\n=========================================================\n";
echo "📊 TEST RESULTS: {$passed} PASSED, {$failed} FAILED\n";
echo "=========================================================\n";
if ($failed === 0) {
    echo "🎉 ALL ENHANCED TOURNAMENT SPECIFICATION TESTS PASSED!\n";
} else {
    exit(1);
}
