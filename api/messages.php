<?php
/**
 * Direct Messaging & Player Inbox API
 */

require_once __DIR__ . '/../config/db.php';

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
        // ================= GET INBOX & CONVERSATIONS ================= //
        case 'get_inbox':
            // Group by peer
            $stmt = $db->prepare("
                SELECT 
                    CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END AS peer_id,
                    CASE WHEN sender_id = ? THEN receiver_name ELSE sender_name END AS peer_name,
                    message AS last_message,
                    created_at AS last_timestamp,
                    (SELECT COUNT(*) FROM user_messages WHERE receiver_id = ? AND sender_id = peer_id AND is_read = 0) AS unread_count
                FROM user_messages
                WHERE id IN (
                    SELECT MAX(id)
                    FROM user_messages
                    WHERE sender_id = ? OR receiver_id = ?
                    GROUP BY CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END
                )
                ORDER BY created_at DESC
                LIMIT 30
            ");
            $uid = $currentUser['id'];
            $stmt->execute([$uid, $uid, $uid, $uid, $uid, $uid]);
            $inbox = $stmt->fetchAll();

            $unreadCount = (int)$db->query("SELECT COUNT(*) FROM user_messages WHERE receiver_id = {$uid} AND is_read = 0")->fetchColumn();

            jsonResponse([
                'success' => true,
                'inbox' => $inbox,
                'unread_count' => $unreadCount
            ]);
            break;

        // ================= GET MESSAGES WITH A SPECIFIC PEER ================= //
        case 'get_messages':
            $peerId = (int)($_GET['peer_id'] ?? ($input['peer_id'] ?? 0));
            if ($peerId <= 0) {
                jsonResponse(['success' => false, 'message' => 'Peer ID required.'], 400);
            }

            // Mark incoming from peer as read
            $db->prepare("UPDATE user_messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?")
               ->execute([$currentUser['id'], $peerId]);

            $stmt = $db->prepare("
                SELECT id, sender_id, receiver_id, sender_name, receiver_name, message, created_at
                FROM user_messages
                WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
                ORDER BY created_at ASC
                LIMIT 100
            ");
            $stmt->execute([$currentUser['id'], $peerId, $peerId, $currentUser['id']]);
            $messages = $stmt->fetchAll();

            jsonResponse(['success' => true, 'peer_id' => $peerId, 'messages' => $messages]);
            break;

        // ================= GET UNREAD COUNT ================= //
        case 'get_unread_count':
            $unreadCount = (int)$db->query("SELECT COUNT(*) FROM user_messages WHERE receiver_id = {$currentUser['id']} AND is_read = 0")->fetchColumn();
            jsonResponse(['success' => true, 'unread_count' => $unreadCount]);
            break;

        // ================= SEND MESSAGE ================= //
        case 'send_message':
            $receiverId = (int)($input['receiver_id'] ?? ($input['recipient_id'] ?? 0));
            $receiverIdentifier = trim($input['receiver_name'] ?? ($input['recipient_identifier'] ?? ''));
            $subject = trim($input['subject'] ?? 'Match Shout');
            $message = trim($input['message'] ?? '');

            if (empty($message)) {
                jsonResponse(['success' => false, 'message' => 'Message cannot be empty.'], 400);
            }

            // Resolve receiver if identifier provided
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
                jsonResponse(['success' => false, 'message' => 'Recipient player not found. Please check player ID or username.'], 404);
            }

            if ($receiverId === (int)$currentUser['id']) {
                jsonResponse(['success' => false, 'message' => 'You cannot send a message to yourself.'], 400);
            }

            $ins = $db->prepare("
                INSERT INTO user_messages (sender_id, receiver_id, sender_name, receiver_name, subject, message, is_read)
                VALUES (?, ?, ?, ?, ?, ?, 0)
            ");
            $ins->execute([
                $currentUser['id'],
                $receiverId,
                $currentUser['username'],
                $receiverName,
                $subject,
                $message
            ]);

            jsonResponse([
                'success' => true,
                'message' => "Message sent to Champion {$receiverName}!"
            ]);
            break;

        // ================= MARK AS READ ================= //
        case 'mark_read':
            $msgId = (int)($input['message_id'] ?? 0);
            if ($msgId > 0) {
                $db->prepare("UPDATE user_messages SET is_read = 1 WHERE id = ? AND receiver_id = ?")
                   ->execute([$msgId, $currentUser['id']]);
            }
            jsonResponse(['success' => true]);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid messages action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Messages server error: ' . $e->getMessage()], 500);
}
