<?php
/**
 * Migration: Enhanced Tournament Specifications
 * Adds tournament_type, rule_type, join_type, payer_type, start_date, end_date,
 * join_deadline, board_type, game_modification, undo_allowed, is_private, to_win,
 * disable_chat, sound_on, is_scheduled.
 */

require_once __DIR__ . '/../config/db.php';

try {
    $db = getDB();
    echo "Starting tournament specifications migration...\n";

    $cols = $db->query("DESCRIBE tournaments")->fetchAll(PDO::FETCH_COLUMN);

    $columnsToAdd = [
        'tournament_type'   => "VARCHAR(30) DEFAULT 'knockout' AFTER format",
        'rule_type'         => "VARCHAR(30) DEFAULT 'nigeria' AFTER tournament_type",
        'join_type'         => "VARCHAR(30) DEFAULT 'open' AFTER rule_type",
        'payer_type'        => "VARCHAR(20) DEFAULT 'player' AFTER join_type",
        'start_date'        => "DATETIME NULL AFTER payer_type",
        'end_date'          => "DATETIME NULL AFTER start_date",
        'join_deadline'     => "DATETIME NULL AFTER end_date",
        'board_type'        => "VARCHAR(30) DEFAULT 'default' AFTER join_deadline",
        'game_modification' => "VARCHAR(50) DEFAULT 'none' AFTER board_type",
        'undo_allowed'      => "TINYINT(1) DEFAULT 1 AFTER game_modification",
        'is_private'        => "TINYINT(1) DEFAULT 0 AFTER undo_allowed",
        'to_win'            => "TINYINT(1) DEFAULT 1 AFTER is_private",
        'disable_chat'      => "TINYINT(1) DEFAULT 0 AFTER to_win",
        'sound_on'          => "TINYINT(1) DEFAULT 1 AFTER disable_chat",
        'is_scheduled'      => "TINYINT(1) DEFAULT 1 AFTER sound_on",
        'views_count'       => "INT DEFAULT 0 AFTER is_scheduled"
    ];

    foreach ($columnsToAdd as $colName => $colDef) {
        if (!in_array($colName, $cols)) {
            $db->exec("ALTER TABLE tournaments ADD COLUMN {$colName} {$colDef}");
            echo "  ✓ Added column {$colName}\n";
        } else {
            echo "  - Column {$colName} already exists\n";
        }
    }

    // Change bracket_size column from ENUM('8','16') to VARCHAR(10) to support 4, 8, 16, 32, 64
    $db->exec("ALTER TABLE tournaments MODIFY COLUMN bracket_size VARCHAR(10) DEFAULT '8'");
    echo "  ✓ bracket_size modified to VARCHAR(10)\n";

    // Check if tournament_participants needs any extra columns (like approval status for 'request' join type)
    $pCols = $db->query("DESCRIBE tournament_participants")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array('join_status', $pCols)) {
        $db->exec("ALTER TABLE tournament_participants ADD COLUMN join_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' AFTER status");
        echo "  ✓ Added join_status to tournament_participants\n";
    }

    echo "Migration completed successfully!\n";
} catch (Exception $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
