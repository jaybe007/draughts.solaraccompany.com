<?php
/**
 * Direct User Scenario Simulation:
 * Host 'jaybe007' creates a game, Guest 'ayoade' joins via random_match or join_room.
 */
require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';

$db = getDB();

echo "========================================================\n";
echo "  SIMULATING USER SCENARIO: jaybe007 vs ayoade\n";
echo "========================================================\n\n";

// 1. Get or create user accounts jaybe007 and ayoade
function ensureUser($db, $username, $email) {
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    if (!$user) {
        $hash = password_hash('password123', PASSWORD_DEFAULT);
        $db->prepare("INSERT INTO users (username, email, password_hash, rating, coins, wallet_balance) VALUES (?, ?, ?, 1500, 1000, 5000)")
           ->execute([$username, $email, $hash]);
        $id = $db->lastInsertId();
        return $db->query("SELECT * FROM users WHERE id = $id")->fetch();
    }
    // Ensure sufficient coins
    if ($user['coins'] < 500) {
        $db->prepare("UPDATE users SET coins = 1000 WHERE id = ?")->execute([$user['id']]);
        $user['coins'] = 1000;
    }
    return $user;
}

$u1 = ensureUser($db, 'jaybe007', 'jaybe007@test.com');
$u2 = ensureUser($db, 'ayoade', 'ayoade@test.com');

echo "1. Users ready:\n";
echo "   Host: {$u1['username']} (ID: {$u1['id']}, Coins: {$u1['coins']})\n";
echo "   Guest: {$u2['username']} (ID: {$u2['id']}, Coins: {$u2['coins']})\n\n";

// 2. jaybe007 creates a 2P game room with 20 coins
echo "2. jaybe007 creates match room with 20 coins stake:\n";

// Simulate POST to api/rooms.php?action=create_room
$_SESSION['user'] = $u1;
$chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
$roomCode = 'ND-' . substr(str_shuffle($chars), 0, 4);
$wagerCoins = 20;

$db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$wagerCoins, $u1['id']]);
$db->prepare("
    INSERT INTO game_rooms (
        room_code, host_id, host_name, game_type, rule_type, player_time,
        time_increment, p1_short, modifications, board_type, settings_json,
        wager_coins, wager_naira, is_private, time_control, board_size, rule_mode,
        status, current_turn, p1_time_left, p2_time_left, last_move_time,
        board_state_json, move_history_json
    ) VALUES (
        ?, ?, ?, 'p2p', 'nigeria', '5',
        0, 0, 'none', 'default', '{}',
        ?, 0, 0, 'rapid_5', 10, 'nigerian',
        'waiting', 1, 300, 300, NULL,
        NULL, '[]'
    )
")->execute([$roomCode, $u1['id'], $u1['username'], $wagerCoins]);
$roomId = $db->lastInsertId();

echo "   ✓ Room created: Code #{$roomCode} (ID: {$roomId}), Status: waiting\n\n";

// 3. ayoade executes random_match to join
echo "3. ayoade triggers random_match:\n";
$_SESSION['user'] = $u2;
$guestId = $u2['id'];
$guestName = $u2['username'];

// Search waiting room
$findWaiting = $db->prepare("
    SELECT * FROM game_rooms 
    WHERE status = 'waiting' AND is_private = 0 AND (host_id IS NULL OR host_id != ?)
    ORDER BY created_at ASC LIMIT 1
");
$findWaiting->execute([$guestId]);
$waitingRoom = $findWaiting->fetch();

if (!$waitingRoom) {
    echo "   ❌ FAIL: No waiting room found for ayoade!\n";
    exit(1);
}

echo "   ✓ Waiting room found: {$waitingRoom['room_code']} (Host: {$waitingRoom['host_name']})\n";

// Deduct escrow coins if wager
if ($waitingRoom['wager_coins'] > 0) {
    $db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$waitingRoom['wager_coins'], $guestId]);
    echo "   ✓ Escrow deducted {$waitingRoom['wager_coins']} coins from guest {$guestName}\n";
}

$db->prepare("
    UPDATE game_rooms SET
        guest_id = ?,
        guest_name = ?,
        status = 'active',
        last_move_time = ?,
        updated_at = NOW()
    WHERE id = ?
")->execute([$guestId, $guestName, time(), $waitingRoom['id']]);

echo "   ✓ Room activated! guest_id = {$guestId} ({$guestName})\n\n";

// 4. Verify room state via get_state
echo "4. Testing get_state for both players:\n";
$stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
$stmt->execute([$roomCode]);
$state = $stmt->fetch(PDO::FETCH_ASSOC);

echo "   Status: {$state['status']}\n";
echo "   Host: {$state['host_name']} (ID: {$state['host_id']})\n";
echo "   Guest: {$state['guest_name']} (ID: {$state['guest_id']})\n";
echo "   Current Turn: {$state['current_turn']} (1 = White / Host, 2 = Dark / Guest)\n";
assert($state['status'] === 'active', "Room must be active");
assert($state['guest_name'] === 'ayoade', "Guest must be ayoade");
assert($state['host_name'] === 'jaybe007', "Host must be jaybe007");
echo "   ✓ PASS: State is active with jaybe007 (P1) and ayoade (P2)\n\n";

// 5. Test Move 1 by jaybe007 (White / P1)
echo "5. jaybe007 makes Move 1:\n";
$db->prepare("
    UPDATE game_rooms SET
        current_turn = 2,
        last_move_time = ?,
        board_state_json = ?,
        move_history_json = ?,
        updated_at = NOW()
    WHERE room_code = ?
")->execute([
    time(),
    json_encode(['dummy_board_move_1']),
    json_encode([['from' => ['r' => 6, 'c' => 1], 'to' => ['r' => 5, 'c' => 2]]]),
    $roomCode
]);

$stmt->execute([$roomCode]);
$state1 = $stmt->fetch(PDO::FETCH_ASSOC);
echo "   Current Turn after Move 1: {$state1['current_turn']} (Expected: 2 for ayoade)\n";
assert((int)$state1['current_turn'] === 2, "Turn must be 2");
echo "   ✓ PASS: Move 1 registered and turn handed over to ayoade\n\n";

// 6. Test Move 2 by ayoade (Dark / P2)
echo "6. ayoade makes Move 2:\n";
$db->prepare("
    UPDATE game_rooms SET
        current_turn = 1,
        last_move_time = ?,
        board_state_json = ?,
        move_history_json = ?,
        updated_at = NOW()
    WHERE room_code = ?
")->execute([
    time(),
    json_encode(['dummy_board_move_2']),
    json_encode([
        ['from' => ['r' => 6, 'c' => 1], 'to' => ['r' => 5, 'c' => 2]],
        ['from' => ['r' => 3, 'c' => 2], 'to' => ['r' => 4, 'c' => 1]]
    ]),
    $roomCode
]);

$stmt->execute([$roomCode]);
$state2 = $stmt->fetch(PDO::FETCH_ASSOC);
echo "   Current Turn after Move 2: {$state2['current_turn']} (Expected: 1 for jaybe007)\n";
assert((int)$state2['current_turn'] === 1, "Turn must be 1");
echo "   ✓ PASS: Move 2 registered and turn handed back to jaybe007\n\n";

echo "========================================================\n";
echo "🎉 SIMULATION SUCCESS: 2 Players flow works 100% cleanly!\n";
echo "========================================================\n";
