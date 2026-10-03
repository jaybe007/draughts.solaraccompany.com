<?php
/**
 * donate.php
 * Official Community Donation & Grassroots Draughts Patron Portal
 * Naija Draughts Platform
 */

require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
$userBalance = $currentUser ? (float)($currentUser['wallet_balance'] ?? 0) : 0;
$userCoins = $currentUser ? (int)($currentUser['coins'] ?? 0) : 0;

$refParam = trim($_GET['reference'] ?? '');
$isVerified = !empty($_GET['verified']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donate & Support Grassroots Draughts | Naija Draughts</title>
  <meta name="description" content="Support African Draughts masters, grassroots street tournaments, youth coaching, and server infrastructure. Donate via Card, Bank Transfer, or In-Game Wallet.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css?v=<?= filemtime(__DIR__ . '/home.css') ?>">
  <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <meta name="theme-color" content="#10b981">
  <style>
    .donate-page-body {
      background-color: #0b0f17;
      color: #cbd5e1;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .donate-container {
      max-width: 1080px;
      margin: 36px auto 70px;
      padding: 0 20px;
      flex: 1;
    }
    .donate-hero {
      text-align: center;
      margin-bottom: 36px;
    }
    .donate-hero h1 {
      font-family: 'Cinzel', serif;
      font-size: 2.4rem;
      color: #f8fafc;
      margin: 0 0 10px;
      letter-spacing: 1px;
    }
    .donate-hero p {
      color: #94a3b8;
      font-size: 1.05rem;
      max-width: 720px;
      margin: 0 auto 16px;
      line-height: 1.6;
    }
    .donate-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 30px;
      align-items: start;
    }
    .donate-card {
      background: rgba(18, 24, 34, 0.9);
      border: 1px solid rgba(245, 166, 35, 0.3);
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }
    .donate-card-title {
      font-family: 'Cinzel', serif;
      font-size: 1.4rem;
      color: #fde047;
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .preset-chips-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin: 14px 0 20px;
    }
    .preset-chip {
      background: #0f172a;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 12px 8px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s ease;
    }
    .preset-chip:hover, .preset-chip.active {
      background: rgba(245, 158, 11, 0.18);
      border-color: #f59e0b;
      color: #fde047;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
    }
    .method-selector-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin: 14px 0 20px;
    }
    .method-chip {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #cbd5e1;
      transition: all 0.2s;
    }
    .method-chip:hover, .method-chip.active {
      background: rgba(16, 185, 129, 0.15);
      border-color: #10b981;
      color: #34d399;
    }
    .impact-stat-box {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .impact-stat-icon {
      font-size: 1.8rem;
      background: rgba(245, 166, 35, 0.15);
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .wall-patron-item {
      background: #0f172a;
      border-left: 3px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin-bottom: 8px;
    }
    .wall-patron-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 4px;
    }
    .wall-patron-msg {
      font-size: 0.8rem;
      color: #94a3b8;
      font-style: italic;
    }
    @media (max-width: 860px) {
      .donate-grid {
        grid-template-columns: 1fr;
      }
      .preset-chips-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
</head>
<body class="donate-page-body">

  <!-- ================= TOP HEADER NAVIGATION ================= -->
  <header class="home-header">
    <div class="nav-container">
      <a href="index.php" class="brand-wrap">
        <div class="flag-stripes">
          <span class="stripe green"></span>
          <span class="stripe white"></span>
          <span class="stripe green"></span>
        </div>
        <div class="brand-text">
          <span class="brand-title">NAIJA DRAUGHTS</span>
          <span class="brand-tagline">COMMUNITY PATRON PORTAL</span>
        </div>
      </a>

      <nav class="home-nav">
        <ul class="nav-links">
          <li><a href="index.php">Home</a></li>
          <li><a href="game.php">Play Arena</a></li>
          <li><a href="puzzles.php">Puzzles</a></li>
          <li><a href="terms.php">Terms & Conditions</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <?php if ($currentUser): ?>
          <a href="dashboard.php" class="btn btn-secondary btn-small">👑 <?= htmlspecialchars($currentUser['username']) ?></a>
          <a href="game.php" class="btn btn-primary btn-small">⚔️ Enter Arena</a>
        <?php else: ?>
          <a href="index.php#auth-card" class="btn btn-secondary btn-small">Sign In</a>
          <a href="game.php" class="btn btn-primary btn-small">Play Free</a>
        <?php endif; ?>
      </div>
    </div>
  </header>

  <!-- ================= MAIN CONTENT ================= -->
  <main class="donate-container">
    
    <div class="donate-hero">
      <div style="font-size: 3rem; margin-bottom: 8px;">💛</div>
      <h1>Support African Draughts Heritage</h1>
      <p>
        Help sponsor street draughts masters across Lagos, Benin, Ibadan, Port Harcourt, and Abuja. Your generous contributions directly power open grassroots tournaments, youth coaching clinics, and world-class server infrastructure.
      </p>
    </div>

    <?php if ($isVerified): ?>
      <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 8px; padding: 14px 20px; margin-bottom: 24px; text-align: center; color: #34d399;">
        🎉 <strong>Ese Gan! Thank you for your contribution!</strong> Your support has been recorded and dedicated to the African Draughts Prize Pool fund.
      </div>
    <?php endif; ?>

    <div class="donate-grid">
      
      <!-- Left Column: Donation Form -->
      <div class="donate-card">
        <h2 class="donate-card-title"><span>🤝</span> Make a Contribution</h2>
        <p style="color:#94a3b8; font-size:0.9rem; margin-bottom: 16px;">
          Choose an amount or enter a custom sum. Every Naira empowers African board game champions.
        </p>

        <!-- Preset Amount Chips -->
        <label style="font-size:0.85rem; font-weight:700; color:#cbd5e1;">Select Amount (NGN):</label>
        <div class="preset-chips-grid" id="preset-chips-wrap">
          <div class="preset-chip" data-amount="1000">₦1,000</div>
          <div class="preset-chip active" data-amount="2500">₦2,500</div>
          <div class="preset-chip" data-amount="5000">₦5,000</div>
          <div class="preset-chip" data-amount="10000">₦10,000</div>
          <div class="preset-chip" data-amount="25000">₦25,000</div>
          <div class="preset-chip" data-amount="custom">Custom Amount</div>
        </div>

        <form id="form-donate-action" onsubmit="handleDonateSubmit(event)">
          <!-- Custom Amount Input -->
          <div class="form-group" id="custom-amount-wrap" style="display:none; margin-bottom: 16px;">
            <label for="donate-amount-val" style="font-weight:600; font-size:0.88rem;">Custom Amount (₦):</label>
            <input type="number" id="donate-amount-val" class="form-control" min="100" step="100" value="2500" placeholder="Minimum ₦100" style="font-size:1.1rem; font-weight:700;">
          </div>

          <!-- Payment Method Choice -->
          <label style="font-size:0.85rem; font-weight:700; color:#cbd5e1; display:block; margin-bottom:6px;">
            Contribution Method:
          </label>
          <div class="method-selector-grid">
            <?php if ($currentUser): ?>
            <div class="method-chip active" data-method="wallet_balance">
              <span>🏦</span> In-Game Wallet (₦<?= number_format($userBalance, 2) ?>)
            </div>
            <div class="method-chip" data-method="coins">
              <span>🪙</span> Platform Coins (<?= number_format($userCoins) ?> Coins)
            </div>
            <?php endif; ?>
            <div class="method-chip <?= !$currentUser ? 'active' : '' ?>" data-method="paystack">
              <span>💳</span> Paystack (Card, Transfer, USSD)
            </div>
            <div class="method-chip" data-method="flutterwave">
              <span>🌍</span> Flutterwave (Direct Bank/Card)
            </div>
          </div>
          <input type="hidden" id="donate-method-input" value="<?= $currentUser ? 'wallet_balance' : 'paystack' ?>">

          <!-- Coins Amount Input (Visible if coins method chosen) -->
          <div class="form-group" id="coins-amount-wrap" style="display:none; margin-bottom: 16px;">
            <label for="donate-coins-val" style="font-weight:600; font-size:0.88rem;">Coins to Donate:</label>
            <input type="number" id="donate-coins-val" class="form-control" min="50" step="50" value="250" placeholder="Minimum 50 Coins">
            <small style="color:#94a3b8; font-size:0.75rem;">Coins will be allocated directly to open tournament prize pools.</small>
          </div>

          <!-- Donor Name -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label for="donor-display-name" style="font-size:0.85rem; font-weight:600;">Your Name / Handle:</label>
            <input type="text" id="donor-display-name" class="form-control" placeholder="e.g. Lagos Draughts Enthusiast" value="<?= $currentUser ? htmlspecialchars($currentUser['username']) : '' ?>">
          </div>

          <!-- Donor Email -->
          <div class="form-group" style="margin-bottom: 14px;">
            <label for="donor-email-val" style="font-size:0.85rem; font-weight:600;">Email Address (For Receipt):</label>
            <input type="email" id="donor-email-val" class="form-control" placeholder="champion@example.com" value="<?= $currentUser ? htmlspecialchars($currentUser['email'] ?? '') : '' ?>">
          </div>

          <!-- Words of Encouragement -->
          <div class="form-group" style="margin-bottom: 16px;">
            <label for="donor-message-val" style="font-size:0.85rem; font-weight:600;">Message / Words of Support (Optional):</label>
            <textarea id="donor-message-val" class="form-control" rows="2" placeholder="e.g. Keep African street draughts shining! More power to the masters."></textarea>
          </div>

          <!-- Anonymous Option -->
          <div style="display:flex; align-items:center; gap:8px; margin-bottom: 22px;">
            <input type="checkbox" id="donate-is-anonymous" style="width:16px; height:16px; cursor:pointer;">
            <label for="donate-is-anonymous" style="font-size:0.85rem; color:#cbd5e1; cursor:pointer;">
              Make this contribution anonymous on the public Wall of Patrons
            </label>
          </div>

          <button type="submit" id="btn-submit-donation" class="btn btn-primary btn-large btn-block" style="font-size:1.05rem; font-weight:800; padding:14px;">
            💛 Complete Contribution &rarr;
          </button>
        </form>
      </div>

      <!-- Right Column: Community Impact & Wall of Fame -->
      <div>
        
        <!-- Impact Breakdown Card -->
        <div class="donate-card" style="margin-bottom: 24px;">
          <h3 style="font-family:'Cinzel', serif; font-size:1.2rem; color:#f8fafc; margin:0 0 16px;">Where Your Support Goes</h3>

          <div class="impact-stat-box">
            <div class="impact-stat-icon">🏆</div>
            <div>
              <strong style="color:#fde047; font-size:0.95rem;">Grassroots Tournament Prize Pools</strong>
              <div style="font-size:0.82rem; color:#94a3b8; line-height:1.4;">
                Directly rewards street champions in Lagos, Benin, Ibadan, and Port Harcourt.
              </div>
            </div>
          </div>

          <div class="impact-stat-box">
            <div class="impact-stat-icon">🛡️</div>
            <div>
              <strong style="color:#34d399; font-size:0.95rem;">Fair Play & Anti-Cheat Servers</strong>
              <div style="font-size:0.82rem; color:#94a3b8; line-height:1.4;">
                Keeps high-frequency low-latency servers running with tab-switch telemetry.
              </div>
            </div>
          </div>

          <div class="impact-stat-box">
            <div class="impact-stat-icon">♟️</div>
            <div>
              <strong style="color:#60a5fa; font-size:0.95rem;">Youth Draughts Academies</strong>
              <div style="font-size:0.82rem; color:#94a3b8; line-height:1.4;">
                Funds physical boards and coaching camps for the next generation of African Grandmasters.
              </div>
            </div>
          </div>
        </div>

        <!-- Wall of Patrons Card -->
        <div class="donate-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 style="font-family:'Cinzel', serif; font-size:1.2rem; color:#f8fafc; margin:0;">👑 Wall of Patrons</h3>
            <span id="patron-count-badge" class="badge-mini" style="background:#f59e0b; color:#000; font-weight:800; padding:2px 8px; border-radius:10px; font-size:0.75rem;">Loading...</span>
          </div>

          <div id="patrons-list-container" style="max-height: 340px; overflow-y: auto;">
            <div style="text-align:center; padding:20px; color:#94a3b8; font-size:0.85rem;">
              Loading community patrons...
            </div>
          </div>
        </div>

      </div>

    </div>

  </main>

  <!-- ================= FOOTER ================= -->
  <footer class="home-footer">
    <div class="footer-container">
      <div class="footer-brand-col">
        <div class="brand-wrap">
          <div class="flag-stripes">
            <span class="stripe green"></span>
            <span class="stripe white"></span>
            <span class="stripe green"></span>
          </div>
          <div class="brand-text">
            <span class="brand-title">NAIJA DRAUGHTS</span>
            <span class="brand-tagline">AFRICAN BOARD GAME FEDERATION</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6; margin-top:8px;">
          Celebrating the rich heritage of African Draughts. Connect with players worldwide, master tactical board combinations, and rise to become the Oba of the board.
        </p>
      </div>

      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links-list">
          <li><a href="index.php">Home</a></li>
          <li><a href="game.php">Play Arena</a></li>
          <li><a href="puzzles.php">Tactical Puzzles</a></li>
          <li><a href="dashboard.php">Player Dashboard</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Community & Legal</h4>
        <ul class="footer-links-list">
          <li><a href="donate.php" style="color: #fde047; font-weight: 700;">💛 Donate & Support</a></li>
          <li><a href="terms.php">Terms & Conditions</a></li>
          <li><a href="terms.php#section-3">Fair Play Policy</a></li>
          <li><a href="game.php?view=chat">Street Corner Chat</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <span>&copy; <?= date('Y') ?> Naija Draughts Platform. All Rights Reserved.</span>
      <span><a href="terms.php" style="color: #cbd5e1; text-decoration: underline;">Terms & Conditions</a> &bull; <a href="donate.php" style="color: #fde047; font-weight: 700; text-decoration: none;">💛 Support Us</a></span>
    </div>
  </footer>

  <script>
    let selectedAmount = 2500;
    let selectedMethod = '<?= $currentUser ? 'wallet_balance' : 'paystack' ?>';

    // Preset chip selection
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const val = chip.getAttribute('data-amount');
        const customWrap = document.getElementById('custom-amount-wrap');
        const amountInput = document.getElementById('donate-amount-val');

        if (val === 'custom') {
          customWrap.style.display = 'block';
          amountInput.focus();
        } else {
          customWrap.style.display = 'none';
          selectedAmount = parseFloat(val);
          amountInput.value = val;
        }
      });
    });

    // Method chip selection
    document.querySelectorAll('.method-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.method-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedMethod = chip.getAttribute('data-method');
        document.getElementById('donate-method-input').value = selectedMethod;

        const coinsWrap = document.getElementById('coins-amount-wrap');
        const chipsWrap = document.getElementById('preset-chips-wrap');
        if (selectedMethod === 'coins') {
          coinsWrap.style.display = 'block';
          chipsWrap.style.opacity = '0.4';
          chipsWrap.style.pointerEvents = 'none';
        } else {
          coinsWrap.style.display = 'none';
          chipsWrap.style.opacity = '1';
          chipsWrap.style.pointerEvents = 'auto';
        }
      });
    });

    async function handleDonateSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('btn-submit-donation');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Processing Contribution...';

      const amountVal = parseFloat(document.getElementById('donate-amount-val').value) || selectedAmount;
      const coinsVal = parseInt(document.getElementById('donate-coins-val').value, 10) || 0;
      const donorName = document.getElementById('donor-display-name').value.trim();
      const donorEmail = document.getElementById('donor-email-val').value.trim();
      const message = document.getElementById('donor-message-val').value.trim();
      const isAnonymous = document.getElementById('donate-is-anonymous').checked;

      try {
        const res = await fetch('api/donations.php?action=donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: selectedMethod,
            amount: amountVal,
            coins_amount: coinsVal,
            donor_name: donorName,
            donor_email: donorEmail,
            message: message,
            is_anonymous: isAnonymous ? 1 : 0
          })
        });
        const data = await res.json();

        if (data.success) {
          if (data.authorization_url) {
            window.location.href = data.authorization_url;
            return;
          }
          alert(data.message || 'Thank you for your generous contribution!');
          loadWallOfPatrons();
          if (selectedMethod === 'wallet_balance' || selectedMethod === 'coins') {
            setTimeout(() => window.location.reload(), 1200);
          }
        } else {
          alert(data.message || 'Contribution could not be processed. Please try again.');
        }
      } catch (err) {
        alert('Network error submitting contribution. Please check your connection.');
      } finally {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    }

    async function loadWallOfPatrons() {
      const container = document.getElementById('patrons-list-container');
      const badge = document.getElementById('patron-count-badge');
      if (!container) return;

      try {
        const res = await fetch('api/donations.php?action=get_donations');
        const data = await res.json();

        if (!data.success || !data.donations || data.donations.length === 0) {
          container.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:0.85rem;">Be the inaugural community patron!</div>';
          if (badge) badge.textContent = '0 Patrons';
          return;
        }

        if (badge) {
          badge.textContent = `${data.stats.donor_count} Patrons • ₦${Number(data.stats.total_naira).toLocaleString()}`;
        }

        container.innerHTML = data.donations.map(d => {
          const name = escapeHtml(d.donor_name || 'Anonymous Patron');
          const amountText = (d.currency === 'COINS' || d.donation_method === 'coins') 
            ? `${Number(d.coins_amount).toLocaleString()} Coins`
            : `₦${Number(d.amount).toLocaleString()}`;
          const msg = d.message ? `<div class="wall-patron-msg">"${escapeHtml(d.message)}"</div>` : '';
          const date = (d.created_at || '').substring(0, 10);

          return `
            <div class="wall-patron-item">
              <div class="wall-patron-header">
                <strong style="color: #fde047;">${name}</strong>
                <span style="color: #34d399; font-weight: 700;">${amountText}</span>
              </div>
              ${msg}
              <div style="font-size: 0.7rem; color: #64748b; margin-top: 3px;">${date}</div>
            </div>
          `;
        }).join('');

      } catch (e) {
        container.innerHTML = '<div style="text-align:center; padding:15px; color:#94a3b8; font-size:0.85rem;">Could not load patrons list.</div>';
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    document.addEventListener('DOMContentLoaded', loadWallOfPatrons);
  </script>
</body>
</html>
