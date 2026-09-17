<?php
/**
 * Naija Draughts - Admin Helper & RBAC Authorization Middleware
 * Provides permission evaluation, audit logging, and platform settings retrieval.
 */

require_once __DIR__ . '/db.php';

/**
 * Standard Available Permissions Registry
 */
function getAvailablePermissionsList() {
    return [
        'manage_admins' => [
            'key' => 'manage_admins',
            'title' => 'Admin Staff & RBAC',
            'category' => 'Security',
            'description' => 'Create sub-admins, assign roles, and configure granular staff permissions (Super Admin).'
        ],
        'manage_users' => [
            'key' => 'manage_users',
            'title' => 'Player Management',
            'category' => 'Moderation',
            'description' => 'View player directory, adjust balances & coins, upgrade VIP packages, and ban/unban users.'
        ],
        'manage_finance' => [
            'key' => 'manage_finance',
            'title' => 'Financial Treasury & Cashier',
            'category' => 'Finance',
            'description' => 'Approve or reject bank withdrawal payout requests, view rake ledger, and perform manual adjustments.'
        ],
        'manage_tournaments' => [
            'key' => 'manage_tournaments',
            'title' => 'Tournaments & Championships',
            'category' => 'Competitions',
            'description' => 'Host official championships, override match outcomes, force round advance, or cancel with refunds.'
        ],
        'manage_rooms' => [
            'key' => 'manage_rooms',
            'title' => 'Live Arena & Match Rooms',
            'category' => 'Gameplay',
            'description' => 'Inspect active multiplayer game rooms, terminate stuck matches, and release locked escrows.'
        ],
        'manage_settings' => [
            'key' => 'manage_settings',
            'title' => 'Global Platform Settings',
            'category' => 'System',
            'description' => 'Configure platform match rake %, withdrawal thresholds, maintenance mode, and announcement banner.'
        ],
        'view_audit_logs' => [
            'key' => 'view_audit_logs',
            'title' => 'Security Audit Trails',
            'category' => 'System',
            'description' => 'View chronological immutable log of all administrative actions and security events.'
        ]
    ];
}

/**
 * Returns current authenticated admin user from session and fresh database state.
 */
function getAdminSessionUser($db = null) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $userId = $_SESSION['user']['id'] ?? ($_SESSION['user_id'] ?? null);

    if (!$userId && !empty($_SESSION['user']['username'])) {
        if (!$db) $db = getDB();
        $uStmt = $db->prepare("SELECT id FROM users WHERE username = ?");
        $uStmt->execute([$_SESSION['user']['username']]);
        $userId = $uStmt->fetchColumn();
    }

    if (!$userId) {
        return null;
    }

    if (!$db) {
        $db = getDB();
    }

    $stmt = $db->prepare("
        SELECT id, username, email, role, permissions_json, wallet_balance, coins, rating, package, is_banned, is_verified, created_at 
        FROM users 
        WHERE id = ?
    ");
    $stmt->execute([(int)$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !in_array($user['role'], ['admin', 'super_admin'])) {
        return null;
    }

    if (!empty($user['is_banned'])) {
        return null;
    }

    // Refresh active session array with latest role & permissions
    if (isset($_SESSION['user']) && is_array($_SESSION['user'])) {
        $_SESSION['user']['role'] = $user['role'];
        $_SESSION['user']['permissions_json'] = $user['permissions_json'];
    }

    return $user;
}

/**
 * Checks if admin user has specific permission.
 * Super Admin has ALL permissions unconditionally.
 */
function hasAdminPermission($user, $permissionKey) {
    if (!$user || empty($user['role'])) {
        return false;
    }

    if ($user['role'] === 'super_admin') {
        return true;
    }

    if ($user['role'] !== 'admin') {
        return false;
    }

    $perms = json_decode($user['permissions_json'] ?? '[]', true) ?: [];
    return in_array($permissionKey, $perms);
}

/**
 * Logs administrative action into immutable audit table.
 */
function logAdminAudit($db, $adminId, $adminUsername, $action, $targetType, $targetId = null, $details = null) {
    try {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1');
        if (strpos($ip, ',') !== false) {
            $ip = trim(explode(',', $ip)[0]);
        }

        $detailsStr = is_array($details) ? json_encode($details, JSON_UNESCAPED_SLASHES) : (string)$details;

        $stmt = $db->prepare("
            INSERT INTO admin_audit_logs (admin_id, admin_username, action, target_type, target_id, details, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $adminId,
            $adminUsername,
            $action,
            $targetType,
            $targetId ? (string)$targetId : null,
            $detailsStr,
            $ip
        ]);
        return true;
    } catch (Exception $e) {
        error_log("Failed to write admin audit log: " . $e->getMessage());
        return false;
    }
}

/**
 * Returns associative map of all system settings.
 */
function getSystemSettingsMap($db = null) {
    if (!$db) {
        $db = getDB();
    }
    try {
        $rows = $db->query("SELECT setting_key, setting_value FROM system_settings")->fetchAll(PDO::FETCH_ASSOC);
        $map = [];
        foreach ($rows as $r) {
            $map[$r['setting_key']] = $r['setting_value'];
        }
        return $map;
    } catch (Exception $e) {
        return [];
    }
}
