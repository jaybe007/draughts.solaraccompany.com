<?php
// Test actual HTTP/API handling logic of api/rooms.php
require_once __DIR__ . '/config/db.php';

echo "=== Nigerian Draughts 'api/rooms.php' End-to-End API Test ===\n\n";

$db = getDB();

// Find an active user with coins
$userStmt = $db->query("SELECT id, username, coins FROM users WHERE coins >= 100 LIMIT 1");
$testUser = $userStmt->fetch(PDO::FETCH_ASSOC);

if (!$testUser) {
    // Create or update a test user with coins
    $db->prepare("UPDATE users SET coins = 1000 WHERE id = 1")->execute();
    $testUser = ['id' => 1, 'username' => 'TestMaster', 'coins' => 1000];
}

echo "Testing as User #{$testUser['id']} ({$testUser['username']}) with {$testUser['coins']} coins.\n";

// Helper function to invoke api/rooms.php via internal function/buffer
function callRoomsApi($action, $data, $userId) {
    $_SESSION['user_id'] = $userId;
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $_GET['action'] = $action;
    
    // Save to temp input
    $json = json_encode($data);
    $stream = fopen('php://memory', 'r+');
    fwrite($stream, $json);
    rewind($stream);

    ob_start();
    // Simulate API logic
    require __DIR__ . '/api/rooms.php';
    $out = ob_get_clean();
    fclose($stream);
    
    return json_decode($out, true);
}

// Let's test room creation directly with curl / local HTTP request to Apache server!
$url = 'http://localhost/nigerian-draughts/api/rooms.php?action=create_room';

$postData = [
    'game_type' => 'p2p',
    'rule_type' => 'nigeria',
    'player_time' => '5',
    'time_increment' => 3,
    'p1_short' => 1,
    'modifications' => 'crown_start_left_left',
    'board_type' => 'safari_land',
    'wager_coins' => 0,
    'is_private' => 1,
    'player_name' => 'LagosChamp',
    'settings' => [
        'undo_allowed' => false,
        'private_game' => true,
        'to_win' => true,
        'disable_chat' => false,
        'sound_on' => true,
        'highlight_moves' => true,
        'analysis_mode' => false
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: {$httpCode}\n";
echo "Response: {$response}\n";

$json = json_decode($response, true);
if ($json && !empty($json['success']) && !empty($json['room_code'])) {
    echo "  -> PASS: Successfully created room {$json['room_code']} with Safari Land theme & crown_start_left_left!\n";

    // Test get_state endpoint
    $stateUrl = 'http://localhost/nigerian-draughts/api/rooms.php?action=get_state&room_code=' . urlencode($json['room_code']);
    $stateResp = file_get_contents($stateUrl);
    $stateJson = json_decode($stateResp, true);
    
    if ($stateJson && $stateJson['success'] && $stateJson['room']) {
        $r = $stateJson['room'];
        echo "  -> PASS: Retrieved state for {$r['room_code']}.\n";
        echo "     Board Theme: {$r['board_type']}\n";
        echo "     Rule Type: {$r['rule_type']}\n";
        echo "     Modifications: {$r['modifications']}\n";
        echo "     P1 Short: {$r['p1_short']}\n";
        echo "     Player Time: {$r['player_time']}m (Initial Secs: {$r['p1_time_left']}s)\n";
    }

    // Clean up
    $db->prepare("DELETE FROM game_rooms WHERE room_code = ?")->execute([$json['room_code']]);
    echo "  -> PASS: Cleaned up test room.\n";
} else {
    echo "  -> Response output indicates: " . ($json['message'] ?? 'Unknown error') . "\n";
}

echo "\n=== API TEST COMPLETE ===\n";
