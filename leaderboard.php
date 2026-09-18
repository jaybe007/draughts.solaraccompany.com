<?php
/**
 * Leaderboard API Endpoint
 * Returns top Nigerian Draughts champions ordered by rating and wins.
 */

require_once __DIR__ . '/config/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = getDB();

    $stmt = $db->query("
        SELECT id, username, rating, wins, losses, draws, total_chopped,
               CASE 
                 WHEN (wins + losses + draws) > 0 
                 THEN ROUND((wins / (wins + losses + draws)) * 100, 1) 
                 ELSE 0 
               END AS win_rate
        FROM users
        ORDER BY rating DESC, wins DESC, total_chopped DESC
        LIMIT 25
    ");

    $champions = $stmt->fetchAll();

    jsonResponse([
        'success' => true,
        'leaderboard' => $champions
    ]);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
