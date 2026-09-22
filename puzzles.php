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
      <div class="puzzle-layout-container">

        <!-- LEFT COLUMN: 10x10 DRAUGHTS BOARD -->
        <section class="puzzle-board-column">
          <!-- Board Top Bar -->
          <div class="puzzle-board-header">
            <div class="puzzle-variant-tag" id="puzzle-variant-tag">
              <span class="flag">🇳🇬</span> <span class="text" id="puzzle-variant-text">Nigerian Rules</span>
            </div>
            <div class="puzzle-board-tools">
              <button type="button" class="btn btn-small btn-secondary" id="btn-open-coups-modal" title="Explore 32 Classical Draughts Combinations & Themes">
                📖 <span>32 Classical Coups</span>
              </button>
              <button type="button" class="btn btn-small btn-secondary" id="btn-toggle-coords" title="Toggle 1-50 Draughts Notation Numbers">
                🔢 <span id="label-coords-toggle">Square 1-50: On</span>
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-sound-toggle" title="Toggle Sound FX">
                <span id="sound-icon">🔊</span>
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-flip-board" title="Flip Board Perspective">
                🔄
              </button>
              <button type="button" class="btn btn-icon btn-secondary" id="btn-fullscreen" title="Toggle Fullscreen Mode">
                ⛶
              </button>
            </div>
          </div>

          <!-- Board with Vertical Evaluation Gauge -->
          <div class="board-eval-wrapper">
            <!-- Dynamic Tactical Advantage Evaluation Bar (Lidraughts-Style) -->
            <div class="puzzle-eval-gauge" id="puzzle-eval-gauge" title="Tactical Advantage Evaluation">
              <div class="eval-bar-fill" id="eval-bar-fill" style="height: 50%;"></div>
              <span class="eval-score-label" id="eval-score-label">0.0</span>
            </div>

            <!-- Board Wood Frame (10x10 Nigerian Mirrored Board) -->
            <div class="puzzle-board-frame-wrap">
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
              </div>
            </div>
          </div>

          <!-- Lidraughts-Style Session Performance Strip -->
          <div class="puzzle-session-strip" id="puzzle-session-strip">
            <span class="session-strip-label">Session:</span>
            <div class="session-pills-wrap" id="session-pills-wrap"></div>
          </div>

          <!-- Quick Board Subtext -->
          <div class="puzzle-highway-status" id="puzzle-highway-status">
            <span class="dot"></span> <span id="puzzle-highway-label">Highway Ambush Active • Compulsory Capture Enforced</span>
          </div>

          <!-- Keyboard Shortcuts Quick Guide -->
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

        <!-- RIGHT COLUMN: LIDRAUGHTS TRAINING SIDEBAR -->
        <aside class="puzzle-training-sidebar">
          
          <!-- Card 1: Puzzle Meta & Level Header -->
          <div class="puzzle-meta-card">
            <div class="meta-card-top">
              <div class="puzzle-id-wrap">
                <span class="puzzle-icon">🧩</span>
                <span class="puzzle-id-label" id="puzzle-id-label">Puzzle #1</span>
              </div>
              <span class="puzzle-rating-badge" id="puzzle-rating-badge">⭐ 1100 Elo</span>
            </div>
            
            <div class="meta-card-title-row">
              <h2 class="puzzle-title" id="puzzle-title">The Center Bomb Shot</h2>
              <span class="puzzle-difficulty-tag beginner" id="puzzle-diff-tag">🟢 Very Simple</span>
            </div>

            <div class="puzzle-theme-tags" id="puzzle-theme-tags">
              <span class="puzzle-tag">Sacrifice</span>
              <span class="puzzle-tag">Breakthrough</span>
              <span class="puzzle-tag">King Flight</span>
            </div>
          </div>

          <!-- Card 2: Turn Indicator Prompt (Lidraughts-Style) -->
          <div class="puzzle-turn-card" id="puzzle-turn-card">
            <div class="turn-disc white" id="puzzle-turn-disc"></div>
            <div class="turn-text-group">
              <span class="turn-tagline" id="puzzle-turn-tagline">YOUR TURN</span>
              <span class="turn-prompt" id="puzzle-turn-prompt">Find the best move for White.</span>
            </div>
          </div>

          <!-- Card: Authentic Pidgin Street Draughts Coach -->
          <div class="puzzle-coach-card" id="puzzle-coach-card">
            <div class="coach-avatar">👑</div>
            <div class="coach-speech">
              <span class="coach-badge">Naija Street Master</span>
              <p class="coach-quote" id="coach-quote">"Calm down spot the combination. Trap don set, chop am well!"</p>
            </div>
          </div>

          <!-- Card 3: Dynamic Feedback Card (Changes dynamically on move) -->
          <div class="puzzle-feedback-card" id="puzzle-feedback-card">
            <div class="feedback-status-row" id="feedback-status-row">
              <span class="feedback-icon" id="feedback-icon">🎯</span>
              <span class="feedback-title" id="feedback-title">Find the winning move</span>
            </div>
            <p class="feedback-desc" id="feedback-desc">
              Spot the tactical sequence that forces an inescapable trap or decisive material advantage.
            </p>
            <!-- Reward Pill (shown on solved) -->
            <div class="feedback-rewards" id="feedback-rewards" style="display: none;">
              <span class="reward-item rating-gain">📈 +25 Rating</span>
              <span class="reward-item coins-gain">🪙 +50 Coins</span>
            </div>
            <!-- Dynamic Action Buttons (e.g. Retry or Next) -->
            <div class="feedback-actions" id="feedback-actions"></div>
          </div>

          <!-- Card: Live Move Notation History & Step Replay (World-Standard Lidraughts) -->
          <div class="puzzle-notation-card" id="puzzle-notation-card">
            <div class="notation-card-header">
              <span class="notation-header-title">📜 TACTICAL MOVE NOTATION</span>
              <span class="notation-step-counter" id="notation-step-counter">Move 0/3</span>
            </div>
            <div class="notation-moves-scroll" id="notation-moves-scroll">
              <table class="notation-table" id="notation-table">
                <thead>
                  <tr>
                    <th class="col-num">#</th>
                    <th class="col-white">White (You)</th>
                    <th class="col-black">Dark (AI)</th>
                  </tr>
                </thead>
                <tbody id="notation-table-body">
                  <!-- Dynamic rows populated via JS -->
                </tbody>
              </table>
            </div>
            <div class="notation-step-controls">
              <button type="button" class="btn btn-step-nav" id="btn-step-first" title="Jump to Start (|◀)">|◀</button>
              <button type="button" class="btn btn-step-nav" id="btn-step-prev" title="Previous Step (◀)">◀</button>
              <button type="button" class="btn btn-step-nav" id="btn-step-next" title="Next Step (▶)">▶</button>
              <button type="button" class="btn btn-step-nav" id="btn-step-last" title="Jump to End (▶|)">▶|</button>
            </div>
          </div>

          <!-- Card 4: Action Controls Toolbar -->
          <div class="puzzle-controls-toolbar">
            <button type="button" class="btn btn-secondary btn-small" id="btn-puzzle-hint" title="Show progressive hint">
              💡 Hint
            </button>
            <button type="button" class="btn btn-secondary btn-small" id="btn-puzzle-solution" title="Show winning solution">
              👁️ View Solution
            </button>
            <button type="button" class="btn btn-secondary btn-small" id="btn-puzzle-reset" title="Reset puzzle to start">
              🔄 Retry
            </button>
            <button type="button" class="btn btn-primary btn-small" id="btn-puzzle-next" title="Next puzzle">
              ⚡ Next &rarr;
            </button>
          </div>

          <!-- Card 5: Performance Stats & Streak Tracker -->
          <div class="puzzle-performance-card">
            <div class="perf-stat-item">
              <span class="stat-label">Your Rating</span>
              <span class="stat-val rating" id="user-puzzle-rating">1500</span>
            </div>
            <div class="perf-stat-item">
              <span class="stat-label">Streak</span>
              <span class="stat-val streak" id="user-puzzle-streak">🔥 0</span>
            </div>
            <div class="perf-stat-item">
              <span class="stat-label">Solved</span>
              <span class="stat-val solved" id="user-puzzle-solved-ratio">0 / 9</span>
            </div>
          </div>

          <!-- Card 6: Ruleset & Difficulty Filter Pills -->
          <div class="puzzle-filter-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="section-label">Ruleset:</span>
              <a href="admin_puzzles.php" class="btn btn-secondary btn-small" style="font-size: 0.72rem; padding: 2px 8px;" title="Open Puzzle Generator Lab">⚙️ Generator Lab</a>
            </div>
            <div class="puzzle-filter-pills" id="puzzle-ruleset-pills" style="margin-bottom: 12px;">
              <button type="button" class="filter-btn active" data-ruleset="draughts-image" title="Master puzzles directly generated from DRAUGHTS IMAGE screenshots 1.PNG to 21.PNG">📸 DRAUGHTS IMAGE (21)</button>
              <button type="button" class="filter-btn" data-ruleset="international">🌍 FMJD International (130)</button>
              <button type="button" class="filter-btn" data-ruleset="nigeria">🇳🇬 Nigeria (130)</button>
              <button type="button" class="filter-btn" data-ruleset="ghana">🇬🇭 Ghana (130)</button>
              <button type="button" class="filter-btn" data-ruleset="all">⭐ All Puzzles (411)</button>
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
          </div>

          <!-- Card 7: Direct Puzzle Carousel Jumper -->
          <div class="puzzle-list-section">
            <div class="puzzle-list-header">
              <span class="section-label">Select Tactical Puzzle:</span>
              <input type="text" id="puzzle-search-input" class="puzzle-search-input" placeholder="🔍 Search # or theme..." autocomplete="off">
            </div>
            <div class="puzzle-chips-grid" id="puzzle-chips-grid">
              <!-- Populated dynamically via JS -->
            </div>
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
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  </script>
</body>
</html>
