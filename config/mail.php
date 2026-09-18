<?php
/**
 * Naija Draughts - Central Mail Configuration & Mailer Engine
 * Supports SMTP (with STARTTLS/SSL), PHP mail(), and Local Dev Mail Logging.
 */

// Load environment variables if available
require_once __DIR__ . '/env.php';

// Configuration Options (can be overridden via environment variables)
define('MAIL_SMTP_ENABLED', filter_var(getenv('SMTP_ENABLED') ?: false, FILTER_VALIDATE_BOOLEAN));
define('MAIL_SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('MAIL_SMTP_PORT', (int)(getenv('SMTP_PORT') ?: 587));
define('MAIL_SMTP_USER', getenv('SMTP_USER') ?: '');
define('MAIL_SMTP_PASS', getenv('SMTP_PASS') ?: '');
define('MAIL_SMTP_SECURE', getenv('SMTP_SECURE') ?: 'tls'); // 'tls', 'ssl', or 'none'

$detectedHost = !empty($_SERVER['HTTP_HOST']) ? preg_replace('/^www\./i', '', $_SERVER['HTTP_HOST']) : 'solaraccompany.com';
define('MAIL_FROM_EMAIL', getenv('MAIL_FROM') ?: ('no-reply@' . $detectedHost));
define('MAIL_FROM_NAME', getenv('MAIL_FROM_NAME') ?: 'Naija Draughts Arena');

// Auto-detect Dev Mode on localhost / offline environments
$isLocal = (!empty($_SERVER['HTTP_HOST']) && (
    strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
    strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false
)) || php_sapi_name() === 'cli';

define('MAIL_DEV_MODE', getenv('MAIL_DEV_MODE') !== false ? filter_var(getenv('MAIL_DEV_MODE'), FILTER_VALIDATE_BOOLEAN) : $isLocal);

/**
 * Automatically determine application base URL for links in emails.
 */
function getAppBaseUrl() {
    if (!empty(getenv('APP_URL'))) {
        return rtrim(getenv('APP_URL'), '/') . '/';
    }
    if (!empty($_SERVER['HTTP_HOST'])) {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
        $host = $_SERVER['HTTP_HOST'];
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        // Find base path up to /api/ or root
        $path = preg_replace('#/(api|database|scripts)/.*$#i', '', $uri);
        $path = rtrim($path, '/') . '/';
        return $protocol . $host . $path;
    }
    return 'http://localhost/nigerian-draughts/';
}

/**
 * Socket-based SMTP transport helper.
 */
function sendSmtpMail($to, $subject, $htmlBody, $textBody = '') {
    $host = MAIL_SMTP_HOST;
    $port = MAIL_SMTP_PORT;
    $user = MAIL_SMTP_USER;
    $pass = MAIL_SMTP_PASS;
    $secure = strtolower(MAIL_SMTP_SECURE);

    $socketHost = ($secure === 'ssl') ? 'ssl://' . $host : $host;
    $timeout = 10;
    $errno = 0;
    $errstr = '';

    $socket = @fsockopen($socketHost, $port, $errno, $errstr, $timeout);
    if (!$socket) {
        throw new Exception("Could not connect to SMTP server {$host}:{$port} - {$errstr} ({$errno})");
    }

    $read = function() use ($socket) {
        $res = '';
        while ($line = fgets($socket, 512)) {
            $res .= $line;
            if (substr($line, 3, 1) === ' ') break;
        }
        return $res;
    };

    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $expect = function($code) use ($read) {
        $res = $read();
        if (substr($res, 0, 3) != $code) {
            throw new Exception("SMTP Error: expected {$code}, got: {$res}");
        }
        return $res;
    };

    $expect('220');

    $clientHost = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
    $write("EHLO " . $clientHost);
    $expect('250');

    if ($secure === 'tls') {
        $write("STARTTLS");
        $expect('220');
        if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            throw new Exception("Failed to establish TLS encryption with SMTP server");
        }
        $write("EHLO " . $clientHost);
        $expect('250');
    }

    if (!empty($user) && !empty($pass)) {
        $write("AUTH LOGIN");
        $expect('334');
        $write(base64_encode($user));
        $expect('334');
        $write(base64_encode($pass));
        $expect('235');
    }

    $write("MAIL FROM: <" . MAIL_FROM_EMAIL . ">");
    $expect('250');

    $write("RCPT TO: <" . $to . ">");
    $expect('250');

    $write("DATA");
    $expect('354');

    $boundary = '=_naija_' . md5(uniqid(time()));
    $headers  = "From: =?UTF-8?B?" . base64_encode(MAIL_FROM_NAME) . "?= <" . MAIL_FROM_EMAIL . ">\r\n";
    $headers .= "To: <" . $to . ">\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
    $headers .= "Date: " . date('r') . "\r\n";

    $data  = $headers . "\r\n";
    if (!empty($textBody)) {
        $data .= "--{$boundary}\r\n";
        $data .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $data .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
        $data .= $textBody . "\r\n\r\n";
    }
    $data .= "--{$boundary}\r\n";
    $data .= "Content-Type: text/html; charset=UTF-8\r\n";
    $data .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
    $data .= $htmlBody . "\r\n\r\n";
    $data .= "--{$boundary}--\r\n";
    $data .= ".";

    $write($data);
    $expect('250');

    $write("QUIT");
    fclose($socket);

    return true;
}

