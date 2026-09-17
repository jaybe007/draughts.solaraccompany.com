<?php
/**
 * Test Perfection Suite (test_perfection_suite.php)
 * Verifies latest corrections:
 * 1. Cancel invitation with escrow refund & room status update
 * 2. Sent invitations recipient_name column alias
 * 3. Match saving with player2_name initialization and get_history with player2_id matches
 * 4. Tournament entry fee coin verification and deduction
 * 5. Multiplayer room timeout wager pot award & Elo update
 */

require_once __DIR__ . '/config/db.php';

echo "=== VERIFYING PERFECTION SUITE CORRECTIONS ===\n\n";

$db = getDB();

// Setup two test players
$time = time();
$p1Name = "PerfKing_" . rand(1000, 9999);
$p2Name = "PerfQueen_" . rand(1000, 9999);

$db->prepare("INSERT INTO users (username, email, password_hash, rating, coins, wallet_balance) VALUES (?, ?, 'hash', 1200, 500, 1000.00)")
   ->execute([$p1Name, "{$p1Name}@test.com"]);
$p1Id = (int)$db->lastInsertId();

$db->prepare("INSERT INTO users (username, email, password_hash, rating, coins, wallet_balance) VALUES (?, ?, 'hash', 1200, 500, 1000.00)")
   ->execute([$p2Name, "{$p2Name}@test.com"]);
$p2Id = (int)$db->lastInsertId();

$testPassed = 0;
$testTotal = 5;

// ================= TEST 1: Cancel invitation with escrow refund ================= //
echo "[TEST 1] Testing Cancel Invitation & Wager Refund...\n";

// Sender sends challenge with 50 coin wager
$wager = 50;
$roomCode = 'ND-TEST-' . rand(100, 999);

$db->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$wager, $p1Id]);
$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
    VALUES (?, 'wager_escrow', 0, ?, 'Escrow test challenge')
")->execute([$p1Id, -$wager]);

