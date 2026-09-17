<?php
/**
 * One-Click Database Setup & Migration Script
 * Handles table upgrades, alterations, and seed additions safely.
 */

require_once __DIR__ . '/config/db.php';

$isCli = (php_sapi_name() === 'cli');

function outputMsg($msg, $isError = false) {
    global $isCli;
    if ($isCli) {
        echo ($isError ? "[ERROR] " : "[SUCCESS] ") . $msg . "\n";
    } else {
        $color = $isError ? '#dc2626' : '#16a34a';
        echo "<p style='font-family: sans-serif; color: {$color}; font-weight: bold;'>{$msg}</p>";
    }
}

try {
    // 1. Connect to MySQL server first to create database if not present
    $dsnServer = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', DB_HOST, DB_PORT);
    $pdoServer = new PDO($dsnServer, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    $pdoServer->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    outputMsg("Database '" . DB_NAME . "' verified or created successfully.");

    $db = getDB();

    // Ensure uploads/avatars directory exists
    $avatarDir = __DIR__ . '/uploads/avatars';
    if (!is_dir($avatarDir)) {
        mkdir($avatarDir, 0777, true);
        outputMsg("Created avatars upload directory at uploads/avatars/");
    }

    // Add new columns to users if missing
    $userColumns = $db->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);
    $userAlters = [
        'country' => "ALTER TABLE users ADD COLUMN `country` VARCHAR(50) DEFAULT 'Nigeria'",
        'country_code' => "ALTER TABLE users ADD COLUMN `country_code` VARCHAR(10) DEFAULT 'NG'",
        'title' => "ALTER TABLE users ADD COLUMN `title` VARCHAR(50) DEFAULT 'Street Player'",
        'avatar_url' => "ALTER TABLE users ADD COLUMN `avatar_url` VARCHAR(255) NULL",
        'wallet_balance' => "ALTER TABLE users ADD COLUMN `wallet_balance` DECIMAL(10,2) DEFAULT 2500.00",
        'coins' => "ALTER TABLE users ADD COLUMN `coins` INT DEFAULT 150",
        'package' => "ALTER TABLE users ADD COLUMN `package` ENUM('free', 'silver', 'gold', 'vip_oba') DEFAULT 'free'",
        'package_expiry' => "ALTER TABLE users ADD COLUMN `package_expiry` DATETIME NULL",
        'daily_games_left' => "ALTER TABLE users ADD COLUMN `daily_games_left` INT DEFAULT 10",
        'last_daily_reset' => "ALTER TABLE users ADD COLUMN `last_daily_reset` DATE NULL",
        'tournaments_hosted' => "ALTER TABLE users ADD COLUMN `tournaments_hosted` INT DEFAULT 0",
        'tournaments_joined' => "ALTER TABLE users ADD COLUMN `tournaments_joined` INT DEFAULT 0"
    ];
    foreach ($userAlters as $col => $sql) {
        if (!in_array($col, $userColumns)) {
            $db->exec($sql);
            outputMsg("Added column `{$col}` to `users` table.");
        }
    }

    // Add new columns to matches if missing
    $matchColumns = $db->query("SHOW COLUMNS FROM matches")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('time_control', $matchColumns)) {
        $db->exec("ALTER TABLE matches ADD COLUMN `time_control` VARCHAR(20) DEFAULT 'rapid_5'");
    }

    // Add new columns to game_rooms if missing
    $roomColumns = $db->query("SHOW COLUMNS FROM game_rooms")->fetchAll(PDO::FETCH_COLUMN);
    $roomAlters = [
        'game_type' => "ALTER TABLE game_rooms ADD COLUMN `game_type` ENUM('p2p', 'random', 'tournament', 'daily_challenge', 'ai') DEFAULT 'p2p'",
        'wager_coins' => "ALTER TABLE game_rooms ADD COLUMN `wager_coins` INT DEFAULT 0",
        'is_private' => "ALTER TABLE game_rooms ADD COLUMN `is_private` TINYINT(1) DEFAULT 0",
        'rule_type' => "ALTER TABLE game_rooms ADD COLUMN `rule_type` VARCHAR(30) DEFAULT 'nigeria'",
        'player_time' => "ALTER TABLE game_rooms ADD COLUMN `player_time` VARCHAR(20) DEFAULT '5'",
        'time_increment' => "ALTER TABLE game_rooms ADD COLUMN `time_increment` INT DEFAULT 0",
        'p1_short' => "ALTER TABLE game_rooms ADD COLUMN `p1_short` INT DEFAULT 0",
        'modifications' => "ALTER TABLE game_rooms ADD COLUMN `modifications` VARCHAR(50) DEFAULT 'none'",
        'board_type' => "ALTER TABLE game_rooms ADD COLUMN `board_type` VARCHAR(50) DEFAULT 'default'",
        'settings_json' => "ALTER TABLE game_rooms ADD COLUMN `settings_json` LONGTEXT NULL"
    ];
    foreach ($roomAlters as $col => $sql) {
        if (!in_array($col, $roomColumns)) {
            $db->exec($sql);
            outputMsg("Added column `{$col}` to `game_rooms` table.");
        }
    }

    // Add new columns to tournaments if missing
    $tournColumns = $db->query("SHOW COLUMNS FROM tournaments")->fetchAll(PDO::FETCH_COLUMN);
    $tournAlters = [
        'host_id' => "ALTER TABLE tournaments ADD COLUMN `host_id` INT NULL",
        'host_name' => "ALTER TABLE tournaments ADD COLUMN `host_name` VARCHAR(50) DEFAULT 'Naija Draughts Federation'",
        'entry_fee_coins' => "ALTER TABLE tournaments ADD COLUMN `entry_fee_coins` INT DEFAULT 0",
        'max_participants' => "ALTER TABLE tournaments ADD COLUMN `max_participants` INT DEFAULT 16"
    ];
    foreach ($tournAlters as $col => $sql) {
        if (!in_array($col, $tournColumns)) {
            $db->exec($sql);
            outputMsg("Added column `{$col}` to `tournaments` table.");
        }
    }

    // Execute schema file to create all missing tables
    $schemaFile = __DIR__ . '/database/schema.sql';
    if (!file_exists($schemaFile)) {
        throw new Exception("Schema file not found at " . $schemaFile);
    }

    $sql = file_get_contents($schemaFile);
    $db->exec($sql);
    outputMsg("All database tables synchronized successfully!");

    $userCount = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $tournCount = $db->query("SELECT COUNT(*) FROM tournaments")->fetchColumn();
    $roomCount = $db->query("SELECT COUNT(*) FROM game_rooms")->fetchColumn();
    $msgCount = $db->query("SELECT COUNT(*) FROM user_messages")->fetchColumn();
    outputMsg("Champions: {$userCount} | Tournaments: {$tournCount} | Rooms: {$roomCount} | Messages: {$msgCount}");

} catch (Exception $e) {
    outputMsg("Database Setup Failed: " . $e->getMessage(), true);
    exit(1);
}