/**
 * Logs email to uploads/mail_logs for local inspection and offline testing.
 */
function logEmailToDisk($to, $subject, $htmlBody, $meta = []) {
    $logDir = __DIR__ . '/../uploads/mail_logs';
    if (!is_dir($logDir)) {
        @mkdir($logDir, 0777, true);
    }

    $cleanEmail = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $to);
    $filename = date('Ymd_His') . '_' . $cleanEmail . '.html';
    $filepath = $logDir . '/' . $filename;

    $metaBlock = "<!--\nMAIL LOG ENTRY\nDate: " . date('Y-m-d H:i:s') . "\nTo: {$to}\nSubject: {$subject}\n";
    foreach ($meta as $k => $v) {
        $metaBlock .= "{$k}: {$v}\n";
    }
    $metaBlock .= "-->\n";

    @file_put_contents($filepath, $metaBlock . $htmlBody);
    return $filepath;
}

/**
 * Master email sending function.
 */
function sendEmail($to, $subject, $htmlBody, $textBody = '', $meta = []) {
    // Always log to disk for dev inspection
    $logFile = logEmailToDisk($to, $subject, $htmlBody, $meta);

    $sent = false;
    $error = null;

    if (MAIL_SMTP_ENABLED && !empty(MAIL_SMTP_HOST)) {
        try {
            $sent = sendSmtpMail($to, $subject, $htmlBody, $textBody);
        } catch (Exception $e) {
            $error = $e->getMessage();
            error_log("SMTP Dispatch Failed: " . $error);
        }
    }

    // Fallback to PHP native mail() if SMTP was not used or failed
    if (!$sent && function_exists('mail')) {
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM_EMAIL . ">\r\n";
        $headers .= "Reply-To: " . MAIL_FROM_EMAIL . "\r\n";
        $headers .= "X-Mailer: NaijaDraughtsEngine/1.0\r\n";

        // Suppress warning if local sendmail is unconfigured; use -f for SPF alignment
        $additionalParams = "-f " . escapeshellarg(MAIL_FROM_EMAIL);
        $sent = @mail($to, $subject, $htmlBody, $headers, $additionalParams);
        if (!$sent) {
            $sent = @mail($to, $subject, $htmlBody, $headers);
        }
    }

    // In dev mode, treat disk-logged email as successful
    if (MAIL_DEV_MODE && !$sent) {
        $sent = true;
    }

    return [
        'success' => $sent,
        'log_file' => $logFile,
        'error' => $error,
        'dev_mode' => MAIL_DEV_MODE
    ];
}

/**
 * Generates and sends an authentic, branded Naija Draughts verification email.
 */
