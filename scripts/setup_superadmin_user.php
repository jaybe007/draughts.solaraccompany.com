<?php
require_once __DIR__ . '/../config/db.php';
$db = getDB();

$allPerms = json_encode([
    'manage_admins',
    'manage_users',
    'manage_finance',
    'manage_tournaments',
    'manage_rooms',
    'manage_settings',
    'view_audit_logs'
]);

$adminPassword = 'Admin123!';
$passwordHash = password_hash($adminPassword, PASSWORD_BCRYPT);

// 1. Create or update dedicated 'superadmin' account
$check = $db->prepare("SELECT id FROM users WHERE username = 'superadmin' OR email = 'admin@naijadraughts.ng'");
$check->execute();
$existingId = $check->fetchColumn();

if ($existingId) {
    $db->prepare("
        UPDATE users 
        SET username = 'superadmin',
            email = 'admin@naijadraughts.ng',
            password_hash = ?,
            role = 'super_admin',
            permissions_json = ?,
            is_verified = 1,
            is_banned = 0
        WHERE id = ?
    ")->execute([$passwordHash, $allPerms, $existingId]);
    echo "✓ Updated existing account ID {$existingId} to 'superadmin'.\n";
} else {
    $db->prepare("
        INSERT INTO users (username, email, password_hash, role, permissions_json, is_verified, title, wallet_balance, coins)
        VALUES ('superadmin', 'admin@naijadraughts.ng', ?, 'super_admin', ?, 1, 'Grand Master Super Admin', 100000.00, 10000)
    ")->execute([$passwordHash, $allPerms]);
    $newId = $db->lastInsertId();
    echo "✓ Created new dedicated 'superadmin' account with ID {$newId}.\n";
}

// 2. Also ensure GrandmasterAyo has Password123!
$gmPassHash = password_hash('Password123!', PASSWORD_BCRYPT);
$db->prepare("
    UPDATE users 
    SET password_hash = ?, role = 'super_admin', permissions_json = ?, is_verified = 1, is_banned = 0
    WHERE username = 'GrandmasterAyo'
")->execute([$gmPassHash, $allPerms]);
echo "✓ GrandmasterAyo credentials verified (Password123!).\n";

// 3. Also update jaybe007 so user can log in with Password123! or Admin123!
$db->prepare("
    UPDATE users 
    SET password_hash = ?, role = 'super_admin', permissions_json = ?, is_verified = 1, is_banned = 0
    WHERE username = 'jaybe007' OR email = 'ayoadejubril@gmail.com'
")->execute([$passwordHash, $allPerms]);
echo "✓ jaybe007 credentials verified (Admin123!).\n";

echo "\n=======================================================\n";
echo "OFFICIAL SUPER ADMIN CREDENTIALS CONFIGURED:\n";
echo "=======================================================\n";
echo "Option 1 (Dedicated Super Admin):\n";
echo "  Username : superadmin\n";
echo "  Email    : admin@naijadraughts.ng\n";
echo "  Password : Admin123!\n\n";
echo "Option 2 (Your Personal Account):\n";
echo "  Username : jaybe007\n";
echo "  Email    : ayoadejubril@gmail.com\n";
echo "  Password : Admin123!\n\n";
echo "Option 3 (Root Grandmaster):\n";
echo "  Username : GrandmasterAyo\n";
echo "  Password : Password123!\n";
echo "=======================================================\n";
