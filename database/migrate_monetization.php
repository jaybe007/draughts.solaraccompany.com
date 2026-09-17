<?php
/**
 * Database Migration: Add Monetization, Wagers, Escrow & Rake Columns
 */

require_once __DIR__ . '/../config/db.php';

echo "=== MIGRATING DATABASE: MONETIZATION & WAGER ENGINE ===\n";

try {
    $db = getDB();

    // 1. Update game_rooms table
    $roomCols = $db->query("DESCRIBE game_rooms")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('wager_naira', $roomCols)) {
        echo "Adding column `wager_naira` to `game_rooms`... ";
        $db->exec("ALTER TABLE game_rooms ADD COLUMN `wager_naira` DECIMAL(10,2) DEFAULT 0.00 AFTER `wager_coins`");
        echo "DONE\n";
    } else {
        echo "Column `wager_naira` already exists in `game_rooms`.\n";
    }

    if (!in_array('rake_amount', $roomCols)) {
        echo "Adding column `rake_amount` to `game_rooms`... ";
        $db->exec("ALTER TABLE game_rooms ADD COLUMN `rake_amount` DECIMAL(10,2) DEFAULT 0.00 AFTER `wager_naira`");
        echo "DONE\n";
    } else {
        echo "Column `rake_amount` already exists in `game_rooms`.\n";
    }

    // 2. Update wallet_transactions table
    $txCols = $db->query("DESCRIBE wallet_transactions")->fetchAll(PDO::FETCH_COLUMN);

    // Expand ENUM type
    echo "Updating `wallet_transactions`.`type` ENUM... ";
    $db->exec("ALTER TABLE wallet_transactions MODIFY COLUMN `type` ENUM('deposit', 'withdrawal', 'withdrawal_request', 'wager_lock', 'wager_win', 'wager_rake', 'wager_refund', 'wager_fee', 'wager_escrow', 'package_purchase', 'daily_bonus', 'coin_exchange') NOT NULL");
    echo "DONE\n";

    if (!in_array('balance_after', $txCols)) {
        echo "Adding column `balance_after` to `wallet_transactions`... ";
        $db->exec("ALTER TABLE wallet_transactions ADD COLUMN `balance_after` DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER `coins`");
        echo "DONE\n";
    } else {
        echo "Column `balance_after` already exists in `wallet_transactions`.\n";
    }

    if (!in_array('status', $txCols)) {
        echo "Adding column `status` to `wallet_transactions`... ";
        $db->exec("ALTER TABLE wallet_transactions ADD COLUMN `status` ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'completed' AFTER `balance_after`");
        echo "DONE\n";
    } else {
        echo "Column `status` already exists in `wallet_transactions`.\n";
    }

    if (!in_array('reference', $txCols)) {
        echo "Adding column `reference` to `wallet_transactions`... ";
        $db->exec("ALTER TABLE wallet_transactions ADD COLUMN `reference` VARCHAR(100) NULL AFTER `status`");
        try {
            $db->exec("ALTER TABLE wallet_transactions ADD INDEX `idx_tx_ref` (`reference`)");
        } catch (PDOException $e) {}
        echo "DONE\n";
    } else {
        echo "Column `reference` already exists in `wallet_transactions`.\n";
    }

    echo "=== MONETIZATION MIGRATION COMPLETED SUCCESSFULLY ===\n";
} catch (Exception $e) {
    echo "MIGRATION ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