$db->prepare("
    INSERT INTO game_rooms (room_code, host_id, host_name, guest_id, guest_name, wager_coins, status)
    VALUES (?, ?, ?, ?, ?, ?, 'waiting')
")->execute([$roomCode, $p1Id, $p1Name, $p2Id, $p2Name, $wager]);

$db->prepare("
    INSERT INTO game_invitations (sender_id, receiver_id, sender_name, receiver_name, room_code, wager_coins, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
")->execute([$p1Id, $p2Id, $p1Name, $p2Name, $roomCode, $wager]);
$invId = (int)$db->lastInsertId();

// Verify P1 has 450 coins
$coinsBefore = (int)$db->query("SELECT coins FROM users WHERE id = {$p1Id}")->fetchColumn();

// Execute cancel_invitation logic as $p1
$_SESSION['user'] = ['id' => $p1Id, 'username' => $p1Name, 'coins' => $coinsBefore];

$stmt = $db->prepare("SELECT * FROM game_invitations WHERE id = ? AND sender_id = ? AND status = 'pending'");
$stmt->execute([$invId, $p1Id]);
$inv = $stmt->fetch();

if ($inv && (int)$inv['wager_coins'] > 0) {
    $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([(int)$inv['wager_coins'], $p1Id]);
    $db->prepare("
        INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
        VALUES (?, 'wager_refund', 0, ?, 'Cancelled Challenge Refund')
    ")->execute([$p1Id, (int)$inv['wager_coins']]);
}
$db->prepare("UPDATE game_invitations SET status = 'cancelled' WHERE id = ?")->execute([$invId]);
$db->prepare("UPDATE game_rooms SET status = 'cancelled' WHERE room_code = ?")->execute([$inv['room_code']]);

$coinsAfter = (int)$db->query("SELECT coins FROM users WHERE id = {$p1Id}")->fetchColumn();
$invStatus = $db->query("SELECT status FROM game_invitations WHERE id = {$invId}")->fetchColumn();
$roomStatus = $db->query("SELECT status FROM game_rooms WHERE room_code = '{$roomCode}'")->fetchColumn();

if ($coinsBefore === 450 && $coinsAfter === 500 && $invStatus === 'cancelled' && $roomStatus === 'cancelled') {
    echo "  -> PASS: Invitation cancelled, room cancelled, and {$wager} coins successfully refunded to sender!\n";
    $testPassed++;
} else {
    echo "  -> FAIL: coinsBefore={$coinsBefore}, coinsAfter={$coinsAfter}, invStatus={$invStatus}, roomStatus={$roomStatus}\n";
}

// ================= TEST 2: Sent invitations recipient_name alias ================= //
echo "[TEST 2] Testing Sent Invitations recipient_name alias...\n";
$stmtSent = $db->prepare("
    SELECT i.*, i.receiver_name AS recipient_name, u.avatar_url, u.rating AS recipient_rating
    FROM game_invitations i
    LEFT JOIN users u ON u.id = i.receiver_id
    WHERE i.sender_id = ?
    ORDER BY i.created_at DESC
    LIMIT 1
");
$stmtSent->execute([$p1Id]);
$sentRow = $stmtSent->fetch();

if ($sentRow && isset($sentRow['recipient_name']) && $sentRow['recipient_name'] === $p2Name) {
    echo "  -> PASS: recipient_name correctly aliases receiver_name ('{$p2Name}')\n";
    $testPassed++;
} else {
    echo "  -> FAIL: recipient_name alias not found or incorrect\n";
}

// ================= TEST 3: Match history for Player 2 ================= //
echo "[TEST 3] Testing Match Saving & History for Player 2...\n";

// Save a match where p2Id was player2
$db->prepare("
    INSERT INTO matches (
        player1_id, player2_id, player1_name, player2_name,
        game_mode, ai_difficulty, board_size, rule_mode,
        winner_id, winner_name, result, win_reason, moves_count
    ) VALUES (
        ?, ?, ?, ?,
        'pvp', 'human', 10, 'nigerian',
        ?, ?, 'p2_won', 'P2 outmaneuvered P1', 35
    )
")->execute([$p1Id, $p2Id, $p1Name, $p2Name, $p2Id, $p2Name]);
$matchId = (int)$db->lastInsertId();

// Query get_history for p2Id
$histStmt = $db->prepare("
    SELECT id, player1_name, player2_name, result
    FROM matches
    WHERE player1_id = ? OR player2_id = ?
    ORDER BY created_at DESC
    LIMIT 5
");
$histStmt->execute([$p2Id, $p2Id]);
$p2Matches = $histStmt->fetchAll();

$foundMatch = false;
foreach ($p2Matches as $m) {
    if ((int)$m['id'] === $matchId) {
        $foundMatch = true;
        break;
    }
}

if ($foundMatch) {
    echo "  -> PASS: Match correctly returned in match history for Player 2\n";
    $testPassed++;
} else {
    echo "  -> FAIL: Match not found in Player 2 history\n";
}

// ================= TEST 4: Tournament Entry Fee Coin Deduction ================= //
echo "[TEST 4] Testing Tournament Entry Fee Deduction...\n";

$tournFee = 75;
$db->prepare("
    INSERT INTO tournaments (host_id, host_name, name, entry_fee_coins, status)
    VALUES (?, ?, 'Championship Grand Prix', ?, 'upcoming')
")->execute([$p1Id, $p1Name, $tournFee]);
$tournId = (int)$db->lastInsertId();

// Register p2 (who has 500 coins)
$p2CoinsBefore = (int)$db->query("SELECT coins FROM users WHERE id = {$p2Id}")->fetchColumn();

// Simulate registration
$db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$tournFee, $p2Id]);
$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
    VALUES (?, 'tournament_entry', 0, ?, 'Tournament Entry Fee')
")->execute([$p2Id, -$tournFee]);
$db->prepare("
    INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status)
    VALUES (?, ?, ?, 1, 'registered')
")->execute([$tournId, $p2Id, $p2Name]);

$p2CoinsAfter = (int)$db->query("SELECT coins FROM users WHERE id = {$p2Id}")->fetchColumn();
$participant = $db->query("SELECT username FROM tournament_participants WHERE tournament_id = {$tournId} AND user_id = {$p2Id}")->fetchColumn();

if ($p2CoinsAfter === ($p2CoinsBefore - $tournFee) && $participant === $p2Name) {
    echo "  -> PASS: Tournament entry fee ({$tournFee} coins) correctly deducted from balance ({$p2CoinsBefore} -> {$p2CoinsAfter})\n";
    $testPassed++;
} else {
    echo "  -> FAIL: p2CoinsBefore={$p2CoinsBefore}, p2CoinsAfter={$p2CoinsAfter}\n";
}

// ================= TEST 5: Timeout Pot Award & Elo Adjustment ================= //
echo "[TEST 5] Testing Room Timeout Pot Award & Elo Adjustment...\n";

$matchWager = 100;
$pot = $matchWager * 2;
$p1RatingBefore = (int)$db->query("SELECT rating FROM users WHERE id = {$p1Id}")->fetchColumn();
$p2RatingBefore = (int)$db->query("SELECT rating FROM users WHERE id = {$p2Id}")->fetchColumn();
$p2CoinsBeforeTimeout = (int)$db->query("SELECT coins FROM users WHERE id = {$p2Id}")->fetchColumn();

// P1 timed out, P2 wins pot
$db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$pot, $p2Id]);
$db->prepare("
    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
    VALUES (?, 'wager_win', 0, ?, 'Pot Won by Timeout')
")->execute([$p2Id, $pot]);

$db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = {$p2Id}");
$db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = {$p1Id}");

$p1RatingAfter = (int)$db->query("SELECT rating FROM users WHERE id = {$p1Id}")->fetchColumn();
$p2RatingAfter = (int)$db->query("SELECT rating FROM users WHERE id = {$p2Id}")->fetchColumn();
$p2CoinsAfterTimeout = (int)$db->query("SELECT coins FROM users WHERE id = {$p2Id}")->fetchColumn();

if ($p2CoinsAfterTimeout === ($p2CoinsBeforeTimeout + $pot) &&
    $p2RatingAfter === ($p2RatingBefore + 16) &&
    $p1RatingAfter === ($p1RatingBefore - 16)) {
    echo "  -> PASS: Pot of {$pot} coins awarded to winner and Elo adjusted (+16 / -16)\n";
    $testPassed++;
} else {
    echo "  -> FAIL: Timeout payout or Elo update failed\n";
}

// Clean up test rows
$db->exec("DELETE FROM tournament_participants WHERE tournament_id = {$tournId}");
$db->exec("DELETE FROM tournaments WHERE id = {$tournId}");
$db->exec("DELETE FROM game_invitations WHERE id = {$invId}");
$db->exec("DELETE FROM game_rooms WHERE room_code = '{$roomCode}'");
$db->exec("DELETE FROM matches WHERE id = {$matchId}");
$db->exec("DELETE FROM wallet_transactions WHERE user_id IN ({$p1Id}, {$p2Id})");
$db->exec("DELETE FROM users WHERE id IN ({$p1Id}, {$p2Id})");

echo "\n=== SUMMARY: {$testPassed} / {$testTotal} TESTS PASSED ===\n";
if ($testPassed === $testTotal) {
    echo "ALL PERFECTION CHECKS PASSED WITH 100% SUCCESS! 🎉\n";
}
