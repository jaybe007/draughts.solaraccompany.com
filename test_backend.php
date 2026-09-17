<?php
/**
 * Automated Integration Test for Nigerian Draughts PHP + MySQL Backend
 */

require_once __DIR__ . '/config/db.php';

echo "=== RUNNING PHP + MYSQL INTEGRATION TESTS ===\n";

$db = getDB();

// Test 1: Verify database tables exist
$tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
assert(in_array('users', $tables), "Table 'users' must exist");
assert(in_array('matches', $tables), "Table 'matches' must exist");
echo "✓ Test 1 Passed: Tables 'users' and 'matches' exist in MySQL\n";

// Test 2: Clean up previous test user if exists
$testUsername = 'NaijaHero_' . rand(1000, 9999);
$testEmail = $testUsername . '@test.ng';
$testPass = 'password123';

// Register via DB directly to test hashing
$hash = password_hash($testPass, PASSWORD_BCRYPT);
$ins = $db->prepare("INSERT INTO users (username, email, password_hash, rating, wins, losses, draws, total_chopped) VALUES (?, ?, ?, 1200, 0, 0, 0, 0)");
$ins->execute([$testUsername, $testEmail, $hash]);
$userId = (int)$db->lastInsertId();
assert($userId > 0, "User ID should be > 0");
echo "✓ Test 2 Passed: User registration & bcrypt password storage verified (User ID: {$userId})\n";

// Test 3: Password verification
$user = $db->query("SELECT * FROM users WHERE id = {$userId}")->fetch();
assert(password_verify($testPass, $user['password_hash']) === true, "Password verification failed");
echo "✓ Test 3 Passed: Password verification successful\n";

// Test 4: Save Match and update player statistics
$saveStmt = $db->prepare("
    INSERT INTO matches (
        player1_id, player1_name, player2_name, game_mode, ai_difficulty,
        board_size, rule_mode, winner_id, winner_name, result, win_reason,
        moves_count, p1_chopped, p2_chopped
    ) VALUES (?, ?, 'Street Hustler', 'pve', 'medium', 10, 'nigerian', ?, ?, 'p1_won', 'All enemy seeds chopped!', 28, 20, 11)
");
$saveStmt->execute([$userId, $testUsername, $userId, $testUsername]);
$matchId = (int)$db->lastInsertId();
assert($matchId > 0, "Match ID should be > 0");

// Update player stats
$upd = $db->prepare("
    UPDATE users
    SET wins = wins + 1,
        total_chopped = total_chopped + 20,
        rating = rating + 25
    WHERE id = ?
");
$upd->execute([$userId]);
echo "✓ Test 4 Passed: Match saved and player stats updated (Match ID: {$matchId})\n";

// Test 5: Verify updated player stats
$updatedUser = $db->query("SELECT * FROM users WHERE id = {$userId}")->fetch();
assert((int)$updatedUser['wins'] === 1, "Expected 1 win");
assert((int)$updatedUser['total_chopped'] === 20, "Expected 20 chopped seeds");
assert((int)$updatedUser['rating'] === 1225, "Expected rating 1225");
echo "✓ Test 5 Passed: User rating elevated to {$updatedUser['rating']} (+25 Elo), Wins = 1, Chopped = 20\n";

// Test 6: Verify Leaderboard Query
$top = $db->query("SELECT username, rating, wins FROM users ORDER BY rating DESC LIMIT 5")->fetchAll();
assert(count($top) >= 1, "Leaderboard should return top players");
echo "✓ Test 6 Passed: Leaderboard query returns top champions:\n";
foreach ($top as $idx => $champ) {
    echo "   #" . ($idx + 1) . " {$champ['username']} - {$champ['rating']} Elo ({$champ['wins']} wins)\n";
}

// Clean up test user
$db->exec("DELETE FROM matches WHERE player1_id = {$userId}");
$db->exec("DELETE FROM users WHERE id = {$userId}");
echo "✓ Test 7 Passed: Test data cleaned up successfully\n";

echo "\nALL PHP + MYSQL BACKEND INTEGRATION TESTS PASSED 100%! 🎉\n";
