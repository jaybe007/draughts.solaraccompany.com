<?php
require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
$walletBalance = 0.00;
$coins = 0;
if ($currentUser) {
    $walletBalance = (float)($currentUser['wallet_balance'] ?? 0.00);
    $coins = (int)($currentUser['coins'] ?? 0);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tactical Draughts Puzzles & Training | Naija Draughts</title>
  <meta name="description" content="Master West African and International draughts tactics, street traps, sacrifices, and king combinations with Lidraughts-style interactive training puzzles.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css?v=<?= filemtime(__DIR__ . '/home.css') ?>">
  <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
  <link rel="stylesheet" href="puzzles.css?v=<?= filemtime(__DIR__ . '/puzzles.css') ?>">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="alternate icon" href="favicon.ico">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <meta name="theme-color" content="#10b981">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body class="puzzle-trainer-body" data-logged-in="<?= $currentUser ? 'true' : 'false' ?>" data-user-id="<?= $currentUser ? (int)$currentUser['id'] : '' ?>">
  <div class="app-wrapper">

    <!-- ================= TOP HEADER NAVIGATION ================= -->
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
            <span class="game-subtitle">TACTICAL TRAINING PORTAL</span>
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
            <a href="game.php" class="nav-link btn-play-cta" title="Live Game Arena">
              <span class="nav-icon">🎮</span> PLAY
            </a>
          </li>
          <li>
            <a href="puzzles.php" class="nav-link active nav-highlight-traps" title="Lidraughts-Style Tactical Draughts Puzzles">
              <span class="nav-icon">🧩</span> PUZZLES
            </a>
          </li>
          <li>
            <a href="game.php?view=analysis" class="nav-link" title="Open Position Analysis Lab">
              <span class="nav-icon">🔬</span> ANALYSIS
            </a>
          </li>
          <li>
            <a href="game.php?view=tournaments" class="nav-link" title="View Championships">
              <span class="nav-icon">🏆</span> TOURNAMENTS
            </a>
          </li>
        </ul>
      </nav>

      <!-- Account & Quick Tools -->
      <div class="header-right-tools">
        <div id="auth-section" class="auth-section">
          <?php if ($currentUser): ?>
            <a href="dashboard.php" class="user-pill" style="text-decoration: none;" title="Open Player Dashboard">
              <span class="user-pill-avatar">👑</span>
              <span class="user-pill-name"><?= htmlspecialchars($currentUser['username']) ?></span>
              <span class="user-pill-rating"><?= (int)$currentUser['rating'] ?> Elo</span>
            </a>
            <a href="dashboard.php" class="btn btn-small btn-primary" title="Command Portal">Dashboard</a>
          <?php else: ?>
            <a href="index.php#auth-card" class="btn btn-primary btn-small" title="Sign in or register">
              <span class="icon">👤</span> Sign In
            </a>
          <?php endif; ?>
        </div>

        <button id="btn-sound-toggle" class="btn btn-icon" title="Toggle Sound Effects">
          <span class="icon" id="sound-icon">🔊</span>
        </button>
      </div>
    </header>

    <!-- ================= LIDRAUGHTS-STYLE PUZZLE TRAINING ARENA ================= -->
    <main class="puzzle-training-arena">
      <div class="lid-puzzle-container">

        <!-- ================= COLUMN 1: LEFT SIDEBAR (MODE, PUZZLE INFO, RATING GRAPH) ================= -->
        <aside class="lid-sidebar-left">
          
          <!-- Mode / Ruleset Selector Dropdown (Matches Lidraughts "Standard puzzles ▾") -->
          <div class="lid-mode-dropdown-wrap">
            <select id="select-puzzle-ruleset-dropdown" class="lid-mode-dropdown" title="Select Draughts Puzzle Variant">
              <option value="all">👑 Standard puzzles (All 390)</option>
              <option value="international">🌍 FMJD International (96)</option>
              <option value="nigeria">🇳🇬 Nigerian Highway (20)</option>
              <option value="ghana">🇬🇭 Ghana Damii (15)</option>
              <option value="draughts-image">📸 DRAUGHTS IMAGE Series (131)</option>
            </select>
          </div>

          <!-- Puzzle Info Card (Bullseye, ID, Rating, Played Count) -->
          <div class="lid-card lid-puzzle-info-card">
            <div class="lid-target-icon-wrap">
              <svg class="lid-target-svg" viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke="#64748b"/>
                <circle cx="12" cy="12" r="6" stroke="#64748b"/>
                <circle cx="12" cy="12" r="2" fill="#64748b"/>
                <line x1="12" y1="2" x2="12" y2="4" stroke="#64748b"/>
                <line x1="12" y1="20" x2="12" y2="22" stroke="#64748b"/>
                <line x1="2" y1="12" x2="4" y2="12" stroke="#64748b"/>
                <line x1="20" y1="12" x2="22" y2="12" stroke="#64748b"/>
              </svg>
            </div>
            <div class="lid-info-content">
              <div class="lid-info-title-row">
                <a href="javascript:void(0)" class="lid-puzzle-link" id="puzzle-id-label">Puzzle #1</a>
              </div>
              <div class="lid-info-rating" id="puzzle-rating-badge">Rating: 1500</div>
              <div class="lid-info-played" id="puzzle-played-label">Played 11,602 times</div>
            </div>
          </div>

          <!-- User Rating Card with Area Chart (Lidraughts-Style Graph) -->
          <div class="lid-card lid-rating-graph-card">
            <div class="lid-rating-header">
              <span class="lid-rating-label">Your puzzle rating:</span>
              <span class="lid-rating-val" id="user-puzzle-rating">1500</span>
              <span class="lid-rating-delta" id="user-rating-delta-pill">↘ -10</span>
            </div>
            <div class="lid-chart-container">
              <svg id="lid-rating-svg" class="lid-rating-svg" viewBox="0 0 240 70" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.05"/>
                  </linearGradient>
                </defs>
                <path id="lid-chart-area" d="M0,35 Q60,40 120,48 T240,62 L240,70 L0,70 Z" fill="url(#lidGrad)"/>
                <path id="lid-chart-line" d="M0,35 Q60,40 120,48 T240,62" fill="none" stroke="#3b82f6" stroke-width="2"/>
                <circle id="lid-chart-dot" cx="240" cy="62" r="3.5" fill="#f97316"/>
              </svg>
            </div>
          </div>

          <!-- Compact Tactical Details & Classical Coup Link -->
          <div class="lid-card lid-meta-details-card">
            <div class="lid-meta-row">
              <span class="lid-meta-lbl">Theme:</span>
              <div class="puzzle-theme-tags" id="puzzle-theme-tags">
                <span class="puzzle-tag">Coup Royal</span>
              </div>
            </div>
            <div class="lid-meta-row" style="margin-top: 6px;">
              <span class="lid-meta-lbl">Difficulty:</span>
              <span class="puzzle-difficulty-tag beginner" id="puzzle-diff-tag">🟢 Beginner</span>
            </div>
            <div class="lid-meta-actions">
              <button type="button" class="btn btn-secondary btn-small" id="btn-open-coups-modal" title="Explore 32 Classical Draughts Combinations & Themes">
                📖 32 Classical Coups
              </button>
            </div>
          </div>

          <!-- Collapsible Filter Drawer (Maintains All Filter Pills & Search Chips) -->
          <details class="lid-filters-details">
            <summary class="lid-filters-summary">⚙️ Filters & Puzzle Browser</summary>
            <div class="lid-filters-content">
              <div class="puzzle-filter-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span class="section-label">Ruleset:</span>
                  <a href="admin_puzzles.php" class="btn btn-secondary btn-small" style="font-size: 0.72rem; padding: 2px 8px;" title="Open Puzzle Generator Lab">⚙️ Generator Lab</a>
                </div>
                <div class="puzzle-filter-pills" id="puzzle-ruleset-pills" style="margin-bottom: 12px;">
                  <button type="button" class="filter-btn active" data-ruleset="all" title="All puzzles">All (113)</button>
                  <button type="button" class="filter-btn" data-ruleset="international" title="International FMJD">🌍 FMJD (96)</button>
                  <button type="button" class="filter-btn" data-ruleset="nigeria" title="Nigerian Highway">🇳🇬 Nigeria (9)</button>
                  <button type="button" class="filter-btn" data-ruleset="ghana" title="Ghanaian Damii">🇬🇭 Ghana (8)</button>
                </div>

                <span class="section-label">Difficulty Level:</span>
                <div class="puzzle-filter-pills" id="puzzle-filter-pills">
                  <button type="button" class="filter-btn active" data-filter="all">All (390)</button>
                  <button type="button" class="filter-btn" data-filter="beginner">🟢 Beginner (60)</button>
                  <button type="button" class="filter-btn" data-filter="intermediate">🟡 Intermediate (60)</button>
                  <button type="button" class="filter-btn" data-filter="advanced">🟠 Advanced (60)</button>
                  <button type="button" class="filter-btn" data-filter="expert">🟣 Expert (60)</button>
                  <button type="button" class="filter-btn" data-filter="master">🟤 Master (60)</button>
                  <button type="button" class="filter-btn" data-filter="grandmaster">🔴 Grandmaster (60)</button>
                  <button type="button" class="filter-btn" data-filter="super-gm">⚡ Super GM (30)</button>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px; margin-bottom: 6px;">
                  <span class="section-label">Classical Coup / Theme:</span>
                  <button type="button" class="btn btn-secondary btn-small" id="btn-browse-coups" style="font-size: 0.72rem; padding: 2px 8px;" title="Browse all 32 Classical Combinations">📚 View All 32</button>
                </div>
                <div class="puzzle-theme-filter-row">
                  <select id="select-puzzle-theme" class="puzzle-theme-select" title="Filter puzzles by Classical Coup / Theme">
                    <option value="all">⭐ All Classical Combinations (32)</option>
                  </select>
                </div>

                <!-- Direct Puzzle Chips Search Grid -->
                <div class="puzzle-list-section" style="margin-top: 14px;">
                  <div class="puzzle-list-header">
                    <span class="section-label">Select Tactical Puzzle:</span>
                    <input type="text" id="puzzle-search-input" class="puzzle-search-input" placeholder="🔍 Search # or theme..." autocomplete="off">
                  </div>
                  <div class="puzzle-chips-grid" id="puzzle-chips-grid"></div>
                </div>
              </div>
            </div>
          </details>

          <!-- Hidden preserved elements to satisfy existing JS DOM hooks -->
          <div style="display: none;" aria-hidden="true">
            <h2 class="puzzle-title" id="puzzle-title">Tactical Draughts Puzzle</h2>
            <span class="stat-val streak" id="user-puzzle-streak">🔥 0</span>
            <span class="stat-val solved" id="user-puzzle-solved-ratio">0 / 9</span>
          </div>

        </aside>

        <!-- ================= COLUMN 2: CENTER BOARD (10x10 WOOD BOARD WITH COORDINATES) ================= -->
        <section class="lid-board-center">
          
          <!-- Clean Board Header -->
          <div class="lid-board-header">
            <div class="puzzle-variant-tag" id="puzzle-variant-tag">
              <span class="flag">🇳🇬</span> <span class="text" id="puzzle-variant-text">Nigerian Rules</span>
            </div>
            <div class="lid-board-tools">
              <select id="select-puzzle-board-theme" class="lid-board-theme-select" title="Select Board Theme">
                <option value="default">🪵 Default Classic</option>
                <option value="eco_giant">🌿 Eco Giant</option>
                <option value="golden_state">👑 Golden State</option>
                <option value="safari_land">🦁 Safari Land</option>
                <option value="mineral_grove">💎 Mineral Grove</option>
                <option value="diamond_coast">🌊 Diamond Coast</option>
              </select>
              <button type="button" class="btn btn-small btn-secondary" id="btn-toggle-coords" title="Toggle 1-50 Draughts Notation Numbers">
                🔢 <span id="label-coords-toggle">Square 1-50: On</span>
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-board-sound-toggle" title="Toggle Sound FX">
                <span id="board-sound-icon">🔊</span>
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-flip-board" title="Flip Board Perspective">
                🔄
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-fullscreen" title="Toggle Fullscreen Mode">
                ⛶
              </button>
            </div>
          </div>

          <!-- Board Frame Wrap with Rim Coordinates (46..6 Right, 5..1 Bottom) -->
          <div class="lid-board-outer">
            <div class="board-wood-frame" id="board-wood-frame" style="position: relative;">
              <!-- Tactical SVG vector overlay for trajectory arrows -->
              <svg id="board-tactical-svg" class="board-tactical-overlay">
                <defs>
                  <marker id="arrowhead-gold" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#f59e0b" />
                  </marker>
                  <marker id="arrowhead-green" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#10b981" />
                  </marker>
                  <marker id="arrowhead-cyan" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                    <polygon points="0 0, 6 3, 0 6" fill="#38bdf8" />
                  </marker>
                </defs>
              </svg>
              <!-- 10x10 Squares generated dynamically via JavaScript -->
              <div class="board-inner" id="draughts-board"></div>
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

          <!-- Horizontal Move Evaluation Strip Below Board (Matching Lidraughts) -->
          <div class="lid-eval-strip" id="lid-eval-strip" title="Computer Engine Evaluation Per Ply">
            <div class="lid-eval-scores" id="lid-eval-scores">
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-21</span>
              <span class="lid-eval-cell">-14</span>
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-13</span>
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-18</span>
              <span class="lid-eval-cell">-8</span>
              <span class="lid-eval-cell">-30</span>
              <span class="lid-eval-cell">-15</span>
              <span class="lid-eval-cell">-26</span>
              <span class="lid-eval-cell active-eval">-11</span>
            </div>
          </div>

          <!-- Preserved Vertical Eval Elements (hidden to avoid duplicate UI) -->
          <div class="puzzle-eval-gauge" id="puzzle-eval-gauge" style="display: none;" aria-hidden="true">
            <div class="eval-bar-fill" id="eval-bar-fill" style="height: 50%;"></div>
            <span class="eval-score-label" id="eval-score-label">0.0</span>
          </div>

          <!-- Lidraughts-Style Session Performance Strip -->
          <div class="puzzle-session-strip" id="puzzle-session-strip">
            <span class="session-strip-label">Session:</span>
            <div class="session-pills-wrap" id="session-pills-wrap"></div>
          </div>

          <!-- Highway Status Subtext -->
          <div class="puzzle-highway-status" id="puzzle-highway-status">
            <span class="dot"></span> <span id="puzzle-highway-label">Highway Ambush Active • Compulsory Capture Enforced</span>
          </div>

          <!-- Keyboard Shortcuts Quick Hint -->
          <div class="keyboard-shortcuts-hint" title="Use your keyboard for lightning fast tactical training">
            <span>⌨️ Shortcuts:</span>
            <span><kbd>R</kbd> Retry</span>
            <span><kbd>H</kbd> Hint</span>
            <span><kbd>S</kbd> Solution</span>
            <span><kbd>F</kbd> Flip</span>
            <span><kbd>C</kbd> 1-50</span>
            <span><kbd>Space</kbd> Next</span>
          </div>
        </section>

        <!-- ================= COLUMN 3: RIGHT SIDEBAR (NOTATION, STATUS, BLUE CTA, NAV) ================= -->
        <aside class="lid-sidebar-right">
          
          <!-- Top Coach/Engine WASM Toggle (Matches Lidraughts "Scan 3.1 WASM in local browser") -->
          <div class="lid-engine-header">
            <div class="lid-engine-meta">
              <span class="lid-engine-name">Scan 3.1 <span class="lid-wasm-tag">WASM</span></span>
              <span class="lid-engine-sub" id="coach-quote">in local browser</span>
            </div>
            <label class="lid-engine-switch" title="Toggle Engine Analysis">
              <input type="checkbox" id="lid-engine-toggle" checked>
              <span class="lid-engine-slider"></span>
            </label>
          </div>

          <!-- Move Notation History Table (Active Orange Box, Green Checkmarks) -->
          <div class="lid-notation-card" id="puzzle-notation-card">
            <div class="lid-notation-scroll" id="notation-moves-scroll">
              <table class="lid-notation-table" id="notation-table">
                <tbody id="notation-table-body">
                  <!-- Dynamic rows populated via JS -->
                </tbody>
              </table>
            </div>
          </div>

          <!-- Turn & Feedback Status Display (Matches "Puzzle complete! 195 ▲") -->
          <div class="lid-feedback-box" id="puzzle-feedback-card">
            
            <!-- Turn Indicator Prompt -->
            <div class="puzzle-turn-card" id="puzzle-turn-card">
              <div class="turn-disc white" id="puzzle-turn-disc"></div>
              <div class="turn-text-group">
                <span class="turn-tagline" id="puzzle-turn-tagline">YOUR TURN</span>
                <span class="turn-prompt" id="puzzle-turn-prompt">Find the best move for White.</span>
              </div>
            </div>

            <!-- Feedback Title & Description -->
            <div class="feedback-status-row" id="feedback-status-row">
              <span class="feedback-icon" id="feedback-icon" style="display: none;">🎯</span>
              <div class="feedback-text-wrap">
                <div class="feedback-title" id="feedback-title">Find the winning move</div>
                <p class="feedback-desc" id="feedback-desc">
                  Spot the tactical sequence that forces an inescapable trap.
                </p>
              </div>
            </div>

            <!-- Reward Pill (Shown on Solved) -->
            <div class="feedback-rewards" id="feedback-rewards" style="display: none;">
              <span class="reward-item rating-gain">📈 +25 Rating</span>
              <span class="reward-item coins-gain">🪙 +50 Coins</span>
            </div>

            <!-- Dynamic Action Buttons (e.g. Retry or Next) -->
            <div class="feedback-actions" id="feedback-actions" style="display: none;"></div>
          </div>

          <!-- BIG PROMINENT BLUE ACTION BUTTON (Matches "▶ CONTINUE TRAINING") -->
          <button type="button" class="lid-btn-continue" id="btn-puzzle-next" title="Continue Training (Next Puzzle)">
            <span class="lid-play-arrow">▶</span>
            <span class="lid-btn-text">CONTINUE TRAINING</span>
          </button>

          <!-- Step Replay Navigation Controls (|◀, ◀, ▶, ▶|) -->
          <div class="lid-step-controls">
            <button type="button" class="lid-step-btn" id="btn-step-first" title="Jump to Start (|◀)">|◀</button>
            <button type="button" class="lid-step-btn" id="btn-step-prev" title="Previous Step (◀)">◀</button>
            <button type="button" class="lid-step-btn" id="btn-step-next" title="Next Step (▶)">▶</button>
            <button type="button" class="lid-step-btn" id="btn-step-last" title="Jump to End (▶|)">▶|</button>
          </div>

          <!-- Auxiliary Tools Toolbar (Hint, Solution, Retry) -->
          <div class="lid-aux-toolbar">
            <button type="button" class="lid-aux-btn" id="btn-puzzle-hint" title="Show progressive hint">
              💡 Hint
            </button>
            <button type="button" class="lid-aux-btn" id="btn-puzzle-solution" title="Show winning solution">
              👁️ Solution
            </button>
            <button type="button" class="lid-aux-btn" id="btn-puzzle-reset" title="Reset puzzle to start">
              🔄 Retry
            </button>
          </div>

          <!-- Hidden Preserved Elements for JS Compatibility -->
          <div style="display: none;" aria-hidden="true">
            <span class="notation-step-counter" id="notation-step-counter">Move 0/3</span>
            <div class="puzzle-coach-card" id="puzzle-coach-card"></div>
          </div>

        </aside>

      </div>
    </main>

  </div>

  <!-- ================= 32 CLASSICAL COUPS ENCYCLOPEDIA MODAL ================= -->
  <div class="coups-modal-backdrop" id="coups-modal" style="display: none;">
    <div class="coups-modal-dialog">
      <div class="coups-modal-header">
        <div class="coups-header-titles">
          <div class="coups-modal-badge">TACTICAL ENCYCLOPEDIA</div>
          <h2 class="coups-modal-title">📖 32 Classical Draughts Combinations & Coups</h2>
          <p class="coups-modal-subtitle">Master the canonical tactical maneuvers of International, French, Dutch, and West African Grandmasters</p>
        </div>
        <button type="button" class="coups-modal-close" id="btn-close-coups-modal" aria-label="Close modal">&times;</button>
      </div>

      <!-- Modal Search & Star Filter Toolbar -->
      <div class="coups-modal-toolbar">
        <div class="coups-search-wrap">
          <input type="text" id="coups-search-input" class="coups-search-input" placeholder="🔍 Search by Coup name, idea (e.g. Royal, Bombe, Turc, Harlem)..." autocomplete="off">
        </div>
        <div class="coups-star-filters" id="coups-star-filters">
          <button type="button" class="coup-star-pill active" data-stars="all">All (32)</button>
          <button type="button" class="coup-star-pill" data-stars="3">⭐⭐⭐ Intermediate (4)</button>
          <button type="button" class="coup-star-pill" data-stars="4">⭐⭐⭐⭐ Advanced (14)</button>
          <button type="button" class="coup-star-pill" data-stars="5">⭐⭐⭐⭐⭐ Master/GM (13)</button>
          <button type="button" class="coup-star-pill" data-stars="6">⭐⭐⭐⭐⭐+ Legendary (1)</button>
        </div>
      </div>

      <!-- 32 Coups Interactive Grid -->
      <div class="coups-grid" id="coups-grid">
        <!-- Populated dynamically via JS from TACTICAL_THEMES_CATALOG -->
      </div>
    </div>
  </div>

  <script type="module" src="js/puzzle_trainer.js?v=<?= filemtime(__DIR__ . '/js/puzzle_trainer.js') ?>"></script>
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js?v=<?= filemtime(__DIR__ . "/sw.js") ?>').catch(() => {});
      });
    }
  </script>
</body>
</html>
