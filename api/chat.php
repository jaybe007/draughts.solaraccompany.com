<?php
/**
 * Street Corner Live Chat & Banter API Endpoint
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
        case 'send':
            $message = trim($input['message'] ?? '');
            $isShout = !empty($input['is_shout']) ? 1 : 0;

            if (empty($message)) {
                jsonResponse(['success' => false, 'message' => 'Message cannot be empty.'], 400);
            }

            if (strlen($message) > 200) {
                $message = substr($message, 0, 200);
            }

            $userId = $currentUser ? $currentUser['id'] : null;
            $username = $currentUser ? $currentUser['username'] : (trim($input['guest_name'] ?? '') ?: 'Guest_' . rand(100, 999));

            $stmt = $db->prepare("INSERT INTO chat_messages (user_id, username, message, is_shout) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $username, $message, $isShout]);
            $msgId = (int)$db->lastInsertId();

            jsonResponse([
                'success' => true,
                'chat' => [
                    'id' => $msgId,
                    'username' => $username,
                    'message' => $message,
                    'is_shout' => $isShout,
                    'created_at' => date('Y-m-d H:i:s')
                ]
            ]);
            break;

        case 'list':
        default:
            $stmt = $db->query("SELECT id, user_id, username, message, is_shout, created_at FROM chat_messages ORDER BY id DESC LIMIT 50");
            $messages = array_reverse($stmt->fetchAll());
            jsonResponse(['success' => true, 'messages' => $messages]);
            break;
    }

} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
