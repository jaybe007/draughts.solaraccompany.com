<?php
if ((isset($_GET['mode']) && in_array($_GET['mode'], ['traps', 'puzzles'])) || (isset($_GET['view']) && in_array($_GET['view'], ['traps', 'puzzles']))) {
    header('Location: puzzles.php');
    exit;
}
require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Naija Draughts - Premier Online Nigerian Draught Board Game</title>
  <meta name="description" content="Play authentic 10x10 Nigerian Draughts online with flying kings, backward captures, clock timers, live tournaments, board analysis, and street corner chat.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#10b981">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body data-logged-in="<?= $currentUser ? 'true' : 'false' ?>" data-user-id="<?= $currentUser ? (int)$currentUser['id'] : '' ?>">
  <div class="app-wrapper">

    <!-- ================= TOP NAVIGATION BAR (AFRODRAUGHT-STYLE) ================= -->
    <header class="app-header">
      <div class="nav-brand-container">
        <a href="index.php" class="brand-link">
          <div class="flag-stripes">
            <span class="stripe green"></span>
            <span class="stripe white"></span>
            <span class="stripe green"></span>
          </div>
          <div class="brand-text">
            <span class="game-title">NAIJA DRAUGHTS</span>
            <span class="game-subtitle">PRO NIGERIAN 10x10 BOARD ARENA</span>
          </div>
        </a>
      </div>

      <!-- Functional Main Menu -->
      <nav class="main-nav">
        <ul class="nav-list">
          <li>
            <a href="index.php" class="nav-link" title="Return to Home Page">
              <span class="nav-icon">🏠</span> HOME
            </a>
          </li>
          <li>
            <a href="dashboard.php" class="nav-link" title="Open Player Command Portal">
              <span class="nav-icon">👑</span> DASHBOARD
            </a>
          </li>
          <li>
            <button id="nav-play" class="nav-link btn-nav-highlight" title="Start a New Game">
              <span class="nav-icon">🎮</span> PLAY
            </button>
          </li>
          <li>
            <button id="nav-players" class="nav-link" title="Player Directory & Leaderboard">
              <span class="nav-icon">👥</span> PLAYERS
            </button>
          </li>
          <li>
            <button id="nav-games" class="nav-link" title="Past Matches & Board Replays">
              <span class="nav-icon">⚔️</span> GAMES
            </button>
          </li>
          <li>
            <button id="nav-tournaments" class="nav-link" title="Nigerian Championships & Brackets">
              <span class="nav-icon">🏆</span> TOURNAMENTS
            </button>
          </li>
          <li>
            <button id="nav-analysis" class="nav-link" title="Position Editor & AI Evaluator">
              <span class="nav-icon">🔬</span> ANALYSIS
            </button>
          </li>
          <li>
            <button id="nav-chat" class="nav-link nav-link-chat" title="Street Corner Live Banter">
              <span class="nav-icon">💬</span> CHAT
              <span id="chat-unread-badge" class="badge-dot" style="display: none;"></span>
            </button>
          </li>
          <li>
            <button id="nav-rules" class="nav-link" title="Nigerian Draughts Rules">
              <span class="nav-icon">📜</span> RULES
            </button>
          </li>
          <li>
            <a href="puzzles.php" id="btn-open-traps" class="nav-link nav-highlight-traps" title="Lidraughts-Style Tactical Draughts Puzzles">
              <span class="nav-icon">🧩</span> PUZZLES
            </a>
          </li>
        </ul>
      </nav>

      <!-- Account & Quick Tools -->
      <div class="header-right-tools">
        <div id="auth-section" class="auth-section">
          <?php if ($currentUser): ?>
            <?php 
              $userRole = $currentUser['role'] ?? null;
              if ($userRole === null && !empty($currentUser['id'])) {
                  $roleCheckStmt = $db->prepare("SELECT role FROM users WHERE id = ?");
                  $roleCheckStmt->execute([(int)$currentUser['id']]);
                  $userRole = $roleCheckStmt->fetchColumn() ?: 'player';
              }
            ?>
            <?php if (in_array($userRole, ['admin', 'super_admin'])): ?>
              <a href="admin.php" class="btn btn-small btn-secondary" style="background:rgba(245,158,11,0.18); border-color:#f59e0b; color:#fde047; font-weight:800;" title="Open Admin Command Center">
                <span class="icon">🛡️</span> Admin
              </a>
            <?php endif; ?>
            <a href="dashboard.php" class="user-pill" id="user-pill" style="text-decoration: none;" title="Open Player Dashboard">
              <span class="user-pill-avatar">👑</span>
              <span class="user-pill-name" id="user-pill-name"><?= htmlspecialchars($currentUser['username']) ?></span>
              <span class="user-pill-rating" id="user-pill-rating"><?= (int)$currentUser['rating'] ?> Elo</span>
            </a>
            <a href="dashboard.php" class="btn btn-small btn-primary" title="Command Portal">Dashboard</a>
            <button id="btn-logout" class="btn btn-small btn-secondary" title="Sign Out">Logout</button>
          <?php else: ?>
            <button id="btn-open-auth" class="btn btn-primary btn-small" title="Sign in or register">
              <span class="icon">👤</span> Sign In
            </button>
          <?php endif; ?>
        </div>

        <button id="btn-sound-toggle" class="btn btn-icon" title="Toggle Sound Effects">
          <span class="icon" id="sound-icon">🔊</span>
        </button>
        <button id="btn-flip-board" class="btn btn-icon" title="Flip Board Perspective">
          <span class="icon">🔄</span>
        </button>
      </div>
    </header>

    <!-- ================= FLOATING DOCKS (ANALYSIS & REPLAY) ================= -->

    <!-- Analysis Palette Dock (Active in Analysis Mode) -->
    <div class="floating-dock" id="analysis-palette-dock">
      <div class="dock-header">
        <span class="dock-title">🔬 Board Position Analysis</span>
        <div class="eval-summary">
          <span id="eval-score-label">Evaluation: 0.0 (50% White)</span>
          <div class="eval-bar-track"><div id="eval-bar-fill" class="eval-bar-fill" style="width: 50%;"></div></div>
        </div>
        <button id="btn-exit-analysis" class="btn btn-small btn-secondary">&times; Exit</button>
      </div>
      <div class="dock-body">
        <div class="palette-tools">
          <button class="palette-btn active" data-tool="p1_man" title="Place White Seed">⚪ Seed</button>
          <button class="palette-btn" data-tool="p1_king" title="Place White Flying King">👑 White Oba</button>
          <button class="palette-btn" data-tool="p2_man" title="Place Dark Seed">⚫ Seed</button>
          <button class="palette-btn" data-tool="p2_king" title="Place Dark Flying King">👑 Dark Oba</button>
          <button class="palette-btn" data-tool="eraser" title="Erase Square">🧹 Eraser</button>
        </div>
        <div class="dock-actions">
          <select id="analysis-turn-select" class="form-select-small">
            <option value="1">White to move</option>
            <option value="2">Dark to move</option>
          </select>
          <button id="btn-clear-board" class="btn btn-small btn-secondary">Clear</button>
          <button id="btn-reset-board" class="btn btn-small btn-secondary">Reset</button>
          <button id="btn-eval-position" class="btn btn-small btn-primary">⚡ Evaluate</button>
        </div>
        <div class="eval-recommendation" id="eval-best-move">Select pieces to place on dark squares, then click Evaluate.</div>
      </div>
    </div>

    <!-- Replay Control Dock (Active in Replay Mode) -->
    <div class="floating-dock" id="replay-control-dock">
      <div class="dock-header">
        <span class="dock-title" id="replay-meta-label">Replaying Match</span>
        <span class="step-indicator" id="replay-step-label">Move 0 / 0</span>
        <button id="btn-replay-exit" class="btn btn-small btn-secondary">&times; Exit</button>
      </div>
      <div class="dock-controls">
        <button id="btn-replay-start" class="btn btn-icon" title="First Move">⏮️</button>
        <button id="btn-replay-prev" class="btn btn-icon" title="Previous Move">◀️</button>
        <button id="btn-replay-play" class="btn btn-icon btn-primary" title="Play/Pause">▶️</button>
        <button id="btn-replay-next" class="btn btn-icon" title="Next Move">▶️</button>
        <button id="btn-replay-end" class="btn btn-icon" title="Last Move">⏭️</button>
      </div>
    </div>

    <!-- ================= ONLINE MULTIPLAYER ROOM BANNER ================= -->
    <div class="online-room-banner" id="online-room-banner" style="display:none;">
      <div class="room-banner-left">
        <span class="room-live-dot"></span>
        <span class="room-code-tag" id="room-code-display">ND-XXXX</span>
        <span class="room-status-tag" id="room-status-display">Waiting for opponent to join...</span>
      </div>
      <div class="room-banner-right">
        <button type="button" class="btn btn-small btn-secondary" id="btn-copy-room-link" title="Copy room invite link">
          📋 Copy Invite Link
        </button>
        <button type="button" class="btn btn-small btn-secondary" id="btn-resign-room" title="Resign this match" style="color:#fca5a5; border-color:rgba(239,68,68,0.4);">
          🏳️ Resign
        </button>
      </div>
    </div>

    <!-- ================= MAIN GAME ARENA ================= -->
    <main class="game-container">
      
      <!-- Left Panel: Player 2 (Top/Dark) -->
      <aside class="sidebar player-card p2-card" id="card-p2">
        <div class="player-header">
          <div class="avatar p2-avatar">
            <span class="piece-icon p2-seed"></span>
          </div>
          <div class="player-meta">
            <h2 class="player-name" id="p2-name">Street Hustler</h2>
            <span class="player-role" id="p2-role">Computer (AI)</span>
          </div>
          <div class="clock-badge" id="p2-clock">05:00</div>
        </div>

        <div class="turn-indicator" id="p2-indicator">Waiting Turn</div>

        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-label">Seeds</span>
            <span class="stat-val" id="p2-seeds-count">20</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Kings (Oba)</span>
            <span class="stat-val" id="p2-kings-count">0</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Score</span>
            <span class="stat-val" id="p2-score">0</span>
          </div>
        </div>

        <div class="captured-tray">
          <span class="tray-title">Captured Seeds:</span>
          <div class="captured-pieces-list" id="p2-captured-tray"></div>
        </div>

        <!-- Street Commentary Card -->
        <div class="commentary-box">
          <div class="commentary-header">
            <span class="speaker-tag">🎙️ Naija Street Corner</span>
          </div>
          <p class="commentary-text" id="commentary-ticker">"Oya welcome! Place your hand on the board, make we see who sabi play pass."</p>
        </div>

        <!-- Engine Calculation Telemetry HUD (Active when playing vs AI) -->
        <div class="engine-telemetry-panel" id="engine-telemetry-panel">
          <div class="engine-header">
            <span class="engine-title"><span class="engine-pulse-dot" id="engine-pulse-dot"></span> 🤖 Engine Telemetry</span>
            <span class="engine-eval-badge eval-neutral" id="engine-eval-badge">+0.00</span>
          </div>
          <div class="engine-stats-grid">
            <div class="stat-cell">
              <span class="stat-cell-lbl">RULESET</span>
              <span class="stat-cell-val" id="engine-stat-ruleset" style="color: #4ade80; font-weight: 700;">NIGERIA</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-lbl">DEPTH</span>
              <span class="stat-cell-val" id="engine-stat-depth">-</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-lbl">NODES</span>
              <span class="stat-cell-val" id="engine-stat-nodes">0</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-lbl">SPEED</span>
              <span class="stat-cell-val" id="engine-stat-nps">-</span>
            </div>
            <div class="stat-cell">
              <span class="stat-cell-lbl">TT HITS</span>
              <span class="stat-cell-val" id="engine-stat-tt">0%</span>
            </div>
          </div>
          <div class="engine-pv-box">
            <span class="pv-lbl">PV LINE:</span>
            <div class="pv-line" id="engine-pv-line">Position balanced. Waiting for turn...</div>
          </div>
          <div class="engine-thinking-bar" id="engine-thinking-bar" style="display:none;"></div>
        </div>
      </aside>

      <!-- Center: Board Arena -->
      <section class="board-arena">
        
        <!-- Interactive Ruleset Selector Bar -->
        <div class="ruleset-selector-bar" id="ruleset-selector-bar">
          <span class="ruleset-bar-lbl">SELECT RULESET:</span>
          <div class="ruleset-pills-group" id="ruleset-pills-group">
            <label class="ruleset-pill-lbl active" id="lbl-ruleset-nigeria" title="Nigerian Street Draughts - Free Choice, Oba King, Highway">
              <input type="radio" name="ruleset_choice" value="nigeria" checked class="ruleset-radio-hidden">
              <span class="pill-flag">🇳🇬</span> <span class="pill-text">Nigeria</span>
            </label>
            <label class="ruleset-pill-lbl" id="lbl-ruleset-ghana" title="Ghana Damii - Free Choice, Immediate Crown Stop, 16-Move 3v1 Countdown">
              <input type="radio" name="ruleset_choice" value="ghana" class="ruleset-radio-hidden">
              <span class="pill-flag">🇬🇭</span> <span class="pill-text">Ghana</span>
            </label>
            <label class="ruleset-pill-lbl" id="lbl-ruleset-international" title="International Draughts (FMJD) - Strict Majority Capture, Rule 3.5 Non-Promotion">
              <input type="radio" name="ruleset_choice" value="international" class="ruleset-radio-hidden">
              <span class="pill-flag">🌍</span> <span class="pill-text">International</span>
            </label>
          </div>
        </div>

        <div class="quick-status-bar">
          <div class="highway-indicator" id="highway-indicator" title="Active Rules and Board Highway">
            <span class="highway-dot"></span> <span id="highway-indicator-text">🇳🇬 Nigerian Highway (Central Line) Active — Free Capture Choice</span>
          </div>
          <div class="ping-indicator" id="network-ping-indicator" title="Connection Latency">
            <span class="ping-dot"></span> <span id="ping-text">35ms</span>
          </div>
          <div class="quick-actions">
            <a href="puzzles.php" id="btn-quick-puzzles" class="btn btn-small btn-quick-puzzles" title="Lidraughts-Style Tactical Draughts Puzzles" style="text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">🧩 Puzzles</a>
            <button id="btn-toggle-trap-radar" class="btn btn-small" title="Toggle Trap Radar (Tactical Shot Advisor)">⚡ Trap Radar</button>
            <button id="btn-share-match-link" class="btn btn-small btn-secondary" title="Share Match Replay URL">🔗 Share</button>
            <button id="btn-copy-pdn-match" class="btn btn-small btn-secondary" title="Copy Standard Draughts Notation (PDN)">📋 PDN</button>
            <button id="btn-undo-move" class="btn btn-small" title="Undo Move">↩️ Undo</button>
            <button id="btn-open-game-setup" class="btn btn-small btn-primary" title="New Game Setup">⚡ New Match</button>
          </div>
        </div>

        <!-- Active Trap Banner (Active in Trap Academy Mode) -->
        <div class="trap-active-banner" id="trap-active-banner" style="display:none;">
          <div class="trap-active-content" style="width: 100%;">
            <div class="trap-active-header">
              <span class="trap-title" id="trap-active-title">🪤 TRAP: The Nigerian Highway Ambush</span>
              <div class="trap-hud-actions">
                <button id="btn-trap-hint" class="btn btn-small btn-secondary" title="Tactical Hint">💡 Hint</button>
                <button id="btn-trap-reset" class="btn btn-small btn-secondary" title="Reset Trap Position">🔄 Reset</button>
                <button id="btn-trap-exit" class="btn btn-small btn-secondary" title="Exit Trap Mode" style="color: #f87171; border-color: rgba(239, 68, 68, 0.4);">&times; Exit</button>
              </div>
            </div>
            <p class="trap-brief" id="trap-active-brief" style="margin-top: 6px;"></p>
            <div class="trap-step-instruction" id="trap-step-instruction" style="margin-top: 8px;"></div>
          </div>
        </div>

        <!-- Board Arena Container with Live Evaluation Bar -->
        <div class="board-container-with-eval">
          <!-- Live Engine Evaluation Bar -->
          <div class="board-eval-bar" id="board-eval-bar" title="Live Position Evaluation (White vs Black Advantage)">
            <div class="eval-bar-fill" id="eval-bar-fill" style="height: 50%;"></div>
            <span class="eval-bar-score" id="eval-bar-score">0.0</span>
          </div>

          <!-- Board Wood Frame (10x10 Nigerian Mirrored Board) -->
          <div class="board-wood-frame" id="board-wood-frame" style="position: relative;">
            <svg id="board-tactical-svg" class="board-tactical-overlay">
              <defs>
                <marker id="arrowhead-gold" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
                </marker>
                <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#10b981" />
                </marker>
              </defs>
            </svg>
            <div class="board-inner" id="draughts-board">
              <!-- Squares generated dynamically via JavaScript -->
            </div>
          </div>
        </div>

        <!-- Status Notice / Alert Banner -->
        <div class="status-banner" id="status-banner">
          <span id="banner-text">Game started! White to move. Compulsory capture is ON.</span>
        </div>
      </section>

      <!-- Right Panel: Player 1 (Bottom/White) -->
      <aside class="sidebar player-card p1-card" id="card-p1">
        <div class="player-header">
          <div class="avatar p1-avatar">
            <span class="piece-icon p1-seed"></span>
          </div>
          <div class="player-meta">
            <h2 class="player-name" id="p1-name"><?= $currentUser ? htmlspecialchars($currentUser['username']) : 'Champion (Guest)' ?></h2>
            <span class="player-role" id="p1-role"><?= $currentUser ? 'Rating: ' . (int)$currentUser['rating'] . ' Elo' : 'Player 1' ?></span>
          </div>
          <div class="clock-badge active" id="p1-clock">05:00</div>
        </div>

        <div class="turn-indicator active" id="p1-indicator">Active Turn</div>

        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-label">Seeds</span>
            <span class="stat-val" id="p1-seeds-count">20</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Kings (Oba)</span>
            <span class="stat-val" id="p1-kings-count">0</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Score</span>
            <span class="stat-val" id="p1-score">0</span>
          </div>
        </div>

        <div class="captured-tray">
          <span class="tray-title">Captured Seeds:</span>
          <div class="captured-pieces-list" id="p1-captured-tray"></div>
        </div>

        <!-- Move History Box -->
        <div class="history-panel">
          <div class="history-header">
            <span>Move History</span>
            <span class="move-count" id="move-count-badge">0 moves</span>
          </div>
          <div class="history-list" id="move-history-list">
            <div class="history-empty">No moves yet. Make your opening move!</div>
          </div>
        </div>
      </aside>

    </main>
  </div>

  <!-- ================= SLIDE-OUT STREET CHAT DRAWER ================= -->
  <div class="chat-drawer" id="chat-drawer">
    <div class="chat-header">
      <div class="chat-header-title">
        <span class="chat-icon">💬</span>
        <span>Street Corner Live Banter</span>
      </div>
      <button class="chat-close" id="btn-close-chat">&times;</button>
    </div>

    <!-- Quick Pidgin Shouts -->
    <div class="chat-shout-bar">
      <button class="chat-shout-btn" data-shout="Chop am clean! 🍖">Chop am! 🍖</button>
      <button class="chat-shout-btn" data-shout="Kiti-kiti! ⚡">Kiti-kiti! ⚡</button>
      <button class="chat-shout-btn" data-shout="Oba don show face! 👑">Oba! 👑</button>
      <button class="chat-shout-btn" data-shout="You don enter trap! 🪤">Trap! 🪤</button>
      <button class="chat-shout-btn" data-shout="No shaking! 🛡️">No shaking! 🛡️</button>
    </div>

    <!-- Messages Container -->
    <div class="chat-messages" id="chat-messages-container">
      <div class="chat-bubble"><div class="chat-sender">System</div><div class="chat-content">Welcome to Naija Draughts street chat!</div></div>
    </div>

    <!-- Message Input -->
    <form class="chat-input-form" id="chat-form">
      <input type="text" id="chat-input-text" placeholder="Type banter or comment..." maxlength="200" required>
      <button type="submit" class="btn btn-primary btn-small">Send</button>
    </form>
  </div>

  <!-- ================= MODALS ================= -->

  <!-- 1. GAME SETUP / PLAY MODAL -->
  <div class="modal-overlay" id="modal-game-setup">
    <div class="modal-card create-game-modal-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="icon">🎮</span>
          <h2 class="modal-title">Create Match & Game Setup</h2>
        </div>
        <button class="modal-close" id="btn-close-game-setup">&times;</button>
      </div>
      <div class="modal-body create-game-modal-body">
        <form id="form-game-setup">
          <div class="create-game-grid">
            
            <!-- Section 1: Format & Rules -->
            <div class="create-game-section-title">
              <span>🎮</span> 1. Match Format & Rules
            </div>

            <!-- Game Type: 1 Player / 2 Player segmented options -->
            <div class="form-group create-game-full">
              <label class="form-label-bold" style="margin-bottom: 6px; display: block; font-weight: 600;">Game Type</label>
              <div class="segmented-options" id="setup-game-type-segmented">
                <button type="button" class="segmented-btn active" data-type="1p" id="btn-setup-type-1p">👤 1 Player (vs AI)</button>
                <button type="button" class="segmented-btn" data-type="2p" id="btn-setup-type-2p">👥 2 Player (Online Room)</button>
              </div>
              <input type="hidden" id="setup-game-type" value="1p">
            </div>

            <!-- AI Engine Strength (Visible for 1-Player vs AI) -->
            <div class="form-group" id="setup-ai-difficulty-wrap">
              <label for="setup-ai-difficulty" style="font-weight: 600;">🤖 AI Engine Strength</label>
              <select id="setup-ai-difficulty" class="form-select">
                <option value="beginner">Beginner (Level 1 - Casual)</option>
                <option value="intermediate">Intermediate (Level 2 - Club Player)</option>
                <option value="advanced">Advanced (Level 3 - State Contender)</option>
                <option value="expert" selected>Expert (Level 4 - National Master)</option>
                <option value="master">Master (Level 5 - Grandmaster Oba)</option>
                <option value="grandmaster">Grandmaster (Level 6 - World Champion Engine)</option>
              </select>
            </div>

            <!-- Rule Type dropdown -->
            <div class="form-group">
              <label for="setup-rule-type" style="font-weight: 600;">Rule Type</label>
              <select id="setup-rule-type" class="form-select">
                <option value="nigeria" selected>🇳🇬 Nigeria (Free Choice, Flying Kings)</option>
                <option value="ghana">🇬🇭 Ghana (Damii - Immediate Crown Stop, 16-Move 3v1)</option>
                <option value="international">🌍 International (FMJD - Strict Majority Capture)</option>
              </select>
            </div>

            <!-- Section 2: Stakes & Time -->
            <div class="create-game-section-title">
              <span>⏱️</span> 2. Stakes & Time Controls
            </div>

            <!-- Coins Required to Play (Required) dropdown -->
            <div class="form-group">
              <label for="setup-coins-required" style="font-weight: 600;">Coins Required to Play <span style="color: #ef4444;">*</span></label>
              <select id="setup-coins-required" class="form-select">
                <option value="free" selected>Free</option>
                <option value="10">10 coins</option>
                <option value="20">20 coins</option>
                <option value="30">30 coins</option>
                <option value="40">40 coins</option>
                <option value="50">50 coins</option>
                <option value="100">100 coins</option>
                <option value="500">500 coins</option>
                <option value="600">600 coins</option>
                <option value="700">700 coins</option>
                <option value="800">800 coins</option>
                <option value="900">900 coins</option>
                <option value="1000">1000 coins</option>
                <option value="custom">Type coins</option>
              </select>
              <div id="setup-custom-coins-wrap" class="custom-coins-input-wrap">
                <input type="number" id="setup-custom-coins-val" class="form-input" placeholder="Enter coin amount (e.g. 250)" min="1" max="100000">
              </div>
            </div>

            <!-- Real-Money Cash Stake (Naira) Option -->
            <div class="form-group" id="setup-cash-wager-group" style="display: none;">
              <label for="setup-cash-stake" style="font-weight: 600;">💰 Cash Wager Stake (₦ Naira)</label>
              <select id="setup-cash-stake" class="form-select">
                <option value="0" selected>None (Play for Fun / Coins only)</option>
                <option value="500">₦500 Stake (Pot: ₦1,000 • Winner takes ₦920)</option>
                <option value="1000">₦1,000 Stake (Pot: ₦2,000 • Winner takes ₦1,840)</option>
                <option value="2000">₦2,000 Stake (Pot: ₦4,000 • Winner takes ₦3,680)</option>
                <option value="5000">₦5,000 Stake (Pot: ₦10,000 • Winner takes ₦9,200)</option>
                <option value="10000">₦10,000 Stake (Pot: ₦20,000 • Winner takes ₦18,400)</option>
              </select>
              <div id="cash-wager-preview-badge" style="display: none; margin-top: 6px; padding: 6px 10px; background: rgba(245, 158, 11, 0.12); border: 1px dashed #f59e0b; border-radius: 6px; font-size: 12px; color: #fde68a;">
                ⚡ Cash Match: Automated Escrow Lock • 8% House Rake (4% for VIP Oba)
              </div>
            </div>

            <!-- Player Time dropdown -->
            <div class="form-group">
              <label for="setup-player-time" style="font-weight: 600;">Player Time</label>
              <select id="setup-player-time" class="form-select">
                <option value="none">None</option>
                <option value="1">1 min</option>
                <option value="3">3 min</option>
                <option value="4">4 min</option>
                <option value="5" selected>5 min</option>
                <option value="6">6 min</option>
                <option value="7">7 min</option>
                <option value="8">8 min</option>
                <option value="9">9 min</option>
                <option value="10">10 min</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 minute</option>
              </select>
            </div>

            <!-- Player 1 Short (Handicap) dropdown -->
            <div class="form-group">
              <label for="setup-p1-short" style="font-weight: 600;">Player 1 Short (Handicap)</label>
              <select id="setup-p1-short" class="form-select">
                <option value="0" selected>None</option>
                <option value="1">1 piece</option>
                <option value="2">2 pieces</option>
                <option value="3">3 pieces</option>
                <option value="4">4 pieces</option>
                <option value="5">5 pieces</option>
              </select>
            </div>

            <!-- Section 3: Board & Conditions -->
            <div class="create-game-section-title">
              <span>🎨</span> 3. Board Theme & Conditions
            </div>

            <!-- Modifications (Conditions) dropdown -->
            <div class="form-group">
              <label for="setup-modifications" style="font-weight: 600;">Modifications (Conditions)</label>
              <select id="setup-modifications" class="form-select">
                <option value="none" selected>None</option>
                <option value="crown_start_left_left">Crown start left left</option>
                <option value="crown_start_middle_middle">Crown start middle middle</option>
                <option value="draw_odds_p2">2nd player find draw</option>
                <option value="adv_1m">1 min advantage</option>
                <option value="adv_3m">3 min advantage</option>
                <option value="adv_5m">5 min advantage</option>
                <option value="adv_7m">7 min advantage</option>
                <option value="inc_1s">1 second increment</option>
                <option value="inc_3s">3 second increment</option>
                <option value="inc_5s">5 second increment</option>
                <option value="ten_aside">Ten aside</option>
                <option value="random_ten_aside">Random ten aside</option>
              </select>
            </div>

            <!-- Board Type dropdown -->
            <div class="form-group">
              <label for="setup-board-type" style="font-weight: 600;">Board Type</label>
              <select id="setup-board-type" class="form-select">
                <option value="default" selected>Default Classic</option>
                <option value="eco_giant">Eco Giant</option>
                <option value="golden_state">Golden State</option>
                <option value="safari_land">Safari Land</option>
                <option value="mineral_grove">Mineral Grove</option>
                <option value="diamond_coast">Diamond Coast</option>
              </select>
            </div>

            <!-- Section 4: Rules & Toggles -->
            <div class="create-game-section-title">
              <span>⚙️</span> 4. Match Rules & Gameplay Toggles
            </div>

            <!-- Settings: 7 ON/OFF toggle switches -->
            <div class="form-group create-game-full">
              <div class="toggles-grid">
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">↩️ Undo allowed</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-undo" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔒 Private game</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-private">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🏆 To win</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-towin" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔇 Disable chat</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-chat">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">🔊 Sound on</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-sound" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item">
                  <span class="toggle-label-text">✨ Highlight moves</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-highlight" checked>
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                <div class="toggle-switch-item" style="grid-column: 1 / -1;">
                  <span class="toggle-label-text">🔬 Analysis mode</span>
                  <label class="toggle-switch">
                    <input type="checkbox" id="setup-toggle-analysis">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="btn-cancel-game-setup">Cancel</button>
        <button class="btn btn-primary btn-large" id="btn-start-match">⚡ Create & Launch Match</button>
      </div>
    </div>
  </div>

  <!-- 2. PLAYERS DIRECTORY MODAL -->
  <div class="modal-overlay" id="modal-players">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="icon">👥</span>
          <h2 class="modal-title">Draughts Champions & Players Directory</h2>
        </div>
        <button class="modal-close" id="btn-close-players">&times;</button>
      </div>
      <div class="modal-body">
        <div class="search-bar-row">
          <input type="text" id="player-search-input" placeholder="🔍 Search champions by name or country..." class="search-input">
        </div>
        <div class="players-grid" id="players-directory-list">
          <p class="text-center">Loading players...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. GAMES / MATCHES & REPLAY MODAL -->
  <div class="modal-overlay" id="modal-games">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="icon">⚔️</span>
          <h2 class="modal-title">Matches Archive & Board Replays</h2>
        </div>
        <button class="modal-close" id="btn-close-games">&times;</button>
      </div>
      <div class="modal-body">
        <p class="modal-intro">Browse previous games and click <strong>"Replay"</strong> to step through moves on the board.</p>
        <div class="matches-table-container">
          <div id="games-archive-list" class="matches-history-list">
            <p class="text-center">Loading matches...</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 4. TOURNAMENTS HUB MODAL -->
  <div class="modal-overlay" id="modal-tournaments">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="icon">🏆</span>
          <h2 class="modal-title">Naija Championships & Tournament Brackets</h2>
        </div>
        <button class="modal-close" id="btn-close-tournaments">&times;</button>
      </div>
      <div class="modal-body">
        <div class="tournaments-cards" id="tournaments-container">
          <p class="text-center">Loading tournaments...</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 5. AUTH MODAL (LOGIN & REGISTER) -->
  <div class="modal-overlay" id="auth-modal">
    <div class="modal-card auth-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="flag-icon">🇳🇬</span>
          <h2 class="modal-title">Naija Draft Player Portal</h2>
        </div>
        <button class="modal-close" id="btn-close-auth">&times;</button>
      </div>

      <div class="auth-tabs">
        <button class="auth-tab active" id="tab-login">Sign In</button>
        <button class="auth-tab" id="tab-register">New Account</button>
      </div>

      <div class="auth-alert" id="auth-alert" style="display: none;"></div>

      <form id="form-login" class="auth-form active">
        <div class="form-group">
          <label for="login-id">Username or Email</label>
          <input type="text" id="login-id" placeholder="e.g. LagosMaster" required autocomplete="username">
        </div>
        <div class="form-group">
          <label for="login-password">Password</label>
          <input type="password" id="login-password" placeholder="••••••••" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn btn-primary btn-large btn-block">Enter Arena &rarr;</button>
      </form>

      <form id="form-register" class="auth-form">
        <div class="form-group">
          <label for="reg-username">Champion Username</label>
          <input type="text" id="reg-username" placeholder="Choose player name" required autocomplete="username">
        </div>
        <div class="form-group">
          <label for="reg-email">Email Address</label>
          <input type="email" id="reg-email" placeholder="you@example.com" required autocomplete="email">
        </div>
        <div class="form-group">
          <label for="reg-password">Password (min 6 chars)</label>
          <input type="password" id="reg-password" placeholder="••••••••" minlength="6" required autocomplete="new-password">
        </div>
        <button type="submit" class="btn btn-primary btn-large btn-block">Register Profile &rarr;</button>
      </form>

      <!-- Verification Form -->
      <form id="form-verify" class="auth-form" style="display: none;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 28px; display: block; margin-bottom: 4px;">✉️</span>
          <h3 style="margin: 0 0 6px; font-size: 16px; color: var(--gold-500, #f59e0b);">Verify Email Address</h3>
          <p style="margin: 0; font-size: 12px; color: #cbd5e1; line-height: 1.4;">
            We sent a 6-digit code to <br><strong id="game-verify-email-display" style="color: #38bdf8;"></strong>
          </p>
        </div>

        <input type="hidden" id="game-verify-hidden-email">

        <div class="form-group" style="text-align: center;">
          <label for="game-verify-code" style="display: block; margin-bottom: 6px;">Enter 6-Digit Code</label>
          <input type="text" id="game-verify-code" placeholder="••••••" maxlength="6" pattern="[0-9]{6}" inputmode="numeric" required style="text-align: center; font-family: 'Courier New', monospace; font-size: 22px; letter-spacing: 6px; font-weight: 800; color: #f59e0b; background: rgba(15,23,42,0.85); border: 2px solid #f59e0b;">
        </div>

        <div id="game-dev-otp-hint" style="display: none; background: rgba(245, 158, 11, 0.15); border: 1px dashed #f59e0b; border-radius: 6px; padding: 6px 10px; margin-bottom: 12px; font-size: 12px; color: #fde68a; text-align: center; cursor: pointer;">
          ⚡ Dev Mode: <span id="game-dev-otp-code"></span> (click to autofill)
        </div>

        <button type="submit" id="btn-submit-game-verify" class="btn btn-primary btn-large btn-block">
          Verify Code & Enter Arena &rarr;
        </button>

        <div style="margin-top: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
          Didn't receive code? 
          <button type="button" id="btn-game-resend-code" style="background: none; border: none; color: #f59e0b; font-weight: 600; cursor: pointer; padding: 0;">Resend Code</button>
          <span id="game-resend-timer" style="display: none; color: #64748b;"> (60s)</span>
        </div>

        <div style="margin-top: 10px; text-align: center;">
          <button type="button" id="btn-game-back-login" style="background: none; border: none; color: #94a3b8; font-size: 12px; cursor: pointer; text-decoration: underline;">
            ← Back to Sign In
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- 6. RULES MODAL (MULTI-RULESET BROWSER) -->
  <div class="modal-overlay" id="rules-modal">
    <div class="modal-card modal-large">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <span class="flag-icon">📜</span>
          <h2 class="modal-title">Official Draughts Rulebooks</h2>
        </div>
        <button class="modal-close" id="btn-close-rules">&times;</button>
      </div>

      <!-- Rulebook Navigation Tabs -->
      <div class="auth-tabs" style="margin-bottom: 16px;">
        <button type="button" class="auth-tab active" id="tab-rule-nigeria" onclick="switchRuleModalTab('nigeria')">🇳🇬 Nigeria Rules</button>
        <button type="button" class="auth-tab" id="tab-rule-ghana" onclick="switchRuleModalTab('ghana')">🇬🇭 Ghana Damii</button>
        <button type="button" class="auth-tab" id="tab-rule-intl" onclick="switchRuleModalTab('international')">🌍 International (FMJD)</button>
      </div>

      <div class="modal-body">
        <!-- 1. Nigeria Rules Panel -->
        <div class="rule-tab-panel active" id="rule-panel-nigeria">
          <div class="rule-section highlight-rule">
            <h3>🇳🇬 1. Mirrored Board & The Central Line (Nigerian Highway)</h3>
            <p>
              The Nigerian 10x10 board is mirrored: the <strong>bottom-left corner is LIGHT</strong>, and the <strong>Central Line (Highway / Longest Diagonal)</strong> runs on the player's <strong>RIGHT-HAND SIDE</strong> from bottom-right (sq 50) to top-left (sq 1)!
            </p>
          </div>
          <div class="rule-section highlight-rule">
            <h3>2. Free Choice of Capture Path</h3>
            <p>
              Captures are strictly compulsory, but unlike International rules, Nigerian Street Draughts grants <strong>FREE CHOICE</strong>: if multiple capture lines exist, you can choose any sequence you prefer.
            </p>
          </div>
          <div class="rule-section">
            <h3>3. Backward Captures for Ordinary Seeds ("Chop Anywhere")</h3>
            <p>
              Ordinary pieces advance diagonally forward, but when capturing an enemy seed, <strong>ordinary seeds CAN JUMP BOTH FORWARD AND BACKWARD!</strong>
            </p>
          </div>
          <div class="rule-section">
            <h3>4. The Flying King ("Oba" / "Long King")</h3>
            <p>
              Kings can glide across open diagonals, capture from a distance, and land on <em>any vacant square beyond</em> along that diagonal!
            </p>
          </div>
          <div class="rule-section">
            <h3>5. Draw Rules</h3>
            <p>
              Draw by 25 consecutive king moves without a capture, 3-fold repetition of position, or mutual agreement.
            </p>
          </div>
        </div>

        <!-- 2. Ghana Damii Panel -->
        <div class="rule-tab-panel" id="rule-panel-ghana" style="display: none;">
          <div class="rule-section highlight-rule">
            <h3>🇬🇭 1. Ghanaian Damii Promotion: Immediate Turn End</h3>
            <p>
              When a piece reaches the opponent's backline (the promotion line), <strong>your turn terminates immediately and the piece is crowned as King</strong>. The piece cannot jump backward or continue in the same move; it begins moving as King on subsequent turns!
            </p>
          </div>
          <div class="rule-section highlight-rule">
            <h3>2. Ghana 16-Move Rule (3 Kings vs 1 King)</h3>
            <p>
              In Ghanaian Draughts Association (GDA) and street play, if an endgame reaches <strong>3 Kings vs 1 King</strong>, the player with 3 Kings has a strict limit of <strong>16 moves</strong> to capture the lone King. If not captured within 16 moves, a <strong>DRAW</strong> is officially declared!
            </p>
          </div>
          <div class="rule-section">
            <h3>3. Free Choice of Captures</h3>
            <p>
              Captures are compulsory. Like Nigeria, Ghana Damii does NOT enforce maximum capture: players have the freedom to pick any capture sequence.
            </p>
          </div>
          <div class="rule-section">
            <h3>4. Flying Kings ("Nkorɔma")</h3>
            <p>
              Kings glide any distance across empty diagonals and capture from a distance.
            </p>
          </div>
        </div>

        <!-- 3. International Draughts Panel -->
        <div class="rule-tab-panel" id="rule-panel-international" style="display: none;">
          <div class="rule-section highlight-rule">
            <h3>🌍 1. Strict Majority Capture (Compulsory Maximum)</h3>
            <p>
              Under official FMJD International Draughts regulations, when multiple capture sequences are available, the player <strong>MUST choose the line that captures the MAXIMUM NUMBER of pieces</strong>! Quality does not matter (capturing 3 men overrides capturing 2 kings).
            </p>
          </div>
          <div class="rule-section highlight-rule">
            <h3>2. FMJD Rule 3.5: Mid-Jump Non-Promotion</h3>
            <p>
              A man that traverses the king row during a multiple jump <strong>ONLY promotes if it STOPS on the king row</strong> at the end of the jump. If it has a continuing capture off the king row, it <strong>must continue jumping as a MAN and does NOT promote</strong>!
            </p>
          </div>
          <div class="rule-section">
            <h3>3. Standard FMJD Board Orientation</h3>
            <p>
              The dark corner square is placed on each player's bottom-left. 50 active dark squares, 20 pieces per side.
            </p>
          </div>
          <div class="rule-section">
            <h3>4. Official Draw Rules</h3>
            <p>
              Draw by 25 consecutive king moves without capture, 16 moves in 3 Kings vs 1 King, 5 moves in 2 Kings vs 1 King on main diagonal, or 3-fold repetition.
            </p>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="btn-modal-got-it">Got It, Let's Play!</button>
      </div>
    </div>
  </div>

  <!-- 7. GAME OVER VICTORY / DEFEAT MODAL -->
  <div class="modal-overlay" id="game-over-modal">
    <div class="modal-card game-over-card" style="position: relative;">
      <button class="modal-close" id="btn-close-game-over" title="Close to review final board" style="position: absolute; top: 14px; right: 18px;">&times;</button>
      <div class="winner-trophy" id="winner-trophy-icon">🏆</div>
      <h2 class="game-over-title" id="game-over-title">VICTORY!</h2>
      <p class="game-over-sub" id="game-over-sub">Player 1 took all seeds!</p>
      <div class="game-over-stats">
        <div class="go-stat">
          <span class="go-stat-val" id="go-moves-count">0</span>
          <span class="go-stat-lbl">Moves</span>
        </div>
        <div class="go-stat">
          <span class="go-stat-val" id="go-p1-chopped">0</span>
          <span class="go-stat-lbl">P1 Chopped</span>
        </div>
        <div class="go-stat">
          <span class="go-stat-val" id="go-p2-chopped">0</span>
          <span class="go-stat-lbl">P2 Chopped</span>
        </div>
      </div>
      <!-- Accuracy & Move Quality Breakdown -->
      <div class="game-over-accuracy" id="go-accuracy-panel">
        <div class="go-acc-cols">
          <div class="go-acc-col">
            <div class="go-acc-title">P1 Accuracy</div>
            <div class="go-acc-score" id="go-p1-accuracy" style="color: #10b981;">--%</div>
          </div>
          <div class="go-acc-divider"></div>
          <div class="go-acc-col">
            <div class="go-acc-title">P2 Accuracy</div>
            <div class="go-acc-score" id="go-p2-accuracy" style="color: #38bdf8;">--%</div>
          </div>
        </div>
        <div class="go-acc-badges">
          <span class="go-badge" style="color: #22c55e;">🟢 <strong id="go-best-count">0</strong> Best</span>
          <span class="go-badge" style="color: #eab308;">🟡 <strong id="go-inacc-count">0</strong> Inacc</span>
          <span class="go-badge" style="color: #f97316;">🟠 <strong id="go-mistake-count">0</strong> Mistake</span>
          <span class="go-badge" style="color: #ef4444;">🔴 <strong id="go-blunder-count">0</strong> Blunder</span>
        </div>
      </div>
      <div class="game-over-actions" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary btn-large" id="btn-play-again">⚡ Play Rematch</button>
        <button class="btn btn-secondary btn-large" id="btn-review-board">🔬 Review Board</button>
      </div>
    </div>
  </div>

  <!-- 8. STREET TRAP ACADEMY MODAL -->
  <div class="modal-overlay hidden" id="trap-academy-modal" style="display: none;">
    <div class="modal-card trap-academy-card">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <h2 class="modal-title">🧩 Tactical Puzzles & Trap Academy</h2>
          <span class="modal-subtitle">Master legendary Nigerian, Ghanaian & International draughts puzzles, shots, and sacrifices</span>
        </div>
        <button class="modal-close" id="btn-close-trap-academy">&times;</button>
      </div>
      <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
        <div class="trap-academy-intro" style="background: rgba(245, 166, 35, 0.08); border: 1px solid rgba(245, 166, 35, 0.25); border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; font-size: 0.88rem; color: #fde68a;">
          <strong>⚡ Street Wisdom:</strong> In West African draughts, setting traps is the true mark of an <em>Oga At The Top</em>! A trap forces the opponent into compulsory captures, culminating in an unstoppable multi-jump counter-strike or King-kill!
        </div>
        <div class="trap-cards-grid" id="trap-cards-grid">
          <!-- Populated by js/traps.js -->
        </div>
      </div>
    </div>
  </div>

  <!-- 9. TRAP SOLVED CELEBRATION OVERLAY -->
  <div class="modal-overlay hidden" id="trap-celebration-overlay" style="display: none; z-index: 1200;">
    <div class="modal-card trap-celebration-card">
      <div class="trap-celebration-trophy">🏆</div>
      <h2 class="trap-celebration-title">GBAM! TRAP SOLVED!</h2>
      <p class="trap-celebration-sub">Sweet Execution! You Sabi Play Die!</p>
      <div class="trap-reward-badge">💰 +50 Street Coins Awarded</div>
      <div class="trap-celebration-box" id="trap-celebration-explanation">
        Tactical explanation will load here.
      </div>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary btn-large" id="btn-trap-next">⚡ Next Tactical Trap &rarr;</button>
      </div>
    </div>
  </div>

  <!-- 10. TOAST NOTIFICATIONS CONTAINER -->
  <div class="toast-container" id="toast-container"></div>

  <script type="module" src="js/app.js?v=<?= filemtime(__DIR__ . '/js/app.js') ?>"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>
