<?php
/**
 * Social Following & Friends API
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
        // ================= GET FOLLOWINGS ================= //
        case 'get_following':
            $stmt = $db->prepare("
                SELECT u.id, u.username, u.avatar_url, u.rating, u.title, u.country, u.country_code, u.wins, u.package
                FROM user_follows f
                JOIN users u ON u.id = f.following_id
                WHERE f.follower_id = ?
                ORDER BY u.rating DESC
            ");
            $stmt->execute([$currentUser['id']]);
            $followings = $stmt->fetchAll();

            jsonResponse([
                'success' => true,
                'following' => $followings,
                'followings' => $followings,
                'count' => count($followings)
            ]);
            break;

        // ================= TOGGLE FOLLOW ================= //
        case 'toggle_follow':
            $targetId = (int)($input['user_id'] ?? 0);
            if ($targetId <= 0 || $targetId === (int)$currentUser['id']) {
                jsonResponse(['success' => false, 'message' => 'Invalid target user.'], 400);
            }

            $check = $db->prepare("SELECT id FROM user_follows WHERE follower_id = ? AND following_id = ?");
            $check->execute([$currentUser['id'], $targetId]);
            $exists = $check->fetch();

            if ($exists) {
                $db->prepare("DELETE FROM user_follows WHERE id = ?")->execute([$exists['id']]);
                jsonResponse(['success' => true, 'is_following' => false, 'message' => 'Unfollowed player.']);
            } else {
                $db->prepare("INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)")
                   ->execute([$currentUser['id'], $targetId]);
                jsonResponse(['success' => true, 'is_following' => true, 'message' => 'Now following player!']);
            }
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid follow action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Follow server error: ' . $e->getMessage()], 500);
}
