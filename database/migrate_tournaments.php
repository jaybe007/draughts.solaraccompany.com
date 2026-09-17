<?php
/**
 * Naija Draughts - Tournament Engine Database Migration
 * Adds cash entry fees, cash prize pools, bracket sizes, winner IDs, and round tracking.
 */

require_once __DIR__ . '/../config/db.php';

echo "========================================================\n";
echo "  MIGRATING DATABASE FOR TOURNAMENTS ENGINE\n";
echo "========================================================\n\n";

try {
    $db = getDB();

    // 1. Update tournaments table columns
    $cols = $db->query("DESCRIBE tournaments")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('entry_fee_naira', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN entry_fee_naira DECIMAL(10,2) DEFAULT 0.00 AFTER entry_fee_coins");
        echo "  ✓ Added column 'entry_fee_naira' to tournaments.\n";
    }
    if (!in_array('prize_pool_naira', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN prize_pool_naira DECIMAL(10,2) DEFAULT 0.00 AFTER prize_pool");
        echo "  ✓ Added column 'prize_pool_naira' to tournaments.\n";
    }
    if (!in_array('bracket_size', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN bracket_size ENUM('8', '16') DEFAULT '8' AFTER max_participants");
        echo "  ✓ Added column 'bracket_size' to tournaments.\n";
    }
    if (!in_array('winner_id', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN winner_id INT NULL AFTER brackets_json");
        echo "  ✓ Added column 'winner_id' to tournaments.\n";
    }
    if (!in_array('winner_name', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN winner_name VARCHAR(50) NULL AFTER winner_id");
        echo "  ✓ Added column 'winner_name' to tournaments.\n";
    }
    if (!in_array('runner_up_id', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN runner_up_id INT NULL AFTER winner_name");
        echo "  ✓ Added column 'runner_up_id' to tournaments.\n";
    }
    if (!in_array('runner_up_name', $cols)) {
        $db->exec("ALTER TABLE tournaments ADD COLUMN runner_up_name VARCHAR(50) NULL AFTER runner_up_id");
        echo "  ✓ Added column 'runner_up_name' to tournaments.\n";
    }

    // 2. Update tournament_participants table columns
    $pCols = $db->query("DESCRIBE tournament_participants")->fetchAll(PDO::FETCH_COLUMN);

    if (!in_array('current_round', $pCols)) {
        $db->exec("ALTER TABLE tournament_participants ADD COLUMN current_round VARCHAR(30) DEFAULT 'Quarter-Finals' AFTER status");
        echo "  ✓ Added column 'current_round' to tournament_participants.\n";
    }
    if (!in_array('prize_won_naira', $pCols)) {
        $db->exec("ALTER TABLE tournament_participants ADD COLUMN prize_won_naira DECIMAL(10,2) DEFAULT 0.00 AFTER current_round");
        echo "  ✓ Added column 'prize_won_naira' to tournament_participants.\n";
    }
    if (!in_array('prize_won_coins', $pCols)) {
        $db->exec("ALTER TABLE tournament_participants ADD COLUMN prize_won_coins INT DEFAULT 0 AFTER prize_won_naira");
        echo "  ✓ Added column 'prize_won_coins' to tournament_participants.\n";
    }

    // 3. Update wallet_transactions type enum if needed
    $db->exec("
        ALTER TABLE wallet_transactions MODIFY COLUMN type 
        ENUM('deposit', 'withdrawal', 'wager_lock', 'wager_win', 'wager_rake', 'wager_refund', 'wager_escrow', 'withdrawal_request', 'coin_exchange', 'package_upgrade', 'package_purchase', 'tournament_entry', 'tournament_prize') NOT NULL
    ");
    echo "  ✓ Updated wallet_transactions.type ENUM with 'tournament_entry' and 'tournament_prize'.\n";

    // 4. Update game_rooms room_code length for tournament room codes (e.g. TOURN-12-R1M1, TOURN-12-FINAL)
    $db->exec("ALTER TABLE game_rooms MODIFY COLUMN room_code VARCHAR(32) NOT NULL");
    echo "  ✓ Modified game_rooms.room_code to VARCHAR(32).\n";

    // 4. Ensure sample championship exists
    $count = (int)$db->query("SELECT COUNT(*) FROM tournaments")->fetchColumn();
    if ($count === 0) {
        $initialBrackets = json_encode([
            'quarter_finals' => [
                ['match_id' => 1, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null],
                ['match_id' => 2, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null],
                ['match_id' => 3, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null],
                ['match_id' => 4, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null]
            ],
            'semi_finals' => [
                ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null],
                ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null]
            ],
            'finals' => [
                'match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null
            ]
        ]);

        $db->prepare("
            INSERT INTO tournaments (
                host_id, host_name, name, tagline, location, prize_pool, prize_pool_naira, entry_fee_coins, entry_fee_naira, format, bracket_size, status, current_round, brackets_json
            ) VALUES (
                1, 'Naija Draughts Federation', 'Lagos Mainland Championship 2026', 'Battle of the Street Kings & Masters', 'Lagos Island, Nigeria', '₦100,000 Cash Pot', 100000.00, 0, 1000.00, '8-Player Knockout', '8', 'upcoming', 'Registration Open', ?
            )
        ")->execute([$initialBrackets]);
        echo "  ✓ Seeded 'Lagos Mainland Championship 2026' with ₦100,000 Prize Pool.\n";
    }

    echo "\n========================================================\n";
    echo "🎉 TOURNAMENTS ENGINE MIGRATION COMPLETED SUCCESSFULLY!\n";
    echo "========================================================\n";
    exit(0);

} catch (Exception $e) {
    echo "❌ MIGRATION FAILED: " . $e->getMessage() . "\n";
    exit(1);
}
