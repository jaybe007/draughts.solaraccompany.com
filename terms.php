<?php
/**
 * terms.php
 * Official Terms of Service, User Agreement & Fair Play Regulations
 * Naija Draughts Platform
 */

require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms & Conditions | Naija Draughts Platform</title>
  <meta name="description" content="Official Terms of Service, Fair Play Policy, Wager Rules, and User Agreement for the Nigerian Draughts online gaming platform.">
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
    .legal-page-body {
      background-color: #0b0f17;
      color: #cbd5e1;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .legal-container {
      max-width: 960px;
      margin: 40px auto 80px;
      padding: 0 20px;
      flex: 1;
    }
    .legal-card {
      background: rgba(18, 24, 34, 0.85);
      border: 1px solid rgba(245, 166, 35, 0.25);
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }
    .legal-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 24px;
      margin-bottom: 30px;
      text-align: center;
    }
    .legal-header h1 {
      font-family: 'Cinzel', serif;
      color: #f8fafc;
      font-size: 2.2rem;
      margin: 0 0 10px;
      letter-spacing: 1px;
    }
    .legal-badge-date {
      display: inline-block;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      margin-top: 6px;
    }
    .legal-toc {
      background: #0f172a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 18px 24px;
      margin-bottom: 36px;
    }
    .legal-toc-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #f59e0b;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legal-toc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 8px 16px;
      font-size: 0.88rem;
    }
    .legal-toc-grid a {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .legal-toc-grid a:hover {
      color: #fde047;
    }
    .legal-section {
      margin-bottom: 32px;
    }
    .legal-section h2 {
      font-family: 'Cinzel', serif;
      font-size: 1.35rem;
      color: #fde047;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px dashed rgba(245, 166, 35, 0.2);
      padding-bottom: 6px;
    }
    .legal-section p, .legal-section li {
      font-size: 0.94rem;
      line-height: 1.7;
      color: #cbd5e1;
      margin-bottom: 12px;
    }
    .legal-section ul {
      padding-left: 20px;
      margin-bottom: 14px;
    }
    .legal-highlight-box {
      background: rgba(245, 158, 11, 0.08);
      border-left: 4px solid #f59e0b;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      font-size: 0.9rem;
    }
    .legal-cta-box {
      margin-top: 40px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(245, 166, 35, 0.15));
      border: 1px solid rgba(245, 166, 35, 0.3);
      border-radius: 10px;
      padding: 24px;
      text-align: center;
    }
    @media (max-width: 768px) {
      .legal-card {
        padding: 24px 18px;
      }
      .legal-header h1 {
        font-size: 1.7rem;
      }
    }
  </style>
