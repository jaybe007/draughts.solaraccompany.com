<?php
/**
 * Naija Draughts - Professional Tournament & Knockout Championship Engine API
 * Supports 8-player and 16-player single elimination brackets, cash/coin entry fees,
 * automated match seeding, in-bracket room launching, and automated prize payouts.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';
require_once __DIR__ . '/../config/tournament_helper.php';

header('Content-Type: application/json; charset=utf-8');

$currentUser = getCurrentUser();
$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

try {
    $db = getDB();

    switch ($action) {

        // ================= LIST TOURNAMENTS ================= //
        case 'list':
        case 'list_tournaments':
        case 'get_tournaments':
            $filter = $_GET['filter'] ?? 'all';
            $sql = "
                SELECT t.*, 
                       COALESCE(tp.cnt, 0) AS registered_count
                FROM tournaments t
                LEFT JOIN (
                    SELECT tournament_id, COUNT(*) AS cnt 
                    FROM tournament_participants 
                    GROUP BY tournament_id
                ) tp ON tp.tournament_id = t.id
            ";

            if ($filter === 'upcoming') {
                $sql .= " WHERE t.status = 'upcoming'";
            } elseif ($filter === 'live') {
                $sql .= " WHERE t.status = 'live'";
            } elseif ($filter === 'completed') {
                $sql .= " WHERE t.status = 'completed'";
            }

            $sql .= " ORDER BY CASE t.status WHEN 'live' THEN 1 WHEN 'upcoming' THEN 2 ELSE 3 END, t.id DESC";

            $stmt = $db->query($sql);
            $tournaments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($tournaments as &$t) {
                $t['title'] = $t['name'];
                $t['brackets'] = json_decode($t['brackets_json'] ?? '{}', true);
                unset($t['brackets_json']);
                $t['registered_count'] = (int)$t['registered_count'];
                $t['max_participants'] = (int)($t['max_participants'] ?: 8);
                $t['entry_fee_naira'] = (float)($t['entry_fee_naira'] ?? 0);
                $t['entry_fee_coins'] = (int)($t['entry_fee_coins'] ?? 0);
                $t['prize_pool_naira'] = (float)($t['prize_pool_naira'] ?? 0);
                $t['is_registered'] = false;
                $t['user_seed'] = null;
                $t['current_user_id'] = $currentUser ? (int)$currentUser['id'] : null;

                if ($currentUser) {
                    $chk = $db->query("SELECT seed_number FROM tournament_participants WHERE tournament_id = {$t['id']} AND user_id = {$currentUser['id']}")->fetch(PDO::FETCH_ASSOC);
                    if ($chk) {
                        $t['is_registered'] = true;
                        $t['user_seed'] = (int)$chk['seed_number'];
                    }
                }
            }

            jsonResponse(['success' => true, 'tournaments' => $tournaments, 'current_user_id' => $currentUser ? (int)$currentUser['id'] : null]);
            break;

        // ================= GET SINGLE TOURNAMENT ================= //
        case 'get':
        case 'get_tournament':
            $tournId = (int)($_GET['id'] ?? ($input['id'] ?? 0));
            if ($tournId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Tournament ID required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
            $stmt->execute([$tournId]);
            $tournament = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tournament) {
                jsonResponse(['success' => false, 'message' => 'Tournament not found.'], 404);
            }

            $tournament['brackets'] = json_decode($tournament['brackets_json'] ?? '{}', true);
            unset($tournament['brackets_json']);
            $tournament['max_participants'] = (int)($tournament['max_participants'] ?: 8);

            // Fetch registered participants
            $pStmt = $db->prepare("
                SELECT tp.*, u.avatar_url, u.avatar_color, u.rating, u.title
                FROM tournament_participants tp
                LEFT JOIN users u ON u.id = tp.user_id
                WHERE tp.tournament_id = ?
                ORDER BY tp.seed_number ASC
            ");
            $pStmt->execute([$tournId]);
            $participants = $pStmt->fetchAll(PDO::FETCH_ASSOC);
            $tournament['participants'] = $participants;
            $tournament['registered_count'] = count($participants);

            // Check if current logged-in user is registered
            $tournament['is_user_registered'] = false;
            $tournament['user_seed'] = null;
            if ($currentUser) {
                foreach ($participants as $p) {
                    if ((int)$p['user_id'] === (int)$currentUser['id']) {
                        $tournament['is_user_registered'] = true;
                        $tournament['user_seed'] = (int)$p['seed_number'];
                        break;
                    }
                }
            }

            jsonResponse(['success' => true, 'tournament' => $tournament]);
            break;

        // ================= REGISTER FOR TOURNAMENT ================= //
        case 'register':
        case 'join':
            if (!$currentUser) {
                jsonResponse(['success' => false, 'message' => 'Please sign in or register to enter championships.'], 401);
            }

            $tournId = (int)($input['tournament_id'] ?? 0);
            if ($tournId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid tournament ID.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
            $stmt->execute([$tournId]);
            $tournament = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tournament) {
                jsonResponse(['success' => false, 'message' => 'Tournament not found.'], 404);
            }

            if ($tournament['status'] !== 'upcoming') {
                jsonResponse(['success' => false, 'message' => 'Registration is closed. Championship is already live or completed.'], 400);
            }

            $maxParticipants = (int)($tournament['max_participants'] ?: 8);
            $currentCount = (int)$db->query("SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = {$tournId}")->fetchColumn();

            if ($currentCount >= $maxParticipants) {
                jsonResponse(['success' => false, 'message' => 'Tournament bracket is full (8/8 players registered).'], 400);
            }

            // Check if already registered
            $chk = $db->prepare("SELECT id FROM tournament_participants WHERE tournament_id = ? AND user_id = ?");
            $chk->execute([$tournId, $currentUser['id']]);
            if ($chk->fetch()) {
                jsonResponse(['success' => true, 'message' => 'You are already registered for this championship!', 'already_registered' => true]);
            }

            $feeNaira = (float)($tournament['entry_fee_naira'] ?? 0);
            $feeCoins = (int)($tournament['entry_fee_coins'] ?? 0);

            // Fetch fresh wallet balance
            $uBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $uCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($feeNaira > 0 && $uBal < $feeNaira) {
                jsonResponse([
                    'success' => false,
                    'message' => "Insufficient wallet balance! Entry fee: ₦" . number_format($feeNaira, 2) . " (Available: ₦" . number_format($uBal, 2) . "). Please fund wallet."
                ], 400);
            }

            if ($feeCoins > 0) {
                $coinCheck = ensureCoinsAvailable($db, $currentUser['id'], $feeCoins, "Tournament Entry: {$tournament['name']}");
                if (!$coinCheck['success']) {
                    jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                }
            }

            // Deduct fees
            $db->beginTransaction();

            if ($feeNaira > 0) {
                $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")->execute([$feeNaira, $currentUser['id']]);
                $freshBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'tournament_entry', ?, 0, ?, 'completed', ?, ?)
                ")->execute([$currentUser['id'], -$feeNaira, $freshBal, "TOURN-FEE-{$tournId}-" . time(), "Entry Fee: {$tournament['name']}"]);
                if (isset($_SESSION['user']['wallet_balance'])) {
                    $_SESSION['user']['wallet_balance'] = $freshBal;
                }
            }

            if ($feeCoins > 0) {
                $db->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$feeCoins, $currentUser['id']]);
                $freshCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'tournament_entry', 0, ?, ?)
                ")->execute([$currentUser['id'], -$feeCoins, "Coins Entry: {$tournament['name']}"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = $freshCoins;
                }
            }

            // Assign seed number (1 through 8)
            $seedNumber = $currentCount + 1;
            $db->prepare("
                INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status, current_round)
                VALUES (?, ?, ?, ?, 'registered', 'Quarter-Finals')
            ")->execute([$tournId, $currentUser['id'], $currentUser['username'], $seedNumber]);

            $db->exec("UPDATE users SET tournaments_joined = tournaments_joined + 1 WHERE id = " . (int)$currentUser['id']);

            $newCount = $currentCount + 1;

            // AUTO-SEEDING WHEN FULL (8/8 PLAYERS)
            if ($newCount === $maxParticipants) {
                // Fetch all 8 participants
                $pList = $db->query("SELECT * FROM tournament_participants WHERE tournament_id = {$tournId} ORDER BY seed_number ASC")->fetchAll(PDO::FETCH_ASSOC);

                // Standard 8-Player Knockout Pairings:
                // Match 1: Seed 1 vs Seed 8
                // Match 2: Seed 4 vs Seed 5
                // Match 3: Seed 2 vs Seed 7
                // Match 4: Seed 3 vs Seed 6
                $pairings = [
                    ['p1' => $pList[0], 'p2' => $pList[7], 'match_index' => 0],
                    ['p1' => $pList[3], 'p2' => $pList[4], 'match_index' => 1],
                    ['p1' => $pList[1], 'p2' => $pList[6], 'match_index' => 2],
                    ['p1' => $pList[2], 'p2' => $pList[5], 'match_index' => 3]
                ];

                $qfMatches = [];
                foreach ($pairings as $idx => $pair) {
                    $mNum = $idx + 1;
                    $roomCode = "TOURN-{$tournId}-R1M{$mNum}";

                    // Create match room in game_rooms
                    $db->prepare("
                        INSERT INTO game_rooms (
                            room_code, host_id, guest_id, host_name, guest_name, game_type, 
                            wager_coins, wager_naira, status, current_turn, rule_type, player_time,
                            p1_time_left, p2_time_left, time_control, board_size, rule_mode
                        ) VALUES (
                            ?, ?, ?, ?, ?, 'tournament', 
                            0, 0.00, 'waiting', 1, 'nigeria', '5',
                            300, 300, 'rapid_5', 10, 'nigerian'
                        )
                    ")->execute([
                        $roomCode,
                        $pair['p1']['user_id'],
                        $pair['p2']['user_id'],
                        $pair['p1']['username'],
                        $pair['p2']['username']
                    ]);

                    $qfMatches[] = [
                        'match_id' => $mNum,
                        'p1' => [
                            'id' => (int)$pair['p1']['user_id'],
                            'username' => $pair['p1']['username'],
                            'seed' => (int)$pair['p1']['seed_number']
                        ],
                        'p2' => [
                            'id' => (int)$pair['p2']['user_id'],
                            'username' => $pair['p2']['username'],
                            'seed' => (int)$pair['p2']['seed_number']
                        ],
                        'winner' => null,
                        'room_code' => $roomCode,
                        'status' => 'ready'
                    ];
                }

                $brackets = [
                    'quarter_finals' => $qfMatches,
                    'semi_finals' => [
                        ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                        ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                    ],
                    'finals' => [
                        'match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                    ]
                ];

                $db->prepare("
                    UPDATE tournaments 
                    SET status = 'live', current_round = 'Quarter-Finals', brackets_json = ? 
                    WHERE id = ?
                ")->execute([json_encode($brackets), $tournId]);

                $db->exec("UPDATE tournament_participants SET status = 'active', current_round = 'Quarter-Finals' WHERE tournament_id = {$tournId}");
            }

            $db->commit();

            jsonResponse([
                'success' => true,
                'seed_number' => $seedNumber,
                'registered_count' => $newCount,
                'is_live' => ($newCount === $maxParticipants),
                'message' => ($newCount === $maxParticipants)
                    ? "Championship full! Bracket seeded and Quarterfinals are LIVE! Prepare your opening moves."
                    : "Registered successfully for {$tournament['name']} as Seed #{$seedNumber}! ({$newCount}/{$maxParticipants} Players)"
            ]);
            break;

        // ================= ADVANCE ROUND MATCH WINNER ================= //
        case 'advance_round':
            $tournId = (int)($input['tournament_id'] ?? 0);
            $round = trim($input['round'] ?? ''); // 'quarter_finals', 'semi_finals', 'finals'
            $matchIndex = (int)($input['match_index'] ?? 0);
            $winnerId = (int)($input['winner_id'] ?? 0);

            if ($tournId <= 0 || empty($round) || $winnerId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Tournament ID, round, and winner ID are required.'], 400);
            }

            $advanced = advanceTournamentRound($db, $tournId, $round, $matchIndex, $winnerId);
            if (!$advanced) {
                jsonResponse(['success' => false, 'message' => 'Failed to advance tournament round. Check tournament ID or match parameters.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
            $stmt->execute([$tournId]);
            $tourn = $stmt->fetch(PDO::FETCH_ASSOC);
            $brackets = json_decode($tourn['brackets_json'] ?? '{}', true);

            jsonResponse([
                'success' => true,
                'round' => $round,
                'winner_id' => $winnerId,
                'brackets' => $brackets,
                'tournament' => $tourn,
                'message' => "Bracket updated and match advanced!"
            ]);
            break;

        // ================= HOST / CREATE CHAMPIONSHIP ================= //
        case 'host_tournament':
        case 'create':
            if (!$currentUser) {
                jsonResponse(['success' => false, 'message' => 'Please sign in to host tournaments.'], 401);
            }

            $name = trim($input['name'] ?? ($input['title'] ?? ''));
            $tagline = trim($input['tagline'] ?? 'Official Community Draughts Tournament');
            $location = trim($input['location'] ?? 'Lagos, Nigeria');
            $feeNaira = max(0, (float)($input['entry_fee_naira'] ?? 0));
            $feeCoins = max(0, (int)($input['entry_fee_coins'] ?? 0));
            $prizeNaira = max(0, (float)($input['prize_pool_naira'] ?? 0));
            $prizePool = !empty($input['prize_pool']) ? trim($input['prize_pool']) : ($prizeNaira > 0 ? "₦" . number_format($prizeNaira, 2) . " Cash Pot" : "5,000 Coins");
            $format = trim($input['format'] ?? '8-Player Knockout');

            if (empty($name)) {
                jsonResponse(['success' => false, 'message' => 'Tournament title is required.'], 400);
            }

            $initialBrackets = json_encode([
                'quarter_finals' => [
                    ['match_id' => 1, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                    ['match_id' => 2, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                    ['match_id' => 3, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                    ['match_id' => 4, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                ],
                'semi_finals' => [
                    ['match_id' => 5, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                    ['match_id' => 6, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                ],
                'finals' => [
                    'match_id' => 7, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                ]
            ]);

            $stmt = $db->prepare("
                INSERT INTO tournaments (
                    host_id, host_name, name, tagline, location, prize_pool, prize_pool_naira,
                    entry_fee_coins, entry_fee_naira, format, bracket_size, status, current_round, brackets_json
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, '8', 'upcoming', 'Registration Open', ?
                )
            ");
            $stmt->execute([
                $currentUser['id'], $currentUser['username'], $name, $tagline, $location, $prizePool, $prizeNaira,
                $feeCoins, $feeNaira, $format, $initialBrackets
            ]);
            $newId = (int)$db->lastInsertId();

            $db->exec("UPDATE users SET tournaments_hosted = tournaments_hosted + 1 WHERE id = " . (int)$currentUser['id']);

            jsonResponse([
                'success' => true,
                'tournament_id' => $newId,
                'message' => "Championship '{$name}' created! Registration is now open."
            ]);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid tournament action.'], 400);
            break;
    }

} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    jsonResponse(['success' => false, 'message' => 'Tournament server error: ' . $e->getMessage()], 500);
}
