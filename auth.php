<?php
/**
 * Authentication API Endpoint
 * Handles register, login, logout, and current session check.
 */

require_once __DIR__ . '/../config/db.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

// Parse JSON payload if sent as application/json
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}
try {
    $db = getDB();

    switch ($action) {
        case 'me':
            $currentUser = getCurrentUser();
            if ($currentUser) {
                // Fetch fresh stats from DB
                $stmt = $db->prepare("SELECT id, username, email, rating, wins, losses, draws, total_chopped FROM users WHERE id = ?");
                $stmt->execute([$currentUser['id']]);
                $fresh = $stmt->fetch();
                if ($fresh) {
                    $_SESSION['user'] = $fresh;
                    jsonResponse(['success' => true, 'user' => $fresh]);
                }
            }
            jsonResponse(['success' => false, 'user' => null]);
            break;

        case 'register':
            $username = trim($input['username'] ?? '');
            $email    = trim($input['email'] ?? '');
            $password = $input['password'] ?? '';

            if (empty($username) || strlen($username) < 3) {
                jsonResponse(['success' => false, 'message' => 'Username must be at least 3 characters.'], 400);
            }
            if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonResponse(['success' => false, 'message' => 'Please enter a valid email address.'], 400);
            }
            if (empty($password) || strlen($password) < 6) {
                jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters.'], 400);
            }

            // Check if username or email already exists
            $checkStmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $checkStmt->execute([$username, $email]);
            if ($checkStmt->fetch()) {
                jsonResponse(['success' => false, 'message' => 'Username or Email is already registered.'], 409);
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $insertStmt = $db->prepare("
                INSERT INTO users (username, email, password_hash, rating, wins, losses, draws, total_chopped)
                VALUES (?, ?, ?, 1200, 0, 0, 0, 0)
            ");
            $insertStmt->execute([$username, $email, $passwordHash]);
            $newId = (int)$db->lastInsertId();

            $user = [
                'id' => $newId,
                'username' => $username,
                'email' => $email,
                'rating' => 1200,
                'wins' => 0,
                'losses' => 0,
                'draws' => 0,
                'total_chopped' => 0
            ];
            $_SESSION['user'] = $user;

            jsonResponse(['success' => true, 'message' => 'Account created successfully! Welcome champion.', 'user' => $user]);
            break;

        case 'login':
            $loginId  = trim($input['login'] ?? '');
            $password = $input['password'] ?? '';

            if (empty($loginId) || empty($password)) {
                jsonResponse(['success' => false, 'message' => 'Please provide both username/email and password.'], 400);
            }

            $stmt = $db->prepare("SELECT id, username, email, password_hash, rating, wins, losses, draws, total_chopped FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$loginId, $loginId]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                jsonResponse(['success' => false, 'message' => 'Invalid username or password.'], 401);
            }

            unset($user['password_hash']);
            $_SESSION['user'] = $user;

            jsonResponse(['success' => true, 'message' => 'Welcome back, ' . htmlspecialchars($user['username']) . '!', 'user' => $user]);
            break;

        case 'logout':
            unset($_SESSION['user']);
            session_destroy();
            jsonResponse(['success' => true, 'message' => 'Logged out successfully.']);
            break;

        default:
            jsonResponse(['success' => false, 'message' => 'Invalid auth action.'], 400);
    }
} catch (Exception $e) {
    jsonResponse(['success' => false, 'message' => 'Server error: ' . $e->getMessage()], 500);
}
