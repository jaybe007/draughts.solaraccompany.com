<?php
/**
 * Online Multiplayer Game Rooms API Endpoint
 * Handles room creation, matchmaking via room codes (e.g. ND-7K4M),
 * synchronous dual clock tracking, move synchronization, and game results.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';
require_once __DIR__ . '/../config/tournament_helper.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

$currentUser = getCurrentUser();

function getInitialSeconds($preset) {
    switch ($preset) {
        case 'blitz_3': return 180;
        case 'classical_10': return 600;
        case 'rapid_5':
        default: return 300;
    }
}

try {
    $db = getDB();

    switch ($action) {

        // ================= LIST GAMES (GAME CENTER LOBBY) ================= //
        case 'list_games':
            $filter = $_GET['filter'] ?? ($input['filter'] ?? 'all_games');
            $sql = "SELECT id, room_code, host_id, guest_id, host_name, guest_name, game_type, wager_coins, time_control, board_size, status, current_turn, winner_name, result, win_reason, created_at FROM game_rooms ";
            
            switch ($filter) {
                case 'awaiting_opponent':
                    $sql .= "WHERE status = 'waiting' AND is_private = 0 ORDER BY created_at DESC LIMIT 30";
                    break;
                case 'live_games':
                    $sql .= "WHERE status = 'active' ORDER BY updated_at DESC LIMIT 30";
                    break;
                case 'p2p_games':
                    $sql .= "WHERE game_type = 'p2p' ORDER BY created_at DESC LIMIT 30";
                    break;
                case 'tournament_games':
                    $sql .= "WHERE game_type = 'tournament' ORDER BY created_at DESC LIMIT 30";
                    break;
                case 'completed_games':
                    $sql .= "WHERE status = 'finished' ORDER BY updated_at DESC LIMIT 30";
                    break;
                case 'daily_player_games':
                    $sql .= "WHERE game_type = 'daily_challenge' ORDER BY created_at DESC LIMIT 30";
                    break;
                default:
                    $sql .= "WHERE status IN ('waiting', 'active', 'finished') ORDER BY created_at DESC LIMIT 30";
                    break;
            }
            $games = $db->query($sql)->fetchAll();
            jsonResponse(['success' => true, 'filter' => $filter, 'games' => $games, 'count' => count($games)]);
            break;

        // ================= RANDOM OPPONENT AUTO MATCHMAKING ================= //
        case 'random_match':
            $playerName = trim($input['player_name'] ?? '');
            if (empty($playerName)) {
                $playerName = $currentUser ? $currentUser['username'] : 'Champion Challenger';
            }
            $timeControl = $input['time_control'] ?? 'rapid_5';
            $initSec = getInitialSeconds($timeControl);
            $guestId = $currentUser ? (int)$currentUser['id'] : null;

            // Check if there is an open room waiting
            $findWaiting = $db->prepare("
                SELECT * FROM game_rooms 
                WHERE status = 'waiting' AND is_private = 0 AND (host_id IS NULL OR host_id != ?)
                ORDER BY created_at ASC LIMIT 1
            ");
            $findWaiting->execute([$guestId ?: 0]);
            $waitingRoom = $findWaiting->fetch();

            if ($waitingRoom) {
                $db->prepare("
                    UPDATE game_rooms SET
                        guest_id = ?,
                        guest_name = ?,
                        status = 'active',
                        last_move_time = ?,
                        updated_at = NOW()
                    WHERE id = ?
                ")->execute([$guestId, $playerName, time(), $waitingRoom['id']]);

                jsonResponse([
                    'success' => true,
                    'matched' => true,
                    'room_code' => $waitingRoom['room_code'],
                    'player_role' => 'p2',
                    'message' => "Opponent found! Match starting in room {$waitingRoom['room_code']}."
                ]);
            } else {
                $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
                $roomCode = 'ND-' . substr(str_shuffle($chars), 0, 4);
                $db->prepare("
                    INSERT INTO game_rooms (
                        room_code, host_id, host_name, time_control, board_size, rule_mode,
                        game_type, is_private, status, current_turn, p1_time_left, p2_time_left
                    ) VALUES (
                        ?, ?, ?, ?, 10, 'nigerian',
                        'random', 0, 'waiting', 1, ?, ?
                    )
                ")->execute([$roomCode, $guestId, $playerName, $timeControl, $initSec, $initSec]);

                jsonResponse([
                    'success' => true,
                    'matched' => false,
                    'room_code' => $roomCode,
                    'player_role' => 'p1',
                    'message' => "Room {$roomCode} created! Waiting for random opponent to match."
                ]);
            }
            break;

        // ================= CREATE ROOM ================= //
        case 'create_room':
            $timeControl = $input['time_control'] ?? 'rapid_5';
            $boardSize   = (int)($input['board_size'] ?? 10);
            $ruleMode    = $input['rule_mode'] ?? ($input['rule_type'] ?? 'nigerian');
            $ruleType    = $input['rule_type'] ?? 'nigeria';
            $gameType    = $input['game_type'] ?? 'p2p';
            $playerTime  = (string)($input['player_time'] ?? '5');
            $timeIncrement = (int)($input['time_increment'] ?? 0);
            $p1Short     = max(0, min(5, (int)($input['p1_short'] ?? 0)));
            $modifications = $input['modifications'] ?? 'none';
            $boardType   = $input['board_type'] ?? 'default';
            $wagerCoins  = max(0, (int)($input['wager_coins'] ?? 0));
            $wagerNaira  = max(0, (float)($input['wager_naira'] ?? 0));
            $isPrivate   = !empty($input['is_private']) ? 1 : 0;
            $settings    = $input['settings'] ?? [];
            $settingsJson = is_string($settings) ? $settings : json_encode($settings);

            $hostName = trim($input['player_name'] ?? '');
            if (empty($hostName)) {
                $hostName = $currentUser ? $currentUser['username'] : 'Host Champion';
            }

            $hostId = $currentUser ? (int)$currentUser['id'] : null;
            $autoConvertedMsg = '';

            // Coin verification & auto-conversion if coin wagered
            if ($wagerCoins > 0) {
                if (!$hostId) {
                    jsonResponse(['success' => false, 'message' => 'Please sign in to create a coin wager match.'], 401);
                }
                $coinCheck = ensureCoinsAvailable($db, $hostId, $wagerCoins, "Match Staking (Room Creation)");
                if (!$coinCheck['success']) {
                    jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                }
                if (!empty($coinCheck['converted'])) {
                    $autoConvertedMsg = " (Auto-converted ₦" . number_format($coinCheck['converted_amount'], 2) . " for {$coinCheck['converted_coins']} Coins)";
                }
            }

            // Real-Money Naira verification if cash wagered
            if ($wagerNaira > 0) {
                $userBal = $currentUser ? (float)$currentUser['wallet_balance'] : 0.0;
                if (!$currentUser || $userBal < $wagerNaira) {
                    jsonResponse([
                        'success' => false,
                        'message' => "Insufficient wallet balance! You need ₦" . number_format($wagerNaira, 2) . " to create this cash stake match. (Available: ₦" . number_format($userBal, 2) . ")"
                    ], 400);
                }
            }

            // Generate unique 6-character room code (e.g. ND-8F4K)
            $chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
            $maxAttempts = 10;
            $roomCode = '';

            for ($i = 0; $i < $maxAttempts; $i++) {
                $randomCode = 'ND-' . substr(str_shuffle($chars), 0, 4);
                $check = $db->prepare("SELECT id FROM game_rooms WHERE room_code = ? AND status IN ('waiting', 'active')");
                $check->execute([$randomCode]);
                if (!$check->fetch()) {
                    $roomCode = $randomCode;
                    break;
                }
            }

            if (empty($roomCode)) {
                $roomCode = 'ND-' . rand(1000, 9999);
            }

            // Calculate initial clocks based on player_time
            $p1Time = 300;
            $p2Time = 300;
            if ($playerTime === 'none') {
                $p1Time = 0;
                $p2Time = 0;
            } elseif (is_numeric($playerTime) && (int)$playerTime > 0) {
                $p1Time = (int)$playerTime * 60;
                $p2Time = (int)$playerTime * 60;
            } else {
                $p1Time = getInitialSeconds($timeControl);
                $p2Time = $p1Time;
            }

            // Apply modifications clock increments
            if ($modifications === 'inc_1s') $timeIncrement = max($timeIncrement, 1);
            elseif ($modifications === 'inc_3s') $timeIncrement = max($timeIncrement, 3);
            elseif ($modifications === 'inc_5s') $timeIncrement = max($timeIncrement, 5);

            // Apply modifications time advantage
            if ($modifications === 'adv_1m') $p1Time += 60;
            elseif ($modifications === 'adv_3m') $p1Time += 180;
            elseif ($modifications === 'adv_5m') $p1Time += 300;
            elseif ($modifications === 'adv_7m') $p1Time += 420;

            $hostId = $currentUser ? (int)$currentUser['id'] : null;

            // Deduct escrow coins from host if coin wagered
            if ($wagerCoins > 0 && $hostId) {
                $db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$wagerCoins, $hostId]);
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_escrow', 0, ?, ?)
                ")->execute([$hostId, -$wagerCoins, "Escrow: Coin Match Wager for Room {$roomCode}"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = max(0, (int)$_SESSION['user']['coins'] - $wagerCoins);
                }
            }

            // Deduct escrow Naira from host if cash wagered
            if ($wagerNaira > 0 && $hostId) {
                $db->prepare("UPDATE users SET wallet_balance = GREATEST(0, wallet_balance - ?) WHERE id = ?")->execute([$wagerNaira, $hostId]);
                $freshBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$hostId}")->fetchColumn();
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                    VALUES (?, 'wager_lock', ?, 0, ?, 'completed', ?)
                ")->execute([$hostId, -$wagerNaira, $freshBal, "Escrow: Cash Match Wager for Room {$roomCode}"]);
                if (isset($_SESSION['user']['wallet_balance'])) {
                    $_SESSION['user']['wallet_balance'] = $freshBal;
                }
            }

            $stmt = $db->prepare("
                INSERT INTO game_rooms (
                    room_code, host_id, host_name, game_type, rule_type, player_time,
                    time_increment, p1_short, modifications, board_type, settings_json,
                    wager_coins, wager_naira, is_private, time_control, board_size, rule_mode,
                    status, current_turn, p1_time_left, p2_time_left, last_move_time,
                    board_state_json, move_history_json
                ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?,
                    'waiting', 1, ?, ?, NULL,
                    NULL, '[]'
                )
            ");
            $stmt->execute([
                $roomCode, $hostId, $hostName, $gameType, $ruleType, $playerTime,
                $timeIncrement, $p1Short, $modifications, $boardType, $settingsJson,
                $wagerCoins, $wagerNaira, $isPrivate, $timeControl, $boardSize, $ruleMode,
                $p1Time, $p2Time
            ]);
            $roomId = (int)$db->lastInsertId();

            jsonResponse([
                'success' => true,
                'room_id' => $roomId,
                'room_code' => $roomCode,
                'player_role' => 'p1',
                'host_name' => $hostName,
                'game_type' => $gameType,
                'rule_type' => $ruleType,
                'player_time' => $playerTime,
                'time_increment' => $timeIncrement,
                'p1_short' => $p1Short,
                'modifications' => $modifications,
                'board_type' => $boardType,
                'wager_coins' => $wagerCoins,
                'settings' => is_array($settings) ? $settings : json_decode($settingsJson, true),
                'p1_time' => $p1Time,
                'p2_time' => $p2Time,
                'time_control' => $timeControl,
                'board_size' => $boardSize,
                'rule_mode' => $ruleMode,
                'message' => "Room created! Share code {$roomCode} with your opponent." . $autoConvertedMsg
            ]);
            break;

        // ================= JOIN ROOM ================= //
        case 'join_room':
            $roomCode = strtoupper(trim($input['room_code'] ?? ''));
            $guestName = trim($input['player_name'] ?? '');
            if (empty($guestName)) {
                $guestName = $currentUser ? $currentUser['username'] : 'Guest Challenger';
            }

            if (empty($roomCode)) {
                jsonResponse(['success' => false, 'message' => 'Please provide a valid room code.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch();

            if (!$room) {
                jsonResponse(['success' => false, 'message' => "Room code '{$roomCode}' not found. Check code and try again."], 404);
            }

            // Check if player is already host reconnecting
            $guestId = $currentUser ? (int)$currentUser['id'] : null;
            if ($room['host_id'] && $guestId && (int)$room['host_id'] === $guestId) {
                jsonResponse([
                    'success' => true,
                    'room_code' => $roomCode,
                    'player_role' => 'p1',
                    'room' => $room,
                    'message' => 'Reconnected as Host (Player 1).'
                ]);
            }

            // Check if player is guest reconnecting
            if ($room['guest_id'] && $guestId && (int)$room['guest_id'] === $guestId) {
                if ($room['status'] === 'waiting') {
                    $db->prepare("UPDATE game_rooms SET status = 'active', last_move_time = ?, updated_at = NOW() WHERE id = ?")->execute([time(), $room['id']]);
                    $room['status'] = 'active';
                }
                jsonResponse([
                    'success' => true,
                    'room_code' => $roomCode,
                    'player_role' => 'p2',
                    'room' => $room,
                    'message' => 'Connected as Guest (Player 2).'
                ]);
            }
            if (!$guestId && !empty($room['guest_name']) && $room['guest_name'] === $guestName && $room['status'] === 'active') {
                jsonResponse([
                    'success' => true,
                    'room_code' => $roomCode,
                    'player_role' => 'p2',
                    'room' => $room,
                    'message' => 'Reconnected as Guest (Player 2).'
                ]);
            }

            if ($room['status'] === 'finished' || $room['status'] === 'abandoned') {
                jsonResponse(['success' => false, 'message' => 'This match has already concluded.'], 400);
            }

            if ($room['status'] === 'active' && !empty($room['guest_name']) && $room['guest_name'] !== $guestName) {
                jsonResponse(['success' => false, 'message' => 'Room is already full with 2 players.'], 409);
            }

            // Validate and deduct wager coins from joining guest (with auto-conversion if needed)
            $roomWager = (int)($room['wager_coins'] ?? 0);
            if ($roomWager > 0) {
                if (!$guestId) {
                    jsonResponse(['success' => false, 'message' => 'Please sign in to join a coin wager match.'], 401);
                }
                $coinCheck = ensureCoinsAvailable($db, $guestId, $roomWager, "Match Staking (Room {$roomCode})");
                if (!$coinCheck['success']) {
                    jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                }
                $db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$roomWager, $guestId]);
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_escrow', 0, ?, ?)
                ")->execute([$guestId, -$roomWager, "Escrow: Match Wager for Room {$roomCode}"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = max(0, (int)$_SESSION['user']['coins'] - $roomWager);
                }
            }

            // Validate and deduct cash Naira wager from joining guest
            $roomWagerNaira = (float)($room['wager_naira'] ?? 0);
            if ($roomWagerNaira > 0) {
                $availNaira = $currentUser ? (float)$currentUser['wallet_balance'] : 0.0;
                if (!$currentUser || $availNaira < $roomWagerNaira) {
                    jsonResponse([
                        'success' => false,
                        'message' => "Insufficient wallet balance! This match requires a ₦" . number_format($roomWagerNaira, 2) . " cash stake. (Available: ₦" . number_format($availNaira, 2) . ")"
                    ], 400);
                }
                if ($guestId) {
                    $db->prepare("UPDATE users SET wallet_balance = GREATEST(0, wallet_balance - ?) WHERE id = ?")->execute([$roomWagerNaira, $guestId]);
                    $freshGuestBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$guestId}")->fetchColumn();
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                        VALUES (?, 'wager_lock', ?, 0, ?, 'completed', ?)
                    ")->execute([$guestId, -$roomWagerNaira, $freshGuestBal, "Escrow: Match Cash Stake for Room {$roomCode}"]);
                    if (isset($_SESSION['user']['wallet_balance'])) {
                        $_SESSION['user']['wallet_balance'] = $freshGuestBal;
                    }
                }
            }

            // Join as Guest (Player 2) and activate game
            $updateStmt = $db->prepare("
                UPDATE game_rooms SET
                    guest_id = ?,
                    guest_name = ?,
                    status = 'active',
                    last_move_time = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");
            $updateStmt->execute([$guestId, $guestName, time(), $room['id']]);

            // Re-fetch room
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch();

            jsonResponse([
                'success' => true,
                'room_code' => $roomCode,
                'player_role' => 'p2',
                'room' => $room,
                'message' => "Joined room {$roomCode}! Game is starting."
            ]);
            break;

        // ================= GET ROOM STATE (POLLING) ================= //
        case 'get_state':
            $roomCode = strtoupper(trim($_GET['room_code'] ?? ($input['room_code'] ?? '')));
            if (empty($roomCode)) {
                jsonResponse(['success' => false, 'message' => 'Room code required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch();

            if (!$room) {
                jsonResponse(['success' => false, 'message' => 'Room not found.'], 404);
            }

            // If match is active, compute real-time clock deduction (unless untimed)
            if ($room['status'] === 'active' && $room['last_move_time'] && (int)$room['p1_time_left'] > 0 && (int)$room['p2_time_left'] > 0 && ($room['player_time'] ?? '') !== 'none') {
                $elapsed = time() - (int)$room['last_move_time'];
                if ($elapsed > 0) {
                    $turn = (int)$room['current_turn'];
                    if ($turn === 1) {
                        $p1NewTime = max(0, (int)$room['p1_time_left'] - $elapsed);
                        $room['p1_time_left'] = $p1NewTime;
                        if ($p1NewTime <= 0) {
                            // P1 timed out!
                            $room['status'] = 'finished';
                            $room['winner_id'] = $room['guest_id'];
                            $room['winner_name'] = $room['guest_name'];
                            $room['result'] = 'p2_won';
                            $room['win_reason'] = ($room['host_name'] ?: 'Player 1') . ' ran out of time!';
                            
                            $db->prepare("
                                UPDATE game_rooms SET
                                    p1_time_left = 0,
                                    status = 'finished',
                                    winner_id = ?,
                                    winner_name = ?,
                                    result = 'p2_won',
                                    win_reason = ?
                                WHERE id = ?
                            ")->execute([$room['guest_id'], $room['guest_name'], $room['win_reason'], $room['id']]);

                            checkAndAdvanceTournamentMatch($db, $room['room_code'], (int)$room['guest_id']);

                            // Award wager pot and update Elo on timeout
                            $wager = (int)($room['wager_coins'] ?? 0);
                            if ($wager > 0 && $room['guest_id']) {
                                $pot = $wager * 2;
                                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$pot, (int)$room['guest_id']]);
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                    VALUES (?, 'wager_win', 0, ?, ?)
                                ")->execute([(int)$room['guest_id'], $pot, "Pot Won by Timeout: Match Room {$room['room_code']}"]);
                            }
                            if ($room['host_id'] && $room['guest_id']) {
                                $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['guest_id']);
                                $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['host_id']);
                            }
                        }
                    } else {
                        $p2NewTime = max(0, (int)$room['p2_time_left'] - $elapsed);
                        $room['p2_time_left'] = $p2NewTime;
                        if ($p2NewTime <= 0) {
                            // P2 timed out!
                            $room['status'] = 'finished';
                            $room['winner_id'] = $room['host_id'];
                            $room['winner_name'] = $room['host_name'];
                            $room['result'] = 'p1_won';
                            $room['win_reason'] = ($room['guest_name'] ?: 'Player 2') . ' ran out of time!';

                            $db->prepare("
                                UPDATE game_rooms SET
                                    p2_time_left = 0,
                                    status = 'finished',
                                    winner_id = ?,
                                    winner_name = ?,
                                    result = 'p1_won',
                                    win_reason = ?
                                WHERE id = ?
                            ")->execute([$room['host_id'], $room['host_name'], $room['win_reason'], $room['id']]);

                            checkAndAdvanceTournamentMatch($db, $room['room_code'], (int)$room['host_id']);

                            // Award wager pot and update Elo on timeout
                            $wager = (int)($room['wager_coins'] ?? 0);
                            if ($wager > 0 && $room['host_id']) {
                                $pot = $wager * 2;
                                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$pot, (int)$room['host_id']]);
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                    VALUES (?, 'wager_win', 0, ?, ?)
                                ")->execute([(int)$room['host_id'], $pot, "Pot Won by Timeout: Match Room {$room['room_code']}"]);
                            }
                            if ($room['host_id'] && $room['guest_id']) {
                                $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['host_id']);
                                $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['guest_id']);
                            }
                        }
                    }
                }
            }

            jsonResponse(['success' => true, 'room' => $room]);
            break;

        // ================= MAKE MOVE ================= //
        case 'make_move':
            $roomCode       = strtoupper(trim($input['room_code'] ?? ''));
            $playerRole     = trim($input['player_role'] ?? ''); // 'p1' or 'p2'
            $boardStateJson = $input['board_state_json'] ?? null;
            $moveHistoryJson = $input['move_history_json'] ?? null;
            $isGameOver     = !empty($input['is_game_over']);
            $winnerRole     = $input['winner_role'] ?? null; // 'p1', 'p2', 'draw'
            $winReason      = $input['win_reason'] ?? '';

            if (empty($roomCode)) {
                jsonResponse(['success' => false, 'message' => 'Room code required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch();

            if (!$room || $room['status'] !== 'active') {
                jsonResponse(['success' => false, 'message' => 'Cannot make move: game is not active.'], 400);
            }

            // Verify turn
            $expectedRole = ((int)$room['current_turn'] === 1) ? 'p1' : 'p2';
            if ($playerRole !== $expectedRole) {
                jsonResponse(['success' => false, 'message' => "Not your turn! Current turn is {$expectedRole}."], 403);
            }

            // Deduct elapsed time (unless untimed)
            $elapsed = 0;
            if ($room['last_move_time'] && (int)$room['p1_time_left'] > 0 && (int)$room['p2_time_left'] > 0) {
                $elapsed = max(0, time() - (int)$room['last_move_time']);
            }
            $p1Time = (int)$room['p1_time_left'];
            $p2Time = (int)$room['p2_time_left'];
            if ($p1Time > 0 && $p2Time > 0) {
                if ($playerRole === 'p1') {
                    $p1Time = max(0, $p1Time - $elapsed);
                } else {
                    $p2Time = max(0, $p2Time - $elapsed);
                }

                // Apply Fischer increment if configured and turn ended
                $turnEnded = !isset($input['turn_ended']) || !empty($input['turn_ended']);
                $increment = (int)($room['time_increment'] ?? 0);
                if ($increment > 0 && !$isGameOver && $turnEnded) {
                    if ($playerRole === 'p1') {
                        $p1Time += $increment;
                    } else {
                        $p2Time += $increment;
                    }
                }
            } else {
                $turnEnded = !isset($input['turn_ended']) || !empty($input['turn_ended']);
            }

            // Switch turn only if turn ended
            $nextTurn = $turnEnded ? (($playerRole === 'p1') ? 2 : 1) : (($playerRole === 'p1') ? 1 : 2);
            $status = $isGameOver ? 'finished' : 'active';
            $result = 'in_progress';
            $winnerId = null;
            $winnerName = null;

            if ($isGameOver) {
                // Check Draw Odds modification: 2nd player find draw
                if ($winnerRole === 'draw' && ($room['modifications'] ?? '') === 'draw_odds_p2') {
                    $winnerRole = 'p2';
                    $winReason = 'Player 2 awarded victory by Draw Odds rule';
                }
                if ($winnerRole === 'p1') {
                    $result = 'p1_won';
                    $winnerId = $room['host_id'];
                    $winnerName = $room['host_name'];
                } elseif ($winnerRole === 'p2') {
                    $result = 'p2_won';
                    $winnerId = $room['guest_id'];
                    $winnerName = $room['guest_name'];
                } else {
                    $result = 'draw';
                }

                // If host or guest are registered users, record in matches table and update stats
                try {
                    $moves = json_decode($moveHistoryJson, true) ?: [];
                    $movesCount = count($moves);
                    $recordStmt = $db->prepare("
                        INSERT INTO matches (
                            player1_id, player2_id, player1_name, player2_name,
                            game_mode, ai_difficulty, board_size, rule_mode, time_control,
                            winner_id, winner_name, result, win_reason,
                            moves_count, board_state_json, move_history_json
                        ) VALUES (
                            ?, ?, ?, ?,
                            'pvp', 'human', ?, ?, ?,
                            ?, ?, ?, ?,
                            ?, ?, ?
                        )
                    ");
                    $recordStmt->execute([
                        $room['host_id'], $room['guest_id'], $room['host_name'], $room['guest_name'],
                        $room['board_size'], $room['rule_mode'], $room['time_control'],
                        $winnerId, $winnerName, $result, $winReason,
                        $movesCount, $boardStateJson, $moveHistoryJson
                    ]);

                    // Adjust Elo if both are registered
                    if ($room['host_id'] && $room['guest_id']) {
                        if ($result === 'p1_won') {
                            $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['host_id']);
                            $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['guest_id']);
                        } elseif ($result === 'p2_won') {
                            $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['guest_id']);
                            $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['host_id']);
                        } else {
                            $db->exec("UPDATE users SET draws = draws + 1 WHERE id IN (" . (int)$room['host_id'] . "," . (int)$room['guest_id'] . ")");
                        }
                    }

                    // 1. Cash Naira Wager Payout with Platform House Rake
                    $wagerNaira = (float)($room['wager_naira'] ?? 0);
                    if ($wagerNaira > 0) {
                        $pot = $wagerNaira * 2.0;

                        if ($winnerId && ($result === 'p1_won' || $result === 'p2_won')) {
                            // Check if winner is VIP Oba Champion for 50% rake discount
                            $winnerUser = $db->query("SELECT package, wallet_balance FROM users WHERE id = {$winnerId}")->fetch();
                            $isVipOba = ($winnerUser['package'] ?? '') === 'vip_oba';

                            $payout = calculateMatchPayout($pot, $isVipOba);
                            $rake = $payout['rake_amount'];
                            $winnerNet = $payout['winner_payout'];

                            // Record rake on room
                            $db->prepare("UPDATE game_rooms SET rake_amount = ? WHERE id = ?")->execute([$rake, $room['id']]);

                            // Credit winner
                            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$winnerNet, $winnerId]);
                            $newWinnerBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$winnerId}")->fetchColumn();

                            $db->prepare("
                                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                                VALUES (?, 'wager_win', ?, 0, ?, 'completed', ?)
                            ")->execute([
                                $winnerId,
                                $winnerNet,
                                $newWinnerBal,
                                "Cash Wager Won: Room {$roomCode} (₦" . number_format($winnerNet, 2) . " after ₦" . number_format($rake, 2) . " house rake)"
                            ]);

                            // Record platform house rake entry
                            $db->prepare("
                                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                                VALUES (?, 'wager_rake', ?, 0, ?, 'completed', ?)
                            ")->execute([
                                $winnerId,
                                $rake,
                                $newWinnerBal,
                                "Platform House Rake ({$payout['rake_percent']}%): Match Room {$roomCode}"
                            ]);

                        } elseif ($result === 'draw') {
                            // Draw: 100% refund of escrowed stakes with zero fee
                            if ($room['host_id']) {
                                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$wagerNaira, (int)$room['host_id']]);
                                $hBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = " . (int)$room['host_id'])->fetchColumn();
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                                    VALUES (?, 'wager_refund', ?, 0, ?, 'completed', ?)
                                ")->execute([(int)$room['host_id'], $wagerNaira, $hBal, "Draw Refund: Cash Stake Room {$roomCode}"]);
                            }
                            if ($room['guest_id']) {
                                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$wagerNaira, (int)$room['guest_id']]);
                                $gBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = " . (int)$room['guest_id'])->fetchColumn();
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, description)
                                    VALUES (?, 'wager_refund', ?, 0, ?, 'completed', ?)
                                ")->execute([(int)$room['guest_id'], $wagerNaira, $gBal, "Draw Refund: Cash Stake Room {$roomCode}"]);
                            }
                        }
                    }

                    // 2. Wager Coins Payout (Staking in Coins with 0% Commission / Platform Rake)
                    $wager = (int)($room['wager_coins'] ?? 0);
                    if ($wager > 0) {
                        $pot = $wager * 2;
                        if ($winnerId && ($result === 'p1_won' || $result === 'p2_won')) {
                            $rates = getCoinRates($db);
                            $commPercent = (float)($rates['match_commission_percent'] ?? 0.0);
                            $rakeCoins = $commPercent > 0 ? (int)round($pot * ($commPercent / 100.0)) : 0;
                            $winnerCoins = $pot - $rakeCoins;

                            $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$winnerCoins, $winnerId]);
                            $desc = $rakeCoins > 0 
                                ? "Coins Pot Won: Room {$roomCode} (+{$winnerCoins} Coins after {$rakeCoins} platform fee)"
                                : "Coins Pot Won: Room {$roomCode} (+{$winnerCoins} Coins, 0% Commission!)";

                            $db->prepare("
                                INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                VALUES (?, 'wager_win', 0, ?, ?)
                            ")->execute([$winnerId, $winnerCoins, $desc]);

                            if ($rakeCoins > 0) {
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                    VALUES (?, 'wager_rake', 0, ?, ?)
                                ")->execute([$winnerId, -$rakeCoins, "Platform Match Fee ({$commPercent}%): Room {$roomCode}"]);
                            }

                        } elseif ($result === 'draw') {
                            // Refund both players
                            if ($room['host_id']) {
                                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$wager, (int)$room['host_id']]);
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                    VALUES (?, 'wager_refund', 0, ?, ?)
                                ")->execute([(int)$room['host_id'], $wager, "Draw Refund: Match Room {$roomCode}"]);
                            }
                            if ($room['guest_id']) {
                                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$wager, (int)$room['guest_id']]);
                                $db->prepare("
                                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                                    VALUES (?, 'wager_refund', 0, ?, ?)
                                ")->execute([(int)$room['guest_id'], $wager, "Draw Refund: Match Room {$roomCode}"]);
                            }
                        }
                    }
                } catch (Exception $e) {}
            }

            $updateStmt = $db->prepare("
                UPDATE game_rooms SET
                    current_turn = ?,
                    p1_time_left = ?,
                    p2_time_left = ?,
                    last_move_time = ?,
                    status = ?,
                    result = ?,
                    winner_id = ?,
                    winner_name = ?,
                    win_reason = ?,
                    board_state_json = ?,
                    move_history_json = ?,
                    updated_at = NOW()
                WHERE id = ?
            ");
            $updateStmt->execute([
                $nextTurn,
                $p1Time,
                $p2Time,
                time(),
                $status,
                $result,
                $winnerId,
                $winnerName,
                $winReason,
                $boardStateJson,
                $moveHistoryJson,
                $room['id']
            ]);

            if ($isGameOver && $winnerId) {
                checkAndAdvanceTournamentMatch($db, $roomCode, (int)$winnerId);
            }

            // Return updated room
            $stmt->execute([$roomCode]);
            $updatedRoom = $stmt->fetch();

            jsonResponse([
                'success' => true,
                'room' => $updatedRoom,
                'message' => $isGameOver ? "Game over: {$winReason}" : 'Move recorded.'
            ]);
            break;

        // ================= RESIGN / LEAVE ROOM ================= //
        case 'resign':
            $roomCode   = strtoupper(trim($input['room_code'] ?? ''));
            $playerRole = trim($input['player_role'] ?? '');

            if (empty($roomCode)) {
                jsonResponse(['success' => false, 'message' => 'Room code required.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch();

            if (!$room) {
                jsonResponse(['success' => false, 'message' => 'Room not found.'], 404);
            }

            if ($room['status'] === 'waiting') {
                $db->prepare("UPDATE game_rooms SET status = 'abandoned' WHERE id = ?")->execute([$room['id']]);
                // Refund host if wager coins were deposited
                if ($room['host_id'] && (int)($room['wager_coins'] ?? 0) > 0) {
                    $wager = (int)$room['wager_coins'];
                    $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$wager, (int)$room['host_id']]);
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                        VALUES (?, 'wager_refund', 0, ?, ?)
                    ")->execute([(int)$room['host_id'], $wager, "Room Cancelled Refund: {$roomCode}"]);
                    if (isset($_SESSION['user']['coins']) && (int)$currentUser['id'] === (int)$room['host_id']) {
                        $_SESSION['user']['coins'] += $wager;
                    }
                }
                // Refund host if cash wager was deposited
                if ($room['host_id'] && (float)($room['wager_naira'] ?? 0) > 0) {
                    $wNaira = (float)$room['wager_naira'];
                    $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$wNaira, (int)$room['host_id']]);
                    $freshHostBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = " . (int)$room['host_id'])->fetchColumn();
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                        VALUES (?, 'wager_refund', ?, 0, ?, 'completed', ?, ?)
                    ")->execute([(int)$room['host_id'], $wNaira, $freshHostBal, "REFUND-{$roomCode}", "Cancelled Room Refund: Match Room {$roomCode}"]);
                }
                jsonResponse(['success' => true, 'message' => 'Room closed.']);
            }

            // If active match, set other player as winner
            $winnerRole = ($playerRole === 'p1') ? 'p2' : 'p1';
            $winnerId   = ($playerRole === 'p1') ? $room['guest_id'] : $room['host_id'];
            $winnerName = ($playerRole === 'p1') ? $room['guest_name'] : $room['host_name'];
            $resignedName = ($playerRole === 'p1') ? $room['host_name'] : $room['guest_name'];
            $winReason = "{$resignedName} surrendered! {$winnerName} wins!";

            $db->prepare("
                UPDATE game_rooms SET
                    status = 'finished',
                    result = ?,
                    winner_id = ?,
                    winner_name = ?,
                    win_reason = ?
                WHERE id = ?
            ")->execute([
                ($winnerRole === 'p1' ? 'p1_won' : 'p2_won'),
                $winnerId,
                $winnerName,
                $winReason,
                $room['id']
            ]);

            // Award cash Naira wager pot with platform house rake upon resignation
            $wagerNaira = (float)($room['wager_naira'] ?? 0);
            if ($wagerNaira > 0 && $winnerId) {
                $pot = $wagerNaira * 2.0;
                $winnerUser = $db->query("SELECT package, wallet_balance FROM users WHERE id = {$winnerId}")->fetch();
                $isVipOba = ($winnerUser['package'] ?? '') === 'vip_oba';
                $payout = calculateMatchPayout($pot, $isVipOba);
                $rake = $payout['rake_amount'];
                $winnerNet = $payout['winner_payout'];

                $db->prepare("UPDATE game_rooms SET rake_amount = ? WHERE id = ?")->execute([$rake, $room['id']]);
                $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")->execute([$winnerNet, $winnerId]);
                $freshWinnerBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$winnerId}")->fetchColumn();

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'wager_win', ?, 0, ?, 'completed', ?, ?)
                ")->execute([
                    $winnerId,
                    $winnerNet,
                    $freshWinnerBal,
                    "WIN-{$roomCode}",
                    "Cash Pot Won by Surrender: Room {$roomCode} (₦" . number_format($winnerNet, 2) . " after ₦" . number_format($rake, 2) . " rake)"
                ]);

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                    VALUES (?, 'wager_rake', ?, 0, ?, 'completed', ?, ?)
                ")->execute([
                    $winnerId,
                    -$rake,
                    $freshWinnerBal,
                    "RAKE-{$roomCode}",
                    "Platform commission (" . ($isVipOba ? '4% VIP Oba' : '8%') . " rake) for Room {$roomCode}"
                ]);
            }

            // Award wager coins pot to winner upon resignation (Staking in Coins with 0% Commission / Platform Rake)
            $wager = (int)($room['wager_coins'] ?? 0);
            if ($wager > 0 && $winnerId) {
                $pot = $wager * 2;
                $rates = getCoinRates($db);
                $commPercent = (float)($rates['match_commission_percent'] ?? 0.0);
                $rakeCoins = $commPercent > 0 ? (int)round($pot * ($commPercent / 100.0)) : 0;
                $winnerCoins = $pot - $rakeCoins;

                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$winnerCoins, (int)$winnerId]);
                $desc = $rakeCoins > 0
                    ? "Pot Won by Surrender: Match Room {$roomCode} (+{$winnerCoins} Coins after {$rakeCoins} platform fee)"
                    : "Pot Won by Surrender: Match Room {$roomCode} (+{$winnerCoins} Coins, 0% Commission!)";

                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_win', 0, ?, ?)
                ")->execute([(int)$winnerId, $winnerCoins, $desc]);

                if ($rakeCoins > 0) {
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                        VALUES (?, 'wager_rake', 0, ?, ?)
                    ")->execute([(int)$winnerId, -$rakeCoins, "Platform Match Fee ({$commPercent}%): Room {$roomCode}"]);
                }
            }

            // Adjust Elo on surrender
            if ($room['host_id'] && $room['guest_id']) {
                if ($winnerRole === 'p1') {
                    $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['host_id']);
                    $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['guest_id']);
                } else {
                    $db->exec("UPDATE users SET rating = rating + 16, wins = wins + 1 WHERE id = " . (int)$room['guest_id']);
                    $db->exec("UPDATE users SET rating = GREATEST(100, rating - 16), losses = losses + 1 WHERE id = " . (int)$room['host_id']);
                }
            }

            if ($winnerId) {
                checkAndAdvanceTournamentMatch($db, $roomCode, (int)$winnerId);
            }

            jsonResponse(['success' => true, 'message' => $winReason]);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid room action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Room server error: ' . $e->getMessage()], 500);
}
