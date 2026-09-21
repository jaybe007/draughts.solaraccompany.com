<?php
/**
 * Naija Draughts - Admin RBAC & System Settings Database Migration
 * Adds:
 * - `role` ENUM('player', 'admin', 'super_admin') to `users`
 * - `permissions_json` LONGTEXT NULL to `users`
 * - `is_banned` TINYINT(1) DEFAULT 0 and `ban_reason` VARCHAR(255) NULL to `users`
 * - `admin_audit_logs` table
 * - `system_settings` table
 * - Designates 'GrandmasterAyo' as Super Admin with full root permissions
 */

require_once __DIR__ . '/../config/db.php';

echo "========================================================\n";
echo "  MIGRATING DATABASE FOR ADMIN COMMAND CENTER & RBAC\n";
echo "========================================================\n\n";

try {
    $db = getDB();

    // 1. Update `users` table columns
    $userCols = $db->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('role', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN role ENUM('player', 'admin', 'super_admin') DEFAULT 'player' AFTER package_expiry");
        echo "  ✓ Added column 'role' to users table.\n";
    }

    if (!in_array('permissions_json', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN permissions_json LONGTEXT NULL AFTER role");
        echo "  ✓ Added column 'permissions_json' to users table.\n";
    }

    if (!in_array('is_banned', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN is_banned TINYINT(1) DEFAULT 0 AFTER permissions_json");
        echo "  ✓ Added column 'is_banned' to users table.\n";
    }

    if (!in_array('ban_reason', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN ban_reason VARCHAR(255) NULL AFTER is_banned");
        echo "  ✓ Added column 'ban_reason' to users table.\n";
    }

    // 2. Create `admin_audit_logs` table
    $db->exec("
        CREATE TABLE IF NOT EXISTS admin_audit_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_id INT NULL,
            admin_username VARCHAR(50) NOT NULL,
            action VARCHAR(50) NOT NULL,
            target_type VARCHAR(50) NOT NULL,
            target_id VARCHAR(50) NULL,
            details TEXT NULL,
            ip_address VARCHAR(45) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_audit_admin (admin_id),
            INDEX idx_audit_action (action),
            INDEX idx_audit_created (created_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  ✓ Created / verified 'admin_audit_logs' table.\n";

    // 3. Create `system_settings` table
    $db->exec("
        CREATE TABLE IF NOT EXISTS system_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(50) NOT NULL UNIQUE,
            setting_value TEXT NOT NULL,
            description VARCHAR(255) NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            updated_by VARCHAR(50) NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "  ✓ Created / verified 'system_settings' table.\n";

    // 4. Seed default system settings
    $defaultSettings = [
        'coin_buy_rate_per_100' => ['1500', 'Coin purchase rate: ₦ per 100 Coins (₦15.00 / coin)'],
        'coin_sell_rate_per_100' => ['1350', 'Coin sell / cashback rate: ₦ per 100 Coins (₦13.50 / coin)'],
        'coin_match_commission_percent' => ['0', 'Platform house commission on coin match staking: 0 = 0% fee (winner takes 100%)'],
        'platform_match_rake' => ['8', 'Legacy standard match pot house rake percentage'],
        'platform_vip_rake' => ['4', 'VIP Oba discounted match pot house rake percentage'],
        'platform_tourn_commission' => ['10', 'Tournament platform commission percentage'],
        'min_deposit_naira' => ['500.00', 'Minimum wallet deposit amount in Naira (₦)'],
        'min_withdrawal_naira' => ['1000.00', 'Minimum bank payout withdrawal amount in Naira (₦)'],
        'maintenance_mode' => ['0', 'Platform maintenance mode: 0 = active, 1 = offline for maintenance'],
        'maintenance_message' => ['Naija Draughts is currently undergoing scheduled system upgrades. Arena will reopen shortly.', 'Maintenance banner display message'],
        'global_announcement' => ['🏆 Welcome to Naija Draughts! National 10x10 Knockout Championship is now live with ₦50,000 in cash prizes!', 'Global notification banner text across Arena and Dashboard']
    ];

    $checkStmt = $db->prepare("SELECT COUNT(*) FROM system_settings WHERE setting_key = ?");
    $insertStmt = $db->prepare("INSERT INTO system_settings (setting_key, setting_value, description, updated_by) VALUES (?, ?, ?, 'System')");

    foreach ($defaultSettings as $key => [$val, $desc]) {
        $checkStmt->execute([$key]);
        if ((int)$checkStmt->fetchColumn() === 0) {
            $insertStmt->execute([$key, $val, $desc]);
            echo "  ✓ Seeded default setting '{$key}' = '{$val}'.\n";
        }
    }

    // 5. Promote 'GrandmasterAyo' to Super Admin with all permissions
    $allPermissions = json_encode([
        'manage_admins',
        'manage_users',
        'manage_finance',
        'manage_tournaments',
        'manage_rooms',
        'manage_settings',
        'view_audit_logs'
    ]);

    $db->prepare("
        UPDATE users 
        SET role = 'super_admin', permissions_json = ? 
        WHERE username = 'GrandmasterAyo'
    ")->execute([$allPermissions]);

    echo "  ✓ Designated 'GrandmasterAyo' as SUPER ADMIN with full root permissions.\n";

    echo "\n========================================================\n";
    echo "🎉 ADMIN RBAC MIGRATION COMPLETED SUCCESSFULLY!\n";
    echo "========================================================\n";
    exit(0);

} catch (Exception $e) {
    echo "❌ MIGRATION FAILED: " . $e->getMessage() . "\n";
    exit(1);
}
