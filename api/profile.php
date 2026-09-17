<?php
/**
 * Profile Management & Avatar Upload API
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

$currentUser = getCurrentUser();
if (!$currentUser) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized. Please log in.'], 401);
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$db = getDB();

try {
    switch ($action) {
        // ================= UPLOAD AVATAR PICTURE ================= //
        case 'upload_avatar':
            if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
                jsonResponse(['success' => false, 'message' => 'No file uploaded or upload error occurred.'], 400);
            }

            $file = $_FILES['avatar'];
            $maxBytes = 5 * 1024 * 1024; // 5 MB
            if ($file['size'] > $maxBytes) {
                jsonResponse(['success' => false, 'message' => 'Image exceeds 5MB maximum limit.'], 400);
            }

            // Validate mime type
            $finfo = new finfo(FILEINFO_MIME_TYPE);
            $mime = $finfo->file($file['tmp_name']);
            $allowedMimes = [
                'image/jpeg' => 'jpg',
                'image/png'  => 'png',
                'image/webp' => 'webp',
                'image/gif'  => 'gif'
            ];

            if (!isset($allowedMimes[$mime])) {
                jsonResponse(['success' => false, 'message' => 'Invalid image format. Allowed: JPG, PNG, WebP, GIF.'], 400);
            }

            $ext = $allowedMimes[$mime];
            $filename = 'avatar_' . $currentUser['id'] . '_' . time() . '.' . $ext;
            $uploadDir = __DIR__ . '/../uploads/avatars/';

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $destPath = $uploadDir . $filename;
            if (!move_uploaded_file($file['tmp_name'], $destPath)) {
                jsonResponse(['success' => false, 'message' => 'Failed to save uploaded picture.'], 500);
            }

            $avatarUrl = 'uploads/avatars/' . $filename;

            // Update user record
            $db->prepare("UPDATE users SET avatar_url = ?, updated_at = NOW() WHERE id = ?")
               ->execute([$avatarUrl, $currentUser['id']]);

            $_SESSION['user']['avatar_url'] = $avatarUrl;

            jsonResponse([
                'success' => true,
                'avatar_url' => $avatarUrl,
                'message' => 'Champion profile picture updated successfully!'
            ]);
            break;

        // ================= UPDATE PROFILE DETAILS ================= //
        case 'update_profile':
            $input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
            $country = trim($input['country'] ?? 'Nigeria');
            $countryCode = strtoupper(trim($input['country_code'] ?? 'NG'));
            $title = trim($input['title'] ?? 'Street Player');

            $db->prepare("UPDATE users SET country = ?, country_code = ?, title = ?, updated_at = NOW() WHERE id = ?")
               ->execute([$country, $countryCode, $title, $currentUser['id']]);

            $_SESSION['user']['country'] = $country;
            $_SESSION['user']['country_code'] = $countryCode;
            $_SESSION['user']['title'] = $title;

            jsonResponse(['success' => true, 'message' => 'Profile updated successfully!']);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid profile action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Profile server error: ' . $e->getMessage()], 500);
}
