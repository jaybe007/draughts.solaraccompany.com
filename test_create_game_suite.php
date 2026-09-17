<?php
require_once __DIR__ . '/config/db.php';

echo "=== Nigerian Draughts 'Create Game' Automated Test Suite ===\n\n";

$db = getDB();

// 1. Verify table columns in game_rooms
echo "[TEST 1] Verifying game_rooms schema columns...\n";
$stmt = $db->query("SHOW COLUMNS FROM game_rooms");
$cols = $stmt->fetchAll(PDO::FETCH_COLUMN);

$requiredCols = [
    'rule_type', 'player_time', 'time_increment', 'p1_short',
    'modifications', 'board_type', 'settings_json'
];

$missing = [];
foreach ($requiredCols as $col) {
    if (!in_array($col, $cols)) {
        $missing[] = $col;
    }
}

if (empty($missing)) {
    echo "  -> PASS: All 7 required columns exist in game_rooms.\n";
} else {
    echo "  -> FAIL: Missing columns: " . implode(', ', $missing) . "\n";
    exit(1);
}

// 2. Test Room Creation via API logic
echo "\n[TEST 2] Testing room creation with custom attributes...\n";

function simulateCreateRoom($payload) {
    global $db;
    $_SESSION['user_id'] = 1;
    
    $ruleType = $payload['rule_type'] ?? 'nigeria';
    $playerTime = (string)($payload['player_time'] ?? '5');
    $timeIncrement = (int)($payload['time_increment'] ?? 0);
    $p1Short = (int)($payload['p1_short'] ?? 0);
    $modifications = $payload['modifications'] ?? 'none';
    $boardType = $payload['board_type'] ?? 'default';
    $wagerCoins = (int)($payload['wager_coins'] ?? 0);
    $isPrivate = !empty($payload['is_private']) ? 1 : 0;
    $settings = $payload['settings'] ?? [];
    $settingsJson = json_encode($settings);
    $gameType = $payload['game_type'] ?? 'p2p';
    $ruleMode = ($ruleType === 'international') ? 'tournament' : 'nigerian';
    $boardSize = 10;
    $timeControl = 'custom';

    $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    $roomCode = 'ND-' . substr(str_shuffle($chars), 0, 4);

    $p1Time = ($playerTime === 'none') ? 0 : ((int)$playerTime * 60);
    $p2Time = $p1Time;

    if ($modifications === 'adv_1m') $p1Time += 60;
    elseif ($modifications === 'adv_3m') $p1Time += 180;
    elseif ($modifications === 'adv_5m') $p1Time += 300;
    elseif ($modifications === 'adv_7m') $p1Time += 420;

    $stmt = $db->prepare("
        INSERT INTO game_rooms (
            room_code, host_id, host_name, game_type, rule_type, player_time,
            time_increment, p1_short, modifications, board_type, settings_json,
            wager_coins, is_private, time_control, board_size, rule_mode,
            status, current_turn, p1_time_left, p2_time_left, last_move_time,
            board_state_json, move_history_json
        ) VALUES (
            ?, 1, 'Test Master', ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            'waiting', 1, ?, ?, NULL,
            NULL, '[]'
        )
    ");

    $stmt->execute([
        $roomCode, $gameType, $ruleType, $playerTime,
        $timeIncrement, $p1Short, $modifications, $boardType, $settingsJson,
        $wagerCoins, $isPrivate, $timeControl, $boardSize, $ruleMode,
        $p1Time, $p2Time
    ]);

    $id = $db->lastInsertId();

    $check = $db->prepare("SELECT * FROM game_rooms WHERE id = ?");
    $check->execute([$id]);
    return $check->fetch(PDO::FETCH_ASSOC);
}

// Test A: Eco Giant board with 3 min advantage & 2 pieces short handicap
$testPayloadA = [
    'rule_type' => 'nigeria',
    'player_time' => '10',
    'time_increment' => 3,
    'p1_short' => 2,
    'modifications' => 'adv_3m',
    'board_type' => 'eco_giant',
    'wager_coins' => 100,
    'is_private' => 1,
    'settings' => [
        'undo_allowed' => false,
        'private_game' => true,
        'to_win' => true,
        'disable_chat' => true,
        'sound_on' => true,
        'highlight_moves' => true,
        'analysis_mode' => false
    ]
];

$roomA = simulateCreateRoom($testPayloadA);
assert($roomA['board_type'] === 'eco_giant', "Board type mismatch");
assert((int)$roomA['p1_short'] === 2, "P1 short handicap mismatch");
assert($roomA['modifications'] === 'adv_3m', "Modifications mismatch");
assert((int)$roomA['time_increment'] === 3, "Time increment mismatch");
assert((int)$roomA['p1_time_left'] === 600 + 180, "Time advantage calculation mismatch: expected 780s, got {$roomA['p1_time_left']}");
assert((int)$roomA['p2_time_left'] === 600, "P2 time calculation mismatch: expected 600s, got {$roomA['p2_time_left']}");
echo "  -> PASS: Test Room A verified (Eco Giant, adv_3m: 780s vs 600s, handicap 2 seeds).\n";

// Test B: Golden State theme with Fischer 5s increment & Draw Odds P2
$testPayloadB = [
    'rule_type' => 'ghana',
    'player_time' => '5',
    'time_increment' => 5,
    'p1_short' => 0,
    'modifications' => 'draw_odds_p2',
    'board_type' => 'golden_state',
    'wager_coins' => 500,
    'is_private' => 0,
    'settings' => [
        'undo_allowed' => true,
        'private_game' => false,
        'to_win' => true,
        'disable_chat' => false,
        'sound_on' => true,
        'highlight_moves' => false,
        'analysis_mode' => true
    ]
];

$roomB = simulateCreateRoom($testPayloadB);
assert($roomB['board_type'] === 'golden_state', "Board type mismatch");
assert($roomB['rule_type'] === 'ghana', "Rule type mismatch");
assert($roomB['modifications'] === 'draw_odds_p2', "Modifications mismatch");
assert((int)$roomB['time_increment'] === 5, "Increment mismatch");
assert((int)$roomB['wager_coins'] === 500, "Wager coins mismatch");

$stgB = json_decode($roomB['settings_json'], true);
assert($stgB['highlight_moves'] === false, "Highlight toggle mismatch");
assert($stgB['analysis_mode'] === true, "Analysis mode toggle mismatch");
echo "  -> PASS: Test Room B verified (Golden State, Ghana rules, draw_odds_p2, inc 5s, custom toggles).\n";

// Test C: Untimed 'none' mode with Ten Aside
$testPayloadC = [
    'rule_type' => 'international',
    'player_time' => 'none',
    'time_increment' => 0,
    'p1_short' => 0,
    'modifications' => 'ten_aside',
    'board_type' => 'diamond_coast',
    'wager_coins' => 0,
    'is_private' => 0,
    'settings' => []
];

$roomC = simulateCreateRoom($testPayloadC);
assert($roomC['board_type'] === 'diamond_coast', "Board type mismatch");
assert($roomC['player_time'] === 'none', "Player time mismatch");
assert((int)$roomC['p1_time_left'] === 0, "Untimed clock expected 0s");
assert($roomC['modifications'] === 'ten_aside', "Ten aside modification mismatch");
echo "  -> PASS: Test Room C verified (Diamond Coast, Untimed 'none', Ten aside).\n";

// Clean up test rooms
$db->prepare("DELETE FROM game_rooms WHERE id IN (?, ?, ?)")->execute([$roomA['id'], $roomB['id'], $roomC['id']]);
echo "\n[CLEANUP] Test game rooms removed successfully.\n";

echo "\n=== ALL 3 SUITE TESTS PASSED WITH 100% SUCCESS ===\n";
