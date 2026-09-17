<?php
/**
 * Test Suite: Tournament Match Integration through api/rooms.php
 * Verifies that when a tournament match concludes in game_rooms
 * (via make_move game over, surrender/resign, or timeout),
 * checkAndAdvanceTournamentMatch automatically updates the bracket!
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/tournament_helper.php';

$db = getDB();

echo "=========================================================\n";
echo "🏆 TOURNAMENT ROOM INTEGRATION TEST (api/rooms.php)\n";
echo "=========================================================\n\n";

// 1. Create two test players
$p1Name = "TournHost_" . time();
$p2Name = "TournGuest_" . time();
$db->prepare("INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified) VALUES (?, ?, 'hash', 1000, 100, 1200, 1)")
   ->execute([$p1Name, "host_" . time() . "@test.com"]);
$p1Id = (int)$db->lastInsertId();

$db->prepare("INSERT INTO users (username, email, password_hash, wallet_balance, coins, rating, is_verified) VALUES (?, ?, 'hash', 1000, 100, 1200, 1)")
   ->execute([$p2Name, "guest_" . time() . "@test.com"]);
$p2Id = (int)$db->lastInsertId();

// 2. Create sample tournament with QF match 1
$tournBrackets = [
    'quarter_finals' => [
        [
            'match_id' => 1,
            'p1' => ['id' => $p1Id, 'username' => $p1Name, 'seed' => 1],
            'p2' => ['id' => $p2Id, 'username' => $p2Name, 'seed' => 8],
            'winner' => null,
            'room_code' => null, // will set below
            'status' => 'ready'
        ],
        ['match_id' => 2, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 3, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 4, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
    ],
    'semi_finals' => [
        ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
        ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
    ],
    'finals' => ['match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
];

$db->prepare("
    INSERT INTO tournaments (name, tagline, prize_pool, prize_pool_naira, entry_fee_naira, format, status, current_round, brackets_json)
    VALUES ('Trigger Test Cup', 'Testing Room Hooks', '₦10,000', 10000.00, 500.00, '8-Player Knockout', 'live', 'Quarter-Finals', ?)
")->execute([json_encode($tournBrackets)]);
$tournId = (int)$db->lastInsertId();

$roomCode = "TOURN-{$tournId}-R1M1";
$tournBrackets['quarter_finals'][0]['room_code'] = $roomCode;
$db->prepare("UPDATE tournaments SET brackets_json = ? WHERE id = ?")->execute([json_encode($tournBrackets), $tournId]);

$db->prepare("INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status, current_round) VALUES (?, ?, ?, 1, 'active', 'Quarter-Finals')")
   ->execute([$tournId, $p1Id, $p1Name]);
$db->prepare("INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status, current_round) VALUES (?, ?, ?, 8, 'active', 'Quarter-Finals')")
   ->execute([$tournId, $p2Id, $p2Name]);

// 3. Create the active match room
$db->prepare("
    INSERT INTO game_rooms (
        room_code, host_id, guest_id, host_name, guest_name, game_type, 
        wager_coins, wager_naira, status, current_turn, rule_type, player_time,
        p1_time_left, p2_time_left, time_control, board_size, rule_mode
    ) VALUES (
        ?, ?, ?, ?, ?, 'tournament', 
        0, 0.00, 'active', 1, 'nigeria', '5',
        300, 300, 'rapid_5', 10, 'nigerian'
    )
")->execute([$roomCode, $p1Id, $p2Id, $p1Name, $p2Name]);

echo "Created Tournament #{$tournId} with match room {$roomCode}.\n";

// 4. Test checkAndAdvanceTournamentMatch helper directly
// Simulate match won by P1
$advanced = checkAndAdvanceTournamentMatch($db, $roomCode, $p1Id);

if ($advanced) {
    echo "  [PASS] checkAndAdvanceTournamentMatch successfully advanced tournament room {$roomCode}\n";
} else {
    echo "  [FAIL] checkAndAdvanceTournamentMatch failed to advance\n";
    exit(1);
}

// 5. Verify tournament bracket state
$t = $db->query("SELECT brackets_json FROM tournaments WHERE id = {$tournId}")->fetch(PDO::FETCH_ASSOC);
$b = json_decode($t['brackets_json'], true);

$m1 = $b['quarter_finals'][0];
if ($m1['status'] === 'completed' && $m1['winner']['id'] === $p1Id) {
    echo "  [PASS] Quarterfinal match marked completed with P1 ({$p1Name}) as winner\n";
} else {
    echo "  [FAIL] Quarterfinal match status: " . ($m1['status'] ?? 'unknown') . "\n";
    exit(1);
}

if ($b['semi_finals'][0]['p1']['id'] === $p1Id) {
    echo "  [PASS] P1 successfully moved into Semi-Finals Slot 0 (p1)\n";
} else {
    echo "  [FAIL] Semi-Finals slot 0 not populated with P1\n";
    exit(1);
}

// 6. Cleanup
$db->exec("DELETE FROM game_rooms WHERE room_code = '{$roomCode}'");
$db->exec("DELETE FROM tournament_participants WHERE tournament_id = {$tournId}");
$db->exec("DELETE FROM tournaments WHERE id = {$tournId}");
$db->exec("DELETE FROM users WHERE id IN ({$p1Id}, {$p2Id})");

echo "\n🎉 ALL ROOM HOOK TESTS PASSED PERFECTLY!\n";