function sendVerificationEmail($user, $token, $otp) {
    $baseUrl = getAppBaseUrl();
    $verifyUrl = $baseUrl . 'verify_email.php?token=' . urlencode($token);
    $username = htmlspecialchars($user['username'] ?? 'Champion');
    $email = htmlspecialchars($user['email']);

    $subject = "👑 Verify Your Naija Draughts Account - Code: {$otp}";

    $textBody = "Hello {$username}!\n\n"
        . "Welcome to Naija Draughts Arena. To verify your email and activate your champion profile, please use the 6-digit verification code below:\n\n"
        . "VERIFICATION CODE: {$otp}\n\n"
        . "Or click this link to verify instantly:\n"
        . "{$verifyUrl}\n\n"
        . "This code expires in 24 hours.\n\n"
        . "Naija Draughts Team - Zero Cheating, Respectful Street Play";

    $htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b1120;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f8fafc;
    }
    .wrapper {
      max-width: 600px;
      margin: 30px auto;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(245, 158, 11, 0.15);
    }
    .header {
      background: linear-gradient(135deg, #15803d 0%, #047857 50%, #064e3b 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 2px solid #f59e0b;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: rgba(0, 0, 0, 0.3);
      border: 2px solid #f59e0b;
      border-radius: 50%;
      font-size: 28px;
      margin-bottom: 12px;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    .header p {
      margin: 6px 0 0;
      font-size: 14px;
      color: #d1fae5;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 36px 28px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 700;
      color: #fbbf24;
      margin-bottom: 16px;
    }
    .message {
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
      margin-bottom: 28px;
    }
    .otp-card {
      background: rgba(15, 23, 42, 0.8);
      border: 2px dashed #f59e0b;
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 30px;
    }
    .otp-label {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #94a3b8;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #f59e0b;
      text-shadow: 0 0 15px rgba(245, 158, 11, 0.4);
      padding: 4px 0;
    }
    .otp-hint {
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
    }
    .cta-wrap {
      text-align: center;
      margin-bottom: 32px;
    }
    .btn-verify {
      display: inline-block;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0f172a !important;
      text-decoration: none;
      font-size: 16px;
      font-weight: 700;
      padding: 14px 36px;
      border-radius: 8px;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .divider {
      height: 1px;
      background: rgba(245, 158, 11, 0.2);
      margin: 28px 0;
    }
    .alt-link-wrap {
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
      line-height: 1.5;
    }
    .alt-link-wrap a {
      color: #38bdf8;
      text-decoration: none;
    }
    .footer {
      background: rgba(15, 23, 42, 0.95);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .flag-strip {
      display: inline-block;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo-badge">👑</div>
      <h1>NAIJA DRAUGHTS</h1>
      <p>West Africa's Premier 10x10 Draughts Championship Arena</p>
    </div>

    <div class="content">
      <div class="greeting">Welcome Champion {$username}! 🇳🇬</div>
      <div class="message">
        You are just one quick step away from taking your seat at the board. To activate your account, protect your player rating, and join live multiplayer tournaments, please verify your email address.
      </div>

      <div class="otp-card">
        <div class="otp-label">Your 6-Digit Verification Code</div>
        <div class="otp-code">{$otp}</div>
        <div class="otp-hint">Enter this code on your sign-up verification screen. Valid for 24 hours.</div>
      </div>

      <div class="cta-wrap">
        <a href="{$verifyUrl}" class="btn-verify" target="_blank">👑 One-Click Instant Verification &rarr;</a>
      </div>

      <div class="divider"></div>

      <div class="alt-link-wrap">
        Button not working? Copy and paste this direct verification link into your web browser:<br>
        <a href="{$verifyUrl}" target="_blank">{$verifyUrl}</a>
      </div>
    </div>

    <div class="footer">
      <div class="flag-strip">🇳🇬 Authentic Nigerian Street Draughts • 🇬🇭 Ghanaian Damii • 🌍 International FMJD</div>
      <p>If you did not initiate this sign-up on Naija Draughts, you can safely ignore this email.<br>
      Zero Cheating • Respectful Street Play • Grandmaster Tactics</p>
    </div>
  </div>
</body>
</html>
HTML;

    return sendEmail($user['email'], $subject, $htmlBody, $textBody, [
        'Username' => $user['username'],
        'OTP' => $otp,
        'Token' => $token,
        'VerifyUrl' => $verifyUrl
    ]);
}
