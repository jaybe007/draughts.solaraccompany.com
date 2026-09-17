<?php
/**
 * Database Migration: Add Email Verification Columns to `users` Table
 */

require_once __DIR__ . '/../config/db.php';

echo "=== MIGRATING DATABASE: EMAIL VERIFICATION ===\n";

try {
    $db = getDB();
    
    // Check existing columns in users table
    $existingCols = $db->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);

    $columnsToAdd = [
        'is_verified' => "ALTER TABLE users ADD COLUMN `is_verified` TINYINT(1) NOT NULL DEFAULT 0 AFTER `tournaments_joined`",
        'verification_token' => "ALTER TABLE users ADD COLUMN `verification_token` VARCHAR(64) NULL AFTER `is_verified`",
        'verification_code' => "ALTER TABLE users ADD COLUMN `verification_code` VARCHAR(6) NULL AFTER `verification_token`",
        'verification_expires_at' => "ALTER TABLE users ADD COLUMN `verification_expires_at` DATETIME NULL AFTER `verification_code`",
        'email_verified_at' => "ALTER TABLE users ADD COLUMN `email_verified_at` DATETIME NULL AFTER `verification_expires_at`",
    ];

    foreach ($columnsToAdd as $col => $sql) {
        if (!in_array($col, $existingCols)) {
            echo "Adding column `{$col}`... ";
            $db->exec($sql);
            echo "DONE\n";
        } else {
            echo "Column `{$col}` already exists.\n";
        }
    }

    // Add indexes if missing
    try {
        $db->exec("ALTER TABLE users ADD INDEX `idx_verification_token` (`verification_token`)");
        echo "Index `idx_verification_token` added.\n";
    } catch (PDOException $e) {
        // Index might already exist
    }

    try {
        $db->exec("ALTER TABLE users ADD INDEX `idx_verification_code` (`email`, `verification_code`)");
        echo "Index `idx_verification_code` added.\n";
    } catch (PDOException $e) {
        // Index might already exist
    }

    // Mark existing users as verified so existing accounts/tests are not locked out
    $updated = $db->exec("UPDATE users SET is_verified = 1, email_verified_at = NOW() WHERE is_verified = 0 AND verification_token IS NULL AND verification_code IS NULL");
    echo "Existing users marked as verified ({$updated} rows updated).\n";

    echo "=== MIGRATION COMPLETED SUCCESSFULLY ===\n";
} catch (Exception $e) {
    echo "MIGRATION ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
