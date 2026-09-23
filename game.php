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
  <link rel="stylesheet" href="lidraughts_game.css?v=<?= filemtime(__DIR__ . '/lidraughts_game.css') ?>">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <meta name="theme-color" content="#10b981">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body class="lidraughts-theme" data-logged-in="<?= $currentUser ? 'true' : 'false' ?>" data-user-id="<?= $currentUser ? (int)$currentUser['id'] : '' ?>">
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
        <button type="button" class="btn btn-icon lid-mobile-menu-toggle lid-mobile-only" id="btn-lid-mobile-menu" aria-label="Toggle navigation menu" title="Menu">
          <span class="icon">☰</span>
        </button>
      </div>
    </header>

    <!-- ================= MOBILE NAVIGATION DRAWER ================= -->
    <nav class="lid-mobile-drawer lid-mobile-only" id="lid-mobile-drawer">
      <a href="index.php" class="nav-link"><span class="nav-icon">🏠</span> HOME</a>
      <a href="dashboard.php" class="nav-link"><span class="nav-icon">👑</span> DASHBOARD</a>
      <button id="nav-mobile-play" class="nav-link"><span class="nav-icon">🎮</span> PLAY</button>
      <button id="nav-mobile-players" class="nav-link"><span class="nav-icon">👥</span> PLAYERS</button>
      <button id="nav-mobile-games" class="nav-link"><span class="nav-icon">⚔️</span> GAMES</button>
      <button id="nav-mobile-tournaments" class="nav-link"><span class="nav-icon">🏆</span> TOURNAMENTS</button>
      <button id="nav-mobile-analysis" class="nav-link"><span class="nav-icon">🔬</span> ANALYSIS</button>
      <button id="nav-mobile-chat" class="nav-link"><span class="nav-icon">💬</span> CHAT</button>
      <button id="nav-mobile-rules" class="nav-link"><span class="nav-icon">📜</span> RULES</button>
      <a href="puzzles.php" class="nav-link"><span class="nav-icon">🧩</span> PUZZLES</a>
    </nav>

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

    <!-- ================= MAIN GAME ARENA (LIDRAUGHTS 3-COLUMN LAYOUT) ================= -->
    <main class="game-container">
      
      <!-- ================= COLUMN 1: LEFT GAME INFO & CONTROLS ================= -->
      <aside class="lid-game-sidebar-left">
        <!-- Lidraughts Top-Left Match Metadata Card -->
        <div class="lid-meta-card" id="lid-meta-card">
          <div class="lid-meta-card-header">
            <span class="lid-meta-cogs-icon">⚙️</span>
            <div class="lid-meta-info-text">
              <span class="lid-meta-time-title" id="lid-game-time-mode">10+0 • Casual • Rapid</span>
              <span class="lid-meta-status-sub">Playing right now</span>
            </div>
          </div>

          <div class="lid-meta-players-list">
            <div class="lid-meta-player-item">
              <span class="dot-circle white"></span>
              <span class="lid-meta-player-name" id="lid-meta-p1-name"><?= $currentUser ? htmlspecialchars($currentUser['username']) : 'Champion (Guest)' ?></span>
              <span class="lid-meta-player-rating" id="lid-meta-p1-rating">(<?= $currentUser ? (int)$currentUser['rating'] : '1459?' ?>)</span>
            </div>
            <div class="lid-meta-player-item">
              <span class="dot-circle dark"></span>
              <span class="lid-meta-player-name" id="lid-meta-p2-name">Scan AI level 4</span>
              <span class="lid-meta-player-rating" id="lid-meta-p2-rating">(2400)</span>
            </div>
          </div>

          <div class="lid-meta-ruleset-wrap">
            <div class="lid-ruleset-badge" id="lid-ruleset-badge">
              <span id="lid-ruleset-flag">🇳🇬</span> <span id="lid-ruleset-title">Nigerian Rules</span>
            </div>
          </div>
        </div>

        <!-- Collapsible Match Tools, Engine HUD & Captured Trays -->
        <details class="lid-left-accordion" id="lid-left-accordion">
          <summary>⚙️ Match Options & Engine Telemetry</summary>
          <div class="lid-left-accordion-content">
            <!-- Quick Actions Toolbar -->
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px;">
              <button id="btn-open-game-setup" class="btn btn-small btn-primary" title="New Game Setup">⚡ New Match</button>
              <button id="btn-undo-move" class="btn btn-small btn-secondary" title="Undo Move">↩️ Undo</button>
              <button id="btn-toggle-trap-radar" class="btn btn-small btn-secondary" title="Toggle Trap Radar">⚡ Radar</button>
              <button id="btn-share-match-link" class="btn btn-small btn-secondary" title="Share Match Replay URL">🔗 Share</button>
              <button id="btn-copy-pdn-match" class="btn btn-small btn-secondary" title="Copy PDN">📋 PDN</button>
              <a href="puzzles.php" id="btn-quick-puzzles" class="btn btn-small btn-secondary" style="text-decoration: none;" title="Puzzles">🧩 Puzzles</a>
            </div>

            <!-- Captured Seeds -->
            <div style="font-size: 0.8rem; margin-bottom: 10px;">
              <div style="font-weight: 600; color: #555; margin-bottom: 4px;">Captured Pieces:</div>
              <div style="display: flex; gap: 10px;">
                <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px;">
                  <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">White Taken:</span>
                  <div class="captured-pieces-list" id="p1-captured-tray" style="min-height: 20px;"></div>
                </div>
                <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px;">
                  <span style="font-size: 0.72rem; color: #64748b; font-weight: 700;">Dark Taken:</span>
                  <div class="captured-pieces-list" id="p2-captured-tray" style="min-height: 20px;"></div>
                </div>
              </div>
            </div>

            <!-- Engine Telemetry Panel -->
            <div class="engine-telemetry-panel" id="engine-telemetry-panel" style="margin-top: 8px;">
              <div class="engine-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="engine-title" style="font-size: 0.8rem; font-weight: 700;"><span class="engine-pulse-dot" id="engine-pulse-dot"></span> 🤖 Engine Telemetry</span>
                <span class="engine-eval-badge eval-neutral" id="engine-eval-badge" style="font-size: 0.75rem; padding: 2px 6px;">+0.00</span>
              </div>
              <div class="engine-stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; font-size: 0.72rem;">
                <div class="stat-cell" style="background: #f1f5f9; padding: 4px; border-radius: 3px; text-align: center;">
                  <span class="stat-cell-lbl" style="display: block; color: #64748b; font-size: 0.65rem;">RULESET</span>
                  <span class="stat-cell-val" id="engine-stat-ruleset" style="color: #15803d; font-weight: 700;">NIGERIA</span>
                </div>
                <div class="stat-cell" style="background: #f1f5f9; padding: 4px; border-radius: 3px; text-align: center;">
                  <span class="stat-cell-lbl" style="display: block; color: #64748b; font-size: 0.65rem;">DEPTH</span>
                  <span class="stat-cell-val" id="engine-stat-depth">-</span>
                </div>
                <div class="stat-cell" style="background: #f1f5f9; padding: 4px; border-radius: 3px; text-align: center;">
                  <span class="stat-cell-lbl" style="display: block; color: #64748b; font-size: 0.65rem;">NODES</span>
                  <span class="stat-cell-val" id="engine-stat-nodes">0</span>
                </div>
                <div class="stat-cell" style="background: #f1f5f9; padding: 4px; border-radius: 3px; text-align: center;">
                  <span class="stat-cell-lbl" style="display: block; color: #64748b; font-size: 0.65rem;">SPEED</span>
                  <span class="stat-cell-val" id="engine-stat-nps">-</span>
                </div>
                <div class="stat-cell" style="background: #f1f5f9; padding: 4px; border-radius: 3px; text-align: center;">
                  <span class="stat-cell-lbl" style="display: block; color: #64748b; font-size: 0.65rem;">TT HITS</span>
                  <span class="stat-cell-val" id="engine-stat-tt">0%</span>
                </div>
              </div>
              <div class="engine-pv-box" style="margin-top: 6px; font-size: 0.72rem; color: #475569;">
                <span class="pv-lbl" style="font-weight: 700;">PV:</span>
                <span class="pv-line" id="engine-pv-line">Position balanced. Waiting for turn...</span>
              </div>
              <div class="engine-thinking-bar" id="engine-thinking-bar" style="display:none;"></div>
            </div>

            <!-- Street Commentary Ticker -->
            <div style="margin-top: 10px; font-size: 0.78rem; font-style: italic; color: #555; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 4px; padding: 6px 8px;">
              <span style="font-style: normal; font-weight: 700; color: #b45309; display: block; font-size: 0.72rem;">🎙️ Street Commentary:</span>
              <p class="commentary-text" id="commentary-ticker" style="margin: 2px 0 0;">"Oya welcome! Place your hand on the board, make we see who sabi play pass."</p>
            </div>
          </div>
        </details>

        <!-- Preserved Legacy DOM Elements to satisfy existing JS queries -->
        <div style="display: none;" aria-hidden="true">
          <aside class="sidebar player-card p2-card" id="card-p2">
            <div class="turn-indicator" id="p2-indicator">Waiting Turn</div>
            <span id="p2-seeds-count">20</span>
            <span id="p2-kings-count">0</span>
            <span id="p2-score">0</span>
          </aside>
          <aside class="sidebar player-card p1-card" id="card-p1">
            <div class="turn-indicator active" id="p1-indicator">Active Turn</div>
            <span id="p1-seeds-count">20</span>
            <span id="p1-kings-count">0</span>
            <span id="p1-score">0</span>
          </aside>
          <div class="ruleset-selector-bar" id="ruleset-selector-bar">
            <div class="ruleset-pills-group" id="ruleset-pills-group">
              <label id="lbl-ruleset-nigeria"><input type="radio" name="ruleset_choice" value="nigeria" checked></label>
              <label id="lbl-ruleset-ghana"><input type="radio" name="ruleset_choice" value="ghana"></label>
              <label id="lbl-ruleset-international"><input type="radio" name="ruleset_choice" value="international"></label>
            </div>
          </div>
          <div id="highway-indicator"><span id="highway-indicator-text">Nigerian Highway</span></div>
          <div id="network-ping-indicator"><span id="ping-text">35ms</span></div>
          <div id="board-eval-bar"><div id="eval-bar-fill"></div><span id="eval-bar-score">0.0</span></div>
        </div>
      </aside>

      <!-- ================= COLUMN 2: CENTER BOARD ================= -->
      <section class="lid-game-board-center">
        <!-- Active Trap Banner (if in trap mode) -->
        <div class="trap-active-banner" id="trap-active-banner" style="display:none; width: 100%;">
          <div class="trap-active-content" style="width: 100%;">
            <div class="trap-active-header">
              <span class="trap-title" id="trap-active-title">🪤 TRAP: The Nigerian Highway Ambush</span>
              <div class="trap-hud-actions">
                <button id="btn-trap-hint" class="btn btn-small btn-secondary" title="Tactical Hint">💡 Hint</button>
                <button id="btn-trap-reset" class="btn btn-small btn-secondary" title="Reset Trap Position">🔄 Reset</button>
                <button id="btn-trap-exit" class="btn btn-small btn-secondary" title="Exit Trap Mode">&times; Exit</button>
              </div>
            </div>
            <p class="trap-brief" id="trap-active-brief" style="margin-top: 4px;"></p>
            <div class="trap-step-instruction" id="trap-step-instruction" style="margin-top: 6px;"></div>
          </div>
        </div>

        <!-- Mobile Opponent Bar (Displayed above board on mobile phones) -->
        <div class="lid-mobile-player-bar lid-mobile-top lid-mobile-only" id="lid-mobile-p2-bar">
          <div class="lid-ctrl-player-left">
            <span class="green-dot"></span>
            <span class="lid-mobile-player-name" id="p2-mobile-name">Scan AI level 4</span>
            <span class="lid-player-rating-badge" id="p2-mobile-role">(2400)</span>
          </div>
          <div class="lid-mobile-clock-wrap">
            <div class="lid-digital-clock lid-mobile-clock" id="p2-mobile-clock">10:00</div>
          </div>
        </div>

        <!-- 10x10 Wood Board Outer Frame with Rim Coordinates -->
        <div class="lid-board-outer">
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
            <div class="lid-board-resize-handle">///</div>
          </div>

          <!-- Lidraughts Right Rim Coordinates: 5, 15, 25, 35, 45 -->
          <div class="lid-coords-right" id="lid-coords-right" aria-hidden="true">
            <span>5</span>
            <span>15</span>
            <span>25</span>
            <span>35</span>
            <span>45</span>
          </div>

          <!-- Lidraughts Bottom Rim Coordinates: 46, 47, 48, 49, 50 -->
          <div class="lid-coords-bottom" id="lid-coords-bottom" aria-hidden="true">
            <span>46</span>
            <span>47</span>
            <span>48</span>
            <span>49</span>
            <span>50</span>
          </div>
        </div>

        <!-- Mobile Player Bar (Displayed below board on mobile phones) -->
        <div class="lid-mobile-player-bar lid-mobile-bottom lid-mobile-only" id="lid-mobile-p1-bar">
          <div class="lid-ctrl-player-left">
            <span class="green-dot"></span>
            <span class="lid-mobile-player-name" id="p1-mobile-name"><?= $currentUser ? htmlspecialchars($currentUser['username']) : 'Champion (Guest)' ?></span>
            <span class="lid-player-rating-badge" id="p1-mobile-role">(<?= $currentUser ? (int)$currentUser['rating'] . '?' : '1459?' ?>)</span>
          </div>
          <div class="lid-mobile-clock-wrap">
            <div class="lid-digital-clock active lid-mobile-clock" id="p1-mobile-clock">10:00</div>
          </div>
        </div>

        <!-- Status Notice / Alert Banner -->
        <div class="status-banner" id="status-banner" style="display: none;">
          <span id="banner-text">Game started! White to move. Compulsory capture is ON.</span>
        </div>
      </section>

      <!-- ================= COLUMN 3: RIGHT CLOCKS & CONTROLS ================= -->
      <aside class="lid-game-sidebar-right">
        
        <!-- Opponent Clock Row -->
        <div class="lid-clock-card-row">
          <div class="lid-digital-clock" id="p2-clock">10:00</div>
          <button type="button" class="lid-clock-add-btn" id="btn-lid-add-time" title="Add 15s to opponent clock">+</button>
        </div>

        <!-- Main Lidraughts Control Box -->
        <div class="lid-controls-card">
          <!-- Opponent Player Info Bar -->
          <div class="lid-ctrl-player-bar">
            <div class="lid-ctrl-player-left">
              <span class="green-dot"></span>
              <span id="p2-name">Scan level 8</span>
            </div>
            <div class="lid-ctrl-player-right" id="p2-role">2700</div>
          </div>

          <!-- Move Navigation & Replay Toolbar -->
          <div class="lid-nav-toolbar">
            <button type="button" class="lid-nav-btn" id="btn-lid-flip" title="Flip Board Perspective">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            </button>
            <button type="button" class="lid-nav-btn" id="btn-lid-start" title="First Move">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="5" width="2.5" height="14"></rect><polygon points="19,19 9,12 19,5"></polygon></svg>
            </button>
            <button type="button" class="lid-nav-btn" id="btn-lid-prev" title="Previous Move / Undo">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="17,19 7,12 17,5"></polygon></svg>
            </button>
            <button type="button" class="lid-nav-btn" id="btn-lid-next" title="Next Move">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="7,5 17,12 7,19"></polygon></svg>
            </button>
            <button type="button" class="lid-nav-btn" id="btn-lid-end" title="Last Move">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,5 15,12 5,19"></polygon><rect x="17.5" y="5" width="2.5" height="14"></rect></svg>
            </button>
          </div>

          <!-- Turn Status / Instruction Box -->
          <div class="lid-turn-info-box">
            <div class="lid-info-icon-circle">i</div>
            <div class="lid-turn-info-text">
              <span class="lid-turn-sub" id="lid-turn-sub">You play the white pieces</span>
              <span class="lid-turn-main" id="lid-turn-main">It's your turn!</span>
            </div>
          </div>

          <!-- Match Action Buttons (Resign, Draw, Options) -->
          <div class="lid-action-icons-row">
            <button type="button" class="lid-action-icon-btn resign" id="btn-lid-resign" title="Resign Match">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <button type="button" class="lid-action-icon-btn" id="btn-lid-draw" title="Offer Draw">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6"></path><path d="M18 10a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3"></path><line x1="12" y1="3" x2="12" y2="7"></line></svg>
            </button>
            <button type="button" class="lid-action-icon-btn" id="btn-lid-options" title="New Match / Game Settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            </button>
          </div>

          <!-- Player Info Bar -->
          <div class="lid-ctrl-player-bar" style="border-top: 1px solid var(--lid-border-light);">
            <div class="lid-ctrl-player-left">
              <span class="green-dot"></span>
              <span id="p1-name"><?= $currentUser ? htmlspecialchars($currentUser['username']) : 'Champion (Guest)' ?></span>
            </div>
            <div class="lid-ctrl-player-right" id="p1-role"><?= $currentUser ? (int)$currentUser['rating'] . '?' : '1459?' ?></div>
          </div>
        </div>

        <!-- Player Clock Row -->
        <div class="lid-clock-card-row">
          <div class="lid-digital-clock active" id="p1-clock">10:00</div>
        </div>

        <!-- Move History Panel -->
        <div class="lid-meta-card" style="padding: 10px 14px; margin-top: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #555;">Move History</span>
            <span class="move-count" id="move-count-badge" style="font-size: 0.75rem; color: #777;">0 moves</span>
          </div>
          <div class="history-list" id="move-history-list" style="max-height: 120px; overflow-y: auto;">
            <div class="history-empty" style="font-size: 0.8rem; color: #888;">No moves yet. Make your opening move!</div>
          </div>
        </div>

      </aside>

    </main>

    <!-- Bottom Right: Lidraughts Friends Online Indicator -->
    <div class="lid-friends-bottom-widget" id="btn-lid-friends" title="Toggle Live Banter & Online Friends">
      0 friends online
    </div>
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
            <h3>🇬🇭 1. Ghana Damii Seed-Counting Endgame Rules</h3>
            <p>
              In traditional Ghanaian Draughts, when games reach the final endgame, piece count determines the official adjudication:
            </p>
            <ul style="margin: 8px 0 0 18px; color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
              <li><strong>1 Crown + 1 Seed vs 1 Crown + 1 Seed</strong>: Officially counted as a <strong>DRAW</strong>.</li>
              <li><strong>1 Crown + 1 Seed vs 1 Crown alone</strong>: Officially counted as a <strong>WIN</strong> for the player with the Crown and Seed!</li>
              <li><strong>1 Crown vs 1 Crown alone</strong>: Officially counted as a <strong>DRAW</strong>.</li>
            </ul>
          </div>
          <div class="rule-section highlight-rule">
            <h3>2. Ghanaian Damii Promotion: Immediate Turn End</h3>
            <p>
              When a piece reaches the opponent's backline (the promotion line), <strong>your turn terminates immediately and the piece is crowned as King</strong>. The piece cannot jump backward or continue in the same move; it begins moving as King on subsequent turns!
            </p>
          </div>
          <div class="rule-section">
            <h3>3. Ghana 16-Move Rule (3 Kings vs 1 King)</h3>
            <p>
              In Ghanaian Draughts Association (GDA) and street play, if an endgame reaches <strong>3 Kings vs 1 King</strong>, the player with 3 Kings has a strict limit of <strong>16 moves</strong> to capture the lone King. If not captured within 16 moves, a <strong>DRAW</strong> is officially declared!
            </p>
          </div>
          <div class="rule-section">
            <h3>4. Free Choice of Captures & Flying Kings ("Nkorɔma")</h3>
            <p>
              Captures are compulsory. Like Nigeria, Ghana Damii does NOT enforce maximum capture: players have the freedom to pick any capture sequence. Kings glide any distance across empty diagonals.
            </p>
          </div>
        </div>

        <!-- 3. International Draughts Panel -->
        <div class="rule-tab-panel" id="rule-panel-international" style="display: none;">
          <div class="rule-section highlight-rule">
            <h3>🌍 1. Central Line is Otherwise (Opposite Board Orientation)</h3>
            <p>
              While Nigerian and Ghanaian draughts place the bottom-left corner as a light square with the Central Line (Highway) on the player's right, <strong>International Draughts (FMJD) board is oriented the opposite way ("otherwise")</strong>:
            </p>
            <ul style="margin: 8px 0 0 18px; color: #cbd5e1; font-size: 0.9rem; line-height: 1.6;">
              <li>The bottom-left corner square (row 9, col 0) is a <strong>DARK playable square</strong>.</li>
              <li>The Central Line (Grande Ligne / Main Longest Diagonal) runs from <strong>bottom-left to top-right</strong> on the player's left-hand side.</li>
            </ul>
          </div>
          <div class="rule-section highlight-rule">
            <h3>2. Strict Majority Capture (Compulsory Maximum)</h3>
            <p>
              Under official FMJD International Draughts regulations, when multiple capture sequences are available, the player <strong>MUST choose the line that captures the MAXIMUM NUMBER of pieces</strong>! Quality does not matter (capturing 3 men overrides capturing 2 kings).
            </p>
          </div>
          <div class="rule-section">
            <h3>3. FMJD Rule 3.5: Mid-Jump Non-Promotion</h3>
            <p>
              A man that traverses the king row during a multiple jump <strong>ONLY promotes if it STOPS on the king row</strong> at the end of the jump. If it has a continuing capture off the king row, it <strong>must continue jumping as a MAN and does NOT promote</strong>!
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
