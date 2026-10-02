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
            $filter = strtolower(trim($_GET['filter'] ?? 'all'));
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

            if ($filter === 'upcoming' || $filter === 'new') {
                $sql .= " WHERE t.status = 'upcoming'";
            } elseif ($filter === 'live' || $filter === 'started') {
                $sql .= " WHERE t.status = 'live'";
            } elseif ($filter === 'completed' || $filter === 'over') {
                $sql .= " WHERE t.status = 'completed'";
            }

            if ($filter === 'most_viewed') {
                $sql .= " ORDER BY COALESCE(t.views_count, 0) DESC, registered_count DESC, t.id DESC";
            } else {
                $sql .= " ORDER BY CASE t.status WHEN 'live' THEN 1 WHEN 'upcoming' THEN 2 ELSE 3 END, t.id DESC";
            }

            $stmt = $db->query($sql);
            $tournaments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Fetch live counts for category badges
            $counts = [
                'all' => (int)$db->query("SELECT COUNT(*) FROM tournaments")->fetchColumn(),
                'new' => (int)$db->query("SELECT COUNT(*) FROM tournaments WHERE status = 'upcoming'")->fetchColumn(),
                'started' => (int)$db->query("SELECT COUNT(*) FROM tournaments WHERE status = 'live'")->fetchColumn(),
                'over' => (int)$db->query("SELECT COUNT(*) FROM tournaments WHERE status = 'completed'")->fetchColumn(),
                'most_viewed' => (int)$db->query("SELECT COUNT(*) FROM tournaments")->fetchColumn()
            ];

            foreach ($tournaments as &$t) {
                $t['title'] = $t['name'];
                $t['brackets'] = json_decode($t['brackets_json'] ?? '{}', true);
                unset($t['brackets_json']);
                $t['registered_count'] = (int)$t['registered_count'];
                $t['max_participants'] = (int)($t['max_participants'] ?: 8);
                $t['views_count'] = (int)($t['views_count'] ?? 0);
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
                $t['tournament_type'] = $t['tournament_type'] ?? 'knockout';
                $t['rule_type'] = $t['rule_type'] ?? 'nigeria';
                $t['join_type'] = $t['join_type'] ?? 'open';
                $t['payer_type'] = $t['payer_type'] ?? 'player';
                $t['start_date'] = $t['start_date'] ?? null;
                $t['end_date'] = $t['end_date'] ?? null;
                $t['join_deadline'] = $t['join_deadline'] ?? null;
                $t['board_type'] = $t['board_type'] ?? 'default';
                $t['game_modification'] = $t['game_modification'] ?? 'none';
                $t['undo_allowed'] = (bool)($t['undo_allowed'] ?? 1);
                $t['is_private'] = (bool)($t['is_private'] ?? 0);
                $t['to_win'] = (bool)($t['to_win'] ?? 1);
                $t['disable_chat'] = (bool)($t['disable_chat'] ?? 0);
                $t['sound_on'] = (bool)($t['sound_on'] ?? 1);
                $t['is_scheduled'] = (bool)($t['is_scheduled'] ?? 1);
            }

            jsonResponse([
                'success' => true,
                'tournaments' => $tournaments,
                'counts' => $counts,
                'current_filter' => $filter,
                'current_user_id' => $currentUser ? (int)$currentUser['id'] : null
            ]);
            break;

        // ================= GET SINGLE TOURNAMENT ================= //
        case 'get':
        case 'get_tournament':
            $tournId = (int)($_GET['id'] ?? ($input['id'] ?? 0));
            if ($tournId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Tournament ID required.'], 400);
            }

            // Increment views count
            $db->exec("UPDATE tournaments SET views_count = views_count + 1 WHERE id = {$tournId}");

            $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
            $stmt->execute([$tournId]);
            $tournament = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tournament) {
                jsonResponse(['success' => false, 'message' => 'Tournament not found.'], 404);
            }

            $tournament['brackets'] = json_decode($tournament['brackets_json'] ?? '{}', true);
            unset($tournament['brackets_json']);
            $tournament['max_participants'] = (int)($tournament['max_participants'] ?: 8);
            $tournament['views_count'] = (int)($tournament['views_count'] ?? 0);

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

            // Deadline check (in GMT)
            if (!empty($tournament['join_deadline'])) {
                $nowUtc = new DateTime('now', new DateTimeZone('UTC'));
                $deadlineUtc = new DateTime($tournament['join_deadline'], new DateTimeZone('UTC'));
                if ($nowUtc > $deadlineUtc) {
                    jsonResponse(['success' => false, 'message' => 'Registration deadline has passed for this championship (' . $deadlineUtc->format('d/m/Y H:i') . ' GMT).'], 400);
                }
            }

            $maxParticipants = (int)($tournament['max_participants'] ?: 8);
            $currentCount = (int)$db->query("SELECT COUNT(*) FROM tournament_participants WHERE tournament_id = {$tournId}")->fetchColumn();

            if ($currentCount >= $maxParticipants) {
                jsonResponse(['success' => false, 'message' => "Tournament bracket is full ({$maxParticipants}/{$maxParticipants} players registered)."], 400);
            }

            // Check if already registered
            $chk = $db->prepare("SELECT id FROM tournament_participants WHERE tournament_id = ? AND user_id = ?");
            $chk->execute([$tournId, $currentUser['id']]);
            if ($chk->fetch()) {
                jsonResponse(['success' => true, 'message' => 'You are already registered for this championship!', 'already_registered' => true]);
            }

            $isHostSponsored = (($tournament['payer_type'] ?? 'player') === 'host');
            $feeNaira = $isHostSponsored ? 0 : (float)($tournament['entry_fee_naira'] ?? 0);
            $feeCoins = $isHostSponsored ? 0 : (int)($tournament['entry_fee_coins'] ?? 0);

            // Fetch fresh wallet balance
            $uBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $uCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            if ($feeNaira > 0) {
                if ($uBal >= $feeNaira) {
                    $db->prepare("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?")->execute([$feeNaira, $currentUser['id']]);
                    $freshBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                        VALUES (?, 'tournament_entry', ?, 0, ?, 'completed', ?, ?)
                    ")->execute([$currentUser['id'], -$feeNaira, $freshBal, "TOURN-FEE-{$tournId}-" . time(), "Entry Fee: {$tournament['name']}"]);
                    if (isset($_SESSION['user']['wallet_balance'])) {
                        $_SESSION['user']['wallet_balance'] = $freshBal;
                    }
                } elseif ($uCoins >= (int)ceil($feeNaira)) {
                    $coinDeduct = (int)ceil($feeNaira);
                    $db->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$coinDeduct, $currentUser['id']]);
                    $freshCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                        VALUES (?, 'tournament_entry', 0, ?, ?, 'completed', ?, ?)
                    ")->execute([$currentUser['id'], -$coinDeduct, $uBal, "TOURN-COIN-{$tournId}-" . time(), "Tournament Entry via Global Coins: {$tournament['name']}"]);
                    if (isset($_SESSION['user']['coins'])) {
                        $_SESSION['user']['coins'] = $freshCoins;
                    }
                } else {
                    jsonResponse([
                        'success' => false,
                        'message' => "Insufficient balance! Entry fee: ₦" . number_format($feeNaira, 2) . " or " . number_format($feeNaira) . " Coins (Available: ₦" . number_format($uBal, 2) . ", " . number_format($uCoins) . " Coins). Please fund wallet or purchase Coins."
                    ], 400);
                }
            }

            if ($feeCoins > 0) {
                $coinCheck = ensureCoinsAvailable($db, $currentUser['id'], $feeCoins, "Tournament Entry: {$tournament['name']}");
                if (!$coinCheck['success']) {
                    jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                }

                $db->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$feeCoins, $currentUser['id']]);
                $freshCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                $curBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'tournament_entry', 0, ?, ?, 'completed', ?, ?)
                ")->execute([$currentUser['id'], -$feeCoins, $curBal, "TOURN-COIN-{$tournId}-" . time(), "Coins Entry: {$tournament['name']}"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = $freshCoins;
                }
            }

            $joinType = $tournament['join_type'] ?? 'open';
            $joinStatus = ($joinType === 'request') ? 'pending' : 'approved';

            // Assign seed number (1 through max)
            $seedNumber = $currentCount + 1;
            $db->prepare("
                INSERT INTO tournament_participants (tournament_id, user_id, username, seed_number, status, join_status, current_round)
                VALUES (?, ?, ?, ?, 'registered', ?, 'Round 1')
            ")->execute([$tournId, $currentUser['id'], $currentUser['username'], $seedNumber, $joinStatus]);

            $db->exec("UPDATE users SET tournaments_joined = tournaments_joined + 1 WHERE id = " . (int)$currentUser['id']);

            $newCount = $currentCount + 1;

            // If request participation, notify user
            if ($joinType === 'request') {
                jsonResponse([
                    'success' => true,
                    'is_pending_request' => true,
                    'message' => "Request to join {$tournament['name']} sent to host ({$tournament['host_name']})! You will be notified upon approval."
                ]);
            }

            // AUTO-SEEDING WHEN FULL
            if ($newCount === $maxParticipants) {
                $pList = $db->query("SELECT * FROM tournament_participants WHERE tournament_id = {$tournId} AND join_status = 'approved' ORDER BY seed_number ASC")->fetchAll(PDO::FETCH_ASSOC);

                // Build round pairings according to bracket size
                $pairings = [];
                $initialRoundName = 'Quarter-Finals';
                $roundKey = 'quarter_finals';

                if ($maxParticipants == 4) {
                    $pairings = [
                        ['p1' => $pList[0], 'p2' => $pList[3], 'match_index' => 0],
                        ['p1' => $pList[1], 'p2' => $pList[2], 'match_index' => 1]
                    ];
                    $initialRoundName = 'Semi-Finals';
                    $roundKey = 'semi_finals';
                } elseif ($maxParticipants == 8) {
                    $pairings = [
                        ['p1' => $pList[0], 'p2' => $pList[7], 'match_index' => 0],
                        ['p1' => $pList[3], 'p2' => $pList[4], 'match_index' => 1],
                        ['p1' => $pList[1], 'p2' => $pList[6], 'match_index' => 2],
                        ['p1' => $pList[2], 'p2' => $pList[5], 'match_index' => 3]
                    ];
                    $initialRoundName = 'Quarter-Finals';
                    $roundKey = 'quarter_finals';
                } elseif ($maxParticipants == 16) {
                    $pairings = [
                        ['p1' => $pList[0], 'p2' => $pList[15], 'match_index' => 0],
                        ['p1' => $pList[7], 'p2' => $pList[8],  'match_index' => 1],
                        ['p1' => $pList[3], 'p2' => $pList[12], 'match_index' => 2],
                        ['p1' => $pList[4], 'p2' => $pList[11], 'match_index' => 3],
                        ['p1' => $pList[1], 'p2' => $pList[14], 'match_index' => 4],
                        ['p1' => $pList[6], 'p2' => $pList[9],  'match_index' => 5],
                        ['p1' => $pList[2], 'p2' => $pList[13], 'match_index' => 6],
                        ['p1' => $pList[5], 'p2' => $pList[10], 'match_index' => 7]
                    ];
                    $initialRoundName = 'Round of 16';
                    $roundKey = 'round_of_16';
                } else {
                    for ($pi = 0; $pi < $maxParticipants / 2; $pi++) {
                        $pairings[] = [
                            'p1' => $pList[$pi],
                            'p2' => $pList[$maxParticipants - 1 - $pi],
                            'match_index' => $pi
                        ];
                    }
                    $initialRoundName = ($maxParticipants == 32) ? 'Round of 32' : 'Round of 64';
                    $roundKey = ($maxParticipants == 32) ? 'round_of_32' : 'round_of_64';
                }

                $roundMatches = [];
                $tournRule = $tournament['rule_type'] ?: 'nigeria';

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
                            0, 0.00, 'waiting', 1, ?, '5',
                            300, 300, 'rapid_5', 10, ?
                        )
                    ")->execute([
                        $roomCode,
                        $pair['p1']['user_id'],
                        $pair['p2']['user_id'],
                        $pair['p1']['username'],
                        $pair['p2']['username'],
                        $tournRule,
                        $tournRule
                    ]);

                    $roundMatches[] = [
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

                $brackets = json_decode($tournament['brackets_json'] ?? '{}', true);
                if (empty($brackets)) {
                    $brackets = [];
                }
                $brackets[$roundKey] = $roundMatches;

                $db->prepare("
                    UPDATE tournaments 
                    SET status = 'live', current_round = ?, brackets_json = ? 
                    WHERE id = ?
                ")->execute([$initialRoundName, json_encode($brackets), $tournId]);

                $db->exec("UPDATE tournament_participants SET status = 'active', current_round = '{$initialRoundName}' WHERE tournament_id = {$tournId}");
            }

            jsonResponse([
                'success' => true,
                'seed_number' => $seedNumber,
                'registered_count' => $newCount,
                'is_live' => ($newCount === $maxParticipants),
                'message' => ($newCount === $maxParticipants)
                    ? "Championship full! Bracket seeded and {$tournament['name']} is LIVE! Prepare your moves."
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
            if (empty($name)) {
                jsonResponse(['success' => false, 'message' => 'Tournament name is required.'], 400);
            }

            // Tournament type: Knockout, League, best of 5, best of 3
            $rawType = strtolower(trim($input['tournament_type'] ?? ($input['type'] ?? 'knockout')));
            $validTypes = ['knockout', 'league', 'best_of_5', 'best_of_3'];
            $tournType = in_array($rawType, $validTypes) ? $rawType : 'knockout';

            // Rule type: Nigeria, Ghana, international
            $rawRule = strtolower(trim($input['rule_type'] ?? 'nigeria'));
            $validRules = ['nigeria', 'ghana', 'international'];
            $ruleType = in_array($rawRule, $validRules) ? $rawRule : 'nigeria';

            // Player join type: Join tournament button (open), Request participation button (request), invited only (invite_only)
            $rawJoin = strtolower(trim($input['join_type'] ?? ($input['player_join_type'] ?? 'open')));
            if (strpos($rawJoin, 'request') !== false) {
                $joinType = 'request';
            } elseif (strpos($rawJoin, 'invite') !== false) {
                $joinType = 'invite_only';
            } else {
                $joinType = 'open';
            }

            // Number of players: 4, 8, 16, 32, 64
            $numPlayers = (int)($input['number_of_players'] ?? ($input['max_participants'] ?? 8));
            $validSizes = [4, 8, 16, 32, 64];
            if (!in_array($numPlayers, $validSizes)) {
                $numPlayers = 8;
            }

            // Entry coins
            $entryCoins = (int)($input['entry_coins'] ?? ($input['entry_fee_coins'] ?? 100));
            if ($entryCoins < 0) $entryCoins = 100;

            // Who is paying entry coins: player, host
            $rawPayer = strtolower(trim($input['payer_type'] ?? ($input['who_is_paying'] ?? 'player')));
            $payerType = ($rawPayer === 'host') ? 'host' : 'player';

            // Helper to parse dates in GMT/UTC (supports dd/mm/yyyy HH:MM or ISO)
            $parseGmt = function($dateStr) {
                if (empty($dateStr)) return null;
                $dateStr = trim($dateStr);
                if ($dateStr === '--:--' || $dateStr === 'dd/mm/yyyy --:--') return null;
                if (preg_match('/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/', $dateStr, $m)) {
                    $d = str_pad($m[1], 2, '0', STR_PAD_LEFT);
                    $mo = str_pad($m[2], 2, '0', STR_PAD_LEFT);
                    $y = $m[3];
                    $h = isset($m[4]) ? str_pad($m[4], 2, '0', STR_PAD_LEFT) : '00';
                    $mi = isset($m[5]) ? str_pad($m[5], 2, '0', STR_PAD_LEFT) : '00';
                    $s = isset($m[6]) ? str_pad($m[6], 2, '0', STR_PAD_LEFT) : '00';
                    return "{$y}-{$mo}-{$d} {$h}:{$mi}:{$s}";
                }
                if (preg_match('/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/', $dateStr, $m)) {
                    $s = isset($m[6]) ? $m[6] : '00';
                    return "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$s}";
                }
                $ts = strtotime($dateStr);
                return $ts ? gmdate('Y-m-d H:i:s', $ts) : null;
            };

            $startDate = $parseGmt($input['start_date'] ?? null);
            $endDate = $parseGmt($input['end_date'] ?? null);
            $joinDeadline = $parseGmt($input['join_deadline'] ?? ($input['deadline_date'] ?? null));

            // Board type: Default (or other themes)
            $boardType = trim($input['board_type'] ?? ($input['board'] ?? 'default'));

            // Game modifications: None, crown start left left, crown start middle middle, crown start left middle
            $rawMod = strtolower(trim($input['game_modification'] ?? ($input['game_modifications'] ?? 'none')));
            $validMods = ['crown_start_left_left', 'crown_start_middle_middle', 'crown_start_left_middle'];
            $gameMod = in_array($rawMod, $validMods) ? $rawMod : 'none';

            // Settings toggles
            $undoAllowed = isset($input['undo_allowed']) ? (int)(bool)$input['undo_allowed'] : 1;
            $isPrivate = isset($input['is_private']) ? (int)(bool)$input['is_private'] : 0;
            $toWin = isset($input['to_win']) ? (int)(bool)$input['to_win'] : 1;
            $disableChat = isset($input['disable_chat']) ? (int)(bool)$input['disable_chat'] : 0;
            $soundOn = isset($input['sound_on']) ? (int)(bool)$input['sound_on'] : 1;
            $isScheduled = isset($input['is_scheduled']) ? (int)(bool)$input['is_scheduled'] : 1;

            // Optional cash entry & prize pool
            $feeNaira = max(0, (float)($input['entry_fee_naira'] ?? 0));
            $prizeNaira = max(0, (float)($input['prize_pool_naira'] ?? 0));

            // Validation: Minimum 20 coins required to create a tournament
            $hostCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $creationFee = 20;
            if ($hostCoins < $creationFee) {
                jsonResponse([
                    'success' => false,
                    'message' => 'You required a minimum of 20 coins to create a tournament. (Your current balance: ' . number_format($hostCoins) . ' coins)'
                ], 400);
            }

            // Total coins needed if host is paying for all players:
            $hostSponsorshipCoins = ($payerType === 'host') ? ($entryCoins * $numPlayers) : 0;
            $totalCoinsRequired = $creationFee + $hostSponsorshipCoins;

            if ($hostCoins < $totalCoinsRequired) {
                jsonResponse([
                    'success' => false,
                    'message' => "You required a minimum of " . number_format($totalCoinsRequired) . " coins to create this tournament (20 coins creation fee + " . number_format($hostSponsorshipCoins) . " coins entry fees for {$numPlayers} players). Your balance is " . number_format($hostCoins) . " coins."
                ], 400);
            }

            // Build dynamic initial bracket structure
            $makeBrackets = function($sz) {
                $sz = (int)$sz;
                if ($sz <= 4) {
                    return [
                        'semi_finals' => [
                            ['match_id' => 1, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                            ['match_id' => 2, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                        ],
                        'finals' => [
                            'match_id' => 3, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                        ]
                    ];
                } elseif ($sz <= 8) {
                    return [
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
                    ];
                } elseif ($sz <= 16) {
                    $r16 = [];
                    for ($i = 1; $i <= 8; $i++) $r16[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $qf = [];
                    for ($i = 9; $i <= 12; $i++) $qf[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    return [
                        'round_of_16' => $r16,
                        'quarter_finals' => $qf,
                        'semi_finals' => [
                            ['match_id' => 13, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                            ['match_id' => 14, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                        ],
                        'finals' => [
                            'match_id' => 15, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                        ]
                    ];
                } elseif ($sz <= 32) {
                    $r32 = [];
                    for ($i = 1; $i <= 16; $i++) $r32[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $r16 = [];
                    for ($i = 17; $i <= 24; $i++) $r16[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $qf = [];
                    for ($i = 25; $i <= 28; $i++) $qf[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    return [
                        'round_of_32' => $r32,
                        'round_of_16' => $r16,
                        'quarter_finals' => $qf,
                        'semi_finals' => [
                            ['match_id' => 29, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                            ['match_id' => 30, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                        ],
                        'finals' => [
                            'match_id' => 31, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                        ]
                    ];
                } else {
                    $r64 = [];
                    for ($i = 1; $i <= 32; $i++) $r64[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $r32 = [];
                    for ($i = 33; $i <= 48; $i++) $r32[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $r16 = [];
                    for ($i = 49; $i <= 56; $i++) $r16[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    $qf = [];
                    for ($i = 57; $i <= 60; $i++) $qf[] = ['match_id' => $i, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'];
                    return [
                        'round_of_64' => $r64,
                        'round_of_32' => $r32,
                        'round_of_16' => $r16,
                        'quarter_finals' => $qf,
                        'semi_finals' => [
                            ['match_id' => 61, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'],
                            ['match_id' => 62, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending']
                        ],
                        'finals' => [
                            'match_id' => 63, 'p1' => null, 'p2' => null, 'winner' => null, 'room_code' => null, 'status' => 'pending'
                        ]
                    ];
                }
            };

            $initialBrackets = json_encode($makeBrackets($numPlayers));

            // Format prize pool string
            $totalPotCoins = $entryCoins * $numPlayers;
            $prizePool = !empty($input['prize_pool']) ? trim($input['prize_pool']) : ($prizeNaira > 0 ? "₦" . number_format($prizeNaira, 2) . " Cash Pot" : number_format($totalPotCoins) . " Coins Pot");

            $typeLabel = ucfirst($tournType);
            if ($tournType === 'best_of_5') $typeLabel = 'Best of 5';
            if ($tournType === 'best_of_3') $typeLabel = 'Best of 3';
            $format = "{$numPlayers}-Player {$typeLabel}";

            $tagline = trim($input['tagline'] ?? ("Official " . ucfirst($ruleType) . " Draughts Championship"));
            $location = trim($input['location'] ?? 'Nigeria (Online)');

            $db->beginTransaction();

            // Deduct coins from host (creation fee + sponsorship if applicable)
            $db->prepare("UPDATE users SET coins = coins - ? WHERE id = ?")->execute([$totalCoinsRequired, $currentUser['id']]);
            $freshCoins = (int)$db->query("SELECT coins FROM users WHERE id = {$currentUser['id']}")->fetchColumn();
            $curBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$currentUser['id']}")->fetchColumn();

            $desc = "Tournament Creation Fee ({$creationFee} Coins)";
            if ($hostSponsorshipCoins > 0) {
                $desc .= " + Host Sponsorship for {$numPlayers} Players (" . number_format($hostSponsorshipCoins) . " Coins)";
            }
            $desc .= ": {$name}";

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'tournament_entry', 0, ?, ?, 'completed', ?, ?)
            ")->execute([$currentUser['id'], -$totalCoinsRequired, $curBal, "TOURN-HOST-{$currentUser['id']}-" . time(), $desc]);

            if (isset($_SESSION['user']['coins'])) {
                $_SESSION['user']['coins'] = $freshCoins;
            }

            $stmt = $db->prepare("
                INSERT INTO tournaments (
                    host_id, host_name, name, tagline, location, prize_pool, prize_pool_naira,
                    entry_fee_coins, entry_fee_naira, format, tournament_type, rule_type,
                    join_type, payer_type, start_date, end_date, join_deadline, board_type,
                    game_modification, undo_allowed, is_private, to_win, disable_chat, sound_on,
                    is_scheduled, bracket_size, max_participants, status, current_round, brackets_json
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, 'upcoming', 'Registration Open', ?
                )
            ");
            $stmt->execute([
                $currentUser['id'], $currentUser['username'], $name, $tagline, $location, $prizePool, $prizeNaira,
                $entryCoins, $feeNaira, $format, $tournType, $ruleType,
                $joinType, $payerType, $startDate, $endDate, $joinDeadline, $boardType,
                $gameMod, $undoAllowed, $isPrivate, $toWin, $disableChat, $soundOn,
                $isScheduled, (string)$numPlayers, $numPlayers, $initialBrackets
            ]);
            $newId = (int)$db->lastInsertId();

            $db->exec("UPDATE users SET tournaments_hosted = tournaments_hosted + 1 WHERE id = " . (int)$currentUser['id']);

            $db->commit();

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
