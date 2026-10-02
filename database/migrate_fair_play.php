<?php
/**
 * Database Migration: Fair Play & Anti-Cheat Engine Telemetry
 * Adds tab-switch tracking, fair-play flags, and reputation metrics.
 */
require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    echo "========================================================\n";
    echo "🛡️  STARTING FAIR PLAY & ANTI-CHEAT MIGRATION\n";
    echo "========================================================\n\n";

    // 1. Add columns to `game_rooms`
    $roomCols = $db->query("DESCRIBE game_rooms")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('p1_tab_switches', $roomCols)) {
        $db->exec("ALTER TABLE game_rooms ADD COLUMN p1_tab_switches INT NOT NULL DEFAULT 0 AFTER settings_json");
        echo "  ✓ Added 'p1_tab_switches' to game_rooms.\n";
    }
    if (!in_array('p2_tab_switches', $roomCols)) {
        $db->exec("ALTER TABLE game_rooms ADD COLUMN p2_tab_switches INT NOT NULL DEFAULT 0 AFTER p1_tab_switches");
        echo "  ✓ Added 'p2_tab_switches' to game_rooms.\n";
    }
    if (!in_array('fair_play_flag', $roomCols)) {
        $db->exec("ALTER TABLE game_rooms ADD COLUMN fair_play_flag VARCHAR(50) NOT NULL DEFAULT 'clean' AFTER p2_tab_switches");
        echo "  ✓ Added 'fair_play_flag' to game_rooms.\n";
    }

    // 2. Add columns to `users`
    $userCols = $db->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('fair_play_score', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN fair_play_score INT NOT NULL DEFAULT 100 AFTER is_banned");
        echo "  ✓ Added 'fair_play_score' to users.\n";
    }
    if (!in_array('cheat_warnings_count', $userCols)) {
        $db->exec("ALTER TABLE users ADD COLUMN cheat_warnings_count INT NOT NULL DEFAULT 0 AFTER fair_play_score");
        echo "  ✓ Added 'cheat_warnings_count' to users.\n";
    }

    echo "\n========================================================\n";
    echo "🎉 FAIR PLAY MIGRATION COMPLETED SUCCESSFULLY!\n";
    echo "========================================================\n";
    exit(0);

} catch (Exception $e) {
    echo "❌ MIGRATION FAILED: " . $e->getMessage() . "\n";
    exit(1);
}
