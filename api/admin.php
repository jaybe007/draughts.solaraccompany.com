<?php
/**
 * Naija Draughts - Admin Command Center API Endpoint
 * Handles:
 * - RBAC & Staff Management (Super Admin only: create admin, assign permissions, revoke)
 * - User Management (search, view, edit balance, upgrade tier, ban/unban)
 * - Financial Treasury & Cashier (approve/reject bank withdrawals with refunds, manual credits)
 * - Tournaments & Knockout Brackets (monitoring, round force-advance, cancellation with refunds)
 * - Live Game Arena & Rooms (active match monitoring, termination)
 * - System Configurations & Audit Logs
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/admin_helper.php';
require_once __DIR__ . '/../config/tournament_helper.php';

header('Content-Type: application/json; charset=utf-8');

function jsonResp($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$db = getDB();
$adminUser = getAdminSessionUser($db);

if (!$adminUser) {
    jsonResp(['success' => false, 'message' => 'Unauthorized: Administrator access required.'], 403);
}

$action = $_GET['action'] ?? ($_POST['action'] ?? '');
$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

try {
    switch ($action) {

        // ================= PERMISSION REGISTRY ================= //
        case 'get_permissions_registry':
            jsonResp([
                'success' => true,
                'permissions' => array_values(getAvailablePermissionsList()),
                'current_admin' => [
                    'id' => (int)$adminUser['id'],
                    'username' => $adminUser['username'],
                    'role' => $adminUser['role'],
                    'is_super_admin' => ($adminUser['role'] === 'super_admin')
                ]
            ]);
            break;

        // ================= OVERVIEW DASHBOARD METRICS ================= //
        case 'get_overview':
            // 1. User stats
            $totalUsers = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
            $verifiedUsers = (int)$db->query("SELECT COUNT(*) FROM users WHERE is_verified = 1")->fetchColumn();
            $bannedUsers = (int)$db->query("SELECT COUNT(*) FROM users WHERE is_banned = 1")->fetchColumn();
            $totalVip = (int)$db->query("SELECT COUNT(*) FROM users WHERE package = 'vip_oba'")->fetchColumn();

            // 2. Financial metrics
            $totalDeposits = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM wallet_transactions WHERE type = 'deposit' AND status = 'completed'")->fetchColumn();
            $totalWithdrawals = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM wallet_transactions WHERE type = 'withdrawal_request' AND status = 'completed'")->fetchColumn();
            $pendingWithdrawalsCount = (int)$db->query("SELECT COUNT(*) FROM wallet_transactions WHERE type = 'withdrawal_request' AND status = 'pending'")->fetchColumn();
            $pendingWithdrawalsAmount = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM wallet_transactions WHERE type = 'withdrawal_request' AND status = 'pending'")->fetchColumn();
            
            // Platform Rake Earned: 
            // Sum of match rake records
            $matchRakeNaira = (float)$db->query("SELECT COALESCE(SUM(rake_amount), 0) FROM game_rooms WHERE status = 'finished'")->fetchColumn();
            // Tournament platform commission
            $tournRakeNaira = (float)$db->query("SELECT COALESCE(SUM(prize_pool_naira * 0.10), 0) FROM tournaments WHERE status = 'completed'")->fetchColumn();
            $totalRakeNaira = $matchRakeNaira + $tournRakeNaira;

            // 3. Match & Tournament stats
            $totalMatches = (int)$db->query("SELECT COUNT(*) FROM matches")->fetchColumn();
            $liveRooms = (int)$db->query("SELECT COUNT(*) FROM game_rooms WHERE status IN ('waiting', 'active')")->fetchColumn();
            $activeTournaments = (int)$db->query("SELECT COUNT(*) FROM tournaments WHERE status IN ('upcoming', 'live')")->fetchColumn();

            // 4. System settings
            $settings = getSystemSettingsMap($db);

            // 5. Recent 5 audit logs
            $recentAudit = $db->query("SELECT * FROM admin_audit_logs ORDER BY id DESC LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);

            // 6. Recent pending withdrawals
            $recentPending = $db->query("
                SELECT w.*, u.username, u.email 
                FROM wallet_transactions w
                JOIN users u ON u.id = w.user_id
                WHERE w.type = 'withdrawal_request' AND w.status = 'pending'
                ORDER BY w.id DESC LIMIT 5
            ")->fetchAll(PDO::FETCH_ASSOC);

            jsonResp([
                'success' => true,
                'stats' => [
                    'total_users' => $totalUsers,
                    'verified_users' => $verifiedUsers,
                    'banned_users' => $bannedUsers,
                    'vip_users' => $totalVip,
                    'total_deposits' => $totalDeposits,
                    'total_withdrawals' => $totalWithdrawals,
                    'pending_withdrawals_count' => $pendingWithdrawalsCount,
                    'pending_withdrawals_amount' => $pendingWithdrawalsAmount,
                    'total_rake_naira' => $totalRakeNaira,
                    'match_rake_naira' => $matchRakeNaira,
                    'tourn_rake_naira' => $tournRakeNaira,
                    'total_matches' => $totalMatches,
                    'live_rooms' => $liveRooms,
                    'active_tournaments' => $activeTournaments
                ],
                'settings' => $settings,
                'recent_audit' => $recentAudit,
                'recent_pending_withdrawals' => $recentPending,
                'admin' => [
                    'id' => (int)$adminUser['id'],
                    'username' => $adminUser['username'],
                    'role' => $adminUser['role']
                ]
            ]);
            break;

        // ================= ADMIN & RBAC MANAGEMENT ================= //
        case 'list_admins':
            if (!hasAdminPermission($adminUser, 'manage_admins')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_admins required.'], 403);
            }

            $admins = $db->query("
                SELECT id, username, email, role, title, permissions_json, is_banned, ban_reason, created_at, updated_at 
                FROM users 
                WHERE role IN ('admin', 'super_admin') 
                ORDER BY CASE role WHEN 'super_admin' THEN 1 ELSE 2 END, id ASC
            ")->fetchAll(PDO::FETCH_ASSOC);

            foreach ($admins as &$adm) {
                $adm['permissions'] = json_decode($adm['permissions_json'] ?? '[]', true) ?: [];
                $adm['is_self'] = ((int)$adm['id'] === (int)$adminUser['id']);
            }

            jsonResp(['success' => true, 'admins' => $admins]);
            break;

        case 'create_admin':
            if ($adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can provision new staff.'], 403);
            }

            $username = trim($input['username'] ?? '');
            $email = trim(strtolower($input['email'] ?? ''));
            $password = trim($input['password'] ?? '');
            $role = trim($input['role'] ?? 'admin');
            $title = trim($input['title'] ?? 'Official Staff');
            $permissions = is_array($input['permissions'] ?? null) ? $input['permissions'] : [];

            if (strlen($username) < 3 || strlen($password) < 6 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonResp(['success' => false, 'message' => 'Valid username (3+ chars), email, and password (6+ chars) required.'], 400);
            }

            if (!in_array($role, ['admin', 'super_admin'])) {
                $role = 'admin';
            }

            // Check if username or email exists
            $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                jsonResp(['success' => false, 'message' => 'Username or email already in use.'], 400);
            }

            $passHash = password_hash($password, PASSWORD_BCRYPT);
            $permsJson = json_encode(array_values($permissions));

            $insertStmt = $db->prepare("
                INSERT INTO users (username, email, password_hash, role, permissions_json, is_verified, title, wallet_balance, coins)
                VALUES (?, ?, ?, ?, ?, 1, ?, 0.00, 1000)
            ");
            $insertStmt->execute([$username, $email, $passHash, $role, $permsJson, $title ?: 'Official Staff']);
            $newAdminId = (int)$db->lastInsertId();

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'create_admin', 'user', $newAdminId, [
                'username' => $username,
                'email' => $email,
                'role' => $role,
                'title' => $title,
                'permissions' => $permissions
            ]);

            jsonResp([
                'success' => true,
                'admin_id' => $newAdminId,
                'message' => "Admin staff '{$username}' provisioned successfully as {$role}."
            ]);
            break;

        case 'promote_existing_user':
            if ($adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can promote players to staff.'], 403);
            }

            $targetUserId = (int)($input['user_id'] ?? 0);
            $role = trim($input['role'] ?? 'admin');
            $title = trim($input['title'] ?? 'Operations Arbiter');
            $permissions = is_array($input['permissions'] ?? null) ? $input['permissions'] : [];

            if ($targetUserId <= 0) {
                jsonResp(['success' => false, 'message' => 'Valid player ID required for promotion.'], 400);
            }

            $stmt = $db->prepare("SELECT id, username, email, role FROM users WHERE id = ?");
            $stmt->execute([$targetUserId]);
            $player = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$player) {
                jsonResp(['success' => false, 'message' => 'Target player not found in directory.'], 404);
            }

            if (!in_array($role, ['admin', 'super_admin'])) {
                $role = 'admin';
            }

            $permsJson = json_encode(array_values($permissions));
            $db->prepare("
                UPDATE users 
                SET role = ?, permissions_json = ?, title = ? 
                WHERE id = ?
            ")->execute([$role, $permsJson, $title ?: 'Operations Arbiter', $targetUserId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'promote_existing_user', 'user', $targetUserId, [
                'username' => $player['username'],
                'previous_role' => $player['role'],
                'new_role' => $role,
                'title' => $title,
                'permissions' => $permissions
            ]);

            jsonResp([
                'success' => true,
                'message' => "Player '{$player['username']}' successfully promoted to {$role} ({$title})!"
            ]);
            break;

        case 'provision_player':
            if (!hasAdminPermission($adminUser, 'manage_users')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $username = trim($input['username'] ?? '');
            $email = trim(strtolower($input['email'] ?? ''));
            $password = trim($input['password'] ?? '');
            $walletBalance = max(0, (float)($input['wallet_balance'] ?? 0));
            $coins = max(0, (int)($input['coins'] ?? 500));
            $rating = max(100, (int)($input['rating'] ?? 1200));
            $package = trim($input['package'] ?? 'free');
            $title = trim($input['title'] ?? 'Street Player');

            if (strlen($username) < 3 || strlen($password) < 6 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                jsonResp(['success' => false, 'message' => 'Valid username (3+ chars), email, and password (6+ chars) required.'], 400);
            }

            if (!in_array($package, ['free', 'silver', 'gold', 'vip_oba'])) {
                $package = 'free';
            }

            // Check if username or email exists
            $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                jsonResp(['success' => false, 'message' => 'Username or email is already registered.'], 400);
            }

            $passHash = password_hash($password, PASSWORD_BCRYPT);

            $insertStmt = $db->prepare("
                INSERT INTO users (username, email, password_hash, role, is_verified, title, wallet_balance, coins, rating, package, daily_games_left)
                VALUES (?, ?, ?, 'player', 1, ?, ?, ?, ?, ?, ?)
            ");
            $dailyQuota = ($package === 'vip_oba') ? 999 : (($package === 'gold') ? 50 : (($package === 'silver') ? 25 : 10));
            $insertStmt->execute([$username, $email, $passHash, $title, $walletBalance, $coins, $rating, $package, $dailyQuota]);
            $newPlayerId = (int)$db->lastInsertId();

            if ($walletBalance > 0) {
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, reference, description)
                    VALUES (?, 'deposit', ?, ?, 'completed', ?, 'Initial provision balance credit by admin')
                ")->execute([$newPlayerId, $walletBalance, $walletBalance, 'PROV-' . time()]);
            }

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'provision_player', 'user', $newPlayerId, [
                'username' => $username,
                'email' => $email,
                'wallet_balance' => $walletBalance,
                'coins' => $coins,
                'package' => $package
            ]);

            jsonResp([
                'success' => true,
                'player_id' => $newPlayerId,
                'message' => "Player '{$username}' successfully provisioned with {$package} package and ₦" . number_format($walletBalance, 2) . " balance."
            ]);
            break;

        case 'reset_password':
            if (!hasAdminPermission($adminUser, 'manage_users') && $adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $targetUserId = (int)($input['user_id'] ?? 0);
            $newPass = trim($input['new_password'] ?? '');

            if ($targetUserId <= 0 || strlen($newPass) < 6) {
                jsonResp(['success' => false, 'message' => 'Valid user ID and new password (min 6 characters) required.'], 400);
            }

            $stmt = $db->prepare("SELECT id, username, role FROM users WHERE id = ?");
            $stmt->execute([$targetUserId]);
            $u = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$u) {
                jsonResp(['success' => false, 'message' => 'Target user not found.'], 404);
            }

            // Only Super Admin can reset another admin's password
            if (in_array($u['role'], ['admin', 'super_admin']) && $adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can reset administrative passwords.'], 403);
            }

            $passHash = password_hash($newPass, PASSWORD_BCRYPT);
            $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?")->execute([$passHash, $targetUserId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'reset_password', 'user', $targetUserId, [
                'username' => $u['username'],
                'role' => $u['role']
            ]);

            jsonResp([
                'success' => true,
                'message' => "Password for '{$u['username']}' has been reset successfully."
            ]);
            break;

        case 'toggle_user_status':
            if (!hasAdminPermission($adminUser, 'manage_users') && $adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $targetUserId = (int)($input['user_id'] ?? 0);
            $reason = trim($input['reason'] ?? '');

            if ($targetUserId <= 0) {
                jsonResp(['success' => false, 'message' => 'Valid user ID required.'], 400);
            }

            $stmt = $db->prepare("SELECT id, username, role, is_banned FROM users WHERE id = ?");
            $stmt->execute([$targetUserId]);
            $u = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$u) {
                jsonResp(['success' => false, 'message' => 'Target user not found.'], 404);
            }

            // Protect root Super Admin
            if ($u['username'] === 'GrandmasterAyo') {
                jsonResp(['success' => false, 'message' => 'Root Super Admin cannot be suspended.'], 400);
            }

            $newBanned = $u['is_banned'] ? 0 : 1;
            $newReason = $newBanned ? ($reason ?: 'Suspended by administrator') : null;

            $db->prepare("UPDATE users SET is_banned = ?, ban_reason = ? WHERE id = ?")
               ->execute([$newBanned, $newReason, $targetUserId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'toggle_user_status', 'user', $targetUserId, [
                'username' => $u['username'],
                'is_banned' => $newBanned,
                'reason' => $newReason
            ]);

            jsonResp([
                'success' => true,
                'is_banned' => $newBanned,
                'message' => "User '{$u['username']}' is now " . ($newBanned ? 'suspended 🔴' : 'active 🟢') . "."
            ]);
            break;

        case 'clear_stale_rooms':
            if (!hasAdminPermission($adminUser, 'manage_rooms')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_rooms required.'], 403);
            }

            $delStmt = $db->prepare("
                DELETE FROM game_rooms 
                WHERE status = 'finished' 
                  AND created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)
            ");
            $delStmt->execute();
            $clearedCount = $delStmt->rowCount();

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'clear_stale_rooms', 'game_rooms', null, [
                'cleared_count' => $clearedCount
            ]);

            jsonResp([
                'success' => true,
                'cleared_count' => $clearedCount,
                'message' => "Cleared {$clearedCount} finished match room(s) older than 24 hours."
            ]);
            break;

        case 'update_admin_permissions':
            if ($adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can modify staff roles and permissions.'], 403);
            }

            $targetId = (int)($input['admin_id'] ?? 0);
            $newRole = trim($input['role'] ?? 'admin');
            $title = trim($input['title'] ?? '');
            $permissions = is_array($input['permissions'] ?? null) ? $input['permissions'] : [];

            if ($targetId <= 0) {
                jsonResp(['success' => false, 'message' => 'Invalid admin ID.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$targetId]);
            $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$targetUser) {
                jsonResp(['success' => false, 'message' => 'Staff user not found.'], 404);
            }

            // Protect root Super Admin
            if ($targetUser['username'] === 'GrandmasterAyo' && $newRole !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Root Super Admin cannot be demoted.'], 400);
            }

            if (!in_array($newRole, ['admin', 'super_admin'])) {
                $newRole = 'admin';
            }

            $permsJson = json_encode(array_values($permissions));

            $db->prepare("UPDATE users SET role = ?, permissions_json = ?, title = COALESCE(NULLIF(?, ''), title) WHERE id = ?")
               ->execute([$newRole, $permsJson, $title, $targetId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'update_admin_permissions', 'user', $targetId, [
                'username' => $targetUser['username'],
                'new_role' => $newRole,
                'title' => $title,
                'permissions' => $permissions
            ]);

            jsonResp(['success' => true, 'message' => "Permissions and title updated for staff '{$targetUser['username']}'."]);
            break;

        case 'delete_admin':
            if ($adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can revoke staff privileges.'], 403);
            }

            $targetId = (int)($input['admin_id'] ?? 0);
            if ($targetId === (int)$adminUser['id']) {
                jsonResp(['success' => false, 'message' => 'You cannot revoke your own Super Admin account.'], 400);
            }

            $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$targetId]);
            $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$targetUser) {
                jsonResp(['success' => false, 'message' => 'Staff user not found.'], 404);
            }

            if ($targetUser['username'] === 'GrandmasterAyo') {
                jsonResp(['success' => false, 'message' => 'Root Super Admin cannot be revoked.'], 400);
            }

            $db->prepare("UPDATE users SET role = 'player', permissions_json = NULL, title = 'Street Player' WHERE id = ?")
               ->execute([$targetId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'delete_admin', 'user', $targetId, [
                'username' => $targetUser['username']
            ]);

            jsonResp(['success' => true, 'message' => "Staff access revoked for '{$targetUser['username']}'."]);
            break;

        // ================= PLAYER / USER MANAGEMENT ================= //
        case 'list_users':
            if (!hasAdminPermission($adminUser, 'manage_users')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $q = trim($_GET['q'] ?? '');
            $packageFilter = trim($_GET['package'] ?? '');
            $roleFilter = trim($_GET['role'] ?? '');
            $statusFilter = trim($_GET['status'] ?? ''); // 'banned', 'verified', 'unverified'
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = min(100, max(5, (int)($_GET['limit'] ?? 20)));
            $offset = ($page - 1) * $limit;

            $where = ["1=1"];
            $params = [];

            if ($q !== '') {
                $where[] = "(username LIKE ? OR email LIKE ?)";
                $params[] = "%{$q}%";
                $params[] = "%{$q}%";
            }
            if ($packageFilter !== '' && $packageFilter !== 'all') {
                $where[] = "package = ?";
                $params[] = $packageFilter;
            }
            if ($roleFilter !== '' && $roleFilter !== 'all') {
                $where[] = "role = ?";
                $params[] = $roleFilter;
            }
            if ($statusFilter === 'banned') {
                $where[] = "is_banned = 1";
            } elseif ($statusFilter === 'verified') {
                $where[] = "is_verified = 1";
            } elseif ($statusFilter === 'unverified') {
                $where[] = "is_verified = 0";
            }

            $whereClause = implode(' AND ', $where);

            $countStmt = $db->prepare("SELECT COUNT(*) FROM users WHERE {$whereClause}");
            $countStmt->execute($params);
            $totalCount = (int)$countStmt->fetchColumn();

            $sql = "
                SELECT id, username, email, title, rating, coins, wallet_balance, package, role, 
                       is_banned, ban_reason, is_verified, wins, losses, draws, created_at 
                FROM users 
                WHERE {$whereClause} 
                ORDER BY id DESC 
                LIMIT {$limit} OFFSET {$offset}
            ";
            $dataStmt = $db->prepare($sql);
            $dataStmt->execute($params);
            $users = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResp([
                'success' => true,
                'users' => $users,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $totalCount,
                    'total_pages' => ceil($totalCount / $limit)
                ]
            ]);
            break;

        case 'get_user_details':
            if (!hasAdminPermission($adminUser, 'manage_users')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $uid = (int)($_GET['user_id'] ?? 0);
            $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$uid]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                jsonResp(['success' => false, 'message' => 'User not found.'], 404);
            }
            unset($user['password_hash'], $user['verification_token']);

            // Fetch recent 15 matches
            $matches = $db->prepare("
                SELECT * FROM matches 
                WHERE player1_id = ? OR player2_id = ? 
                ORDER BY id DESC LIMIT 15
            ");
            $matches->execute([$uid, $uid]);
            $matchList = $matches->fetchAll(PDO::FETCH_ASSOC);

            // Fetch recent 15 wallet transactions
            $wtx = $db->prepare("
                SELECT * FROM wallet_transactions 
                WHERE user_id = ? 
                ORDER BY id DESC LIMIT 15
            ");
            $wtx->execute([$uid]);
            $txList = $wtx->fetchAll(PDO::FETCH_ASSOC);

            jsonResp([
                'success' => true,
                'user' => $user,
                'matches' => $matchList,
                'transactions' => $txList
            ]);
            break;

        case 'update_user':
            if (!hasAdminPermission($adminUser, 'manage_users')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_users required.'], 403);
            }

            $uid = (int)($input['user_id'] ?? 0);
            $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$uid]);
            $existing = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$existing) {
                jsonResp(['success' => false, 'message' => 'User not found.'], 404);
            }

            // Cannot edit Super Admin if not super admin
            if ($existing['role'] === 'super_admin' && $adminUser['role'] !== 'super_admin') {
                jsonResp(['success' => false, 'message' => 'Only Super Admins can modify Super Admin accounts.'], 403);
            }

            $newBalance = isset($input['wallet_balance']) ? (float)$input['wallet_balance'] : (float)$existing['wallet_balance'];
            $newCoins = isset($input['coins']) ? (int)$input['coins'] : (int)$existing['coins'];
            $newRating = isset($input['rating']) ? (int)$input['rating'] : (int)$existing['rating'];
            $newPackage = trim($input['package'] ?? $existing['package']);
            $isBanned = isset($input['is_banned']) ? (int)(bool)$input['is_banned'] : (int)$existing['is_banned'];
            $banReason = trim($input['ban_reason'] ?? ($existing['ban_reason'] ?? ''));
            $isVerified = isset($input['is_verified']) ? (int)(bool)$input['is_verified'] : (int)$existing['is_verified'];

            // Financial balance adjustment logging
            if (abs($newBalance - (float)$existing['wallet_balance']) > 0.001) {
                $diff = $newBalance - (float)$existing['wallet_balance'];
                $db->prepare("
                    INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, description)
                    VALUES (?, 'coin_exchange', ?, ?, 'completed', ?)
                ")->execute([
                    $uid,
                    $diff,
                    $newBalance,
                    "Admin manual balance adjustment by {$adminUser['username']}"
                ]);
            }

            $db->prepare("
                UPDATE users SET 
                    wallet_balance = ?, coins = ?, rating = ?, package = ?, 
                    is_banned = ?, ban_reason = ?, is_verified = ?
                WHERE id = ?
            ")->execute([
                $newBalance, $newCoins, $newRating, $newPackage,
                $isBanned, $banReason, $isVerified, $uid
            ]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'update_user', 'user', $uid, [
                'target_username' => $existing['username'],
                'balance_before' => $existing['wallet_balance'],
                'balance_after' => $newBalance,
                'package' => $newPackage,
                'is_banned' => $isBanned,
                'ban_reason' => $banReason
            ]);

            jsonResp(['success' => true, 'message' => "Player '{$existing['username']}' updated successfully."]);
            break;

        // ================= FINANCIAL CASHIER & PAYOUTS ================= //
        case 'list_withdrawals':
            if (!hasAdminPermission($adminUser, 'manage_finance')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_finance required.'], 403);
            }

            $status = trim($_GET['status'] ?? 'pending'); // 'pending', 'completed', 'cancelled', 'all'
            $sql = "
                SELECT w.*, u.username, u.email, u.wallet_balance AS current_balance
                FROM wallet_transactions w
                JOIN users u ON u.id = w.user_id
                WHERE w.type = 'withdrawal_request'
            ";

            if ($status !== 'all') {
                $sql .= " AND w.status = " . $db->quote($status);
            }

            $sql .= " ORDER BY w.id DESC LIMIT 100";
            $withdrawals = $db->query($sql)->fetchAll(PDO::FETCH_ASSOC);

            jsonResp(['success' => true, 'withdrawals' => $withdrawals]);
            break;

        case 'approve_withdrawal':
            if (!hasAdminPermission($adminUser, 'manage_finance')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_finance required.'], 403);
            }

            $txId = (int)($input['transaction_id'] ?? 0);
            $stmt = $db->prepare("SELECT * FROM wallet_transactions WHERE id = ? AND type = 'withdrawal_request'");
            $stmt->execute([$txId]);
            $tx = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tx) {
                jsonResp(['success' => false, 'message' => 'Withdrawal transaction not found.'], 404);
            }

            if ($tx['status'] !== 'pending') {
                jsonResp(['success' => false, 'message' => "Withdrawal already {$tx['status']}."], 400);
            }

            $db->prepare("
                UPDATE wallet_transactions 
                SET status = 'completed', description = CONCAT(description, ' [Approved by ', ?, ']')
                WHERE id = ?
            ")->execute([$adminUser['username'], $txId]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'approve_withdrawal', 'wallet_transaction', $txId, [
                'user_id' => $tx['user_id'],
                'amount' => $tx['amount'],
                'reference' => $tx['reference']
            ]);

            jsonResp(['success' => true, 'message' => "Withdrawal payout of ₦" . number_format(abs($tx['amount']), 2) . " approved!"]);
            break;

        case 'reject_withdrawal':
            if (!hasAdminPermission($adminUser, 'manage_finance')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_finance required.'], 403);
            }

            $txId = (int)($input['transaction_id'] ?? 0);
            $reason = trim($input['reason'] ?? 'Rejected by administrative review');

            $stmt = $db->prepare("SELECT * FROM wallet_transactions WHERE id = ? AND type = 'withdrawal_request'");
            $stmt->execute([$txId]);
            $tx = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tx) {
                jsonResp(['success' => false, 'message' => 'Withdrawal transaction not found.'], 404);
            }

            if ($tx['status'] !== 'pending') {
                jsonResp(['success' => false, 'message' => "Withdrawal already {$tx['status']}."], 400);
            }

            $refundAmount = abs((float)$tx['amount']);

            // 1. Mark transaction cancelled
            $db->prepare("
                UPDATE wallet_transactions 
                SET status = 'cancelled', description = CONCAT(description, ' [Rejected: ', ?, ']')
                WHERE id = ?
            ")->execute([$reason, $txId]);

            // 2. Refund amount to user's wallet
            $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?")
               ->execute([$refundAmount, $tx['user_id']]);

            $newBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$tx['user_id']}")->fetchColumn();

            // 3. Log refund transaction
            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, balance_after, status, reference, description)
                VALUES (?, 'wager_refund', ?, ?, 'completed', ?, ?)
            ")->execute([
                $tx['user_id'],
                $refundAmount,
                $newBal,
                "REFUND-WITHDRAW-{$txId}",
                "Refund for rejected withdrawal: {$reason}"
            ]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'reject_withdrawal', 'wallet_transaction', $txId, [
                'user_id' => $tx['user_id'],
                'amount' => $refundAmount,
                'reason' => $reason
            ]);

            jsonResp([
                'success' => true,
                'message' => "Withdrawal rejected. ₦" . number_format($refundAmount, 2) . " successfully refunded to player's balance."
            ]);
            break;

        case 'adjust_wallet_balance':
            if (!hasAdminPermission($adminUser, 'manage_finance')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_finance required.'], 403);
            }

            $uid = (int)($input['user_id'] ?? 0);
            $amountNaira = (float)($input['amount_naira'] ?? 0);
            $coins = (int)($input['coins'] ?? 0);
            $reason = trim($input['reason'] ?? 'Administrative Adjustment');

            if ($uid <= 0 || (abs($amountNaira) < 0.01 && $coins === 0)) {
                jsonResp(['success' => false, 'message' => 'Target player and non-zero adjustment amount required.'], 400);
            }

            $uStmt = $db->prepare("SELECT id, username, wallet_balance, coins FROM users WHERE id = ?");
            $uStmt->execute([$uid]);
            $user = $uStmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                jsonResp(['success' => false, 'message' => 'Player not found.'], 404);
            }

            $db->prepare("
                UPDATE users 
                SET wallet_balance = GREATEST(0, wallet_balance + ?),
                    coins = GREATEST(0, coins + ?)
                WHERE id = ?
            ")->execute([$amountNaira, $coins, $uid]);

            $newBal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$uid}")->fetchColumn();

            $db->prepare("
                INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                VALUES (?, 'coin_exchange', ?, ?, ?, 'completed', ?, ?)
            ")->execute([
                $uid,
                $amountNaira,
                $coins,
                $newBal,
                "ADJUST-" . time(),
                "Manual Adjustment by {$adminUser['username']}: {$reason}"
            ]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'adjust_wallet_balance', 'user', $uid, [
                'target_username' => $user['username'],
                'amount_naira' => $amountNaira,
                'coins' => $coins,
                'reason' => $reason
            ]);

            jsonResp(['success' => true, 'message' => "Player '{$user['username']}' balance adjusted by ₦" . number_format($amountNaira, 2) . " / {$coins} coins."]);
            break;

        // ================= TOURNAMENTS & CHAMPIONSHIPS ================= //
        case 'list_tournaments':
            if (!hasAdminPermission($adminUser, 'manage_tournaments')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_tournaments required.'], 403);
            }

            $tourns = $db->query("
                SELECT t.*, 
                       (SELECT COUNT(*) FROM tournament_participants tp WHERE tp.tournament_id = t.id) AS participant_count
                FROM tournaments t 
                ORDER BY t.id DESC
            ")->fetchAll(PDO::FETCH_ASSOC);

            foreach ($tourns as &$t) {
                $t['brackets'] = json_decode($t['brackets_json'] ?? '{}', true);
            }

            jsonResp(['success' => true, 'tournaments' => $tourns]);
            break;

        case 'cancel_tournament':
            if (!hasAdminPermission($adminUser, 'manage_tournaments')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_tournaments required.'], 403);
            }

            $tournId = (int)($input['tournament_id'] ?? 0);
            $reason = trim($input['reason'] ?? 'Tournament cancelled by admin');

            $stmt = $db->prepare("SELECT * FROM tournaments WHERE id = ?");
            $stmt->execute([$tournId]);
            $tourn = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$tourn) {
                jsonResp(['success' => false, 'message' => 'Tournament not found.'], 404);
            }

            if ($tourn['status'] === 'completed' || $tourn['status'] === 'cancelled') {
                jsonResp(['success' => false, 'message' => "Cannot cancel a tournament that is already {$tourn['status']}."], 400);
            }

            // Refund entry fees to all participants
            $feeNaira = (float)($tourn['entry_fee_naira'] ?? 0);
            $feeCoins = (int)($tourn['entry_fee_coins'] ?? 0);

            $participants = $db->query("SELECT user_id FROM tournament_participants WHERE tournament_id = {$tournId}")->fetchAll(PDO::FETCH_COLUMN);

            foreach ($participants as $pId) {
                if ($feeNaira > 0 || $feeCoins > 0) {
                    $db->prepare("UPDATE users SET wallet_balance = wallet_balance + ?, coins = coins + ? WHERE id = ?")
                       ->execute([$feeNaira, $feeCoins, $pId]);

                    $bal = (float)$db->query("SELECT wallet_balance FROM users WHERE id = {$pId}")->fetchColumn();

                    $db->prepare("
                        INSERT INTO wallet_transactions (user_id, type, amount, coins, balance_after, status, reference, description)
                        VALUES (?, 'wager_refund', ?, ?, ?, 'completed', ?, ?)
                    ")->execute([
                        $pId,
                        $feeNaira,
                        $feeCoins,
                        $bal,
                        "TOURN-CANCEL-{$tournId}",
                        "Refund for cancelled tournament '{$tourn['name']}': {$reason}"
                    ]);
                }
            }

            // Mark cancelled
            $db->prepare("UPDATE tournaments SET status = 'cancelled', current_round = 'Cancelled' WHERE id = ?")
               ->execute([$tournId]);

            // Close waiting/active rooms
            $db->prepare("UPDATE game_rooms SET status = 'finished' WHERE room_code LIKE ?")
               ->execute(["TOURN-{$tournId}-%"]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'cancel_tournament', 'tournament', $tournId, [
                'tournament_name' => $tourn['name'],
                'refunded_count' => count($participants),
                'reason' => $reason
            ]);

            jsonResp([
                'success' => true,
                'message' => "Tournament '{$tourn['name']}' cancelled. " . count($participants) . " participants refunded."
            ]);
            break;

        case 'force_advance_round':
            if (!hasAdminPermission($adminUser, 'manage_tournaments')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_tournaments required.'], 403);
            }

            $tournId = (int)($input['tournament_id'] ?? 0);
            $round = trim($input['round'] ?? '');
            $matchIndex = (int)($input['match_index'] ?? 0);
            $winnerId = (int)($input['winner_id'] ?? 0);

            if ($tournId <= 0 || empty($round) || $winnerId <= 0) {
                jsonResp(['success' => false, 'message' => 'Tournament ID, round, and winner ID are required.'], 400);
            }

            $advanced = advanceTournamentRound($db, $tournId, $round, $matchIndex, $winnerId);
            if (!$advanced) {
                jsonResp(['success' => false, 'message' => 'Failed to force-advance round. Verify parameters.'], 400);
            }

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'force_advance_round', 'tournament', $tournId, [
                'round' => $round,
                'match_index' => $matchIndex,
                'winner_id' => $winnerId
            ]);

            jsonResp(['success' => true, 'message' => "Bracket successfully updated! Round advanced."]);
            break;

        // ================= LIVE GAME ARENA & ROOMS ================= //
        case 'list_rooms':
            if (!hasAdminPermission($adminUser, 'manage_rooms')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_rooms required.'], 403);
            }

            $rooms = $db->query("
                SELECT * FROM game_rooms 
                ORDER BY CASE status WHEN 'active' THEN 1 WHEN 'waiting' THEN 2 ELSE 3 END, id DESC 
                LIMIT 50
            ")->fetchAll(PDO::FETCH_ASSOC);

            jsonResp(['success' => true, 'rooms' => $rooms]);
            break;

        case 'terminate_room':
            if (!hasAdminPermission($adminUser, 'manage_rooms')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_rooms required.'], 403);
            }

            $roomCode = trim($input['room_code'] ?? '');
            $reason = trim($input['reason'] ?? 'Terminated by administrator');

            $stmt = $db->prepare("SELECT * FROM game_rooms WHERE room_code = ?");
            $stmt->execute([$roomCode]);
            $room = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$room) {
                jsonResp(['success' => false, 'message' => 'Match room not found.'], 404);
            }

            if ($room['status'] === 'finished') {
                jsonResp(['success' => false, 'message' => 'Room is already finished.'], 400);
            }

            // Refund escrows if wager match
            $wNaira = (float)($room['wager_naira'] ?? 0);
            if ($wNaira > 0) {
                if ($room['host_id']) {
                    $db->exec("UPDATE users SET wallet_balance = wallet_balance + {$wNaira} WHERE id = {$room['host_id']}");
                }
                if ($room['guest_id'] && $room['status'] === 'active') {
                    $db->exec("UPDATE users SET wallet_balance = wallet_balance + {$wNaira} WHERE id = {$room['guest_id']}");
                }
            }

            $db->prepare("
                UPDATE game_rooms SET 
                    status = 'finished', 
                    win_reason = CONCAT('Room Terminated: ', ?), 
                    result = 'draw'
                WHERE room_code = ?
            ")->execute([$reason, $roomCode]);

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'terminate_room', 'game_room', $room['id'], [
                'room_code' => $roomCode,
                'reason' => $reason
            ]);

            jsonResp(['success' => true, 'message' => "Match room {$roomCode} successfully terminated."]);
            break;

        // ================= SYSTEM SETTINGS ================= //
        case 'get_settings':
            if (!hasAdminPermission($adminUser, 'manage_settings')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_settings required.'], 403);
            }

            $rows = $db->query("SELECT * FROM system_settings ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
            jsonResp(['success' => true, 'settings' => $rows]);
            break;

        case 'update_settings':
            if (!hasAdminPermission($adminUser, 'manage_settings')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: manage_settings required.'], 403);
            }

            $settings = is_array($input['settings'] ?? null) ? $input['settings'] : [];
            if (empty($settings)) {
                jsonResp(['success' => false, 'message' => 'No settings provided to update.'], 400);
            }

            $stmt = $db->prepare("
                INSERT INTO system_settings (setting_key, setting_value, updated_by)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)
            ");

            foreach ($settings as $k => $v) {
                $stmt->execute([$k, (string)$v, $adminUser['username']]);
            }

            logAdminAudit($db, $adminUser['id'], $adminUser['username'], 'update_settings', 'system', null, $settings);

            jsonResp(['success' => true, 'message' => 'System settings updated successfully!']);
            break;

        // ================= AUDIT LOGS ================= //
        case 'get_audit_logs':
            if (!hasAdminPermission($adminUser, 'view_audit_logs')) {
                jsonResp(['success' => false, 'message' => 'Permission denied: view_audit_logs required.'], 403);
            }

            $actionFilter = trim($_GET['action_filter'] ?? '');
            $page = max(1, (int)($_GET['page'] ?? 1));
            $limit = min(100, max(5, (int)($_GET['limit'] ?? 25)));
            $offset = ($page - 1) * $limit;

            $where = ["1=1"];
            $params = [];

            if ($actionFilter !== '') {
                $where[] = "action = ?";
                $params[] = $actionFilter;
            }

            $whereClause = implode(' AND ', $where);

            $countStmt = $db->prepare("SELECT COUNT(*) FROM admin_audit_logs WHERE {$whereClause}");
            $countStmt->execute($params);
            $total = (int)$countStmt->fetchColumn();

            $sql = "
                SELECT * FROM admin_audit_logs 
                WHERE {$whereClause} 
                ORDER BY id DESC 
                LIMIT {$limit} OFFSET {$offset}
            ";
            $dataStmt = $db->prepare($sql);
            $dataStmt->execute($params);
            $logs = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

            jsonResp([
                'success' => true,
                'logs' => $logs,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'total_pages' => ceil($total / $limit)
                ]
            ]);
            break;

        default:
            jsonResp(['success' => false, 'message' => "Unknown admin action '{$action}'."], 400);
            break;
    }

} catch (Exception $e) {
    jsonResp(['success' => false, 'message' => 'Admin API Error: ' . $e->getMessage()], 500);
}
