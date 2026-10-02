<?php
/**
 * Intelligent Error Diagnostics & System Error Handler
 * Automatically captures system errors and provides actionable diagnostic solutions.
 */

require_once __DIR__ . '/db.php';

/**
 * Intelligent solution analyzer: matches errors against known failure patterns
 * and generates actionable, step-by-step remediation instructions for administrators.
 */
function suggestErrorSolution($message, $category = 'general', $file = '', $line = 0) {
    $msg = strtolower($message);
    $cat = strtolower($category);

    // 1. DATABASE & MYSQL FAILURES
    if ($cat === 'database' || strpos($msg, 'sql') !== false || strpos($msg, 'pdo') !== false || strpos($msg, 'mysql') !== false) {
        if (strpos($msg, 'access denied for user') !== false) {
            return "Database Authentication Failure: Check DB_USER and DB_PASS in your environment (.env) or config/db.php. Ensure the MySQL user exists and has GRANT ALL privileges on 'naija_draughts'.";
        }
        if (strpos($msg, 'connection refused') !== false || strpos($msg, 'no connection could be made') !== false) {
            return "MySQL Service Offline: The MySQL / MariaDB server is unreachable on port 3306. Check if mysqld service is running in XAMPP or systemctl status mariadb.";
        }
        if (strpos($msg, "table '") !== false && strpos($msg, "doesn't exist") !== false) {
            return "Missing Database Table: A required database table is missing. Run the migration script in database/ or execute database/schema.sql to initialize missing tables.";
        }
        if (strpos($msg, 'duplicate entry') !== false) {
            return "Unique Constraint Violation: A unique key collision occurred (e.g. duplicate username, email, transaction reference, or room code). Ensure transaction references and unique codes are generated using random_bytes().";
        }
        if (strpos($msg, 'lock wait timeout') !== false || strpos($msg, 'deadlock') !== false) {
            return "Database Lock / Concurrency Contention: Two concurrent transactions locked the same user wallet or game room. Ensure transactions are kept short and use SELECT ... FOR UPDATE consistently.";
        }
        return "Database Query Error: Inspect the SQL statement in {$file} on line {$line}. Check column data types and ensure parameters are safely bound via PDO prepared statements.";
    }

    // 2. PAYMENT GATEWAY & FINANCIALS
    if ($cat === 'payment' || strpos($msg, 'paystack') !== false || strpos($msg, 'flutterwave') !== false || strpos($msg, 'webhook') !== false) {
        if (strpos($msg, 'unauthorized') !== false || strpos($msg, 'invalid key') !== false || strpos($msg, 'secret key') !== false) {
            return "Payment Gateway API Key Error: Your Secret Key is invalid or expired. Check PAYSTACK_SECRET_KEY or FLUTTERWAVE_SECRET_KEY in your .env or cPanel environment.";
        }
        if (strpos($msg, 'timeout') !== false || strpos($msg, 'could not resolve host') !== false || strpos($msg, 'curl error') !== false) {
            return "Network Timeout to Payment API: Server failed to connect to Paystack/Flutterwave API. Check outbound internet connectivity, firewall port 443, or DNS settings on the hosting server.";
        }
        if (strpos($msg, 'hash') !== false || strpos($msg, 'signature') !== false) {
            return "Webhook Signature Mismatch: The webhook header signature does not match your secret hash. Update your webhook secret in your Flutterwave/Paystack merchant portal.";
        }
        return "Payment Processing Error: Review payment gateway logs and transaction reference. If testing locally, ensure PAYMENT_DEV_MODE is enabled in config/payment.php.";
    }

    // 3. WALLET & WITHDRAWALS
    if ($cat === 'wallet' || strpos($msg, 'withdraw') !== false || strpos($msg, 'balance') !== false) {
        if (strpos($msg, 'insufficient') !== false) {
            return "Insufficient Player Balance: Normal business logic catch. Player attempted to wager or withdraw more funds than their available balance. No server repair required.";
        }
        if (strpos($msg, 'account number') !== false || strpos($msg, 'nuban') !== false) {
            return "Invalid Bank Account Details: Player entered an invalid 10-digit NUBAN account number. Advise player to double-check their bank account details.";
        }
        return "Wallet Transaction Discrepancy: Check wallet_transactions table for recent entries belonging to this user to audit credit/debit integrity.";
    }

    // 4. GAME ENGINE & ROOM MATCHMAKING
    if ($cat === 'gameplay' || strpos($msg, 'room') !== false || strpos($msg, 'move') !== false || strpos($msg, 'draughts') !== false) {
        if (strpos($msg, 'not your turn') !== false) {
            return "Turn Desynchronization: Player client sent a move when it was opponent's turn. Usually caused by temporary packet lag or network jitter. The client will self-correct on next room poll.";
        }
        if (strpos($msg, 'room not found') !== false) {
            return "Expired or Closed Room: Player tried to interact with a room that was cancelled, closed, or never created. Redirect player to the active lobby.";
        }
        return "Game Room State Warning: Verify that the room record exists in game_rooms and check move_history_json for valid notation.";
    }

    // 5. AUTHENTICATION & SESSIONS
    if ($cat === 'auth' || strpos($msg, 'session') !== false || strpos($msg, 'unauthorized') !== false || strpos($msg, 'login') !== false) {
        if (strpos($msg, 'session') !== false) {
            return "Expired Player Session: Player's 30-day session expired or cookies were cleared. Advise user to log back in. Ensure session.cookie_secure and path are configured in config/db.php.";
        }
        return "Authentication Rejection: Unauthenticated API request. The client must be logged in with a valid session cookie to access protected endpoints.";
    }

    // 6. FRONTEND JAVASCRIPT & CLIENT ASSETS
    if ($cat === 'frontend_js' || strpos($msg, 'uncaught') !== false || strpos($msg, 'typeerror') !== false) {
        return "Client-Side Browser Error: Check client browser version. Clear browser cache or update service worker cache version in sw.js to ensure users load the latest bundle.";
    }

    // 7. GENERAL / UNHANDLED
    return "Diagnostic Advice: Review the stack trace and context parameters below. If this occurred after a recent deployment, verify file permissions (644 for files, 755 for directories) and ensure PHP 8.1+ extensions (pdo_mysql, curl, mbstring) are active.";
}

