<?php
/**
 * Database Migration: Security Engine Tables & Balance Integrity
 * Creates security_rate_limits and security_audit_flags tables,
 * and configures financial balance integrity.
 */

require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    echo "[Security Migration] Connected to database: " . DB_NAME . "\n";

    // 1. security_rate_limits table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `security_rate_limits` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `rate_key` VARCHAR(128) NOT NULL,
            `action_type` VARCHAR(64) NOT NULL,
            `identifier` VARCHAR(128) NOT NULL,
            `hits` INT NOT NULL DEFAULT 1,
            `window_start` INT NOT NULL,
            `blocked_until` INT NULL DEFAULT NULL,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY `uk_rate_key` (`rate_key`),
            INDEX `idx_action_id` (`action_type`, `identifier`),
            INDEX `idx_blocked` (`blocked_until`),
            INDEX `idx_window` (`window_start`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "[Security Migration] Table 'security_rate_limits' ready.\n";

    // 2. security_audit_flags table
    $db->exec("
        CREATE TABLE IF NOT EXISTS `security_audit_flags` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `user_id` INT NULL,
            `event_type` VARCHAR(64) NOT NULL,
            `severity` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
            `ip_address` VARCHAR(45) NOT NULL,
            `user_agent` VARCHAR(255) NULL,
            `details_json` LONGTEXT NULL,
            `status` ENUM('flagged', 'reviewed', 'dismissed', 'banned') DEFAULT 'flagged',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX `idx_flag_user` (`user_id`),
            INDEX `idx_flag_event` (`event_type`),
            INDEX `idx_flag_severity` (`severity`),
            INDEX `idx_flag_status` (`status`),
            INDEX `idx_flag_created` (`created_at` DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "[Security Migration] Table 'security_audit_flags' ready.\n";

    // 3. failed_logins table for persistent brute force defense
    $db->exec("
        CREATE TABLE IF NOT EXISTS `failed_logins` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `login_identifier` VARCHAR(128) NOT NULL,
            `ip_address` VARCHAR(45) NOT NULL,
            `failed_attempts` INT NOT NULL DEFAULT 1,
            `first_failed_at` INT NOT NULL,
            `last_failed_at` INT NOT NULL,
            `locked_until` INT NULL DEFAULT NULL,
            UNIQUE KEY `uk_login_ip` (`login_identifier`, `ip_address`),
            INDEX `idx_locked_until` (`locked_until`),
            INDEX `idx_ip` (`ip_address`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");
    echo "[Security Migration] Table 'failed_logins' ready.\n";

    // 4. Financial Integrity Guard (Prevent negative balance via Triggers if CHECK constraints not active)
    $db->exec("DROP TRIGGER IF EXISTS `trg_prevent_negative_balance_update`;");
    $db->exec("
        CREATE TRIGGER `trg_prevent_negative_balance_update`
        BEFORE UPDATE ON `users`
        FOR EACH ROW
        BEGIN
            IF NEW.wallet_balance < 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Security Violation: Wallet balance cannot be negative.';
            END IF;
            IF NEW.coins < 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Security Violation: Coins balance cannot be negative.';
            END IF;
        END;
    ");
    echo "[Security Migration] Trigger 'trg_prevent_negative_balance_update' installed.\n";

    $db->exec("DROP TRIGGER IF EXISTS `trg_prevent_negative_balance_insert`;");
    $db->exec("
        CREATE TRIGGER `trg_prevent_negative_balance_insert`
        BEFORE INSERT ON `users`
        FOR EACH ROW
        BEGIN
            IF NEW.wallet_balance < 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Security Violation: Wallet balance cannot be negative.';
            END IF;
            IF NEW.coins < 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Security Violation: Coins balance cannot be negative.';
            END IF;
        END;
    ");
    echo "[Security Migration] Trigger 'trg_prevent_negative_balance_insert' installed.\n";

    echo "[Security Migration] All security tables and integrity triggers successfully initialized!\n";

} catch (Exception $e) {
    echo "[Security Migration Error] " . $e->getMessage() . "\n";
    exit(1);
}
