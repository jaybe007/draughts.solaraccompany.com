<?php
require_once __DIR__ . '/config/db.php';
$db = getDB();

// Ensure a reliable demo user exists with known password
$demoUsername = "GrandmasterAyo";
$demoEmail = "ayo@naijadraughts.com";
$demoPassword = "Password123!";
$passHash = password_hash($demoPassword, PASSWORD_BCRYPT);

$stmt = $db->prepare("SELECT id, username, email, is_verified, wallet_balance, coins, package FROM users WHERE username = ?");
$stmt->execute([$demoUsername]);
$existing = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$existing) {
    $db->prepare("INSERT INTO users (username, email, password_hash, coins, wallet_balance, package, is_verified, rating, title) VALUES (?, ?, ?, 500, 25000.00, 'gold', 1, 1450, 'Lagos Master')")
       ->execute([$demoUsername, $demoEmail, $passHash]);
    $userId = $db->lastInsertId();
    echo "Created demo user '$demoUsername' (ID: $userId)\n";
} else {
    // Ensure password and verified status are set
    $db->prepare("UPDATE users SET password_hash = ?, is_verified = 1, wallet_balance = GREATEST(wallet_balance, 25000.00) WHERE id = ?")
       ->execute([$passHash, $existing['id']]);
    echo "Updated demo user '$demoUsername' (ID: {$existing['id']})\n";
}

$stmt->execute([$demoUsername]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode($user, JSON_PRETTY_PRINT) . "\n";
