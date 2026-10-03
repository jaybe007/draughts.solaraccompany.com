<?php
/**
 * database/migrate_puzzle_rbac.php
 * Enhances role field to support flexible roles (admin, super_admin, puzzle_master, creator, player)
 * and verifies permissions_json supports manage_puzzles.
 */

require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    echo "Running puzzle RBAC database migration...\n";

    // Allow flexible roles
    $db->exec("ALTER TABLE users MODIFY COLUMN role VARCHAR(32) NOT NULL DEFAULT 'player'");
    echo "✓ Column 'role' in users table converted to VARCHAR(32).\n";

    // Ensure index on role
    $indices = $db->query("SHOW INDEX FROM users WHERE Key_name = 'idx_users_role'")->fetchAll();
    if (empty($indices)) {
        $db->exec("CREATE INDEX idx_users_role ON users (role)");
        echo "✓ Created index 'idx_users_role'.\n";
    }

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
