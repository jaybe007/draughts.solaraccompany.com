<?php
/**
 * Standalone Email Verification Page
 * Verifies email tokens via URL query parameter or 6-digit OTP manual input.
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/config/mail.php';

$token = trim($_GET['token'] ?? '');
$status = 'prompt'; // 'success', 'error', 'prompt'
$message = '';
$verifiedUser = null;

if (!empty($token)) {
    try {
        $db = getDB();
        $stmt = $db->prepare("
            SELECT * FROM users 
            WHERE verification_token = ? 
              AND verification_expires_at >= NOW()
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if ($user) {
            // Mark user as verified
            $db->prepare("
                UPDATE users 
                SET is_verified = 1, 
                    email_verified_at = NOW(), 
                    verification_token = NULL, 
                    verification_code = NULL, 
                    verification_expires_at = NULL 
                WHERE id = ?
            ")->execute([$user['id']]);

            // Refresh user and start session
            $stmt = $db->prepare("
                SELECT id, username, email, is_verified, rating, coins, wallet_balance, package,
                       daily_games_left, wins, losses, draws, total_chopped, title, country, country_code
                FROM users WHERE id = ?
            ");
            $stmt->execute([$user['id']]);
            $verifiedUser = $stmt->fetch();
            $_SESSION['user'] = $verifiedUser;

            $status = 'success';
            $message = 'Your email has been verified successfully! Your champion profile is now active.';
        } else {
            // Check if token already verified
            $stmt = $db->prepare("SELECT id, username, is_verified FROM users WHERE verification_token = ?");
            $stmt->execute([$token]);
            $already = $stmt->fetch();
            if ($already && (int)$already['is_verified'] === 1) {
                $status = 'success';
                $message = 'Your account is already verified! You can proceed to the arena.';
                $verifiedUser = $already;
            } else {
                $status = 'error';
                $message = 'This verification link is invalid or has expired. Please enter your 6-digit code below or request a new one.';
            }
        }
    } catch (Exception $e) {
        $status = 'error';
        $message = 'Database error during verification. Please try again.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - Naija Draughts Championship</title>
  <link rel="stylesheet" href="home.css">
  <style>
    body {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0b1120 70%, #020617 100%);
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .verify-page-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .verify-box {
      width: 100%;
      max-width: 500px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 158, 11, 0.12);
      position: relative;
      overflow: hidden;
    }
    .verify-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #15803d, #f59e0b, #15803d);
    }
    .verify-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
    }
    .verify-icon.success {
      background: rgba(34, 197, 94, 0.15);
      border: 2px solid #22c55e;
      color: #22c55e;
      box-shadow: 0 0 25px rgba(34, 197, 94, 0.3);
    }
    .verify-icon.error {
      background: rgba(239, 68, 68, 0.15);
      border: 2px solid #ef4444;
      color: #ef4444;
      box-shadow: 0 0 25px rgba(239, 68, 68, 0.3);
    }
    .verify-icon.prompt {
      background: rgba(245, 158, 11, 0.15);
      border: 2px solid #f59e0b;
      color: #f59e0b;
      box-shadow: 0 0 25px rgba(245, 158, 11, 0.3);
    }
    .verify-title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .verify-desc {
      font-size: 15px;
      line-height: 1.6;
      color: #cbd5e1;
      margin-bottom: 28px;
    }
    .verify-code-inputs {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 24px;
    }
    .otp-single-field {
      width: 100%;
      max-width: 280px;
      text-align: center;
      font-family: 'Courier New', Courier, monospace;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 12px;
      padding: 12px 16px;
      background: rgba(15, 23, 42, 0.85);
      border: 2px solid #f59e0b;
      border-radius: 12px;
      color: #f59e0b;
      margin: 0 auto 20px;
      display: block;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
    }
    .otp-single-field:focus {
      outline: none;
      box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
      border-color: #fbbf24;
    }
    .btn-verify-submit {
      width: 100%;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0f172a;
      font-weight: 800;
      font-size: 16px;
      padding: 14px;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
      transition: all 0.2s;
    }
    .btn-verify-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
    }
    .verify-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .verify-sublink {
      font-size: 14px;
      color: #94a3b8;
      text-decoration: none;
      margin-top: 16px;
      display: inline-block;
      transition: color 0.2s;
    }
    .verify-sublink:hover {
      color: #38bdf8;
    }
    .alert-banner {
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
      display: none;
    }
    .alert-banner.error {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #fca5a5;
      display: block;
    }
    .alert-banner.success {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid #22c55e;
      color: #86efac;
      display: block;
    }
  </style>
</head>
<body>
  <!-- Navigation bar -->
  <header class="home-header">
    <div class="header-container">
      <a href="index.php" class="logo-wrap" style="text-decoration: none;">
        <span class="logo-icon">👑</span>
        <div class="logo-text">
          <span class="logo-title">NAIJA DRAUGHTS</span>
          <span class="logo-sub">Email Verification Portal</span>
        </div>
      </a>
      <div class="header-actions">
        <a href="index.php" class="btn btn-secondary btn-small">← Back to Portal</a>
      </div>
    </div>
  </header>

  <div class="verify-page-wrap">
    <div class="verify-box">
      <?php if ($status === 'success'): ?>
        <div class="verify-icon success">✓</div>
        <h1 class="verify-title">Email Verified! 🇳🇬</h1>
        <p class="verify-desc"><?= htmlspecialchars($message) ?></p>
        
        <div class="verify-actions">
          <a href="dashboard.php" class="btn btn-primary btn-large btn-block">
            👑 Open Player Dashboard &rarr;
          </a>
          <a href="game.php" class="btn btn-secondary btn-block" style="margin-top: 8px;">
            🎮 Launch Game Arena &rarr;
          </a>
        </div>

      <?php else: ?>
        <div class="verify-icon <?= $status === 'error' ? 'error' : 'prompt' ?>">
          <?= $status === 'error' ? '⚠️' : '✉️' ?>
        </div>

        <h1 class="verify-title">
          <?= $status === 'error' ? 'Verification Needed' : 'Verify Your Email' ?>
        </h1>
        
        <p class="verify-desc">
          <?= htmlspecialchars($message ?: 'Enter the 6-digit verification code sent to your registered email address.') ?>
        </p>

        <div id="verify-alert" class="alert-banner"></div>

        <form id="form-verify-code">
          <div style="text-align: left; margin-bottom: 16px;">
            <label style="font-size: 13px; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 6px;">
              Email Address
            </label>
            <input type="email" id="verify-email" class="form-control" placeholder="you@example.com" required 
                   value="<?= htmlspecialchars($_GET['email'] ?? '') ?>"
                   style="width: 100%; box-sizing: border-box; padding: 12px 14px; background: rgba(15,23,42,0.8); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
          </div>

          <div style="margin-bottom: 12px;">
            <label style="font-size: 13px; color: #94a3b8; font-weight: 600; display: block; margin-bottom: 8px;">
              6-Digit Verification Code
            </label>
            <input type="text" id="verify-code" class="otp-single-field" placeholder="••••••" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" required autofocus>
          </div>

          <button type="submit" id="btn-submit-verify" class="btn-verify-submit">
            Verify Code & Enter Arena &rarr;
          </button>
        </form>

        <div style="margin-top: 20px; font-size: 13px; color: #94a3b8;">
          Didn't receive the email? 
          <a href="#" id="link-resend-code" style="color: #f59e0b; font-weight: 600; text-decoration: none;">Resend Code</a>
          <span id="resend-timer" style="display: none; color: #64748b;"> (60s)</span>
        </div>

        <a href="index.php" class="verify-sublink">← Back to Sign In</a>
      <?php endif; ?>
    </div>
  </div>

  <script>
    const formVerify = document.getElementById('form-verify-code');
    const inputEmail = document.getElementById('verify-email');
    const inputCode  = document.getElementById('verify-code');
    const btnSubmit  = document.getElementById('btn-submit-verify');
    const alertBanner = document.getElementById('verify-alert');
    const linkResend = document.getElementById('link-resend-code');
    const resendTimer = document.getElementById('resend-timer');

    function showAlert(msg, isError = true) {
      if (!alertBanner) return;
      alertBanner.textContent = msg;
      alertBanner.className = `alert-banner ${isError ? 'error' : 'success'}`;
      alertBanner.style.display = 'block';
    }

    if (formVerify) {
      formVerify.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = inputEmail.value.trim();
        const code = inputCode.value.trim();

        if (!email) {
          showAlert('Please enter your email address.', true);
          return;
        }
        if (!code || code.length !== 6) {
          showAlert('Please enter the complete 6-digit code.', true);
          return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Verifying...';

        try {
          const res = await fetch('api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify_code', email, code })
          });
          const data = await res.json();

          if (data.success) {
            showAlert(data.message || 'Email verified successfully!', false);
            setTimeout(() => {
              window.location.href = 'dashboard.php';
            }, 800);
          } else {
            showAlert(data.message || 'Verification failed. Check your code.', true);
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Verify Code & Enter Arena →';
          }
        } catch (err) {
          showAlert('Network error connecting to verification server.', true);
          btnSubmit.disabled = false;
          btnSubmit.textContent = 'Verify Code & Enter Arena →';
        }
      });
    }

    if (linkResend) {
      linkResend.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = inputEmail.value.trim();
        if (!email) {
          showAlert('Please enter your email address above to receive a new code.', true);
          inputEmail.focus();
          return;
        }

        linkResend.style.pointerEvents = 'none';
        linkResend.style.opacity = '0.5';

        try {
          const res = await fetch('api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'resend_verification', email })
          });
          const data = await res.json();

          if (data.success) {
            showAlert('New 6-digit code sent! Check your inbox.', false);
            let countdown = 60;
            resendTimer.style.display = 'inline';
            resendTimer.textContent = ` (${countdown}s)`;
            const interval = setInterval(() => {
              countdown--;
              if (countdown <= 0) {
                clearInterval(interval);
                resendTimer.style.display = 'none';
                linkResend.style.pointerEvents = 'auto';
                linkResend.style.opacity = '1';
              } else {
                resendTimer.textContent = ` (${countdown}s)`;
              }
            }, 1000);
          } else {
            showAlert(data.message || 'Could not resend code.', true);
            linkResend.style.pointerEvents = 'auto';
            linkResend.style.opacity = '1';
          }
        } catch (err) {
          showAlert('Network error communicating with server.', true);
          linkResend.style.pointerEvents = 'auto';
          linkResend.style.opacity = '1';
        }
      });
    }
  </script>
</body>
</html>
