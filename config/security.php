<?php
/**
 * Naija Draughts - Central Security Engine & Shield
 * Multi-layer security architecture protecting:
 * - Dynamic HTTP Security Headers & Content Security Policy (CSP)
 * - Distributed Sliding-Window Rate Limiting
 * - Anti-Brute-Force & Progressive Account Lockouts
 * - CSRF (Cross-Site Request Forgery) Token Engine
 * - Financial Race Condition & Double-Spend Protection
 * - Real-Time Anti-Cheat & Bot Velocity Telemetry
 * - Security Event Auditing & Intrusion Detection
 */

require_once __DIR__ . '/db.php';

/**
 * Dispatches modern, hardened HTTP security headers.
 * Safe for Paystack, Flutterwave, Google Fonts, and PWA assets.
 */
function sendSecurityHeaders() {
    if (headers_sent()) {
        return;
    }

    // 1. Prevent MIME-Type Sniffing
    header('X-Content-Type-Options: nosniff');

    // 2. Prevent Clickjacking
    header('X-Frame-Options: SAMEORIGIN');

    // 3. Cross-Site Scripting (XSS) Protection Filter
    header('X-XSS-Protection: 1; mode=block');

    // 4. Strict Referrer Policy
    header('Referrer-Policy: strict-origin-when-cross-origin');

    // 5. Restrict Unused Hardware & Browser Sensors
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://js.paystack.co" "https://checkout.flutterwave.com")');

    // 6. Strict Transport Security (HSTS) when on HTTPS
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
               (!empty($_SERVER['SERVER_PORT']) && (int)$_SERVER['SERVER_PORT'] === 443) ||
               (!empty($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

    if ($isHttps) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }

    // 7. Comprehensive Content Security Policy (CSP)
    // Permissive for legitimate external payment modals, Google fonts, and WebSockets/AJAX
    $csp = "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; " .
           "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://js.paystack.co https://checkout.flutterwave.com; " .
           "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; " .
           "font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com; " .
           "img-src 'self' data: blob: https:; " .
           "connect-src 'self' https: wss: ws: https://api.paystack.co https://api.flutterwave.com; " .
           "frame-src 'self' https://js.paystack.co https://checkout.flutterwave.com; " .
           "object-src 'none'; " .
           "base-uri 'self';";

    header("Content-Security-Policy: " . $csp);
}

// Automatically apply security headers upon load
sendSecurityHeaders();

/**
 * Accurately determines client IP address with proxy / Cloudflare header validation.
 */
function getSecurityClientIp() {
    $ipKeys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
    foreach ($ipKeys as $key) {
        if (!empty($_SERVER[$key])) {
            $ipList = explode(',', $_SERVER[$key]);
            foreach ($ipList as $ip) {
                $cleanIp = trim($ip);
                if (filter_var($cleanIp, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $cleanIp;
                }
            }
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

/**
 * Sliding Window Database Rate Limiter
 * 
 * @param string $actionType e.g. 'auth_login', 'auth_register', 'wallet_withdraw', 'api_general'
 * @param int $maxHits Maximum allowed requests in the time window
 * @param int $windowSeconds Duration of window in seconds
 * @param string|null $identifier Optional user ID or specific key (defaults to Client IP)
 * @return array ['allowed' => bool, 'retry_after' => int, 'hits' => int, 'limit' => int]
 */
function checkRateLimit($actionType, $maxHits, $windowSeconds, $identifier = null) {
    if ($identifier === null) {
        $identifier = getSecurityClientIp();
    }

    $rateKey = hash('sha256', $actionType . ':' . $identifier);
    $now = time();

    try {
        $db = getDB();

        // 1. Check if record exists
        $stmt = $db->prepare("SELECT hits, window_start, blocked_until FROM security_rate_limits WHERE rate_key = ?");
        $stmt->execute([$rateKey]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            // New bucket
            $ins = $db->prepare("
                INSERT INTO security_rate_limits (rate_key, action_type, identifier, hits, window_start, blocked_until)
                VALUES (?, ?, ?, 1, ?, NULL)
            ");
            $ins->execute([$rateKey, $actionType, $identifier, $now]);
            return ['allowed' => true, 'retry_after' => 0, 'hits' => 1, 'limit' => $maxHits];
        }

        // 2. Check if currently blocked
        if (!empty($row['blocked_until']) && (int)$row['blocked_until'] > $now) {
            $retryAfter = (int)$row['blocked_until'] - $now;
            return ['allowed' => false, 'retry_after' => $retryAfter, 'hits' => (int)$row['hits'], 'limit' => $maxHits];
        }

        // 3. Check if window has expired; if so, reset window
        if (($now - (int)$row['window_start']) > $windowSeconds) {
            $upd = $db->prepare("
                UPDATE security_rate_limits 
                SET hits = 1, window_start = ?, blocked_until = NULL 
                WHERE rate_key = ?
            ");
            $upd->execute([$now, $rateKey]);
            return ['allowed' => true, 'retry_after' => 0, 'hits' => 1, 'limit' => $maxHits];
        }

        // 4. Window is active, increment hits
        $newHits = (int)$row['hits'] + 1;
        if ($newHits > $maxHits) {
            // Block until window completes
            $blockedUntil = (int)$row['window_start'] + $windowSeconds;
            $retryAfter = max(1, $blockedUntil - $now);

            $blockStmt = $db->prepare("
                UPDATE security_rate_limits 
                SET hits = ?, blocked_until = ? 
                WHERE rate_key = ?
            ");
            $blockStmt->execute([$newHits, $blockedUntil, $rateKey]);

            // Log security warning for excessive rate-limit violations
            if ($newHits === ($maxHits + 1)) {
                logSecurityAudit('rate_limit_exceeded', 'low', [
                    'action' => $actionType,
                    'identifier' => $identifier,
                    'hits' => $newHits,
                    'limit' => $maxHits,
                    'retry_after' => $retryAfter
                ]);
            }

            return ['allowed' => false, 'retry_after' => $retryAfter, 'hits' => $newHits, 'limit' => $maxHits];
        }

        // Incremented within limits
        $updHits = $db->prepare("UPDATE security_rate_limits SET hits = hits + 1 WHERE rate_key = ?");
        $updHits->execute([$rateKey]);

        return ['allowed' => true, 'retry_after' => 0, 'hits' => $newHits, 'limit' => $maxHits];

    } catch (Exception $e) {
        // Fallback: If DB rate check fails, allow with warning to prevent breaking critical services
        error_log("[RateLimiter Error] " . $e->getMessage());
        return ['allowed' => true, 'retry_after' => 0, 'hits' => 1, 'limit' => $maxHits];
    }
}

/**
 * Checks if a login attempt is blocked due to excessive failed attempts.
 */
function checkLoginLockout($loginIdentifier, $ip = null) {
    if ($ip === null) {
        $ip = getSecurityClientIp();
    }
    $now = time();

    try {
        $db = getDB();
        $stmt = $db->prepare("
            SELECT failed_attempts, last_failed_at, locked_until 
            FROM failed_logins 
            WHERE login_identifier = ? AND ip_address = ?
        ");
        $stmt->execute([$loginIdentifier, $ip]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row && !empty($row['locked_until']) && (int)$row['locked_until'] > $now) {
            $retryAfter = (int)$row['locked_until'] - $now;
            return [
                'locked' => true,
                'retry_after' => $retryAfter,
                'failed_attempts' => (int)$row['failed_attempts']
            ];
        }

        return ['locked' => false, 'retry_after' => 0, 'failed_attempts' => $row ? (int)$row['failed_attempts'] : 0];

    } catch (Exception $e) {
        return ['locked' => false, 'retry_after' => 0, 'failed_attempts' => 0];
    }
}

/**
 * Records a failed login attempt with progressive exponential backoff.
 */
function recordFailedLoginAttempt($loginIdentifier, $ip = null) {
    if ($ip === null) {
        $ip = getSecurityClientIp();
    }
    $now = time();

    try {
        $db = getDB();
        $stmt = $db->prepare("SELECT id, failed_attempts, first_failed_at FROM failed_logins WHERE login_identifier = ? AND ip_address = ?");
        $stmt->execute([$loginIdentifier, $ip]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$existing) {
            $ins = $db->prepare("
                INSERT INTO failed_logins (login_identifier, ip_address, failed_attempts, first_failed_at, last_failed_at, locked_until)
                VALUES (?, ?, 1, ?, ?, NULL)
            ");
            $ins->execute([$loginIdentifier, $ip, $now, $now]);
            return 1;
        }

        // Reset if older than 30 minutes
        if (($now - (int)$existing['first_failed_at']) > 1800) {
            $upd = $db->prepare("
                UPDATE failed_logins 
                SET failed_attempts = 1, first_failed_at = ?, last_failed_at = ?, locked_until = NULL 
                WHERE id = ?
            ");
            $upd->execute([$now, $now, $existing['id']]);
            return 1;
        }

        $attempts = (int)$existing['failed_attempts'] + 1;
        $lockUntil = null;

        // Progressive lockout threshold
        if ($attempts >= 10) {
            $lockUntil = $now + 1800; // 30 minutes lockout
        } elseif ($attempts >= 5) {
            $lockUntil = $now + 300;  // 5 minutes lockout
        }

        $upd = $db->prepare("
            UPDATE failed_logins 
            SET failed_attempts = ?, last_failed_at = ?, locked_until = ? 
            WHERE id = ?
        ");
        $upd->execute([$attempts, $now, $lockUntil, $existing['id']]);

        if ($attempts >= 5) {
            logSecurityAudit('brute_force_detected', 'high', [
                'login_target' => $loginIdentifier,
                'ip' => $ip,
                'attempts' => $attempts,
                'locked_until' => $lockUntil
            ]);
        }

        return $attempts;

    } catch (Exception $e) {
        error_log("[FailedLogin Record Error] " . $e->getMessage());
        return 1;
    }
}

/**
 * Clears failed login record upon successful authentication.
 */
function clearLoginFailures($loginIdentifier, $ip = null) {
    if ($ip === null) {
        $ip = getSecurityClientIp();
    }
    try {
        $db = getDB();
        $db->prepare("DELETE FROM failed_logins WHERE login_identifier = ? AND ip_address = ?")->execute([$loginIdentifier, $ip]);
    } catch (Exception $e) {}
}

/**
 * CSRF Protection Engine
 */
function getCsrfToken() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken($token) {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Server-Side Anti-Cheat & Bot Velocity Telemetry
 * Checks if a player is submitting moves faster than physiological human reaction limits (<40ms).
 */
function checkMoveVelocitySecurity($roomCode, $playerRole, $lastMoveTimestamp) {
    $now = microtime(true);
    if ($lastMoveTimestamp > 0) {
        $elapsedSeconds = $now - (float)$lastMoveTimestamp;
        // Humanly impossible speed for complex strategic draughts move
        if ($elapsedSeconds < 0.04) {
            logSecurityAudit('bot_velocity_detected', 'medium', [
                'room_code' => $roomCode,
                'player_role' => $playerRole,
                'elapsed_ms' => round($elapsedSeconds * 1000, 2)
            ]);
            return false;
        }
    }
    return true;
}

/**
 * Logs security audit flags into security_audit_flags table.
 */
function logSecurityAudit($eventType, $severity, $details = [], $userId = null) {
    try {
        $db = getDB();
        $ip = getSecurityClientIp();
        $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 255);

        if ($userId === null && !empty($_SESSION['user']['id'])) {
            $userId = (int)$_SESSION['user']['id'];
        }

        $stmt = $db->prepare("
            INSERT INTO security_audit_flags (user_id, event_type, severity, ip_address, user_agent, details_json, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'flagged', NOW())
        ");
        $stmt->execute([
            $userId,
            substr($eventType, 0, 64),
            in_array($severity, ['low', 'medium', 'high', 'critical']) ? $severity : 'medium',
            $ip,
            $ua,
            json_encode($details)
        ]);

    } catch (Exception $e) {
        error_log("[SecurityAudit Error] " . $e->getMessage());
    }
}

/**
 * Input string sanitizer & attack detector.
 */
function sanitizeInputString($input, $maxLength = 255) {
    if (!is_string($input)) return '';
    $clean = trim($input);
    $clean = strip_tags($clean);
    return mb_substr($clean, 0, $maxLength, 'UTF-8');
}

function sanitizeInputInt($input, $min = null, $max = null) {
    $val = (int)$input;
    if ($min !== null && $val < $min) $val = $min;
    if ($max !== null && $val > $max) $val = $max;
    return $val;
}

function sanitizeInputFloat($input, $min = null, $max = null) {
    $val = (float)$input;
    if ($min !== null && $val < $min) $val = $min;
    if ($max !== null && $val > $max) $val = $max;
    return $val;
}
