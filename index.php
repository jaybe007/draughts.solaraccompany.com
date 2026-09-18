<?php
require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Naija Draughts - The Ultimate African 10x10 Board Game Community</title>
  <meta name="description" content="Play authentic 10x10 Nigerian Draughts online. Compete in tournaments, challenge master AI, analyze board positions, and connect with global draughts champions.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css?v=<?= filemtime(__DIR__ . '/home.css') ?>">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <meta name="theme-color" content="#10b981">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body>

  <!-- ================= TOP NAVIGATION (AFRODRAUGHT-STYLE) ================= -->
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
          <span class="brand-tagline">AFRICAN 10x10 BOARD GAME COMMUNITY</span>
        </div>
      </a>

      <ul class="home-nav-links">
        <li><a href="index.php" class="home-nav-link active">HOME</a></li>
        <li><a href="dashboard.php" class="home-nav-link" style="color: var(--accent-gold); font-weight: 800;">👑 DASHBOARD</a></li>
        <li><a href="game.php" class="home-nav-link btn-play-cta">🎮 PLAY</a></li>
        <li><a href="#champions" class="home-nav-link">PLAYERS</a></li>
        <li><a href="#tournaments" class="home-nav-link">TOURNAMENTS</a></li>
        <li><a href="puzzles.php" class="home-nav-link nav-link-puzzles" style="color: #fde047; font-weight: 800; text-shadow: 0 0 10px rgba(245, 158, 11, 0.4);"><span style="margin-right: 4px;">🧩</span>PUZZLES</a></li>
        <li><a href="game.php?view=analysis" class="home-nav-link">ANALYSIS</a></li>
        <li><a href="#rules" class="home-nav-link">RULES</a></li>
      </ul>

      <div class="nav-user-area" id="top-user-pill">
        <?php if ($currentUser): ?>
          <a href="dashboard.php" class="user-pill" style="text-decoration:none;" title="Open Player Dashboard">
            <span class="user-pill-avatar">👑</span>
            <span class="user-pill-name"><?= htmlspecialchars($currentUser['username']) ?></span>
            <span class="user-pill-rating"><?= (int)$currentUser['rating'] ?> Elo</span>
          </a>
          <a href="dashboard.php" class="btn btn-primary btn-small">Dashboard &rarr;</a>
        <?php else: ?>
          <a href="#auth-card" class="btn btn-primary btn-small">Sign In / Register</a>
        <?php endif; ?>
      </div>
    </div>
  </header>

  <!-- ================= HERO SECTION WITH AUTH CARD ================= -->
  <section class="hero-section">
    <div class="hero-container">
      
      <!-- Left Column: Inspiring Headline & Action CTA -->
      <div class="hero-content">
        <div class="hero-badge">🇳🇬 Official Nigerian 10x10 Rules &bull; Flying Kings</div>
        <h1 class="hero-title">
          Master the Board.<br>
          <span class="highlight">Conquer the Highway.</span>
        </h1>
        <p class="hero-description">
          AfroDraught is more than just a gaming platform—it's a global community built around the love of draughts. 
          Experience authentic street draughts with the 10x10 mirrored board, backward captures for seeds, flying kings, 
          and tournament-grade AI.
        </p>
        <p class="hero-description" style="font-weight: 700; color: #fde68a;">
          Play. Compete. Connect. Grow.
        </p>

        <div class="hero-cta-group">
          <a href="game.php" class="btn btn-primary btn-large">⚡ Play Online Now</a>
          <a href="puzzles.php" class="btn btn-secondary" style="background: linear-gradient(135deg, rgba(245, 166, 35, 0.25), rgba(217, 119, 6, 0.35)); border-color: rgba(245, 166, 35, 0.6); color: #fef08a; font-weight: 700;">🧩 Tactical Puzzles</a>
          <a href="game.php?mode=pve&diff=expert" class="btn btn-secondary">🤖 Challenge Master AI</a>
          <a href="game.php?mode=pvp" class="btn btn-secondary">👥 Pass & Play</a>
        </div>

        <div class="hero-stats-row">
          <div class="hero-stat-item">
            <span class="hero-stat-val">5,000+</span>
            <span class="hero-stat-lbl">Matches Played</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-val">10x10</span>
            <span class="hero-stat-lbl">Mirrored Arena</span>
          </div>
          <div class="hero-stat-item">
            <span class="hero-stat-val">₦4.5M</span>
            <span class="hero-stat-lbl">Tournament Prizes</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Sign In / Register Card (AfroDraught-Style) -->
      <div class="hero-auth-card" id="auth-card">
        <div class="auth-card-header">
          <div class="auth-icon-badge">👑</div>
          <h2 class="auth-card-title">Player Portal</h2>
          <p class="auth-card-sub">Sign in to save ratings, replay matches & join tournaments</p>
        </div>

        <div id="auth-forms-box">
          <div class="auth-tabs">
            <button type="button" class="auth-tab active" id="tab-login">Sign In</button>
            <button type="button" class="auth-tab" id="tab-register">New Account</button>
          </div>

          <div class="auth-alert" id="auth-alert" role="alert"></div>

          <!-- Sign In Form -->
          <form id="form-login" class="auth-form active" novalidate>
            <div class="form-group">
              <label for="login-id">Username or Email</label>
              <div class="input-with-icon">
                <span class="input-icon">👤</span>
                <input type="text" id="login-id" class="form-control" placeholder="e.g. LagosStreetKing" required autocomplete="username">
              </div>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input type="password" id="login-password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
                <button type="button" class="btn-toggle-pwd" data-target="login-password" title="Show or hide password">👁️</button>
              </div>
            </div>
            <button type="submit" id="btn-submit-login" class="btn btn-primary btn-block btn-large">
              Sign In & Enter Arena &rarr;
            </button>
            <div class="auth-guest-divider">
              <span>OR</span>
            </div>
            <a href="game.php" class="btn btn-secondary btn-block btn-guest">
              ⚡ Play Immediately as Guest
            </a>
            <div class="auth-perks-row">
              <span>✓ Elo Ranking</span>
              <span>✓ Move Replays</span>
              <span>✓ 100% Free</span>
            </div>
          </form>

          <!-- Register Form -->
          <form id="form-register" class="auth-form" novalidate>
            <div class="form-group">
              <label for="reg-username">Champion Username</label>
              <div class="input-with-icon">
                <span class="input-icon">👑</span>
                <input type="text" id="reg-username" class="form-control" placeholder="Choose player name (min 3 chars)" required autocomplete="username">
              </div>
            </div>
            <div class="form-group">
              <label for="reg-email">Email Address</label>
              <div class="input-with-icon">
                <span class="input-icon">✉️</span>
                <input type="email" id="reg-email" class="form-control" placeholder="you@example.com" required autocomplete="email">
              </div>
            </div>
            <div class="form-group">
              <label for="reg-password">Password (min 6 characters)</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input type="password" id="reg-password" class="form-control" placeholder="••••••••" minlength="6" required autocomplete="new-password">
                <button type="button" class="btn-toggle-pwd" data-target="reg-password" title="Show or hide password">👁️</button>
              </div>
            </div>
            <div class="form-group">
              <label for="reg-password-confirm">Confirm Password</label>
              <div class="input-with-icon">
                <span class="input-icon">🔒</span>
                <input type="password" id="reg-password-confirm" class="form-control" placeholder="••••••••" minlength="6" required autocomplete="new-password">
                <button type="button" class="btn-toggle-pwd" data-target="reg-password-confirm" title="Show or hide password">👁️</button>
              </div>
            </div>
            <button type="submit" id="btn-submit-register" class="btn btn-primary btn-block btn-large">
              Create Champion Profile &rarr;
            </button>
            <p class="auth-terms-hint">
              By joining, you agree to respectful street play & zero cheating.
            </p>
          </form>

          <!-- Email Verification Form (Shown after registration or when unverified) -->
          <form id="form-verify" class="auth-form" novalidate>
            <div class="auth-verify-header" style="text-align: center; margin-bottom: 16px;">
              <span style="font-size: 32px; display: block; margin-bottom: 6px;">✉️</span>
              <h3 style="margin: 0 0 6px; font-size: 18px; color: #f59e0b;">Verify Your Email</h3>
              <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.4;">
                We sent a 6-digit verification code to <br><strong id="verify-email-display" style="color: #38bdf8;"></strong>
              </p>
            </div>

            <input type="hidden" id="verify-hidden-email">

            <div class="form-group" style="text-align: center;">
              <label for="home-verify-code" style="display: block; margin-bottom: 8px;">Enter 6-Digit Code</label>
              <input type="text" id="home-verify-code" class="form-control" placeholder="••••••" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" required autocomplete="one-time-code" style="text-align: center; font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 8px; font-weight: 800; color: #f59e0b; background: rgba(15,23,42,0.85); border: 2px solid #f59e0b;">
            </div>

            <div id="dev-mode-otp-hint" style="display: none; background: rgba(245, 158, 11, 0.15); border: 1px dashed #f59e0b; border-radius: 6px; padding: 6px 10px; margin-bottom: 12px; font-size: 12px; color: #fde68a; text-align: center; cursor: pointer;">
              ⚡ Dev Mode: <span id="dev-otp-code"></span> (click to autofill)
            </div>

            <button type="submit" id="btn-submit-home-verify" class="btn btn-primary btn-block btn-large">
              Verify Code & Enter Arena &rarr;
            </button>

            <div style="margin-top: 14px; text-align: center; font-size: 13px; color: #94a3b8;">
              Didn't receive email? 
              <button type="button" id="btn-home-resend-code" style="background: none; border: none; color: #f59e0b; font-weight: 600; cursor: pointer; padding: 0; font-size: 13px;">Resend Code</button>
              <span id="home-resend-timer" style="display: none; color: #64748b;"> (60s)</span>
            </div>

            <div style="margin-top: 10px; text-align: center;">
              <button type="button" id="btn-back-to-login" style="background: none; border: none; color: #94a3b8; font-size: 12px; cursor: pointer; text-decoration: underline;">
                ← Back to Sign In
              </button>
            </div>
          </form>
        </div>

        <!-- Logged-in View (Shown when authenticated) -->
        <div class="logged-in-profile-box" id="logged-in-profile-box">
          <div class="logged-in-avatar" id="logged-user-avatar">👑</div>
          <div>
            <h3 class="logged-in-name" id="logged-user-name">Player</h3>
            <span class="logged-in-badge" id="logged-user-title">1200 Elo &bull; Street Player</span>
          </div>

          <div class="logged-in-stats-grid">
            <div>
              <span class="hero-stat-val" id="logged-stat-wins">0</span>
              <span class="hero-stat-lbl">Wins</span>
            </div>
            <div>
              <span class="hero-stat-val" id="logged-stat-losses">0</span>
              <span class="hero-stat-lbl">Losses</span>
            </div>
            <div>
              <span class="hero-stat-val" id="logged-stat-chopped">0</span>
              <span class="hero-stat-lbl">Chopped</span>
            </div>
          </div>

          <a href="dashboard.php" class="btn btn-primary btn-block btn-large">
            👑 Open Player Dashboard &rarr;
          </a>
          <a href="game.php" class="btn btn-secondary btn-block">
            🎮 Launch Game Arena &rarr;
          </a>
          <button id="btn-home-logout" class="btn btn-secondary btn-small" style="margin-top: 4px;">Sign Out</button>
        </div>

      </div>

    </div>
  </section>

  <!-- ================= GAME MODES SHOWCASE (AFRODRAUGHT-STYLE) ================= -->
  <section class="home-section" id="game-modes">
    <div class="section-header">
      <span class="section-tag">Game Arena Modes</span>
      <h2 class="section-title">How Do You Want to Play?</h2>
      <p class="section-sub">Choose your battleground: test your skills against our AI, play against a friend locally, compete in Nigerian championships, or master board tactics.</p>
    </div>

    <div class="modes-grid">
      <div class="mode-card">
        <div class="mode-header">
          <div class="mode-icon-circle">🤖</div>
          <span class="mode-badge">Single Player</span>
        </div>
        <h3>Play vs Grandmaster AI</h3>
        <p>Challenge 6 authentic skill tiers from Street Rookie to World Champion Engine. Powered by Iterative Deepening PVS, Opening Books, and live Telemetry HUD.</p>
        <ul class="mode-perks">
          <li>✓ 6 Engine Difficulty Levels</li>
          <li>✓ Real-Time Telemetry HUD</li>
          <li>✓ Quiescence Trap Calculation</li>
        </ul>
        <div class="mode-footer">
          <a href="game.php?mode=pve&diff=expert" class="btn btn-primary btn-block">Challenge Engine Now &rarr;</a>
        </div>
      </div>

      <div class="mode-card">
        <div class="mode-header">
          <div class="mode-icon-circle">👥</div>
          <span class="mode-badge">Local 2-Player</span>
        </div>
        <h3>Pass & Play Arena</h3>
        <p>Face off against a buddy side-by-side on desktop or tablet. Dual countdown clocks, undo support, and complete move logs.</p>
        <ul class="mode-perks">
          <li>✓ Dual Blitz / Rapid Clocks</li>
          <li>✓ Interactive Move History</li>
          <li>✓ Nigerian Street Slang Commentary</li>
        </ul>
        <div class="mode-footer">
          <a href="game.php?mode=pvp" class="btn btn-secondary btn-block">Start 2-Player Match &rarr;</a>
        </div>
      </div>

      <div class="mode-card highlight-card">
        <div class="mode-header">
          <div class="mode-icon-circle">🌐</div>
          <span class="mode-badge live-pulse">Live Online</span>
        </div>
        <h3>Online Room Multiplayer</h3>
        <p>Play against a friend anywhere across two phones or computers. Create a match code or enter a friend's room code to battle live.</p>
        <ul class="mode-perks">
          <li>✓ Instant 6-Char Match Codes</li>
          <li>✓ Synchronized Dual Clocks</li>
          <li>✓ Real-Time Move Streaming</li>
        </ul>
        <div class="mode-footer">
          <button type="button" class="btn btn-primary btn-block" id="btn-open-online-modal">Play Online with Code &rarr;</button>
        </div>
      </div>

      <div class="mode-card">
        <div class="mode-header">
          <div class="mode-icon-circle">🏆</div>
          <span class="mode-badge">Championships</span>
        </div>
        <h3>Tournaments & Brackets</h3>
        <p>Follow premier Nigerian competitions: Lagos Street Masters, Benin Oba Trophy, and Abuja Rapid Invitational with live brackets.</p>
        <ul class="mode-perks">
          <li>✓ ₦4.5M In Featured Prizes</li>
          <li>✓ Visual Quarter to Finals Trees</li>
          <li>✓ Real-Time Champion Standings</li>
        </ul>
        <div class="mode-footer">
          <a href="game.php?view=tournaments" class="btn btn-secondary btn-block">View Tournaments &rarr;</a>
        </div>
      </div>

      <div class="mode-card">
        <div class="mode-header">
          <div class="mode-icon-circle">🔬</div>
          <span class="mode-badge">Tactical Lab</span>
        </div>
        <h3>Board Analysis & Tactics</h3>
        <p>Set up any custom board position with drag-and-drop piece palette. Let the AI evaluation engine calculate winning combinations.</p>
        <ul class="mode-perks">
          <li>✓ Custom Piece Palette (Seeds & Kings)</li>
          <li>✓ AI Evaluation Gauge (-100% to +100%)</li>
          <li>✓ Recommended Best Move Highlighter</li>
        </ul>
        <div class="mode-footer">
          <a href="game.php?view=analysis" class="btn btn-secondary btn-block">Open Analysis Lab &rarr;</a>
        </div>
      </div>

      <div class="mode-card highlight-card" style="border-color: rgba(245, 158, 11, 0.5); background: linear-gradient(180deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95));">
        <div class="mode-header">
          <div class="mode-icon-circle" style="background: rgba(245, 158, 11, 0.2); border-color: rgba(245, 158, 11, 0.5);">🧩</div>
          <span class="mode-badge" style="background: #f59e0b; color: #000; font-weight: 800;">4 Skill Tiers</span>
        </div>
        <h3 style="color: #fde047;">Tactical Puzzles & Traps</h3>
        <p>Master street traps, sacrifice shots, and flying king ambushes. Solve 8 engine-tested draughts puzzles ranging from beginner to grandmaster level.</p>
        <ul class="mode-perks">
          <li>✓ 4 Tiers: Very Simple to Grandmaster</li>
          <li>✓ Visual Trajectory Hints & Solutions</li>
          <li>✓ Earn Street Coins for Solving</li>
        </ul>
        <div class="mode-footer">
          <a href="puzzles.php" class="btn btn-primary btn-block" style="background: linear-gradient(135deg, #f59e0b, #d97706); border-color: #f59e0b; color: #000; font-weight: 800;">🧩 Solve Tactical Puzzles &rarr;</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= FEATURES SECTION ================= -->
  <section class="home-section" id="features">
    <div class="section-header">
      <span class="section-tag">Why Naija Draughts?</span>
      <h2 class="section-title">Authentic African Board Heritage</h2>
      <p class="section-sub">Experience the authentic strategy and adrenaline of Nigerian street draughts built on modern web standards.</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon-box">📐</div>
        <h3>Authentic 10x10 Mirrored Board</h3>
        <p>Featuring the traditional Nigerian layout where the bottom-left square is light, and the Central Line (Highway) runs on the player's right hand.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-box">🍗</div>
        <h3>Backward Captures ("Chop Anywhere")</h3>
        <p>Ordinary seeds move forward, but can jump in all diagonal directions when capturing an opponent piece. Capturing is compulsory!</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-box">👑</div>
        <h3>The Flying King ("Oba")</h3>
        <p>Reaching the opponent's baseline crowns the Oba. Glide any distance along open diagonals and strike from across the board with multi-hop chops.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-box">🤖</div>
        <h3>Master-Grade AI Opponents</h3>
        <p>Challenge Street Rookie, Street Hustler, or Oga At The Top powered by Minimax search with Quiescence Search and tactical trap recognition.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-box">⏱️</div>
        <h3>Dual Clock Timers</h3>
        <p>Play with real-time draughts clocks: Blitz (3 min), Rapid (5 min), or Classical (10 min) with urgent low-time countdown sound effects.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-box">🔬</div>
        <h3>Board Position Analysis</h3>
        <p>Set up any custom board position, test combinations, and ask the AI evaluation engine to calculate win probabilities and the best move.</p>
      </div>
    </div>
  </section>

  <!-- ================= LIVE PREVIEWS (CHAMPIONS & TOURNAMENTS) ================= -->
  <section class="home-section" id="champions">
    <div class="section-header">
      <span class="section-tag">Hall of Fame & Championships</span>
      <h2 class="section-title">Live Draughts Champions</h2>
      <p class="section-sub">Real-time player rankings and tournament brackets from our MySQL database.</p>
    </div>

    <div class="preview-grid">
      <!-- Champions Leaderboard -->
      <div class="preview-card-box">
        <div class="preview-card-title-row">
          <h3>🏆 Top Rated Champions</h3>
          <a href="game.php?view=players" class="btn btn-secondary btn-small">View All</a>
        </div>
        <table class="leaderboard-preview-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Champion</th>
              <th>Rating</th>
              <th>Wins</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody id="preview-leaderboard-body">
            <tr><td colspan="5" class="text-center">Loading champions...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Active Tournaments -->
      <div class="preview-card-box" id="tournaments">
        <div class="preview-card-title-row">
          <h3>⚔️ Featured Championships</h3>
          <a href="game.php?view=tournaments" class="btn btn-secondary btn-small">View Brackets</a>
        </div>
        <div class="tournaments-preview-list" id="preview-tournaments-list" style="display:flex; flex-direction:column; gap:10px;">
          <p class="text-center">Loading tournaments...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= RULES BANTER SECTION ================= -->
  <section class="home-section" id="rules">
    <div class="section-header">
      <span class="section-tag">Street Code & Slang</span>
      <h2 class="section-title">How Naija Sabi Play</h2>
      <p class="section-sub">Learn the iconic street draughts terminology and rules.</p>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon-box">⚡</div>
        <h3>"Kiti-Kiti!"</h3>
        <p>The sound of rapid, continuous multi-jump captures clearing 3 or 4 enemy seeds in a single breathtaking turn.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-box">🍖</div>
        <h3>"Compulsory Chop!"</h3>
        <p>In Nigerian Draughts, you cannot ignore food! If an opponent piece is jumpable, you must chop it immediately.</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon-box">🛣️</div>
        <h3>"The Highway"</h3>
        <p>The central long diagonal connecting the corners. Nigerian players position this on their right hand to dominate king warfare.</p>
      </div>
    </div>
  </section>

  <!-- ================= AFRODRAUGHT-STYLE FOOTER ================= -->
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
            <span class="brand-tagline">AFRICAN BOARD GAME PLATFORM</span>
          </div>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.6; margin-top:8px;">
          Celebrating the rich heritage of African Draughts. Connect with players worldwide, master tactical board combinations, and rise to become the Oba of the board.
        </p>
      </div>

      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links-list">
          <li><a href="game.php">Play Online</a></li>
          <li><a href="#champions">Leaderboard</a></li>
          <li><a href="#tournaments">Tournaments</a></li>
          <li><a href="game.php?view=analysis">Analysis Board</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Rules & Guides</h4>
        <ul class="footer-links-list">
          <li><a href="#rules">Nigerian Draughts Rules</a></li>
          <li><a href="#rules">Flying King Mechanics</a></li>
          <li><a href="#rules">Backward Captures Guide</a></li>
          <li><a href="#rules">Tournament Standards</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Community</h4>
        <ul class="footer-links-list">
          <li><a href="game.php?view=chat">Street Corner Chat</a></li>
          <li><a href="#tournaments">Lagos Street Masters</a></li>
          <li><a href="#tournaments">Benin Kingdom Oba Cup</a></li>
          <li><a href="game.php?mode=pve&diff=expert">Challenge Master AI</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom-bar">
      <span>&copy; <?= date('Y') ?> Naija Draughts Platform. Built with HTML, CSS, PHP & MySQL.</span>
      <span>Inspired by AfroDraught &bull; Made for African Board Game Champions</span>
    </div>
  </footer>

  <!-- ================= ONLINE MULTIPLAYER MODAL ================= -->
  <div class="home-modal-overlay" id="online-room-modal">
    <div class="home-modal-dialog">
      <div class="home-modal-header">
        <div class="home-modal-title">
          <span>🌐</span> Online 2-Player Matchmaking
        </div>
        <button type="button" class="btn-close-home-modal" id="btn-close-room-modal">&times;</button>
      </div>
      <div class="home-modal-body">
        <div class="auth-tabs" style="margin-bottom:16px;">
          <button type="button" class="auth-tab active" id="tab-room-create">Create Match Room</button>
          <button type="button" class="auth-tab" id="tab-room-join">Join with Code</button>
        </div>

        <div class="auth-alert" id="room-alert"></div>

        <!-- Create Room Form -->
        <form id="form-create-room" class="auth-form active">
          <div class="form-group">
            <label for="room-player-name">Your Player Name</label>
            <input type="text" id="room-player-name" class="form-control" placeholder="Champion Name" value="<?= $currentUser ? htmlspecialchars($currentUser['username']) : '' ?>">
          </div>
          <div class="form-group">
            <label for="room-time-control">Timer Preset</label>
            <select id="room-time-control" class="form-control" style="background:#161d27; color:#fff;">
              <option value="rapid_5">Rapid (5 Minutes)</option>
              <option value="blitz_3">Blitz (3 Minutes)</option>
              <option value="classical_10">Classical (10 Minutes)</option>
            </select>
          </div>
          <button type="submit" id="btn-submit-create-room" class="btn btn-primary btn-block btn-large">
            ⚡ Generate Room Code & Launch &rarr;
          </button>
        </form>

        <!-- Join Room Form -->
        <form id="form-join-room" class="auth-form">
          <div class="form-group">
            <label for="join-player-name">Your Player Name</label>
            <input type="text" id="join-player-name" class="form-control" placeholder="Challenger Name" value="<?= $currentUser ? htmlspecialchars($currentUser['username']) : '' ?>">
          </div>
          <div class="form-group">
            <label for="join-room-code">Room Code (e.g. ND-XXXX)</label>
            <input type="text" id="join-room-code" class="form-control" placeholder="ND-XXXX" style="text-transform:uppercase; font-weight:bold; letter-spacing:2px; font-size:1.1rem;" required>
          </div>
          <button type="submit" id="btn-submit-join-room" class="btn btn-primary btn-block btn-large">
            🚀 Enter Match Room &rarr;
          </button>
        </form>
      </div>
    </div>
  </div>

  <script src="js/home.js?v=<?= filemtime(__DIR__ . '/js/home.js') ?>"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>
