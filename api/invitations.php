<?php
/**
 * Game Invitations & Player Match Challenges API
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/payment.php';

header('Content-Type: application/json; charset=utf-8');

$currentUser = getCurrentUser();
if (!$currentUser) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized. Please log in.'], 401);
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

$db = getDB();

try {
    switch ($action) {
        // ================= GET INVITATIONS (RECEIVED & SENT) ================= //
        case 'get_invitations':
            $uid = $currentUser['id'];

            // Received
            $stmtRecv = $db->prepare("
                SELECT i.*, u.avatar_url, u.rating AS sender_rating
                FROM game_invitations i
                LEFT JOIN users u ON u.id = i.sender_id
                WHERE i.receiver_id = ? AND i.status = 'pending'
                ORDER BY i.created_at DESC
                LIMIT 20
            ");
            $stmtRecv->execute([$uid]);
            $received = $stmtRecv->fetchAll();

            // Sent
            $stmtSent = $db->prepare("
                SELECT i.*, i.receiver_name AS recipient_name, u.avatar_url, u.rating AS recipient_rating
                FROM game_invitations i
                LEFT JOIN users u ON u.id = i.receiver_id
                WHERE i.sender_id = ?
                ORDER BY i.created_at DESC
                LIMIT 20
            ");
            $stmtSent->execute([$uid]);
            $sent = $stmtSent->fetchAll();

            jsonResponse([
                'success' => true,
                'received' => $received,
                'sent' => $sent,
                'count' => count($received)
            ]);
            break;

        // ================= SEND INVITATION ================= //
        case 'send_invitation':
            $receiverId = (int)($input['receiver_id'] ?? ($input['recipient_id'] ?? 0));
            $receiverIdentifier = trim($input['receiver_name'] ?? ($input['recipient_identifier'] ?? ''));
            $timeControl = $input['time_control'] ?? 'rapid_5';
            $wagerCoins = max(0, (int)($input['wager_coins'] ?? 0));

            // Verify & auto-convert coins if wagering
            if ($wagerCoins > 0) {
                $coinCheck = ensureCoinsAvailable($db, $currentUser['id'], $wagerCoins, "Match Challenge");
                if (!$coinCheck['success']) {
                    jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                }
            }

            // Resolve receiver identifier
            if ($receiverId <= 0 && !empty($receiverIdentifier)) {
                $cleanId = ltrim(str_ireplace('#nd-', '', $receiverIdentifier), '0');
                if (is_numeric($cleanId) && (int)$cleanId > 0) {
                    $stmt = $db->prepare("SELECT id, username FROM users WHERE id = ?");
                    $stmt->execute([(int)$cleanId]);
                    $user = $stmt->fetch();
                } else {
                    $stmt = $db->prepare("SELECT id, username FROM users WHERE username = ?");
                    $stmt->execute([$receiverIdentifier]);
                    $user = $stmt->fetch();
                }
                if ($user) {
                    $receiverId = (int)$user['id'];
                    $receiverName = $user['username'];
                }
            } elseif ($receiverId > 0) {
                $stmt = $db->prepare("SELECT id, username FROM users WHERE id = ?");
                $stmt->execute([$receiverId]);
                $user = $stmt->fetch();
                if ($user) {
                    $receiverName = $user['username'];
                }
            }

            if ($receiverId <= 0 || empty($receiverName)) {
                jsonResponse(['success' => false, 'message' => 'Opponent not found. Please check username or Player ID.'], 404);
            }

            if ($receiverId === (int)$currentUser['id']) {
                jsonResponse(['success' => false, 'message' => 'You cannot challenge yourself.'], 400);
            }

            // Create private room for this challenge
            $roomCode = 'ND-' . strtoupper(substr(str_shuffle('23456789ABCDEFGHJKLMNPQRSTUVWXYZ'), 0, 4));
            $initSec = ($timeControl === 'blitz_3') ? 180 : (($timeControl === 'classical_10') ? 600 : 300);

            $roomStmt = $db->prepare("
                INSERT INTO game_rooms (
                    room_code, host_id, host_name, guest_id, guest_name,
                    game_type, wager_coins, is_private, time_control, board_size, rule_mode,
                    status, current_turn, p1_time_left, p2_time_left
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    'p2p', ?, 1, ?, 10, 'nigerian',
                    'waiting', 1, ?, ?
                )
            ");
            $roomStmt->execute([
                $roomCode, $currentUser['id'], $currentUser['username'], $receiverId, $receiverName,
                $wagerCoins, $timeControl, $initSec, $initSec
            ]);

            // Deduct escrow coins from sender if wagering
            if ($wagerCoins > 0) {
                $db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$wagerCoins, $currentUser['id']]);
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_escrow', 0, ?, ?)
                ")->execute([$currentUser['id'], -$wagerCoins, "Escrow: Challenge Challenge to {$receiverName} (Room {$roomCode})"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = max(0, (int)$_SESSION['user']['coins'] - $wagerCoins);
                }
            }

            // Log invitation
            $insInv = $db->prepare("
                INSERT INTO game_invitations (
                    sender_id, receiver_id, sender_name, receiver_name,
                    room_code, time_control, wager_coins, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
            ");
            $insInv->execute([
                $currentUser['id'], $receiverId, $currentUser['username'], $receiverName,
                $roomCode, $timeControl, $wagerCoins
            ]);

            jsonResponse([
                'success' => true,
                'room_code' => $roomCode,
                'message' => "Challenge sent to {$receiverName}! Room code: {$roomCode}."
            ]);
            break;

        // ================= RESPOND TO INVITATION ================= //
        case 'respond':
            $invId = (int)($input['invitation_id'] ?? 0);
            $response = trim($input['status'] ?? ''); // 'accepted' or 'declined'

            if ($invId <= 0 || !in_array($response, ['accepted', 'declined'])) {
                jsonResponse(['success' => false, 'message' => 'Invalid response parameters.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_invitations WHERE id = ? AND receiver_id = ? AND status = 'pending'");
            $stmt->execute([$invId, $currentUser['id']]);
            $inv = $stmt->fetch();

            if (!$inv) {
                jsonResponse(['success' => false, 'message' => 'Challenge not found or already resolved.'], 404);
            }

            if ($response === 'accepted') {
                // If coin wager, verify and auto-convert coins for receiver if needed
                if ($inv['wager_coins'] > 0) {
                    $wagerAmt = (int)$inv['wager_coins'];
                    $coinCheck = ensureCoinsAvailable($db, $currentUser['id'], $wagerAmt, "Accepted Challenge from {$inv['sender_name']}");
                    if (!$coinCheck['success']) {
                        jsonResponse(['success' => false, 'message' => $coinCheck['message']], 400);
                    }
                    $db->prepare("UPDATE users SET coins = GREATEST(0, coins - ?) WHERE id = ?")->execute([$wagerAmt, $currentUser['id']]);
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                        VALUES (?, 'wager_escrow', 0, ?, ?)
                    ")->execute([$currentUser['id'], -$wagerAmt, "Escrow: Accepted Challenge from {$inv['sender_name']}"]);
                    if (isset($_SESSION['user']['coins'])) {
                        $_SESSION['user']['coins'] = max(0, (int)$_SESSION['user']['coins'] - (int)$inv['wager_coins']);
                    }
                }

                // Activate game room
                $db->prepare("
                    UPDATE game_rooms SET
                        status = 'active',
                        guest_id = ?,
                        guest_name = ?,
                        last_move_time = ?,
                        updated_at = NOW()
                    WHERE room_code = ?
                ")->execute([$currentUser['id'], $currentUser['username'], time(), $inv['room_code']]);

                // Mark invitation accepted
                $db->prepare("UPDATE game_invitations SET status = 'accepted', updated_at = NOW() WHERE id = ?")
                   ->execute([$invId]);

                jsonResponse([
                    'success' => true,
                    'status' => 'accepted',
                    'room_code' => $inv['room_code'],
                    'message' => 'Challenge accepted! Entering battle arena.'
                ]);
            } else {
                // Declined: refund sender if wager coins were escrowed
                if ($inv['wager_coins'] > 0) {
                    $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([(int)$inv['wager_coins'], (int)$inv['sender_id']]);
                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                        VALUES (?, 'wager_refund', 0, ?, ?)
                    ")->execute([(int)$inv['sender_id'], (int)$inv['wager_coins'], "Declined Challenge Refund: Room {$inv['room_code']}"]);
                }

                $db->prepare("UPDATE game_invitations SET status = 'declined', updated_at = NOW() WHERE id = ?")
                   ->execute([$invId]);

                // Cancel the room
                $db->prepare("UPDATE game_rooms SET status = 'abandoned' WHERE room_code = ?")
                   ->execute([$inv['room_code']]);

                jsonResponse(['success' => true, 'status' => 'declined', 'message' => 'Challenge declined.']);
            }
            break;

        // ================= CANCEL INVITATION (BY SENDER) ================= //
        case 'cancel_invitation':
            $invId = (int)($input['invitation_id'] ?? 0);
            if ($invId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Invalid invitation ID.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM game_invitations WHERE id = ? AND sender_id = ? AND status = 'pending'");
            $stmt->execute([$invId, $currentUser['id']]);
            $inv = $stmt->fetch();

            if (!$inv) {
                jsonResponse(['success' => false, 'message' => 'Pending invitation not found or already resolved.'], 404);
            }

            // Refund sender if wager coins were escrowed
            if ((int)$inv['wager_coins'] > 0) {
                $wager = (int)$inv['wager_coins'];
                $db->prepare("UPDATE users SET coins = coins + ? WHERE id = ?")->execute([$wager, (int)$currentUser['id']]);
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, coins, description)
                    VALUES (?, 'wager_refund', 0, ?, ?)
                ")->execute([(int)$currentUser['id'], $wager, "Cancelled Challenge Refund: Room {$inv['room_code']}"]);
                if (isset($_SESSION['user']['coins'])) {
                    $_SESSION['user']['coins'] = (int)$_SESSION['user']['coins'] + $wager;
                }
            }

            $db->prepare("UPDATE game_invitations SET status = 'cancelled', updated_at = NOW() WHERE id = ?")
               ->execute([$invId]);

            // Cancel associated room
            if (!empty($inv['room_code'])) {
                $db->prepare("UPDATE game_rooms SET status = 'abandoned' WHERE room_code = ?")
                   ->execute([$inv['room_code']]);
            }

            jsonResponse(['success' => true, 'message' => 'Challenge cancelled successfully.']);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid invitation action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Invitations server error: ' . $e->getMessage()], 500);
}
