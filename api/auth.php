<?php
/**
 * Authentication API Endpoint
 * Handles register, email verification, resend verification, login, logout, and current session check.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/mail.php';

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
                $stmt = $db->prepare("
                    SELECT id, username, email, is_verified, rating, coins, wallet_balance, package, package_expiry,
                           daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
                           tournaments_hosted, tournaments_joined, avatar_url, avatar_color, country, country_code, title,
                           role, permissions_json, is_banned, ban_reason
                    FROM users WHERE id = ?
                ");
                $stmt->execute([$currentUser['id']]);
                $fresh = $stmt->fetch();
                if ($fresh) {
                    // Check daily reset
                    $today = date('Y-m-d');
                    if ($fresh['last_daily_reset'] !== $today) {
                        $resetQuota = 10;
                        if ($fresh['package'] === 'silver') $resetQuota = 25;
                        elseif ($fresh['package'] === 'gold') $resetQuota = 50;
                        elseif ($fresh['package'] === 'vip_oba') $resetQuota = 999;

                        $db->prepare("UPDATE users SET daily_games_left = ?, last_daily_reset = ? WHERE id = ?")
                           ->execute([$resetQuota, $today, $fresh['id']]);
                        $fresh['daily_games_left'] = $resetQuota;
                        $fresh['last_daily_reset'] = $today;
                    }

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
            $checkStmt = $db->prepare("SELECT id, username, email, is_verified FROM users WHERE username = ? OR email = ?");
            $checkStmt->execute([$username, $email]);
            $existing = $checkStmt->fetch();
            if ($existing) {
                if ((int)$existing['is_verified'] === 0) {
                    jsonResponse([
                        'success' => false,
                        'requires_verification' => true,
                        'email' => $existing['email'],
                        'username' => $existing['username'],
                        'message' => 'This account was created but not verified yet. Please enter the verification code sent to your email.'
                    ], 409);
                }
                jsonResponse(['success' => false, 'message' => 'Username or Email is already registered.'], 409);
            }

            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $today = date('Y-m-d');
            
            // Generate verification token and 6-digit OTP code
            $token = bin2hex(random_bytes(32));
            $otp = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            $expiresAt = date('Y-m-d H:i:s', time() + 86400); // 24 hours validity

            $insertStmt = $db->prepare("
                INSERT INTO users (
                    username, email, password_hash, is_verified,
                    verification_token, verification_code, verification_expires_at,
                    rating, coins, wallet_balance, package,
                    daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
                    tournaments_hosted, tournaments_joined, title, country, country_code
                ) VALUES (
                    ?, ?, ?, 0,
                    ?, ?, ?,
                    1200, 150, 2500.00, 'free',
                    10, ?, 0, 0, 0, 0,
                    0, 0, 'Street Player', 'Nigeria', 'NG'
                )
            ");
            $insertStmt->execute([$username, $email, $passwordHash, $token, $otp, $expiresAt, $today]);
            $newId = (int)$db->lastInsertId();

            $newUser = [
                'id' => $newId,
                'username' => $username,
                'email' => $email,
            ];

            // Send branded verification email
            $mailResult = sendVerificationEmail($newUser, $token, $otp);

            // Return verification required response (do NOT set session until verified)
            $response = [
                'success' => true,
                'requires_verification' => true,
                'email' => $email,
                'username' => $username,
                'message' => 'Account created! Please enter the 6-digit code sent to your email.',
            ];

            $isDevOrDebug = MAIL_DEV_MODE || 
                            (getenv('APP_DEBUG') && filter_var(getenv('APP_DEBUG'), FILTER_VALIDATE_BOOLEAN)) ||
                            empty($mailResult['success']);
            if ($isDevOrDebug) {
                $response['dev_otp'] = $otp;
                $response['dev_token'] = $token;
                $response['dev_mail_log'] = $mailResult['log_file'] ?? null;
            }

            jsonResponse($response);
            break;

        case 'verify_code':
        case 'verify_email':
            $token = trim($input['token'] ?? ($_GET['token'] ?? ''));
            $email = trim($input['email'] ?? ($_GET['email'] ?? ''));
            $code  = trim($input['code'] ?? ($_GET['code'] ?? ''));

            if (empty($token) && (empty($email) || empty($code))) {
                jsonResponse(['success' => false, 'message' => 'Please provide the 6-digit verification code and your email.'], 400);
            }

            $user = null;

            if (!empty($token)) {
                $stmt = $db->prepare("
                    SELECT * FROM users 
                    WHERE verification_token = ? 
                      AND verification_expires_at >= NOW()
                ");
                $stmt->execute([$token]);
                $user = $stmt->fetch();
            } else {
                $stmt = $db->prepare("
                    SELECT * FROM users 
                    WHERE (email = ? OR username = ?) 
                      AND verification_code = ? 
                      AND verification_expires_at >= NOW()
                ");
                $stmt->execute([$email, $email, $code]);
                $user = $stmt->fetch();
            }

            if (!$user) {
                // Check if user is already verified
                $searchId = !empty($email) ? $email : '';
                if ($searchId) {
                    $chk = $db->prepare("SELECT id, is_verified FROM users WHERE email = ? OR username = ?");
                    $chk->execute([$searchId, $searchId]);
                    $row = $chk->fetch();
                    if ($row && (int)$row['is_verified'] === 1) {
                        jsonResponse([
                            'success' => true,
                            'already_verified' => true,
                            'message' => 'Account is already verified! You can sign in now.'
                        ]);
                    }
                }
                jsonResponse([
                    'success' => false,
                    'message' => 'Invalid or expired verification code. Please check your code or request a new one.'
                ], 400);
            }

            // Mark user as verified
            $updateStmt = $db->prepare("
                UPDATE users 
                SET is_verified = 1, 
                    email_verified_at = NOW(), 
                    verification_token = NULL, 
                    verification_code = NULL, 
                    verification_expires_at = NULL 
                WHERE id = ?
            ");
            $updateStmt->execute([$user['id']]);

            // Fetch fresh user record
            $stmt = $db->prepare("
                SELECT id, username, email, is_verified, rating, coins, wallet_balance, package, package_expiry,
                       daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
                       tournaments_hosted, tournaments_joined, avatar_url, avatar_color, country, country_code, title
                FROM users WHERE id = ?
            ");
            $stmt->execute([$user['id']]);
            $verifiedUser = $stmt->fetch();

            $_SESSION['user'] = $verifiedUser;

            jsonResponse([
                'success' => true,
                'message' => 'Email verified successfully! Welcome to the Arena, Champion ' . htmlspecialchars($verifiedUser['username']) . '!',
                'user' => $verifiedUser
            ]);
            break;

        case 'resend_verification':
            $email = trim($input['email'] ?? ($_GET['email'] ?? ''));

            if (empty($email)) {
                jsonResponse(['success' => false, 'message' => 'Please provide your email address or username.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
            $stmt->execute([$email, $email]);
            $user = $stmt->fetch();

            if (!$user) {
                jsonResponse(['success' => false, 'message' => 'No player account found with that email or username.'], 404);
            }

            if ((int)$user['is_verified'] === 1) {
                jsonResponse(['success' => false, 'message' => 'This account is already verified. Please sign in.'], 400);
            }

            // Rate-limiting check: minimum 60 seconds cooldown between resends
            $sessionKey = 'resend_cooldown_' . $user['id'];
            $lastSent = $_SESSION[$sessionKey] ?? 0;
            $now = time();
            $cooldown = 60;
            if (($now - $lastSent) < $cooldown) {
                $remaining = $cooldown - ($now - $lastSent);
                jsonResponse([
                    'success' => false,
                    'message' => "Please wait {$remaining} seconds before requesting another verification code.",
                    'cooldown' => $remaining
                ], 429);
            }

            // Generate fresh token and 6-digit OTP code
            $token = bin2hex(random_bytes(32));
            $otp = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
            $expiresAt = date('Y-m-d H:i:s', time() + 86400);

            $updateStmt = $db->prepare("
                UPDATE users 
                SET verification_token = ?, 
                    verification_code = ?, 
                    verification_expires_at = ? 
                WHERE id = ?
            ");
            $updateStmt->execute([$token, $otp, $expiresAt, $user['id']]);

            $_SESSION[$sessionKey] = $now;

            $mailResult = sendVerificationEmail($user, $token, $otp);

            $response = [
                'success' => true,
                'message' => 'A new 6-digit verification code has been sent to your email.',
            ];

            $isDevOrDebug = MAIL_DEV_MODE || 
                            (getenv('APP_DEBUG') && filter_var(getenv('APP_DEBUG'), FILTER_VALIDATE_BOOLEAN)) ||
                            empty($mailResult['success']);
            if ($isDevOrDebug) {
                $response['dev_otp'] = $otp;
                $response['dev_token'] = $token;
                $response['dev_mail_log'] = $mailResult['log_file'] ?? null;
            }

            jsonResponse($response);
            break;

        case 'login':
            $loginId  = trim($input['login'] ?? '');
            $password = $input['password'] ?? '';

            if (empty($loginId) || empty($password)) {
                jsonResponse(['success' => false, 'message' => 'Please provide both username/email and password.'], 400);
            }

            $stmt = $db->prepare("
                SELECT id, username, email, password_hash, is_verified, rating, coins, wallet_balance, package, package_expiry,
                       daily_games_left, last_daily_reset, wins, losses, draws, total_chopped,
                       tournaments_hosted, tournaments_joined, avatar_url, avatar_color, country, country_code, title,
                       role, permissions_json, is_banned, ban_reason
                FROM users WHERE username = ? OR email = ?
            ");
            $stmt->execute([$loginId, $loginId]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($password, $user['password_hash'])) {
                jsonResponse(['success' => false, 'message' => 'Invalid username or password.'], 401);
            }

            unset($user['password_hash']);

            // Ban check
            if (!empty($user['is_banned'])) {
                $reason = !empty($user['ban_reason']) ? $user['ban_reason'] : 'Account suspended by administrator.';
                jsonResponse([
                    'success' => false,
                    'is_banned' => true,
                    'message' => "Access Denied: {$reason}"
                ], 403);
            }

            // Enforce email verification
            if (isset($user['is_verified']) && (int)$user['is_verified'] === 0) {
                jsonResponse([
                    'success' => false,
                    'requires_verification' => true,
                    'email' => $user['email'],
                    'username' => $user['username'],
                    'message' => 'Your email address is not verified yet. Please enter the 6-digit verification code sent to your email to continue.'
                ], 403);
            }

            // Daily quota check
            $today = date('Y-m-d');
            if ($user['last_daily_reset'] !== $today) {
                $resetQuota = 10;
                if ($user['package'] === 'silver') $resetQuota = 25;
                elseif ($user['package'] === 'gold') $resetQuota = 50;
                elseif ($user['package'] === 'vip_oba') $resetQuota = 999;

                $db->prepare("UPDATE users SET daily_games_left = ?, last_daily_reset = ? WHERE id = ?")
                   ->execute([$resetQuota, $today, $user['id']]);
                $user['daily_games_left'] = $resetQuota;
                $user['last_daily_reset'] = $today;
            }

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
