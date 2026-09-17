<?php
/**
 * Matches API Endpoint
 * Handles saving match results, updating player stats, and fetching match history.
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

try {
    $db = getDB();
    $currentUser = getCurrentUser();

    switch ($action) {
        case 'save_match':
            $gameMode       = $input['game_mode'] ?? 'pve';
            $aiDifficulty   = $input['ai_difficulty'] ?? 'medium';
            $boardSize      = (int)($input['board_size'] ?? 10);
            $ruleMode       = $input['rule_mode'] ?? 'nigerian';
            $result         = $input['result'] ?? 'in_progress'; // 'p1_won' | 'p2_won' | 'draw'
            $winReason      = $input['win_reason'] ?? '';
            $movesCount     = (int)($input['moves_count'] ?? 0);
            $p1Chopped      = (int)($input['p1_chopped'] ?? 0);
            $p2Chopped      = (int)($input['p2_chopped'] ?? 0);
            $boardStateJson = !empty($input['board_state_json']) 
                ? (is_string($input['board_state_json']) ? $input['board_state_json'] : json_encode($input['board_state_json'])) 
                : null;
            $moveHistoryJson = !empty($input['move_history_json']) 
                ? (is_string($input['move_history_json']) ? $input['move_history_json'] : json_encode($input['move_history_json'])) 
                : null;

            $player1Id   = $currentUser ? $currentUser['id'] : null;
            $player1Name = $currentUser ? $currentUser['username'] : 'Guest Player';
            $player2Name = trim($input['player2_name'] ?? '') ?: ($gameMode === 'pve' ? 'Draughts AI (' . ucfirst($aiDifficulty) . ')' : 'Player 2');
            $winnerId    = null;
            $winnerName  = null;

            if ($result === 'p1_won') {
                $winnerId   = $player1Id;
                $winnerName = $player1Name;
            } elseif ($result === 'p2_won') {
                $winnerName = $player2Name;
            }

            // Insert into matches
            $stmt = $db->prepare("
                INSERT INTO matches (
                    player1_id, player2_id, player1_name, player2_name,
                    game_mode, ai_difficulty, board_size, rule_mode,
                    winner_id, winner_name, result, win_reason,
                    moves_count, p1_chopped, p2_chopped,
                    board_state_json, move_history_json
                ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");

            $stmt->execute([
                $player1Id, $player1Name, $player2Name,
                $gameMode, $aiDifficulty, $boardSize, $ruleMode,
                $winnerId, $winnerName, $result, $winReason,
                $movesCount, $p1Chopped, $p2Chopped,
                $boardStateJson, $moveHistoryJson
            ]);

            $matchId = (int)$db->lastInsertId();

            // Update user stats if logged in
            $updatedStats = null;
            if ($player1Id && in_array($result, ['p1_won', 'p2_won', 'draw'])) {
                $isWin  = ($result === 'p1_won');
                $isLoss = ($result === 'p2_won');
                $isDraw = ($result === 'draw');

                // Rating calculation (Elo-like bonus)
                $ratingDelta = $isWin ? 25 : ($isLoss ? -15 : 5);

                $updateUser = $db->prepare("
                    UPDATE users
                    SET wins = wins + ?,
                        losses = losses + ?,
                        draws = draws + ?,
                        total_chopped = total_chopped + ?,
                        rating = GREATEST(800, rating + ?)
                    WHERE id = ?
                ");

                $updateUser->execute([
                    $isWin ? 1 : 0,
                    $isLoss ? 1 : 0,
                    $isDraw ? 1 : 0,
                    $p1Chopped,
                    $ratingDelta,
                    $player1Id
                ]);

                // Fetch fresh stats preserving all session profile fields
                $userStmt = $db->prepare("
                    SELECT id, username, email, rating, coins, wallet_balance, package, package_expiry,
                           daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
                           tournaments_hosted, tournaments_joined, avatar_url, avatar_color, country, country_code, title
                    FROM users WHERE id = ?
                ");
                $userStmt->execute([$player1Id]);
                $updatedStats = $userStmt->fetch();
                if ($updatedStats) {
                    $_SESSION['user'] = $updatedStats;
                }
            }

            jsonResponse([
                'success' => true,
                'message' => 'Match saved successfully!',
                'match_id' => $matchId,
                'user' => $updatedStats
            ]);
            break;

        case 'get_history':
            $userId = $currentUser ? $currentUser['id'] : 0;
            // Return user matches or public recent matches if not logged in
            if ($userId > 0) {
                $stmt = $db->prepare("
                    SELECT id, player1_name, player2_name, game_mode, ai_difficulty,
                           board_size, rule_mode, winner_name, result, win_reason,
                           moves_count, p1_chopped, p2_chopped, move_history_json, created_at
                    FROM matches
                    WHERE player1_id = ? OR player2_id = ?
                    ORDER BY created_at DESC
                    LIMIT 20
                ");
                $stmt->execute([$userId, $userId]);
            } else {
                $stmt = $db->query("
                    SELECT id, player1_name, player2_name, game_mode, ai_difficulty,
                           board_size, rule_mode, winner_name, result, win_reason,
                           moves_count, p1_chopped, p2_chopped, move_history_json, created_at
                    FROM matches
                    ORDER BY created_at DESC
                    LIMIT 20
                ");
            }
            $matches = $stmt->fetchAll();
            foreach ($matches as &$m) {
                $m['has_replay'] = !empty($m['move_history_json']);
                unset($m['move_history_json']); // don't send huge json in list
            }

            jsonResponse(['success' => true, 'matches' => $matches]);
            break;

        case 'get_match':
            $matchId = (int)($_GET['id'] ?? 0);
            if ($matchId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid match ID.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM matches WHERE id = ?");
            $stmt->execute([$matchId]);
            $match = $stmt->fetch();

            if (!$match) {
                jsonResponse(['success' => false, 'message' => 'Match not found.'], 404);
            }

            $match['move_history'] = !empty($match['move_history_json']) ? json_decode($match['move_history_json'], true) : [];
            unset($match['move_history_json']);

            jsonResponse(['success' => true, 'match' => $match]);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid match action.'], 400);
    }

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
