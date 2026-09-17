<?php
/**
 * Naija Draughts - Production Health Check & Diagnostics Tool
 * Run via CLI: php health_check.php
 * Or via Web: https://yourdomain.com/health_check.php?key=YourSecretMaintenanceTokenHere123!
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/payment.php';
require_once __DIR__ . '/config/mail.php';

$isCli = (php_sapi_name() === 'cli');

// If accessed via web, verify secret key or prevent public leak
if (!$isCli) {
    $expectedKey = getenv('MAINTENANCE_KEY') ?: '';
    $providedKey = $_GET['key'] ?? '';
    if (!empty($expectedKey) && $providedKey !== $expectedKey) {
        http_response_code(403);
        die("403 Forbidden: Provide valid ?key=MAINTENANCE_KEY to run diagnostics.");
    }
}

$results = [];
$allHealthy = true;

function checkItem($title, $status, $details, $critical = true) {
    global $results, $allHealthy;
    $results[] = [
        'title' => $title,
        'status' => $status,
        'details' => $details,
        'critical' => $critical
    ];
    if (!$status && $critical) {
        $allHealthy = false;
    }
}

// 1. PHP Version Check
$phpVersion = PHP_VERSION;
$phpOk = version_compare($phpVersion, '7.4.0', '>=');
checkItem('PHP Version', $phpOk, "Current: {$phpVersion} (Minimum: 7.4, Recommended: 8.1+)", true);

// 2. Extensions Check
$requiredExts = ['pdo', 'pdo_mysql', 'curl', 'json', 'mbstring', 'openssl'];
$missingExts = [];
foreach ($requiredExts as $ext) {
    if (!extension_loaded($ext)) {
        $missingExts[] = $ext;
    }
}
checkItem('Required PHP Extensions', empty($missingExts), empty($missingExts) ? "All loaded: " . implode(', ', $requiredExts) : "Missing: " . implode(', ', $missingExts), true);

// 3. Database Connectivity
$dbOk = false;
$dbDetails = '';
$tableCount = 0;
try {
    $db = getDB();
    $dbOk = true;
    $tables = $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $tableCount = count($tables);
    $dbDetails = "Connected to MySQL database '" . DB_NAME . "' with {$tableCount} table(s).";
} catch (Exception $e) {
    $dbDetails = "Connection failed: " . $e->getMessage();
}
checkItem('Database Connection', $dbOk && $tableCount >= 8, $dbDetails, true);

// 4. File Write Permissions
$uploadDirs = [
    __DIR__ . '/uploads',
    __DIR__ . '/uploads/mail_logs',
    __DIR__ . '/uploads/avatars'
];
$writableOk = true;
$writableMsg = [];
foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    if (is_writable($dir)) {
        $writableMsg[] = basename($dir) . ': OK';
    } else {
        $writableOk = false;
        $writableMsg[] = basename($dir) . ': NOT WRITABLE';
    }
}
checkItem('Storage Write Permissions', $writableOk, implode(' | ', $writableMsg), false);

// 5. Environment Secrets (.env)
$envFile = __DIR__ . '/.env';
$hasEnv = file_exists($envFile);
$appEnv = getenv('APP_ENV') ?: ($hasEnv ? 'loaded' : 'default/dev');
checkItem('Environment File (.env)', $hasEnv, $hasEnv ? "File present. APP_ENV: {$appEnv}" : "No .env found (running on fallback defaults)", false);

// 6. Payment Gateway Configuration
$paystackSecret = getenv('PAYSTACK_SECRET_KEY');
$payDevMode = PAYMENT_DEV_MODE;
$payStatusMsg = $payDevMode 
    ? "Dev Simulation Mode Active (Local Testing)" 
    : (!empty($paystackSecret) ? "Live Paystack Key Configured" : "Warning: No Paystack key provided");
checkItem('Payment Gateway Status', true, $payStatusMsg, false);

// 7. Mail & SMTP Configuration
$smtpEnabled = MAIL_SMTP_ENABLED;
$mailDevMode = MAIL_DEV_MODE;
$mailMsg = $mailDevMode
    ? "Mail Dev Mode Active (logging to uploads/mail_logs/)"
    : ($smtpEnabled ? "SMTP Enabled (Host: " . MAIL_SMTP_HOST . ")" : "PHP mail() Fallback");
checkItem('Mailer Configuration', true, $mailMsg, false);

// Output Formatting
if ($isCli) {
    echo "========================================================\n";
    echo "  NAIJA DRAUGHTS - SYSTEM HEALTH & READINESS AUDIT\n";
    echo "========================================================\n\n";

    foreach ($results as $r) {
        $icon = $r['status'] ? "[✓ PASS]" : ($r['critical'] ? "[✗ FAIL]" : "[! WARN]");
        echo sprintf("%-10s %-28s %s\n", $icon, $r['title'], $r['details']);
    }

    echo "\n========================================================\n";
    if ($allHealthy) {
        echo "🎉 ALL CRITICAL CHECKS PASSED: PLATFORM READY!\n";
        echo "========================================================\n";
        exit(0);
    } else {
        echo "⚠️ CRITICAL CHECKS FAILED. Review errors above.\n";
        echo "========================================================\n";
        exit(1);
    }
} else {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'healthy' => $allHealthy,
        'timestamp' => date('Y-m-d H:i:s'),
        'diagnostics' => $results
    ], JSON_PRETTY_PRINT);
    exit;
}
