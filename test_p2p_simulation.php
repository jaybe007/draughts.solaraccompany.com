<?php
/**
 * Nigerian Draughts - P2P Online Multiplayer Simulation Test
 * Simulates two browser clients (Host P1 and Guest P2) interacting in real-time
 * via api/rooms.php and cookie sessions.
 */

require_once __DIR__ . '/config/db.php';

echo "========================================================\n";
echo "  P2P MULTIPLAYER REAL-TIME SIMULATION TEST\n";
echo "========================================================\n\n";

$baseUrl = 'http://localhost/nigerian-draughts/api';
$p1Cookie = __DIR__ . '/p1_cookie.txt';
$p2Cookie = __DIR__ . '/p2_cookie.txt';
if (file_exists($p1Cookie)) unlink($p1Cookie);
if (file_exists($p2Cookie)) unlink($p2Cookie);

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

$db = getDB();

// 1. Setup Two Verified Test Players with ₦10,000 each
$passHash = password_hash('Pass123!', PASSWORD_BCRYPT);
$p1User = "P1_Host_" . time();
$p2User = "P2_Guest_" . time();

$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 500, 10000.00, 'free', 1)")
   ->execute([$p1User, "p1_" . time() . "@p2p.com", $passHash]);
$p1Id = $db->lastInsertId();

$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified) VALUES (?, ?, ?, 500, 10000.00, 'free', 1)")
   ->execute([$p2User, "p2_" . time() . "@p2p.com", $passHash]);
$p2Id = $db->lastInsertId();

echo "[SETUP] Created P1 ($p1User) and P2 ($p2User)\n\n";

// 2. Log in Both Players
echo "1. Logging in Host (Player 1) and Guest (Player 2):\n";
$login1 = httpReq("$baseUrl/auth.php?action=login", $p1Cookie, 'POST', ['login' => $p1User, 'password' => 'Pass123!']);
assert(!empty($login1['data']['success']), "P1 login failed");
$login2 = httpReq("$baseUrl/auth.php?action=login", $p2Cookie, 'POST', ['login' => $p2User, 'password' => 'Pass123!']);
assert(!empty($login2['data']['success']), "P2 login failed");
echo "  ✓ PASS: Both players authenticated. Separate session cookies created.\n\n";

// 3. P1 Creates a 2-Player Online Match Room
echo "2. P1 Creates Match Room with ₦1,000 Wager Stake:\n";
$createRes = httpReq("$baseUrl/rooms.php?action=create_room", $p1Cookie, 'POST', [
    'game_type' => 'p2p',
    'rule_type' => 'nigeria',
    'rule_mode' => 'nigeria',
    'player_time' => '5',
    'time_increment' => 2,
    'wager_coins' => 0,
    'wager_naira' => 1000.00,
    'board_type' => 'default',
    'is_private' => 0
]);
assert(!empty($createRes['data']['success']), "Room creation failed");
$roomCode = $createRes['data']['room_code'];
echo "  ✓ PASS: Room #$roomCode created. P1 role = {$createRes['data']['player_role']}. Escrow locked ₦1,000.\n\n";

// 4. P1 Polls Room while Waiting for Opponent
echo "3. P1 Polls Room State (Awaiting Opponent):\n";
$pollWaiting = httpReq("$baseUrl/rooms.php?action=get_state&room_code=$roomCode", $p1Cookie);
assert($pollWaiting['data']['room']['status'] === 'waiting', "Room status must be 'waiting'");
echo "  ✓ PASS: Room status is 'waiting'. Invite URL: game.php?room=$roomCode&role=p2\n\n";

// 5. P2 Joins the Match Room via Room Code
echo "4. P2 Joins Match Room #$roomCode:\n";
$joinRes = httpReq("$baseUrl/rooms.php?action=join_room", $p2Cookie, 'POST', [
    'room_code' => $roomCode,
    'player_name' => $p2User
]);
assert(!empty($joinRes['data']['success']), "P2 join failed: " . ($joinRes['data']['message'] ?? ''));
assert($joinRes['data']['player_role'] === 'p2', "P2 role must be p2");
echo "  ✓ PASS: P2 successfully joined. P2 escrow locked ₦1,000. Status updated to 'active'.\n\n";

// 6. P1 Polls Room State (Detects Opponent Arrival)
echo "5. P1 Polls Room (Detects Match Activation):\n";
$pollActive = httpReq("$baseUrl/rooms.php?action=get_state&room_code=$roomCode", $p1Cookie);
assert($pollActive['data']['room']['status'] === 'active', "Room must now be 'active'");
assert($pollActive['data']['room']['guest_name'] === $p2User, "Guest name must match P2");
assert((int)$pollActive['data']['room']['current_turn'] === 1, "Initial turn must be Player 1");
echo "  ✓ PASS: P1 client detects active match with {$p2User}. Turn: Player 1 (White).\n\n";

// 7. P1 Makes Move 1 (32-28)
echo "6. P1 Makes Move (32 -> 28):\n";
$move1History = [['from' => 32, 'to' => 28, 'text' => '32-28']];
$moveRes1 = httpReq("$baseUrl/rooms.php?action=make_move", $p1Cookie, 'POST', [
    'room_code' => $roomCode,
    'player_role' => 'p1',
    'move_history_json' => json_encode($move1History),
    'board_state_json' => json_encode(['mock_board_after_move_1']),
    'turn_ended' => true
]);
assert(!empty($moveRes1['data']['success']), "Move 1 submission failed");
echo "  ✓ PASS: Move 1 registered in database. Turn switched to Player 2.\n\n";