</head>
<body class="legal-page-body">

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
          <span class="brand-tagline">AFRICAN BOARD GAME FEDERATION</span>
        </div>
      </a>

      <nav class="home-nav">
        <ul class="nav-links">
          <li><a href="index.php">Home</a></li>
          <li><a href="game.php">Play Arena</a></li>
          <li><a href="puzzles.php">Tactical Puzzles</a></li>
          <li><a href="donate.php" style="color: #fde047; font-weight: 700;">💛 Donate</a></li>
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

  <!-- ================= MAIN LEGAL CONTENT ================= -->
  <main class="legal-container">
    <div class="legal-card">
      <div class="legal-header">
        <h1>Terms & Conditions of Service</h1>
        <p style="color:#94a3b8; font-size:0.95rem; margin:6px 0 0;">
          User Agreement, Staking Rules & Fair Play Regulations
        </p>
        <span class="legal-badge-date">Effective Date: October 2026 • Version 2.4</span>
      </div>

      <!-- Table of Contents -->
      <div class="legal-toc">
        <div class="legal-toc-title">📌 Contents & Quick Links</div>
        <div class="legal-toc-grid">
          <a href="#section-1">1. Acceptance of Terms</a>
          <a href="#section-2">2. Eligibility & Accounts</a>
          <a href="#section-3">3. Fair Play & Anti-Cheat Policy</a>
          <a href="#section-4">4. Virtual Coins & Match Staking</a>
          <a href="#section-5">5. Real-Money Wallet & Platform Rake</a>
          <a href="#section-6">6. Code of Conduct & Respect</a>
          <a href="#section-7">7. Intellectual Property & Heritage</a>
          <a href="#section-8">8. Disclaimers & Liability</a>
          <a href="#section-9">9. Governing Law & Jurisdiction</a>
          <a href="#section-10">10. Donations & Community Funding</a>
        </div>
      </div>

      <!-- Section 1 -->
      <section class="legal-section" id="section-1">
        <h2><span>1.</span> Acceptance of Terms</h2>
        <p>
          Welcome to <strong>Naija Draughts</strong> ("the Platform", "we", "us", or "our"), operated at <code>draughts.solaraccompany.com</code>. By registering an account, depositing funds, purchasing virtual coins, joining a match room, or using any feature of this website, you agree to be bound unconditionally by these Terms and Conditions.
        </p>
        <p>
          If you do not agree with any part of these terms, you must immediately cease accessing the platform and refrain from creating an account or wagering virtual or fiat currency.
        </p>
      </section>

      <!-- Section 2 -->
      <section class="legal-section" id="section-2">
        <h2><span>2.</span> Eligibility & Account Registration</h2>
        <p>
          To create an account and participate in ranked multiplayer games or tournaments, you must:
        </p>
        <ul>
          <li>Be at least 18 years of age (or the age of legal majority in your jurisdiction).</li>
          <li>Provide accurate, genuine information during registration (including a valid email address).</li>
          <li>Maintain only one primary user account. Creating duplicate ("smurf") accounts to artificially inflate rating points, abuse free daily coins, or bypass tournament limits is strictly forbidden.</li>
          <li>Safeguard your login credentials. You are solely responsible for all activities and transactions conducted through your account.</li>
        </ul>
      </section>

      <!-- Section 3 -->
      <section class="legal-section" id="section-3">
        <h2><span>3.</span> Fair Play & Anti-Cheat Regulations</h2>
        <div class="legal-highlight-box">
          🛡️ <strong>Zero Tolerance for Cheating:</strong> Nigerian Draughts is founded on honour, sharp tactical vision, and street mastery. Any player found using external draughts engines, bots, browser tampering, or tab-switch assistance will be permanently banned with total forfeit of escrow.
        </div>
        <p>
          Our platform implements automated Fair Play Telemetry, including:
        </p>
        <ul>
          <li><strong>Tab-Switch & Focus Tracking:</strong> Monitoring excessive application switches during live active moves.</li>
          <li><strong>Move Velocity & Move-Time Variance:</strong> Algorithmic comparison against known draughts AI engine evaluation curves.</li>
          <li><strong>Spectator & Screen Sharing Bans:</strong> Players may not collaborate or receive real-time coaching during ranked matches.</li>
        </ul>
      </section>

      <!-- Section 4 -->
      <section class="legal-section" id="section-4">
        <h2><span>4.</span> Virtual Coins, Game Rooms & Match Staking</h2>
        <p>
          The platform operates a virtual currency system denominated in <strong>Coins</strong>:
        </p>
        <ul>
          <li>Coins may be earned through gameplay victories, daily challenge quotas, tactical puzzle achievements, or purchased through official gateway bundles.</li>
          <li>Coins wagered in P2P matches are held in secure automated escrow until the match concludes.</li>
          <li>In the event of an opponent disconnection or abandonment, the official disconnection countdown timer governs. If an opponent fails to reconnect within the allocated grace window, the match is awarded to the remaining player.</li>
        </ul>
      </section>

      <!-- Section 5 -->
      <section class="legal-section" id="section-5">
        <h2><span>5.</span> Real-Money Wallet, Deposits, Withdrawals & Rake</h2>
        <p>
          Players may deposit fiat currency (NGN) via licensed Central Bank of Nigeria (CBN) payment gateways (Paystack, Flutterwave) into their platform wallet:
        </p>
        <ul>
          <li><strong>Wallet Protection:</strong> All wallet balances are maintained with atomic database locks to prevent balance discrepancies.</li>
          <li><strong>House Rake:</strong> Competitive cash-staked matches incur a standard house rake of <strong>8%</strong> of the total pot (reduced to <strong>4%</strong> for subscribed VIP Oba members) to fund tournament prize pools, community servers, and referee infrastructure.</li>
          <li><strong>Withdrawals:</strong> Verified players may withdraw their winnings directly to verified Nigerian bank accounts via NIBSS/Paystack transfers. Withdrawals are processed within 1 to 24 business hours subject to anti-fraud checks.</li>
        </ul>
      </section>

      <!-- Section 6 -->
      <section class="legal-section" id="section-6">
        <h2><span>6.</span> Code of Conduct & Respectful Play</h2>
        <p>
          Naija Draughts street banter is welcome, but toxicity, hate speech, ethnic discrimination, threats, or harassment in the Street Corner Chat or private messages will result in immediate chat muting or account suspension.
        </p>
      </section>

      <!-- Section 7 -->
      <section class="legal-section" id="section-7">
        <h2><span>7.</span> Intellectual Property & African Heritage</h2>
        <p>
          All proprietary algorithms, board customization themes (e.g., African Mahogany, Eco Giant, Golden State), tactical puzzle engines, and graphical assets are protected intellectual property. Nigerian and Ghanaian Damii rulesets are celebrated as open cultural heritage.
        </p>
      </section>

      <!-- Section 8 -->
      <section class="legal-section" id="section-8">
        <h2><span>8.</span> Disclaimers & Limitation of Liability</h2>
        <p>
          The service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that gameplay will be uninterrupted or error-free. We shall not be liable for any indirect, incidental, or consequential damages resulting from internet connection dropouts, device failures, or third-party payment processor delays.
        </p>
      </section>

      <!-- Section 9 -->
      <section class="legal-section" id="section-9">
        <h2><span>9.</span> Governing Law & Dispute Resolution</h2>
        <p>
          These Terms and Conditions shall be governed by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>. Any disputes arising under these terms shall be subject to arbitration in Lagos State, Nigeria.
        </p>
      </section>

      <!-- Section 10 -->
      <section class="legal-section" id="section-10">
        <h2><span>10.</span> Community Donations & Tournament Sponsorships</h2>
        <p>
          Patrons and community supporters may contribute voluntary donations via our official <a href="donate.php" style="color: #fde047; font-weight: 700;">Donation Channel</a>. Donations are non-refundable voluntary contributions dedicated towards grassroots tournament prize pools, youth coaching camps, and open server hosting.
        </p>
      </section>

      <!-- Bottom Action Card -->
      <div class="legal-cta-box">
        <h3 style="font-family: 'Cinzel', serif; color: #f8fafc; margin: 0 0 10px;">Ready to Test Your Tactical Vision?</h3>
        <p style="color: #cbd5e1; font-size: 0.95rem; margin-bottom: 20px;">
          Join thousands of draughts masters playing live on the premier African board game platform.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="game.php" class="btn btn-primary btn-large">🎮 Enter Game Arena &rarr;</a>
          <a href="donate.php" class="btn btn-secondary btn-large" style="border-color: #f59e0b; color: #fde047;">💛 Support Us (Donate)</a>
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
          <li><a href="game.php">Play Online</a></li>
          <li><a href="puzzles.php">Tactical Puzzles</a></li>
          <li><a href="dashboard.php">Player Dashboard</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Community & Support</h4>
        <ul class="footer-links-list">
          <li><a href="donate.php" style="color: #fde047; font-weight: 700;">💛 Donate & Support</a></li>
          <li><a href="terms.php">Terms & Conditions</a></li>
          <li><a href="game.php?view=chat">Street Corner Chat</a></li>
          <li><a href="terms.php#section-3">Fair Play Policy</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <span>&copy; <?= date('Y') ?> Naija Draughts Platform. All Rights Reserved.</span>
      <span><a href="terms.php" style="color: #cbd5e1; text-decoration: underline;">Terms & Conditions</a> &bull; <a href="donate.php" style="color: #fde047; text-decoration: none; font-weight: 700;">💛 Support Us</a></span>
    </div>
  </footer>

</body>
</html>