/**
 * Centrally logs any system error, exception, or anomaly into the database.
 * Supports intelligent deduplication: identical active unresolved errors increment occurrence_count.
 */
function logSystemError($errorLevel, $category, $message, $file = null, $line = null, $stackTrace = null, $context = []) {
    try {
        $db = getDB();

        // Refine context with active request info if running in web context
        if (empty($context)) {
            $context = [
                'user_id' => $_SESSION['user']['id'] ?? null,
                'username' => $_SESSION['user']['username'] ?? 'Guest',
                'url' => $_SERVER['REQUEST_URI'] ?? 'CLI',
                'method' => $_SERVER['REQUEST_METHOD'] ?? 'CLI',
                'ip' => $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
            ];
        }

        $cleanFile = $file ? substr($file, 0, 255) : null;
        $cleanLine = $line ? (int)$line : null;

        // Check for identical active unresolved error in the last 24 hours to deduplicate
        $dupStmt = $db->prepare("
            SELECT id, occurrence_count 
            FROM system_error_reports 
            WHERE message = ? AND file <=> ? AND line <=> ? AND status = 'unresolved'
            ORDER BY id DESC LIMIT 1
        ");
        $dupStmt->execute([$message, $cleanFile, $cleanLine]);
        $existing = $dupStmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            $updateStmt = $db->prepare("
                UPDATE system_error_reports 
                SET occurrence_count = occurrence_count + 1,
                    last_seen_at = NOW(),
                    context_json = ?
                WHERE id = ?
            ");
            $updateStmt->execute([json_encode($context), (int)$existing['id']]);
            return (int)$existing['id'];
        }

        $suggestedSolution = suggestErrorSolution($message, $category, $file, (int)$line);

        $stmt = $db->prepare("
            INSERT INTO system_error_reports 
            (error_level, category, message, file, line, stack_trace, context_json, suggested_solution, status, occurrence_count, last_seen_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'unresolved', 1, NOW())
        ");

        $stmt->execute([
            substr($errorLevel, 0, 20),
            substr($category, 0, 50),
            $message,
            $cleanFile,
            $cleanLine,
            $stackTrace,
            json_encode($context),
            $suggestedSolution
        ]);

        return (int)$db->lastInsertId();

    } catch (Throwable $e) {
        // Fallback to error_log if database is temporarily down
        error_log("[NaijaDraughts Error Logger Failed] " . $e->getMessage() . " | Original Error: " . $message);
        return false;
    }
}

/**
 * Registers global unhandled PHP exception and fatal error hooks.
 */
function registerGlobalErrorMonitoring() {
    static $registered = false;
    if ($registered) return;
    $registered = true;

    // Unhandled Exceptions
    set_exception_handler(function (Throwable $e) {
        logSystemError(
            'fatal',
            'unhandled_exception',
            $e->getMessage(),
            $e->getFile(),
            $e->getLine(),
            $e->getTraceAsString()
        );
    });

    // Recoverable Engine Errors
    set_error_handler(function ($errno, $errstr, $errfile, $errline) {
        if ($errno & (E_USER_ERROR | E_RECOVERABLE_ERROR)) {
            logSystemError('error', 'php_engine', $errstr, $errfile, $errline);
        }
        return false;
    });

    // Fatal Errors on script termination
    register_shutdown_function(function () {
        $error = error_get_last();
        if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
            logSystemError(
                'fatal',
                'php_fatal',
                $error['message'],
                $error['file'],
                $error['line'],
                'Fatal termination on shutdown'
            );
        }
    });
}
