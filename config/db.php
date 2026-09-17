<?php
/**
 * Database Configuration & PDO Helper
 * Configured for XAMPP / MySQL
 */

// Load environment variables if available
require_once __DIR__ . '/env.php';

// Start session with secure parameters if not started
if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
               (!empty($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) ||
               filter_var(getenv('SESSION_SECURE_COOKIE'), FILTER_VALIDATE_BOOLEAN);

    session_set_cookie_params([
        'lifetime' => 86400 * 30, // 30 days
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DB_NAME', getenv('DB_NAME') ?: 'naija_draughts');

/**
 * Returns a PDO instance connected to the MySQL database.
 * Automatically creates the database and initializes schema if missing.
 */
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_PORT, DB_NAME);
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Auto-heal: If database does not exist, create it and import schema
            if ($e->getCode() == 1049 || strpos($e->getMessage(), 'Unknown database') !== false) {
                $serverDsn = sprintf('mysql:host=%s;port=%s;charset=utf8mb4', DB_HOST, DB_PORT);
                $serverPdo = new PDO($serverDsn, DB_USER, DB_PASS, $options);
                $serverPdo->exec("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

                $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
                $schemaFile = __DIR__ . '/../database/schema.sql';
                if (file_exists($schemaFile)) {
                    $sql = file_get_contents($schemaFile);
                    $pdo->exec($sql);
                }
            } else {
                throw $e;
            }
        }
    }
    return $pdo;
}

/**
 * Sends a standardized JSON HTTP response and exits.
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

/**
 * Helper to get currently logged in user from session or null.
 */
function getCurrentUser() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : null;
}
