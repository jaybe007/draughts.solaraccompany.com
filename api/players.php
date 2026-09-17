<?php
/**
 * Players Directory API Endpoint
 * Search, filter, and view player profiles with country and rating.
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = getDB();

    $playerId = (int)($_GET['id'] ?? 0);
    $search   = trim($_GET['q'] ?? '');

    if ($playerId > 0) {
        // Single player profile
        $stmt = $db->prepare("
            SELECT id, username, country, country_code, title, rating, wins, losses, draws, total_chopped, created_at,
                   CASE 
                     WHEN (wins + losses + draws) > 0 
                     THEN ROUND((wins / (wins + losses + draws)) * 100, 1) 
                     ELSE 0 
                   END AS win_rate
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$playerId]);
        $player = $stmt->fetch();

        if (!$player) {
            jsonResponse(['success' => false, 'message' => 'Player not found.'], 404);
        }

        // Also fetch their recent matches
        $matchStmt = $db->prepare("
            SELECT id, player1_name, player2_name, result, win_reason, moves_count, p1_chopped, created_at
            FROM matches
            WHERE player1_id = ? OR player2_id = ?
            ORDER BY created_at DESC
            LIMIT 5
        ");
        $matchStmt->execute([$playerId, $playerId]);
        $recentMatches = $matchStmt->fetchAll();

        jsonResponse([
            'success' => true,
            'player' => $player,
            'recent_matches' => $recentMatches
        ]);
    }

    // Search or list all players
    if (!empty($search)) {
        $stmt = $db->prepare("
            SELECT id, username, country, country_code, title, rating, wins, losses, draws, total_chopped,
                   CASE 
                     WHEN (wins + losses + draws) > 0 
                     THEN ROUND((wins / (wins + losses + draws)) * 100, 1) 
                     ELSE 0 
                   END AS win_rate
            FROM users 
            WHERE username LIKE ? OR country LIKE ?
            ORDER BY rating DESC
            LIMIT 30
        ");
        $term = "%{$search}%";
        $stmt->execute([$term, $term]);
    } else {
        $stmt = $db->query("
            SELECT id, username, country, country_code, title, rating, wins, losses, draws, total_chopped,
                   CASE 
                     WHEN (wins + losses + draws) > 0 
                     THEN ROUND((wins / (wins + losses + draws)) * 100, 1) 
                     ELSE 0 
                   END AS win_rate
            FROM users 
            ORDER BY rating DESC
            LIMIT 30
        ");
    }

    $players = $stmt->fetchAll();
    jsonResponse(['success' => true, 'players' => $players]);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
