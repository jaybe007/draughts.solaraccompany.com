<?php
/**
 * Automated Test: Coin Staking & Dynamic Naira Auto-Conversion
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';

echo "=== TESTING COIN STAKING & NAIRA AUTO-CONVERSION ===\n\n";

$db = getDB();
$rates = getCoinRates($db);
$buyRatePerCoin = (float)$rates['buy_rate_per_coin']; // 15.00

$passed = 0;
$total = 0;

function assertTest($label, $condition, $extra = '') {
    global $passed, $total;
    $total++;
    if ($condition) {
        $passed++;
        echo "✓ [PASS] $label\n";
    } else {
        echo "✗ [FAIL] $label" . ($extra ? " - ERROR: $extra" : "") . "\n";
    }
}

// 1. Create test user with 50 coins and ₦5,000.00
$rand = rand(1000, 9999);
$testUser = "CoinAutoTest_$rand";
$testEmail = "cointest_$rand@example.ng";

$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, is_verified) VALUES (?, ?, 'dummy_hash', 50, 5000.00, 1)")
   ->execute([$testUser, $testEmail]);
$testUserId = (int)$db->lastInsertId();

assertTest("Created test player (ID: $testUserId, Coins: 50, Balance: ₦5,000.00)", $testUserId > 0);

// 2. Test ensureCoinsAvailable with enough coins
$res1 = ensureCoinsAvailable($db, $testUserId, 30, "Lobby Staking");
assertTest("Direct coin check passes", $res1['success'] === true && $res1['converted'] === false);

// 3. Test ensureCoinsAvailable with shortfall (Needs 150 coins, has 50 coins -> Shortfall = 100 coins)
// Cost @ official Buy Rate: 100 * 15.00 = ₦1,500.00
$expectedCost1 = round(100 * $buyRatePerCoin, 2);
$res2 = ensureCoinsAvailable($db, $testUserId, 150, "Room Creation Test");
assertTest("Auto-conversion succeeded", $res2['success'] === true && $res2['converted'] === true, "Converted: ₦{$res2['converted_amount']}");

$userState = $db->query("SELECT coins, wallet_balance FROM users WHERE id = {$testUserId}")->fetch();
assertTest("Coins updated to 150", (int)$userState['coins'] === 150, "Current Coins: {$userState['coins']}");
assertTest("Wallet balance reduced by ₦" . number_format($expectedCost1, 2), (float)$userState['wallet_balance'] === (5000.00 - $expectedCost1), "Current Balance: ₦{$userState['wallet_balance']}");

// Check transaction record
$tx = $db->query("SELECT * FROM wallet_transactions WHERE user_id = {$testUserId} AND type = 'coin_exchange' ORDER BY id DESC LIMIT 1")->fetch();
assertTest("Auto-conversion logged in transaction ledger", !empty($tx) && (float)$tx['amount'] === -$expectedCost1);

// 4. Test ensureCoinsAvailable with excessive shortfall (neither coins nor Naira sufficient)
$res3 = ensureCoinsAvailable($db, $testUserId, 5000, "Big Stake Test");
assertTest("Excessive shortfall rejected cleanly", $res3['success'] === false && !empty($res3['message']));

// 5. Test Room Creation via API with auto-conversion
$cookieHost = __DIR__ . "/cookie_host_$rand.txt";
$cookieGuest = __DIR__ . "/cookie_guest_$rand.txt";

// Login Host via auth API to get legitimate session
$pass = 'Pass123!';
$db->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([password_hash($pass, PASSWORD_BCRYPT), $testUserId]);

$ch = curl_init('http://localhost/nigerian-draughts/api/auth.php?action=login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieHost);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['login' => $testUser, 'password' => $pass]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

// Host creates room with 300 coins (has 150 coins -> shortfall 150 coins @ ₦15/coin = ₦2,250.00)
$expectedCost2 = round(150 * $buyRatePerCoin, 2);
$ch = curl_init('http://localhost/nigerian-draughts/api/rooms.php?action=create_room');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieHost);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'wager_coins' => 300,
    'rule_type' => 'nigeria',
    'player_time' => '5'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$roomRes = curl_exec($ch);
curl_close($ch);

$roomData = json_decode($roomRes, true);
assertTest("Room creation with auto-conversion API", !empty($roomData['success']) && !empty($roomData['room_code']), "Code: " . ($roomData['room_code'] ?? 'NONE'));

$userStateAfterRoom = $db->query("SELECT coins, wallet_balance FROM users WHERE id = {$testUserId}")->fetch();
$expectedBalAfterRoom = round((5000.00 - $expectedCost1) - $expectedCost2, 2);
assertTest("Host wallet deducted ₦" . number_format($expectedCost2, 2) . " for shortfall", (float)$userStateAfterRoom['wallet_balance'] === $expectedBalAfterRoom, "Balance: ₦{$userStateAfterRoom['wallet_balance']}");
assertTest("Host escrow locked 300 coins", (int)$userStateAfterRoom['coins'] === 0, "Remaining Coins: {$userStateAfterRoom['coins']}");

// 6. Test Guest Joining with Auto-Conversion
// Create guest with 50 coins and ₦5,000
$guestUser = "GuestTester_$rand";
$db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, is_verified) VALUES (?, 'guest_$rand@ex.ng', ?, 50, 5000.00, 1)")
   ->execute([$guestUser, password_hash($pass, PASSWORD_BCRYPT)]);
$guestId = (int)$db->lastInsertId();

$ch = curl_init('http://localhost/nigerian-draughts/api/auth.php?action=login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieGuest);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['login' => $guestUser, 'password' => $pass]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_exec($ch);
curl_close($ch);

// Guest joins 300-coin room (needs 300 coins, has 50 coins -> converts 250 coins @ ₦15/coin = ₦3,750.00)
$expectedCostGuest = round(250 * $buyRatePerCoin, 2);
$ch = curl_init('http://localhost/nigerian-draughts/api/rooms.php?action=join_room');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieGuest);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'room_code' => $roomData['room_code'] ?? ''
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$joinRes = curl_exec($ch);
curl_close($ch);

$joinData = json_decode($joinRes, true);
assertTest("Guest joined 300-coin room with auto-conversion", !empty($joinData['success']), $joinData['message'] ?? '');

$guestState = $db->query("SELECT coins, wallet_balance FROM users WHERE id = {$guestId}")->fetch();
$expectedGuestBal = round(5000.00 - $expectedCostGuest, 2);
assertTest("Guest wallet balance deducted ₦" . number_format($expectedCostGuest, 2), (float)$guestState['wallet_balance'] === $expectedGuestBal, "Balance: ₦{$guestState['wallet_balance']}");
assertTest("Guest escrow locked 300 coins", (int)$guestState['coins'] === 0, "Coins: {$guestState['coins']}");

// Clean up
if (!empty($roomData['room_code'])) {
    $db->exec("DELETE FROM game_rooms WHERE room_code = '{$roomData['room_code']}'");
}
$db->exec("DELETE FROM wallet_transactions WHERE user_id IN ($testUserId, $guestId)");
$db->exec("DELETE FROM users WHERE id IN ($testUserId, $guestId)");
@unlink($cookieHost);
@unlink($cookieGuest);

echo "\n=============================================\n";
echo "TEST RESULTS: $passed / $total PASSED\n";
echo "=============================================\n";
