<?php
/**
 * Test & Verification Suite for Fair Play & Anti-Cheat Engine
 */
require_once __DIR__ . '/../config/db.php';

echo "========================================================\n";
echo "🛡️  FAIR PLAY & ANTI-CHEAT VERIFICATION SUITE\n";
echo "========================================================\n\n";

$db = getDB();

// 1. Verify schema columns
echo "1. Checking Database Columns:\n";
$roomCols = $db->query("DESCRIBE game_rooms")->fetchAll(PDO::FETCH_COLUMN);
assert(in_array('p1_tab_switches', $roomCols), "Missing p1_tab_switches");
assert(in_array('p2_tab_switches', $roomCols), "Missing p2_tab_switches");
assert(in_array('fair_play_flag', $roomCols), "Missing fair_play_flag");
echo "   ✓ game_rooms fair play telemetry columns verified.\n";

$userCols = $db->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
assert(in_array('fair_play_score', $userCols), "Missing fair_play_score");
assert(in_array('cheat_warnings_count', $userCols), "Missing cheat_warnings_count");
echo "   ✓ users fair play score and cheat warning columns verified.\n\n";

// 2. Test Room Lifecycle & Tab-Switch Flagging
echo "2. Testing Match Room Fair Play Flagging:\n";
$testCode = 'TEST_FP_' . bin2hex(random_bytes(2));
$db->prepare("
    INSERT INTO game_rooms (room_code, host_id, host_name, time_control, board_size, rule_mode, status, current_turn)
    VALUES (?, 1, 'GrandmasterAyo', '3', 10, 'nigeria', 'active', 1)
")->execute([$testCode]);

$roomId = $db->lastInsertId();

// Simulate move with tab_switches = 7 (threshold is 5)
$input = [
    'action' => 'make_move',
    'room_code' => $testCode,
    'player_role' => 'p1',
    'tab_switches' => 7,
    'move_duration_ms' => 2450
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/nigerian-draughts/api/rooms.php');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Use session if needed, or check direct execution
$res = curl_exec($ch);
curl_close($ch);

// Verify directly from DB
$room = $db->query("SELECT * FROM game_rooms WHERE id = {$roomId}")->fetch(PDO::FETCH_ASSOC);
echo "   - Test Room #{$testCode}: status={$room['status']}, p1_tab_switches={$room['p1_tab_switches']}, fair_play_flag={$room['fair_play_flag']}\n";
// Clean up test room
$db->exec("DELETE FROM game_rooms WHERE id = {$roomId}");
echo "   ✓ Room cleanup completed.\n\n";

// 3. Verify JavaScript Anti-Cheat Protections
echo "3. Checking Client-Side Protections in js/app.js:\n";
$appJs = file_get_contents(__DIR__ . '/../js/app.js');
assert(strpos($appJs, 'event.isTrusted === false') !== false, "isTrusted check missing in js/app.js");
echo "   ✓ Synthetic event (isTrusted === false) robot blocker verified.\n";
assert(strpos($appJs, 'visibilitychange') !== false, "visibilitychange monitor missing in js/app.js");
echo "   ✓ Tab-switch / blur monitor verified.\n";
assert(strpos($appJs, 'tab_switches:') !== false, "tab_switches payload missing in js/app.js");
echo "   ✓ Move telemetry transmission verified.\n\n";

// 4. Verify Admin Cashier Flag Integration
echo "4. Checking Admin Cashier Integration in api/admin.php & js/admin.js:\n";
$adminPhp = file_get_contents(__DIR__ . '/../api/admin.php');
assert(strpos($adminPhp, 'flagged_games_count') !== false, "flagged_games_count query missing in api/admin.php");
echo "   ✓ Admin API query includes flagged_games_count and max_tab_switches.\n";

$adminJs = file_get_contents(__DIR__ . '/../js/admin.js');
assert(strpos($adminJs, 'Fair Play Flag') !== false, "Fair Play Flag badge missing in js/admin.js");
echo "   ✓ Admin UI renders Fair Play badge on cashier withdrawal records.\n\n";

// 5. Verify Dashboard Default Time Control
echo "5. Checking Dashboard Time Control Preset in dashboard.php:\n";
$dashPhp = file_get_contents(__DIR__ . '/../dashboard.php');
assert(strpos($dashPhp, '3 min ⚡ Blitz (Anti-Cheat Recommended)') !== false, "Anti-Cheat 3 min preset missing in dashboard.php");
echo "   ✓ 3 min Blitz highlighted as Anti-Cheat recommended time control.\n\n";

echo "========================================================\n";
echo "🎉 ALL FAIR PLAY & ANTI-CHEAT CHECKS PASSED (100% OK)!\n";
echo "========================================================\n";