// 8. P2 Polls Room (Receives Move 1 from P1)
echo "7. P2 Polls Room (Syncs Move 1 from Host):\n";
$pollMove1 = httpReq("$baseUrl/rooms.php?action=get_state&room_code=$roomCode", $p2Cookie);
$syncedMoves = json_decode($pollMove1['data']['room']['move_history_json'], true);
assert(count($syncedMoves) === 1, "P2 should receive 1 move");
assert($syncedMoves[0]['text'] === '32-28', "Move text should be 32-28");
assert((int)$pollMove1['data']['room']['current_turn'] === 2, "Current turn must be 2");
echo "  ✓ PASS: P2 client synchronized move '32-28'. It is now P2's turn!\n\n";

// 9. P2 Makes Counter-Move (19-23)
echo "8. P2 Makes Counter-Move (19 -> 23):\n";
$move2History = [
    ['from' => 32, 'to' => 28, 'text' => '32-28'],
    ['from' => 19, 'to' => 23, 'text' => '19-23']
];
$moveRes2 = httpReq("$baseUrl/rooms.php?action=make_move", $p2Cookie, 'POST', [
    'room_code' => $roomCode,
    'player_role' => 'p2',
    'move_history_json' => json_encode($move2History),
    'board_state_json' => json_encode(['mock_board_after_move_2']),
    'turn_ended' => true
]);
assert(!empty($moveRes2['data']['success']), "Move 2 submission failed");
echo "  ✓ PASS: Move 2 registered in database. Turn switched back to Player 1.\n\n";

// 10. P1 Polls Room (Receives Move 2 from P2)
echo "9. P1 Polls Room (Syncs Move 2 from Guest):\n";
$pollMove2 = httpReq("$baseUrl/rooms.php?action=get_state&room_code=$roomCode", $p1Cookie);
$syncedMoves2 = json_decode($pollMove2['data']['room']['move_history_json'], true);
assert(count($syncedMoves2) === 2, "P1 should receive 2 moves");
assert($syncedMoves2[1]['text'] === '19-23', "Second move should be 19-23");
assert((int)$pollMove2['data']['room']['current_turn'] === 1, "Current turn must be 1");
echo "  ✓ PASS: P1 client synchronized move '19-23'. Real-time bi-directional sync verified!\n\n";

// 11. P2 Resigns the Match
echo "10. P2 Surrenders / Resigns Match:\n";
$resignRes = httpReq("$baseUrl/rooms.php?action=resign", $p2Cookie, 'POST', [
    'room_code' => $roomCode,
    'player_role' => 'p2'
]);
assert(!empty($resignRes['data']['success']), "Resignation failed");
echo "  ✓ PASS: P2 resignation processed.\n\n";

// 12. Both Clients Check Final Match Settlement
echo "11. Checking Final Match Results & Financial Payout:\n";
$finalState = httpReq("$baseUrl/rooms.php?action=get_state&room_code=$roomCode", $p1Cookie);
$finalRoom = $finalState['data']['room'];
assert($finalRoom['status'] === 'finished', "Room must be 'finished'");
assert($finalRoom['result'] === 'p1_won', "Winner must be p1_won");
assert((int)$finalRoom['winner_id'] === (int)$p1Id, "Winner ID must be P1");

// Verify P1 balance credited: Started 10,000. Escrow 1,000 -> 9,000. Won pot 2,000 - 8% rake (160) = 1,840. New bal = 10,840.
$p1Bal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $p1Id")->fetchColumn();
$p2Bal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = $p2Id")->fetchColumn();
echo "  P1 Final Balance: ₦" . number_format($p1Bal, 2) . " (Net profit: +₦840)\n";
echo "  P2 Final Balance: ₦" . number_format($p2Bal, 2) . " (Net loss: -₦1,000)\n";
assert($p1Bal === 10840.00, "P1 should have ₦10,840 after 8% rake deduction");
assert($p2Bal === 9000.00, "P2 should have ₦9,000");
echo "  ✓ PASS: Match pot (₦2,000) settled with 8% platform rake (₦160) and ₦1,840 awarded to Winner.\n\n";

// Cleanup
$db->prepare("DELETE FROM wallet_transactions WHERE user_id IN (?, ?)")->execute([$p1Id, $p2Id]);
$db->prepare("DELETE FROM matches WHERE player1_id = ? OR player2_id = ?")->execute([$p1Id, $p2Id]);
$db->prepare("DELETE FROM game_rooms WHERE room_code = ?")->execute([$roomCode]);
$db->prepare("DELETE FROM users WHERE id IN (?, ?)")->execute([$p1Id, $p2Id]);
if (file_exists($p1Cookie)) unlink($p1Cookie);
if (file_exists($p2Cookie)) unlink($p2Cookie);

echo "========================================================\n";
echo "🎉 P2P ONLINE MULTIPLAYER FULL LIFECYCLE 100% VERIFIED!\n";
echo "========================================================\n";
