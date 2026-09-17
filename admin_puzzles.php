<?php
/**
 * Professional Draughts Puzzle Generator Admin Portal (admin_puzzles.php)
 * 
 * Features:
 * - Real-time client & engine generation across 12 Tiers and 3 Rulesets
 * - Direct ingestion into MySQL database
 * - Live telemetry display (Generated, Accepted, Rejected, Duplicates, Quality Avg)
 * - Interactive 10x10 Draughts Board Inspector with step-by-step solution player
 * - Export to JSON / SQL / traps.js
 */

require_once __DIR__ . '/config/db.php';
$currentUser = getCurrentUser();
$db = getDB();

// Fetch DB aggregate stats
$totalPuzzles = (int)$db->query("SELECT COUNT(*) FROM puzzles")->fetchColumn();
$rulesetStats = $db->query("SELECT ruleset, COUNT(*) as c FROM puzzles GROUP BY ruleset")->fetchAll(PDO::FETCH_KEY_PAIR);
$tierStats = $db->query("SELECT difficulty_tier, COUNT(*) as c FROM puzzles GROUP BY difficulty_tier ORDER BY difficulty_tier ASC")->fetchAll(PDO::FETCH_KEY_PAIR);
$recentLogs = $db->query("SELECT * FROM puzzle_generation_logs ORDER BY id DESC LIMIT 5")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Engine Puzzle Generator & Quality Lab | Naija Draughts Admin</title>
  <meta name="description" content="Industrial-grade draughts puzzle generation engine, telemetry monitoring, and quality assurance control center.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="home.css?v=<?= filemtime(__DIR__ . '/home.css') ?>">
  <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
  <style>
    /* ================= ADMIN SPECIFIC STYLING ================= */
    :root {
      --admin-bg: #0b0f19;
      --admin-card: rgba(18, 26, 43, 0.85);
      --admin-border: rgba(255, 255, 255, 0.1);
      --admin-accent: #10b981;
      --admin-gold: #f59e0b;
      --admin-cyan: #06b6d4;
    }
    body.admin-body {
      background: radial-gradient(circle at 10% 20%, #0d1527 0%, #070a12 90%);
      color: #e2e8f0;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      margin: 0;
      padding-bottom: 50px;
    }
    .admin-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 24px;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background: var(--admin-card);
      backdrop-filter: blur(12px);
      border: 1px solid var(--admin-border);
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .admin-title-wrap h1 {
      margin: 0;
      font-family: 'Cinzel', serif;
      font-size: 1.6rem;
      background: linear-gradient(135deg, #34d399, #f59e0b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .admin-subtitle {
      font-size: 0.85rem;
      color: #94a3b8;
      margin-top: 4px;
    }
    .admin-nav-links {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .admin-db-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #34d399;
    }
    .admin-db-badge .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    /* GRID LAYOUT */
    .admin-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: 24px;
    }
    @media (max-width: 1100px) {
      .admin-grid {
        grid-template-columns: 1fr;
      }
    }

    /* CARDS */
    .admin-card {
      background: var(--admin-card);
      backdrop-filter: blur(12px);
      border: 1px solid var(--admin-border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      margin-bottom: 24px;
    }
    .card-title {
      margin: 0 0 16px 0;
      font-size: 1.15rem;
      font-weight: 700;
      color: #f8fafc;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    /* FORM ELEMENTS */
    .form-group {
      margin-bottom: 16px;
    }
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .form-control, .form-select {
      width: 100%;
      padding: 10px 14px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      color: #f1f5f9;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .form-control:focus, .form-select:focus {
      border-color: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .range-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .range-val {
      font-weight: 700;
      color: #34d399;
      min-width: 40px;
    }

    /* TELEMETRY KPI METRICS */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }
    @media (max-width: 800px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .kpi-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }
    .kpi-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: #f8fafc;
      font-family: 'JetBrains Mono', monospace;
    }
    .kpi-val.accepted { color: #10b981; }
    .kpi-val.rejected { color: #ef4444; }
    .kpi-val.duplicates { color: #f59e0b; }
    .kpi-val.quality { color: #38bdf8; }
    .kpi-label {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      margin-top: 4px;
      letter-spacing: 0.5px;
    }

    /* LIVE PROGRESS BAR */
    .progress-bar-wrap {
      background: rgba(15, 23, 42, 0.8);
      border-radius: 10px;
      height: 12px;
      overflow: hidden;
      margin: 16px 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .progress-bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      transition: width 0.2s ease;
    }

    /* INSPECTOR BOARD & DETAILS */
    .inspector-layout {
      display: grid;
      grid-template-columns: 460px 1fr;
      gap: 20px;
    }
    @media (max-width: 950px) {
      .inspector-layout { grid-template-columns: 1fr; }
    }
    .inspector-board-box {
      width: 440px;
      height: 440px;
      position: relative;
      border: 6px solid #2a1b12;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      background: #1e293b;
    }
    .inspector-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .code-box {
      background: #090d16;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 10px 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      color: #38bdf8;
      word-break: break-all;
    }
    .steps-list {
      max-height: 180px;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px;
      background: rgba(10, 15, 25, 0.6);
    }
    .step-entry {
      padding: 6px 10px;
      font-size: 0.85rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
    }
    .step-entry:last-child { border-bottom: none; }
    .step-entry.white { color: #f1f5f9; }
    .step-entry.black { color: #f59e0b; }

    /* PUZZLE QUEUE PILLS */
    .queue-chips-wrap {
      max-height: 160px;
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 10px;
      background: rgba(10, 15, 25, 0.6);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .queue-chip {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      cursor: pointer;
      transition: all 0.15s;
    }
    .queue-chip:hover, .queue-chip.active {
      background: #10b981;
      color: #042f2e;
      font-weight: 700;
      border-color: #10b981;
    }
  </style>
</head>
<body class="admin-body">

  <div class="admin-container">
    
    <!-- TOP BAR -->
    <header class="admin-header">
      <div class="admin-title-wrap">
        <h1>⚙️ ENGINE PUZZLE GENERATION & QUALITY LAB</h1>
        <div class="admin-subtitle">Industrial-grade 10x10 Draughts Puzzle Generator • 12 Tiers • Multi-Ruleset Ingestion</div>
      </div>
      <div class="admin-nav-links">
        <div class="admin-db-badge">
          <span class="dot"></span>
          <span id="db-total-count"><?= $totalPuzzles ?></span> Puzzles in MySQL
        </div>
        <a href="puzzles.php" class="btn btn-secondary btn-small">🧩 Open Trainer</a>
        <a href="dashboard.php" class="btn btn-secondary btn-small">👑 Dashboard</a>
      </div>
    </header>

    <!-- MAIN CONTROL GRID -->
    <div class="admin-grid">

      <!-- LEFT COLUMN: GENERATOR CONTROLS -->
      <div class="admin-col">
        <div class="admin-card">
          <h2 class="card-title">⚡ Generation Configuration</h2>

          <div class="form-group">
            <label>Target Ruleset</label>
            <select id="gen-ruleset" class="form-select">
              <option value="nigeria" selected>🇳🇬 Nigerian Street Draughts</option>
              <option value="ghana">🇬🇭 Ghanaian Damii Draughts</option>
              <option value="international">🌍 International FMJD (Majority Capture)</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Difficulty Tier</label>
              <select id="gen-tier" class="form-select">
                <option value="all">⚡ All Tiers (1 to 12 Balanced)</option>
                <option value="1">Tier 1: Novice (1000-1150)</option>
                <option value="2">Tier 2: Beginner (1150-1300)</option>
                <option value="3">Tier 3: Casual (1300-1450)</option>
                <option value="4" selected>Tier 4: Intermediate (1450-1600)</option>
                <option value="5">Tier 5: Club Player (1600-1750)</option>
                <option value="6">Tier 6: Tournament (1750-1900)</option>
                <option value="7">Tier 7: Expert (1900-2050)</option>
                <option value="8">Tier 8: Candidate Master (2050-2200)</option>
                <option value="9">Tier 9: Master (2200-2350)</option>
                <option value="10">Tier 10: International Master (2350-2500)</option>
                <option value="11">Tier 11: Grandmaster (2500-2650)</option>
                <option value="12">Tier 12: Super GM / AI Challenge (2650+)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Count to Generate</label>
              <input type="number" id="gen-count" class="form-control" value="20" min="1" max="1000">
            </div>
          </div>

          <div class="form-group">
            <label>Generation Engine Method</label>
            <select id="gen-method" class="form-select">
              <option value="reverse">Method A: Reverse Engineering (Combinations & Traps)</option>
              <option value="endgame">Method E: Composed Endgame (Otilo & King Locks)</option>
              <option value="hybrid" selected>Hybrid (Automatic Balanced Distribution)</option>
            </select>
          </div>

          <div class="form-group">
            <label>Quality Score Gate (≥ 80 Required)</label>
            <div class="range-wrap">
              <input type="range" id="gen-quality-gate" class="form-range" min="70" max="98" value="80" style="flex:1;">
              <span class="range-val" id="quality-gate-val">80</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
            <button type="button" id="btn-run-generator" class="btn btn-primary" style="width: 100%;">
              🚀 Generate Batch via Engine
            </button>
            <div class="form-row">
              <button type="button" id="btn-save-db" class="btn btn-secondary" style="width: 100%;" disabled>
                💾 Save Batch to MySQL
              </button>
              <button type="button" id="btn-export-json" class="btn btn-secondary" style="width: 100%;" disabled>
                📥 Export JSON
              </button>
            </div>
          </div>
        </div>

        <!-- GENERATION PRESETS -->
        <div class="admin-card">
          <h2 class="card-title">📦 Quick Production Batches</h2>
          <p style="font-size: 0.85rem; color: #94a3b8; margin-top: -6px;">
            One-click triggers to build standard certified sets:
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-small" id="btn-preset-130-ng">
              🇳🇬 Generate 130 Nigeria Production Puzzles
            </button>
            <button type="button" class="btn btn-secondary btn-small" id="btn-preset-130-gh">
              🇬🇭 Generate 130 Ghana Production Puzzles
            </button>
            <button type="button" class="btn btn-secondary btn-small" id="btn-preset-130-intl">
              🌍 Generate 130 FMJD Production Puzzles
            </button>
            <button type="button" class="btn btn-primary btn-small" id="btn-preset-390-all" style="margin-top: 6px;">
              ⭐ Generate Full 390 Production Suite (All 3 Rulesets)
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN: TELEMETRY & LIVE INSPECTOR -->
      <div class="admin-col">

        <!-- TELEMETRY KPI -->
        <div class="admin-card">
          <h2 class="card-title">📊 Generation Telemetry & Verification Audit</h2>

          <div class="kpi-grid">
            <div class="kpi-item">
              <div class="kpi-val" id="telemetry-generated">0</div>
              <div class="kpi-label">Generated</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-val accepted" id="telemetry-accepted">0</div>
              <div class="kpi-label">Accepted (≥80)</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-val rejected" id="telemetry-rejected">0</div>
              <div class="kpi-label">Rejected / Invalid</div>
            </div>
            <div class="kpi-item">
              <div class="kpi-val quality" id="telemetry-quality">0.00</div>
              <div class="kpi-label">Avg Quality</div>
            </div>
          </div>

          <div id="gen-status-text" style="font-size: 0.85rem; color: #94a3b8; font-weight: 500;">
            Idle. Ready to run puzzle generation.
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" id="gen-progress-bar"></div>
          </div>

          <!-- GENERATED PUZZLE QUEUE -->
          <label style="font-size: 0.8rem; font-weight: 600; color: #94a3b8; text-transform: uppercase;">
            Generated Puzzles Queue (Click to inspect):
          </label>
          <div class="queue-chips-wrap" id="queue-chips-wrap" style="margin-top: 6px;">
            <span style="font-size: 0.85rem; color: #64748b;">No puzzles generated yet in this session.</span>
          </div>
        </div>

        <!-- BOARD INSPECTOR -->
        <div class="admin-card" id="inspector-card">
          <h2 class="card-title">🔍 Interactive Board Inspector & Solution Player</h2>

          <div class="inspector-layout">
            
            <!-- Left: Board -->
            <div>
              <div class="inspector-board-box" id="inspector-board-box">
                <div class="board-inner" id="inspector-board" style="width: 100%; height: 100%; display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(10, 1fr);"></div>
              </div>
              <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px;">
                <button type="button" class="btn btn-secondary btn-small" id="btn-insp-first">|◀ Start</button>
                <button type="button" class="btn btn-secondary btn-small" id="btn-insp-prev">◀ Back</button>
                <button type="button" class="btn btn-secondary btn-small" id="btn-insp-next">▶ Next Step</button>
                <button type="button" class="btn btn-secondary btn-small" id="btn-insp-play">⚡ Autoplay</button>
              </div>
            </div>

            <!-- Right: Details -->
            <div class="inspector-details">
              <div>
                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Puzzle ID</span>
                <div id="insp-id" style="font-weight: 700; color: #f8fafc; font-size: 1.1rem;">-</div>
              </div>

              <div style="display: flex; gap: 10px;">
                <span class="puzzle-difficulty-tag beginner" id="insp-tier-badge">Tier -</span>
                <span class="puzzle-rating-badge" id="insp-rating-badge">⭐ - Elo</span>
                <span class="puzzle-tag" id="insp-ruleset-badge">🇳🇬 Nigeria</span>
              </div>

              <div>
                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">FEN Notation</span>
                <div class="code-box" id="insp-fen">-</div>
              </div>

              <div>
                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Solution Steps Sequence</span>
                <div class="steps-list" id="insp-steps-list">
                  <div style="color: #64748b; font-size: 0.85rem;">Select a puzzle to view steps.</div>
                </div>
              </div>

              <div>
                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700;">Progressive Hint (Level 3)</span>
                <div style="font-size: 0.85rem; color: #cbd5e1; font-style: italic; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;" id="insp-hint">
                  -
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>

  </div>

  <script type="module">
    import { ProfessionalPuzzleGenerator } from './js/puzzle_generator.js';
    import { rcToSq, sqToRC } from './js/engine50.js';
    import { PLAYER_1, PLAYER_2 } from './js/engine.js';

    let currentBatch = [];
    let selectedPuzzle = null;
    let inspectorStepIdx = 0;
    let inspectorBoardState = Array.from({ length: 10 }, () => Array(10).fill(null));
    let isAutoplaying = false;

    const dom = {
      ruleset: document.getElementById('gen-ruleset'),
      tier: document.getElementById('gen-tier'),
      count: document.getElementById('gen-count'),
      method: document.getElementById('gen-method'),
      qualityGate: document.getElementById('gen-quality-gate'),
      qualityGateVal: document.getElementById('quality-gate-val'),
      btnRun: document.getElementById('btn-run-generator'),
      btnSaveDb: document.getElementById('btn-save-db'),
      btnExportJson: document.getElementById('btn-export-json'),
      progressBar: document.getElementById('gen-progress-bar'),
      statusText: document.getElementById('gen-status-text'),
      queueChips: document.getElementById('queue-chips-wrap'),

      kpiGenerated: document.getElementById('telemetry-generated'),
      kpiAccepted: document.getElementById('telemetry-accepted'),
      kpiRejected: document.getElementById('telemetry-rejected'),
      kpiQuality: document.getElementById('telemetry-quality'),

      dbTotalCount: document.getElementById('db-total-count'),

      // Inspector DOM
      board: document.getElementById('inspector-board'),
      inspId: document.getElementById('insp-id'),
      inspTierBadge: document.getElementById('insp-tier-badge'),
      inspRatingBadge: document.getElementById('insp-rating-badge'),
      inspRulesetBadge: document.getElementById('insp-ruleset-badge'),
      inspFen: document.getElementById('insp-fen'),
      inspStepsList: document.getElementById('insp-steps-list'),
      inspHint: document.getElementById('insp-hint'),

      btnFirst: document.getElementById('btn-insp-first'),
      btnPrev: document.getElementById('btn-insp-prev'),
      btnNext: document.getElementById('btn-insp-next'),
      btnPlay: document.getElementById('btn-insp-play')
    };

    // Slider sync
    dom.qualityGate.addEventListener('input', (e) => {
      dom.qualityGateVal.textContent = e.target.value;
    });

    // Render 10x10 empty inspector board grid
    function initInspectorBoard() {
      dom.board.innerHTML = '';
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const isDark = (r + c) % 2 === 0;
          const sq = document.createElement('div');
          sq.className = `square ${isDark ? 'dark' : 'light'}`;
          sq.id = `insp-sq-${r}-${c}`;
          if (isDark) {
            const sqNum = rcToSq(r, c);
            if (sqNum) {
              const span = document.createElement('span');
              span.className = 'sq-draughts-num';
              span.textContent = sqNum;
              sq.appendChild(span);
            }
          }
          dom.board.appendChild(sq);
        }
      }
    }
    initInspectorBoard();

    // Renders pieces on inspector board
    function renderInspectorPieces() {
      // Clear all pieces
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const sq = document.getElementById(`insp-sq-${r}-${c}`);
          if (!sq) continue;
          const oldPiece = sq.querySelector('.piece');
          if (oldPiece) oldPiece.remove();

          const p = inspectorBoardState[r][c];
          if (p) {
            const pEl = document.createElement('div');
            pEl.className = `piece ${p.player === PLAYER_1 ? 'white' : 'dark'} ${p.isKing ? 'king' : ''}`;
            if (p.isKing) {
              const crown = document.createElement('span');
              crown.className = 'crown-icon';
              crown.textContent = '👑';
              pEl.appendChild(crown);
            }
            sq.appendChild(pEl);
          }
        }
      }
    }

    // Set board to puzzle initial position
    function loadInspectorPuzzle(puzzle) {
      selectedPuzzle = puzzle;
      inspectorStepIdx = 0;
      dom.inspId.textContent = puzzle.id;
      dom.inspTierBadge.textContent = `Tier ${puzzle.difficulty.tier}: ${puzzle.difficulty.tier_name}`;
      dom.inspRatingBadge.textContent = `⭐ ${puzzle.difficulty.rating} Elo`;
      dom.inspRulesetBadge.textContent = puzzle.ruleset.toUpperCase();
      dom.inspFen.textContent = puzzle.fen;
      dom.inspHint.textContent = puzzle.hints[2] || puzzle.hints[1] || puzzle.hints[0];

      // Populate steps list
      dom.inspStepsList.innerHTML = '';
      if (puzzle.initialMove) {
        const initDiv = document.createElement('div');
        initDiv.className = 'step-entry black';
        initDiv.innerHTML = `<span><strong>Blunder (AI):</strong> ${puzzle.initialMove.fromSq} → ${puzzle.initialMove.toSq}</span>`;
        dom.inspStepsList.appendChild(initDiv);
      }
      puzzle.solution.steps.forEach((s, idx) => {
        const div = document.createElement('div');
        div.className = `step-entry ${s.mover === PLAYER_1 ? 'white' : 'black'}`;
        div.innerHTML = `
          <span><strong>#${idx + 1}:</strong> ${s.mover === PLAYER_1 ? 'White' : 'Black'} (${s.fromSq} → ${s.toSq})</span>
          <span style="font-size: 0.75rem; color: #94a3b8;">${s.note || ''}</span>
        `;
        dom.inspStepsList.appendChild(div);
      });

      // Build boardState
      inspectorBoardState = Array.from({ length: 10 }, () => Array(10).fill(null));
      for (const item of puzzle.initialBoard) {
        inspectorBoardState[item.r][item.c] = { player: item.player, isKing: Boolean(item.isKing) };
      }

      renderInspectorPieces();

      // Highlight active chip
      document.querySelectorAll('.queue-chip').forEach(c => c.classList.remove('active'));
      const activeChip = document.getElementById(`chip-${puzzle.id}`);
      if (activeChip) activeChip.classList.add('active');
    }

    // Generator execution
    dom.btnRun.addEventListener('click', async () => {
      const ruleset = dom.ruleset.value;
      const tierVal = dom.tier.value;
      const count = parseInt(dom.count.value, 10) || 10;
      const qualityGate = parseInt(dom.qualityGate.value, 10) || 80;
      const method = dom.method.value;

      dom.btnRun.disabled = true;
      dom.statusText.textContent = `Generating ${count} puzzles (${ruleset.toUpperCase()})...`;
      dom.progressBar.style.width = '10%';

      const gen = new ProfessionalPuzzleGenerator();
      currentBatch = [];

      let accepted = 0;
      const targetTiers = tierVal === 'all' ? [1,2,3,4,5,6,7,8,9,10,11,12] : [parseInt(tierVal, 10)];
      const perTier = Math.max(1, Math.ceil(count / targetTiers.length));

      for (const t of targetTiers) {
        for (let i = 0; i < perTier; i++) {
          if (currentBatch.length >= count) break;
          const p = gen.generatePuzzle({ tier: t, ruleset: ruleset, theme: method === 'endgame' ? 'zugzwang' : 'combination' });
          if (p && p.quality.score >= qualityGate) {
            currentBatch.push(p);
          }
        }
        const pct = Math.min(95, Math.round((currentBatch.length / count) * 100));
        dom.progressBar.style.width = `${pct}%`;
      }

      const report = gen.getTelemetryReport();
      dom.kpiGenerated.textContent = report.generated;
      dom.kpiAccepted.textContent = currentBatch.length;
      dom.kpiRejected.textContent = report.rejected + report.invalidPositions;
      dom.kpiQuality.textContent = report.avgQualityScore;

      dom.progressBar.style.width = '100%';
      dom.statusText.textContent = `Completed! Generated ${currentBatch.length} verified puzzles.`;
      dom.btnRun.disabled = false;
      dom.btnSaveDb.disabled = currentBatch.length === 0;
      dom.btnExportJson.disabled = currentBatch.length === 0;

      // Populate Queue Chips
      dom.queueChips.innerHTML = '';
      currentBatch.forEach((p, idx) => {
        const chip = document.createElement('span');
        chip.className = `queue-chip ${idx === 0 ? 'active' : ''}`;
        chip.id = `chip-${p.id}`;
        chip.textContent = `${p.id} (T${p.difficulty.tier})`;
        chip.addEventListener('click', () => loadInspectorPuzzle(p));
        dom.queueChips.appendChild(chip);
      });

      if (currentBatch.length > 0) {
        loadInspectorPuzzle(currentBatch[0]);
      }
    });

    // Save batch to database via API
    dom.btnSaveDb.addEventListener('click', async () => {
      if (currentBatch.length === 0) return;
      dom.btnSaveDb.disabled = true;
      dom.statusText.textContent = `Ingesting ${currentBatch.length} puzzles into MySQL...`;

      try {
        const res = await fetch('api/puzzles.php?action=save_batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            puzzles: currentBatch,
            ruleset: dom.ruleset.value,
            avg_quality: parseFloat(dom.kpiQuality.textContent) || 85.0
          })
        });
        const data = await res.json();
        if (data.success) {
          dom.statusText.textContent = `✅ Successfully saved ${data.inserted} puzzles to database!`;
          dom.dbTotalCount.textContent = parseInt(dom.dbTotalCount.textContent, 10) + data.inserted;
        } else {
          dom.statusText.textContent = `❌ Error: ${data.message}`;
        }
      } catch (err) {
        dom.statusText.textContent = `❌ Network error: ${err.message}`;
      } finally {
        dom.btnSaveDb.disabled = false;
      }
    });

    // Export JSON
    dom.btnExportJson.addEventListener('click', () => {
      if (currentBatch.length === 0) return;
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentBatch, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `puzzles_${dom.ruleset.value}_${Date.now()}.json`;
      a.click();
    });

    // Step navigation in inspector
    dom.btnNext.addEventListener('click', () => {
      if (!selectedPuzzle) return;
      const steps = selectedPuzzle.solution.steps;
      if (inspectorStepIdx < steps.length) {
        const s = steps[inspectorStepIdx];
        const from = sqToRC(s.fromSq);
        const to = sqToRC(s.toSq);
        const piece = inspectorBoardState[from.r][from.c];
        inspectorBoardState[from.r][from.c] = null;
        inspectorBoardState[to.r][to.c] = piece;

        // If capture, remove jumped piece
        if (Math.abs(to.r - from.r) >= 2) {
          const mr = (from.r + to.r) / 2;
          const mc = (from.c + to.c) / 2;
          if (Number.isInteger(mr) && Number.isInteger(mc)) {
            inspectorBoardState[mr][mc] = null;
          }
        }
        inspectorStepIdx++;
        renderInspectorPieces();
      }
    });

    dom.btnFirst.addEventListener('click', () => {
      if (selectedPuzzle) loadInspectorPuzzle(selectedPuzzle);
    });

  </script>
</body>
</html>
