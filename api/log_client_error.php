<?php
/**
 * Naija Draughts - Frontend Error Logger Endpoint
 * Receives uncaught browser errors and records them for admin diagnostic oversight.
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/error_handler.php';

header('Content-Type: application/json; charset=utf-8');

// Ensure session is started if available
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: $_POST;

$message = trim($input['message'] ?? 'Unknown client error');
if (empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Empty error message']);
    exit;
}

$source = trim($input['source'] ?? ($input['file'] ?? ''));
$lineno = isset($input['lineno']) ? (int)$input['lineno'] : (isset($input['line']) ? (int)$input['line'] : null);
$stack = trim($input['stack'] ?? '');
$url = trim($input['url'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));

$context = [
    'user_id' => $_SESSION['user']['id'] ?? null,
    'username' => $_SESSION['user']['username'] ?? 'Anonymous Guest',
    'url' => $url,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
];

$reportId = logSystemError(
    'warning',
    'frontend_js',
    $message,
    $source,
    $lineno,
    $stack,
    $context
);

echo json_encode([
    'success' => (bool)$reportId,
    'report_id' => $reportId
]);
