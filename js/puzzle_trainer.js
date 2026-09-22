/**
 * Lidraughts-Style Tactical Draughts Puzzle Trainer (js/puzzle_trainer.js)
 *
 * Modeled directly after Lidraughts.org/training:
 * - Opponent preparatory blunder/move played automatically on puzzle load
 * - Fluid Pointer Drag-and-Drop (touch & mouse) without DOM teardown
 * - Click-to-Move with glowing piece selection and destination dots
 * - Opponent forced response moves with realistic 450ms timing
 * - Dynamic feedback: "Best move! Keep going...", "Puzzle Solved!", "Not the best move"
 * - Wrong-move snapback (animates error, plays buzzer, snaps back so user can retry)
 * - Multi-jump consecutive continuation with auto-selected jumper
 * - Progressive hints (Level 1: halo pulse, Level 2: SVG vector arrow)
 * - Automated step-by-step solution player
 * - 1-50 Draughts Notation Numbers visible by default
 * - Rating & Streak HUD with local persistence & Coin reward integration
 */

import { sound } from './audio.js';
import { TRAP_DATABASE } from './traps.js';
import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './engine.js';
import { rcToSq } from './engine50.js';
import { TACTICAL_THEMES_CATALOG, getThemeById, searchThemes, getThemesByStars } from './tactical_taxonomy.js';

class PuzzleTrainer {
  constructor() {
    this.puzzles = TRAP_DATABASE.map(p => {
      if (!p.steps && p.solution && Array.isArray(p.solution.steps)) {
        p.steps = p.solution.steps;
      }
      return p;
    });
    this.currentPuzzleIdx = 0;
    this.currentStepIdx = 0;
    this.boardState = Array.from({ length: 10 }, () => Array(10).fill(null));
    this.selectedSquare = null;
    this.validMoves = [];
    this.isFlipped = false;
    this.showNotationNumbers = true; // Enabled by default for authentic draughts
    this.hintLevel = 0;
    this.isOpponentMoving = false;
    this.isAnimatingSolution = false;
    this.activeFilter = 'all';
    this.activeRuleset = 'all';
    this.activeTheme = 'all';
    this.activeStarFilter = 'all';
    this.searchQuery = '';
    this.coupsSearchQuery = '';

    // Move History & Step Replay Snapshots (World-Standard Lidraughts)
    this.moveHistory = [];
    this.boardSnapshots = [];
    this.activeHistoryIdx = 0;

    // Persisted User Performance & Lidraughts-Style Session Strip
    this.solvedSet = new Set(JSON.parse(localStorage.getItem('draughts_puzzles_solved') || '[]'));
    this.userRating = parseInt(localStorage.getItem('draughts_puzzle_rating') || '1500', 10);
    this.streak = parseInt(localStorage.getItem('draughts_puzzle_streak') || '0', 10);
    this.sessionHistory = JSON.parse(localStorage.getItem('draughts_session_history') || '[]');
    this.engine = null;

    // Initialise on DOM Ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  syncBoardStateFromEngine() {
    this.boardState = Array.from({ length: 10 }, () => Array(10).fill(null));
    if (!this.engine) return;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const p = this.engine.board[r][c];
        if (p) {
          this.boardState[r][c] = {
            player: p.player,
            isKing: Boolean(p.isKing)
          };
        }
      }
    }
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.updatePerformanceHUD();
    this.renderSessionStrip();
    this.renderFilterPills();
    this.populateThemeSelector();
    this.renderCoupsGrid();
    this.renderPuzzleChips();
    if (this.dom.labelCoordsToggle) {
      this.dom.labelCoordsToggle.textContent = `Square 1-50: ${this.showNotationNumbers ? 'On' : 'Off'}`;
    }

    // Check URL parameters for specific puzzle, filter, or theme
    const params = new URLSearchParams(window.location.search);
    const puzzleId = params.get('id');
    const filter = params.get('filter');
    const themeParam = params.get('theme');

    if (filter && ['all', 'beginner', 'intermediate', 'national-master', 'grandmaster'].includes(filter)) {
      this.activeFilter = filter;
      this.updateFilterButtons();
    }

    if (themeParam) {
      this.activeTheme = themeParam;
      if (this.dom.selectTheme) this.dom.selectTheme.value = themeParam;
    }

    let initialIdx = 0;
    if (puzzleId) {
      const foundIdx = this.puzzles.findIndex(p => p.id === puzzleId);
      if (foundIdx !== -1) initialIdx = foundIdx;
    }

    this.loadPuzzle(initialIdx);
  }

  cacheDOM() {
    this.dom = {
      boardInner: document.getElementById('draughts-board'),
      boardFrame: document.getElementById('board-wood-frame'),
      tacticalSvg: document.getElementById('board-tactical-svg'),

      evalBar: document.getElementById('eval-bar-fill'),
      evalScore: document.getElementById('eval-score-label'),
      coachQuote: document.getElementById('coach-quote'),
      btnFullscreen: document.getElementById('btn-fullscreen'),

      notationTableBody: document.getElementById('notation-table-body'),
      notationCounter: document.getElementById('notation-step-counter'),
      btnStepFirst: document.getElementById('btn-step-first'),
      btnStepPrev: document.getElementById('btn-step-prev'),
      btnStepNext: document.getElementById('btn-step-next'),
      btnStepLast: document.getElementById('btn-step-last'),

      btnToggleCoords: document.getElementById('btn-toggle-coords'),
      labelCoordsToggle: document.getElementById('label-coords-toggle'),
      btnFlipBoard: document.getElementById('btn-flip-board'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      soundIcon: document.getElementById('sound-icon'),

      puzzleVariantTag: document.getElementById('puzzle-variant-tag'),
      puzzleVariantText: document.getElementById('puzzle-variant-text'),
      highwayStatus: document.getElementById('puzzle-highway-status'),
      highwayLabel: document.getElementById('puzzle-highway-label'),

      puzzleIdLabel: document.getElementById('puzzle-id-label'),
      puzzleRatingBadge: document.getElementById('puzzle-rating-badge'),
      puzzleTitle: document.getElementById('puzzle-title'),
      puzzleDiffTag: document.getElementById('puzzle-diff-tag'),
      puzzleThemeTags: document.getElementById('puzzle-theme-tags'),

      turnCard: document.getElementById('puzzle-turn-card'),
      turnDisc: document.getElementById('puzzle-turn-disc'),
      turnTagline: document.getElementById('puzzle-turn-tagline'),
      turnPrompt: document.getElementById('puzzle-turn-prompt'),

      feedbackCard: document.getElementById('puzzle-feedback-card'),
      feedbackStatusRow: document.getElementById('feedback-status-row'),
      feedbackIcon: document.getElementById('feedback-icon'),
      feedbackTitle: document.getElementById('feedback-title'),
      feedbackDesc: document.getElementById('feedback-desc'),
      feedbackRewards: document.getElementById('feedback-rewards'),
      feedbackActions: document.getElementById('feedback-actions'),

      btnHint: document.getElementById('btn-puzzle-hint'),
      btnSolution: document.getElementById('btn-puzzle-solution'),
      btnReset: document.getElementById('btn-puzzle-reset'),
      btnNext: document.getElementById('btn-puzzle-next'),

      userRating: document.getElementById('user-puzzle-rating'),
      userStreak: document.getElementById('user-puzzle-streak'),
      userSolvedRatio: document.getElementById('user-puzzle-solved-ratio'),

      filterPills: document.getElementById('puzzle-filter-pills'),
      rulesetPills: document.getElementById('puzzle-ruleset-pills'),
      selectTheme: document.getElementById('select-puzzle-theme'),
      btnOpenCoupsModal: document.getElementById('btn-open-coups-modal'),
      btnBrowseCoups: document.getElementById('btn-browse-coups'),
      coupsModal: document.getElementById('coups-modal'),
      btnCloseCoupsModal: document.getElementById('btn-close-coups-modal'),
      coupsSearchInput: document.getElementById('coups-search-input'),
      coupsStarFilters: document.getElementById('coups-star-filters'),
      coupsGrid: document.getElementById('coups-grid'),
      chipsGrid: document.getElementById('puzzle-chips-grid'),
      searchInput: document.getElementById('puzzle-search-input'),
      sessionPillsWrap: document.getElementById('session-pills-wrap')
    };
  }

  bindEvents() {
    // Puzzle Search Input
    this.dom.searchInput?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderPuzzleChips();
    });

    // Square Notation Toggle
    this.dom.btnToggleCoords?.addEventListener('click', () => {
      this.showNotationNumbers = !this.showNotationNumbers;
      if (this.dom.labelCoordsToggle) {
        this.dom.labelCoordsToggle.textContent = `Square 1-50: ${this.showNotationNumbers ? 'On' : 'Off'}`;
      }
      this.renderBoard();
      this.renderPieces();
    });

    // Board Flip
    this.dom.btnFlipBoard?.addEventListener('click', () => {
      this.isFlipped = !this.isFlipped;
      this.renderBoard();
      this.renderPieces();
    });

    // Sound Toggle
    this.dom.btnSoundToggle?.addEventListener('click', () => {
      sound.toggleMute();
      this.updateSoundIcon();
    });

    // Fullscreen Toggle
    this.dom.btnFullscreen?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Move Notation Step Navigation Controls
    this.dom.btnStepFirst?.addEventListener('click', () => this.jumpToHistoryStep(0));
    this.dom.btnStepPrev?.addEventListener('click', () => this.jumpToHistoryStep(this.activeHistoryIdx - 1));
    this.dom.btnStepNext?.addEventListener('click', () => this.jumpToHistoryStep(this.activeHistoryIdx + 1));
    this.dom.btnStepLast?.addEventListener('click', () => this.jumpToHistoryStep(this.boardSnapshots.length - 1));

    // Global Keyboard Shortcuts (Lidraughts standard)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      const key = e.key.toLowerCase();
      if (key === 'r') {
        e.preventDefault();
        this.loadPuzzle(this.currentPuzzleIdx);
      } else if (key === 'h') {
        e.preventDefault();
        this.handleHintClick();
      } else if (key === 's') {
        e.preventDefault();
        this.handleSolutionClick();
      } else if (key === 'f') {
        e.preventDefault();
        this.isFlipped = !this.isFlipped;
        this.renderBoard();
        this.renderPieces();
      } else if (key === 'c') {
        e.preventDefault();
        this.showNotationNumbers = !this.showNotationNumbers;
        if (this.dom.labelCoordsToggle) {
          this.dom.labelCoordsToggle.textContent = `Square 1-50: ${this.showNotationNumbers ? 'On' : 'Off'}`;
        }
        this.renderBoard();
        this.renderPieces();
      } else if (key === '[' || (key === 'arrowleft' && this.boardSnapshots.length > 1 && this.activeHistoryIdx > 0)) {
        e.preventDefault();
        this.jumpToHistoryStep(this.activeHistoryIdx - 1);
      } else if (key === ']' || (key === 'arrowright' && this.activeHistoryIdx < this.boardSnapshots.length - 1)) {
        e.preventDefault();
        this.jumpToHistoryStep(this.activeHistoryIdx + 1);
      } else if (key === ' ' || key === 'arrowright') {
        e.preventDefault();
        const puzzle = this.puzzles[this.currentPuzzleIdx];
        if (this.currentStepIdx >= puzzle.steps.length || this.solvedSet.has(puzzle.id)) {
          this.advanceToNextPuzzle();
        }
      } else if (key === 'arrowleft') {
        e.preventDefault();
        const prevIdx = (this.currentPuzzleIdx - 1 + this.puzzles.length) % this.puzzles.length;
        this.loadPuzzle(prevIdx);
      } else if (key === 'm') {
        e.preventDefault();
        sound.toggleMute();
        this.updateSoundIcon();
      }
    });

    // Interactive Action Controls
    this.dom.btnHint?.addEventListener('click', () => this.handleHintClick());
    this.dom.btnSolution?.addEventListener('click', () => this.handleSolutionClick());
    this.dom.btnReset?.addEventListener('click', () => this.loadPuzzle(this.currentPuzzleIdx));
    this.dom.btnNext?.addEventListener('click', () => this.advanceToNextPuzzle());

    // Ruleset Filter Pills Delegate
    this.dom.rulesetPills?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const rset = btn.dataset.ruleset;
      if (rset) {
        this.activeRuleset = rset;
        this.updateRulesetButtons();
        this.renderFilterPills();
        this.renderPuzzleChips();

        // Load first puzzle matching ruleset
        const matchIdx = this.puzzles.findIndex(p => {
          if (this.activeRuleset === 'all') return true;
          return p.ruleset === this.activeRuleset;
        });
        if (matchIdx !== -1) {
          this.loadPuzzle(matchIdx);
        }
      }
    });

    // Filter Buttons Delegate
    this.dom.filterPills?.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      const filter = btn.dataset.filter;
      if (filter) {
        this.activeFilter = filter;
        this.updateFilterButtons();
        this.renderPuzzleChips();

        // Load first puzzle matching filter
        const matchIdx = this.puzzles.findIndex(p => this.matchesFilter(p, filter));
        if (matchIdx !== -1) {
          this.loadPuzzle(matchIdx);
        }
      }
    });

    // Classical Coups Modal Controls
    this.dom.btnOpenCoupsModal?.addEventListener('click', () => this.openCoupsModal());
    this.dom.btnBrowseCoups?.addEventListener('click', () => this.openCoupsModal());
    this.dom.btnCloseCoupsModal?.addEventListener('click', () => this.closeCoupsModal());
    this.dom.coupsModal?.addEventListener('click', (e) => {
      if (e.target === this.dom.coupsModal) this.closeCoupsModal();
    });

    // Coups Search Input
    this.dom.coupsSearchInput?.addEventListener('input', (e) => {
      this.coupsSearchQuery = e.target.value.toLowerCase().trim();
      this.filterCoupsGrid();
    });

    // Coups Star Filter Pills
    this.dom.coupsStarFilters?.addEventListener('click', (e) => {
      const pill = e.target.closest('.coup-star-pill');
      if (!pill) return;
      this.dom.coupsStarFilters.querySelectorAll('.coup-star-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      this.activeStarFilter = pill.dataset.stars || 'all';
      this.filterCoupsGrid();
    });

    // Coups Grid Practice Click Delegate
    this.dom.coupsGrid?.addEventListener('click', (e) => {
      const practiceBtn = e.target.closest('.btn-practice-coup');
      if (practiceBtn) {
        const coupId = practiceBtn.dataset.coupId;
        if (coupId) this.practiceCoup(coupId);
      }
    });

    // Theme Selector Dropdown
    this.dom.selectTheme?.addEventListener('change', (e) => {
      this.activeTheme = e.target.value;
      this.renderPuzzleChips();
      const matchIdx = this.puzzles.findIndex(p => this.matchesFilter(p, this.activeFilter));
      if (matchIdx !== -1) {
        this.loadPuzzle(matchIdx);
      }
    });
  }

  getPuzzleTier(p) {
    if (!p) return 1;
    if (typeof p.difficulty === 'object' && p.difficulty !== null) {
      return p.difficulty.tier || 1;
    }
    return p.difficultyTier || 1;
  }

  getPuzzleDiffName(p) {
    if (!p) return 'Beginner';
    if (typeof p.difficulty === 'object' && p.difficulty !== null) {
      return p.difficulty.tier_name || 'Beginner';
    }
    if (typeof p.difficulty === 'string') {
      return p.difficulty;
    }
    return 'Beginner';
  }

  getPuzzleRating(p) {
    if (!p) return 1200;
    if (typeof p.difficulty === 'object' && p.difficulty !== null && p.difficulty.rating) {
      return p.difficulty.rating;
    }
    return p.rating || 1200;
  }

  matchesFilter(p, filter) {
    if (!p) return false;

    // 1. Ruleset check
    if (this.activeRuleset && this.activeRuleset !== 'all') {
      if (p.ruleset !== this.activeRuleset) return false;
    }

    // 2. Classical Coup / Theme check
    if (this.activeTheme && this.activeTheme !== 'all') {
      const coup = getThemeById(this.activeTheme);
      const matchesId = p.themeId === this.activeTheme;
      const matchesName = coup && (
        (p.themeName && p.themeName.toLowerCase() === coup.name.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(coup.name.toLowerCase())) ||
        (Array.isArray(p.themes) && p.themes.some(t => t.toLowerCase() === coup.name.toLowerCase() || t.toLowerCase() === coup.id.toLowerCase()))
      );
      if (!matchesId && !matchesName) return false;
    }

    // 3. Search query check
    if (this.searchQuery) {
      const q = this.searchQuery;
      const title = (p.title || '').toLowerCase();
      const theme = (p.themeName || p.category || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const pid = String(p.id || '').toLowerCase();
      if (!title.includes(q) && !theme.includes(q) && !desc.includes(q) && !pid.includes(q)) {
        return false;
      }
    }

    // 4. Difficulty tier check
    if (filter === 'all') return true;
    const tier = this.getPuzzleTier(p);
    if (filter === 'beginner') return tier <= 2;
    if (filter === 'intermediate') return tier === 3 || tier === 4;
    if (filter === 'advanced') return tier === 5 || tier === 6;
    if (filter === 'expert') return tier === 7 || tier === 8;
    if (filter === 'master') return tier === 9 || tier === 10;
    if (filter === 'grandmaster') return tier === 11;
    if (filter === 'super-gm') return tier === 12;
    return this.getPuzzleDiffName(p).toLowerCase().replace(/\s+/g, '-').includes(filter);
  }

  // ==================== 32 CLASSICAL COUPS & THEMES LOGIC ==================== //

  populateThemeSelector() {
    if (!this.dom.selectTheme) return;
    let html = '<option value="all">⭐ All Classical Combinations (32)</option>';
    
    const starsGroups = [
      { label: '⭐⭐⭐ Intermediate Coups', stars: 3 },
      { label: '⭐⭐⭐⭐ Advanced & Expert Coups', stars: 4 },
      { label: '⭐⭐⭐⭐⭐ Master & Grandmaster Coups', stars: 5 },
      { label: '⭐⭐⭐⭐⭐+ Legendary Studies', stars: 6 }
    ];

    for (const grp of starsGroups) {
      const themes = TACTICAL_THEMES_CATALOG.filter(t => t.stars === grp.stars);
      if (themes.length > 0) {
        html += `<optgroup label="${grp.label}">`;
        for (const t of themes) {
          html += `<option value="${t.id}">${t.starsDisplay} ${t.name}</option>`;
        }
        html += `</optgroup>`;
      }
    }
    this.dom.selectTheme.innerHTML = html;
  }

  renderCoupsGrid() {
    if (!this.dom.coupsGrid) return;
    this.dom.coupsGrid.innerHTML = TACTICAL_THEMES_CATALOG.map(t => `
      <div class="coup-card" data-coup-id="${t.id}" data-stars="${t.stars}">
        <div class="coup-card-top">
          <span class="coup-card-icon">${t.icon || '♟️'}</span>
          <span class="coup-stars-badge">${t.starsDisplay}</span>
        </div>
        <h3 class="coup-card-title">${t.name}</h3>
        <p class="coup-card-idea">${t.coreIdea}</p>
        <div class="coup-card-footer">
          <span class="coup-level-label">${t.difficultyLabel}</span>
          <button type="button" class="btn-practice-coup" data-coup-id="${t.id}" title="Practice ${t.name} in Puzzle Trainer">
            🎯 Practice
          </button>
        </div>
      </div>
    `).join('');
  }

  openCoupsModal(focusedCoupId = null) {
    if (!this.dom.coupsModal) return;
    this.dom.coupsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (focusedCoupId) {
      const card = this.dom.coupsGrid?.querySelector(`[data-coup-id="${focusedCoupId}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.style.borderColor = '#f59e0b';
        card.style.boxShadow = '0 0 25px rgba(245, 158, 11, 0.6)';
        setTimeout(() => {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }, 2000);
      }
    }
  }

  closeCoupsModal() {
    if (!this.dom.coupsModal) return;
    this.dom.coupsModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  filterCoupsGrid() {
    if (!this.dom.coupsGrid) return;
    const cards = this.dom.coupsGrid.querySelectorAll('.coup-card');
    const q = this.coupsSearchQuery;
    const starsFilter = this.activeStarFilter;

    cards.forEach(card => {
      const coupId = card.dataset.coupId;
      const theme = getThemeById(coupId);
      if (!theme) return;

      const matchesStars = starsFilter === 'all' || String(theme.stars) === String(starsFilter);
      const matchesText = !q || 
        theme.name.toLowerCase().includes(q) ||
        theme.frenchName.toLowerCase().includes(q) ||
        theme.englishName.toLowerCase().includes(q) ||
        theme.coreIdea.toLowerCase().includes(q) ||
        theme.difficultyLabel.toLowerCase().includes(q);

      card.style.display = (matchesStars && matchesText) ? 'flex' : 'none';
    });
  }

  practiceCoup(coupId) {
    this.closeCoupsModal();
    this.activeTheme = coupId;
    if (this.dom.selectTheme) {
      this.dom.selectTheme.value = coupId;
    }
    this.renderPuzzleChips();

    // Find first matching puzzle
    const matchIdx = this.puzzles.findIndex(p => this.matchesFilter(p, this.activeFilter));
    if (matchIdx !== -1) {
      this.loadPuzzle(matchIdx);
    }
  }

  updateRulesetButtons() {
    if (!this.dom.rulesetPills) return;
    const btns = this.dom.rulesetPills.querySelectorAll('.filter-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.ruleset === this.activeRuleset);
    });
  }

  updateSoundIcon() {
    if (this.dom.soundIcon) {
      this.dom.soundIcon.textContent = !sound.muted ? '🔊' : '🔇';
    }
  }

  // ==================== PUZZLE LOADING & OPPONENT SETUP ==================== //

  loadPuzzle(index) {
    if (index < 0 || index >= this.puzzles.length) index = 0;
    this.currentPuzzleIdx = index;
    this.currentStepIdx = 0;
    this.selectedSquare = null;
    this.validMoves = [];
    this.hintLevel = 0;
    this.isOpponentMoving = false;
    this.isAnimatingSolution = false;
    this.clearMoveHighlights();
    this.clearTacticalSvg();

    // Reset History & Evaluation
    this.moveHistory = [];
    this.boardSnapshots = [];
    this.activeHistoryIdx = 0;

    const puzzle = this.puzzles[this.currentPuzzleIdx];
    if (!puzzle) return;

    // 1. Populate metadata cards
    const diffName = this.getPuzzleDiffName(puzzle);
    const diffClass = diffName.toLowerCase().replace(/\s+/g, '-');
    const rating = this.getPuzzleRating(puzzle);

    if (this.dom.puzzleIdLabel) this.dom.puzzleIdLabel.textContent = `Puzzle #${this.currentPuzzleIdx + 1}`;
    if (this.dom.puzzleRatingBadge) this.dom.puzzleRatingBadge.textContent = `⭐ ${rating} Elo`;
    if (this.dom.puzzleTitle) this.dom.puzzleTitle.textContent = puzzle.title;

    if (this.dom.puzzleDiffTag) {
      this.dom.puzzleDiffTag.className = `puzzle-difficulty-tag ${diffClass}`;
      this.dom.puzzleDiffTag.textContent = diffName;
    }

    if (this.dom.puzzleThemeTags) {
      const coupName = puzzle.themeName || puzzle.category || 'Coup Royal';
      const coupStars = puzzle.themeStars || '⭐⭐⭐⭐';
      const coupIdea = puzzle.themeIdea || 'Classical combination';
      const coupId = puzzle.themeId || '';
      const rulesetLabel = puzzle.ruleset === 'nigeria' ? '🇳🇬 Naija Rules' : (puzzle.ruleset === 'ghana' ? '🇬🇭 Damii' : '🌍 FMJD');

      this.dom.puzzleThemeTags.innerHTML = `
        <span class="puzzle-tag coup-tag" data-coup-id="${coupId}" title="${coupName} (${coupStars}): ${coupIdea}. Click to view in Encyclopedia.">
          ${coupStars} ${coupName}
        </span>
        <span class="puzzle-tag">${puzzle.badge || 'Tactical Shot'}</span>
        <span class="puzzle-tag">${rulesetLabel}</span>
      `;

      this.dom.puzzleThemeTags.querySelector('.coup-tag')?.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.coupId;
        this.openCoupsModal(id);
      });
    }

    if (this.dom.puzzleVariantText) {
      this.dom.puzzleVariantText.textContent = puzzle.ruleset === 'nigeria'
        ? 'Nigerian Rules (Backward Seed Captures + Flying King)'
        : 'International 10x10 Draughts';
    }

    if (this.dom.highwayStatus && this.dom.highwayLabel) {
      if (puzzle.id === 'highway_ambush') {
        this.dom.highwayStatus.style.display = 'flex';
        this.dom.highwayLabel.textContent = 'Highway Ambush Active • Long Diagonal (46-1) Cleared';
      } else {
        this.dom.highwayStatus.style.display = 'flex';
        this.dom.highwayLabel.textContent = 'Compulsory Capture Enforced • Strict Tactical Solution';
      }
    }

    // Street Coach Commentary
    if (this.dom.coachQuote) {
      const coachQuotes = [
        "Calm down spot the combination. Trap don set, chop am well!",
        "Look well! Draughts na calculation, no be speed.",
        "Street rule: If you touch am, you must chop am!",
        "Trap dey set... shine your eye well well!",
        "Patience na king! Calculate all moves before you strike.",
        "Make you no rush! See where Black piece dey go first.",
        "Master combination dey come: think 2 moves ahead!",
        "Shine your eye! Highway trap no dey give second chance."
      ];
      this.dom.coachQuote.textContent = puzzle.coachQuote || coachQuotes[this.currentPuzzleIdx % coachQuotes.length];
    }

    // Reset Evaluation Gauge
    this.updateEvalGauge('0.0', 50);

    // 2. Setup Engine & Board State from initialBoard
    const ruleMode = puzzle.ruleset || 'nigeria';
    this.engine = new NigerianDraughtsEngine({ boardSize: 10, ruleMode });
    this.engine.loadCustomPosition(puzzle.initialBoard, PLAYER_1);
    this.syncBoardStateFromEngine();

    // 3. Render Board & Pieces
    this.renderBoard();
    this.renderPieces();
    this.renderPuzzleChips();

    // Save starting snapshot & populate notation
    this.saveBoardSnapshot('Start', null, null);
    this.updateNotationTable();

    // 4. Opponent Setup Move (The Blunder/Pre-move in Lidraughts style)
    if (puzzle.initialMove) {
      this.playOpponentInitialMove(puzzle.initialMove);
    } else {
      this.activatePlayerTurn();
    }
  }

  playOpponentInitialMove(initMove) {
    this.isOpponentMoving = true;
    this.updateTurnBanner(PLAYER_2, 'Opponent is making their move...');
    this.setFeedback({
      icon: '⏳',
      title: 'Opponent is moving...',
      desc: 'Watch the board carefully to identify Black’s tactical mistake.',
      statusClass: 'progress'
    });

    // Highlight from square
    this.highlightMoveSquares(initMove.from, null);

    setTimeout(() => {
      // Execute opponent move with smooth animation callback
      this.executeMove(initMove.from, initMove.to, () => {
        this.highlightMoveSquares(initMove.from, initMove.to);
        this.isOpponentMoving = false;
        this.activatePlayerTurn();
      });
    }, 450);
  }

  activatePlayerTurn() {
    this.isOpponentMoving = false;
    this.updateTurnBanner(PLAYER_1, 'Find the best move for White.');
    this.setFeedback({
      icon: '🎯',
      title: 'Find the winning move',
      desc: 'Spot the tactical sequence that forces an inescapable trap or decisive material advantage.',
      statusClass: 'normal'
    });
  }

  updateTurnBanner(player, promptText) {
    if (this.dom.turnDisc) {
      this.dom.turnDisc.className = `turn-disc ${player === PLAYER_1 ? 'white' : 'dark'}`;
    }
    if (this.dom.turnTagline) {
      this.dom.turnTagline.textContent = player === PLAYER_1 ? 'YOUR TURN' : 'OPPONENT TURN';
    }
    if (this.dom.turnPrompt) {
      this.dom.turnPrompt.textContent = promptText || (player === PLAYER_1 ? 'Find the best move for White.' : 'Waiting for response...');
    }
  }

  setFeedback({ icon, title, desc, statusClass = 'normal', rewards = null, actions = [] }) {
    if (this.dom.feedbackIcon) this.dom.feedbackIcon.textContent = icon || '🎯';
    if (this.dom.feedbackTitle) this.dom.feedbackTitle.textContent = title || '';
    if (this.dom.feedbackDesc) this.dom.feedbackDesc.textContent = desc || '';

    if (this.dom.feedbackStatusRow) {
      this.dom.feedbackStatusRow.className = `feedback-status-row ${statusClass}`;
    }

    // Rewards Pill
    if (this.dom.feedbackRewards) {
      if (rewards) {
        this.dom.feedbackRewards.style.display = 'flex';
        this.dom.feedbackRewards.innerHTML = `
          <span class="reward-item rating-gain">📈 +${rewards.rating || 25} Rating</span>
          <span class="reward-item coins-gain">🪙 +${rewards.coins || 50} Coins</span>
        `;
      } else {
        this.dom.feedbackRewards.style.display = 'none';
      }
    }

    // Dynamic Action Buttons
    if (this.dom.feedbackActions) {
      this.dom.feedbackActions.innerHTML = '';
      actions.forEach(act => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `btn ${act.isPrimary ? 'btn-primary' : 'btn-secondary'} btn-small`;
        btn.textContent = act.label;
        btn.addEventListener('click', act.onClick);
        this.dom.feedbackActions.appendChild(btn);
      });
    }
  }

  // ==================== BOARD & PIECE RENDERING ==================== //

  renderBoard() {
    if (!this.dom.boardInner) return;
    this.dom.boardInner.style.display = 'grid';
    this.dom.boardInner.style.gridTemplateColumns = 'repeat(10, 1fr)';
    this.dom.boardInner.style.gridTemplateRows = 'repeat(10, 1fr)';
    this.dom.boardInner.style.width = '100%';
    this.dom.boardInner.style.height = '100%';
    this.dom.boardInner.style.aspectRatio = '1 / 1';
    this.dom.boardInner.innerHTML = '';

    for (let rowIdx = 0; rowIdx < 10; rowIdx++) {
      for (let colIdx = 0; colIdx < 10; colIdx++) {
        const r = this.isFlipped ? (9 - rowIdx) : rowIdx;
        const c = this.isFlipped ? (9 - colIdx) : colIdx;

        const isDark = this.engine && this.engine.isDarkSquare ? this.engine.isDarkSquare(r, c) : ((r + c) % 2 === 0);
        const isHighway = this.engine && this.engine.isCentralLineSquare ? this.engine.isCentralLineSquare(r, c) : (isDark && (r === c));

        const sq = document.createElement('div');
        sq.className = `square ${isDark ? 'dark' : 'light'} ${isHighway ? 'central-line-sq' : ''}`;
        sq.dataset.row = r;
        sq.dataset.col = c;
        sq.id = `puzzle-sq-${r}-${c}`;

        // 1-50 Notation Number Badge
        if (isDark && this.showNotationNumbers) {
          const isIntl = this.engine && (this.engine.ruleMode === 'international' || this.engine.ruleMode === 'tournament' || this.engine.ruleMode === 'fmjd');
          const sqNum = rcToSq(r, c, isIntl);
          if (sqNum) {
            const numBadge = document.createElement('span');
            numBadge.className = 'sq-draughts-num';
            numBadge.textContent = sqNum;
            sq.appendChild(numBadge);
          }
        }

        // Rank and File Coordinate Labels
        if (colIdx === 0) {
          const rowLabel = document.createElement('span');
          rowLabel.className = 'square-coord row-label';
          rowLabel.textContent = this.isFlipped ? (r + 1) : (10 - r);
          sq.appendChild(rowLabel);
        }
        if (rowIdx === 9) {
          const colLabel = document.createElement('span');
          colLabel.className = 'square-coord col-label';
          colLabel.textContent = String.fromCharCode(65 + (this.isFlipped ? (9 - colIdx) : colIdx));
          sq.appendChild(colLabel);
        }

        // Click Listener for destination squares
        sq.addEventListener('click', (e) => {
          // If clicking inside the square (not on a piece)
          if (!e.target.closest('.piece')) {
            this.handleSquareClick(r, c);
          }
        });

        this.dom.boardInner.appendChild(sq);
      }
    }
  }

  renderPieces() {
    // Clear any pieces currently on squares
    document.querySelectorAll('.square .piece').forEach(p => p.remove());

    const puzzle = this.puzzles[this.currentPuzzleIdx];
    const steps = puzzle?.steps || puzzle?.solution?.steps || [];
    const expectedStep = steps[this.currentStepIdx];

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        const piece = this.boardState[r][c];
        if (!piece) continue;

        const sq = document.getElementById(`puzzle-sq-${r}-${c}`);
        if (!sq) continue;

        const pieceEl = document.createElement('div');
        const isWhite = (piece.player === PLAYER_1);
        pieceEl.className = `piece p${piece.player} ${isWhite ? 'white' : 'dark'} ${piece.isKing ? 'king' : ''}`;
        pieceEl.id = `piece-${r}-${c}`;
        pieceEl.dataset.row = r;
        pieceEl.dataset.col = c;
        pieceEl.style.touchAction = 'none'; // Critical for fluid mobile/desktop pointer drag

        // King Crown Icon
        if (piece.isKing) {
          const crown = document.createElement('span');
          crown.className = 'crown-icon';
          crown.textContent = '👑';
          pieceEl.appendChild(crown);
        }

        // Progressive hint halo
        if (this.hintLevel >= 1 && expectedStep && expectedStep.from && expectedStep.from.r === r && expectedStep.from.c === c) {
          pieceEl.classList.add('piece-hint-pulse');
        }

        // Setup Pointer Events for selection & drag-and-drop
        if (piece.player === PLAYER_1) {
          this.setupPointerEvents(pieceEl, r, c);
        }

        sq.appendChild(pieceEl);
      }
    }

    this.updateSelectionUI();
  }

  selectSquare(r, c) {
    if (!this.engine) return;
    const piece = this.boardState[r][c];
    if (!piece || piece.player !== PLAYER_1) {
      this.deselectSquare();
      return;
    }

    const allMoves = this.engine.getAllLegalMoves(PLAYER_1);
    const pieceMoves = allMoves.filter(m => m.from.r === r && m.from.c === c);

    if (pieceMoves.length === 0) {
      const hasAnyCaptures = allMoves.some(m => m.isCapture);
      if (hasAnyCaptures) {
        sound.playError();
        this.setFeedback({
          icon: '⚠️',
          title: 'Compulsory Capture!',
          desc: 'Authentic draughts rules require capturing when possible. You must select a piece that can capture!',
          statusClass: 'error'
        });
      } else {
        sound.playError();
      }
      this.deselectSquare();
      return;
    }

    this.selectedSquare = { r, c };
    this.validMoves = this.calculatePossibleMovesForPiece(r, c);
    this.updateSelectionUI();
  }

  deselectSquare() {
    this.selectedSquare = null;
    this.validMoves = [];
    this.updateSelectionUI();
  }

  updateSelectionUI() {
    // Remove old selected styles
    document.querySelectorAll('.square.sq-selected').forEach(s => s.classList.remove('sq-selected'));
    document.querySelectorAll('.piece.selected').forEach(p => p.classList.remove('selected'));
    document.querySelectorAll('.square.valid-target, .square.valid-capture-target').forEach(s => {
      s.classList.remove('valid-target', 'valid-capture-target');
    });

    if (!this.selectedSquare) return;

    // Highlight selected square & piece
    const sq = document.getElementById(`puzzle-sq-${this.selectedSquare.r}-${this.selectedSquare.c}`);
    if (sq) {
      sq.classList.add('sq-selected');
      const piece = sq.querySelector('.piece');
      if (piece) piece.classList.add('selected');
    }

    // Render valid target dots
    for (const dest of this.validMoves) {
      const targetSq = document.getElementById(`puzzle-sq-${dest.r}-${dest.c}`);
      if (targetSq) {
        targetSq.classList.add(dest.isCapture ? 'valid-capture-target' : 'valid-target');
      }
    }
  }

  // ==================== POINTER EVENTS (DRAG & DROP + CLICK) ==================== //

  setupPointerEvents(pieceEl, r, c) {
    let isDragging = false;
    let dragThresholdPassed = false;
    let startX = 0;
    let startY = 0;

    pieceEl.addEventListener('pointerdown', (e) => {
      if (this.isOpponentMoving || this.isAnimatingSolution) return;
      if (this.activeHistoryIdx !== this.boardSnapshots.length - 1) {
        this.jumpToHistoryStep(this.boardSnapshots.length - 1);
      }
      const piece = this.boardState[r][c];
      if (!piece || piece.player !== PLAYER_1) return;
      if (e.button !== undefined && e.button !== 0) return; // Only left-click/touch

      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;
      dragThresholdPassed = false;

      try {
        pieceEl.setPointerCapture(e.pointerId);
      } catch {}

      const onPointerMove = (moveEv) => {
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;

        if (!dragThresholdPassed && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          dragThresholdPassed = true;
          isDragging = true;
          // Ensure piece is selected when drag begins so target dots are visible
          if (!this.selectedSquare || this.selectedSquare.r !== r || this.selectedSquare.c !== c) {
            this.selectSquare(r, c);
          }
          pieceEl.classList.add('dragging');
          pieceEl.style.zIndex = '9999';
        }

        if (isDragging) {
          pieceEl.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      };

      const onPointerUp = (upEv) => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);

        try {
          pieceEl.releasePointerCapture(upEv.pointerId);
        } catch {}

        if (isDragging) {
          // Restore visual styles
          pieceEl.classList.remove('dragging');
          pieceEl.style.transform = '';
          pieceEl.style.zIndex = '';
          isDragging = false;

          // Find target square under pointer release (hide pointer events temporarily)
          pieceEl.style.pointerEvents = 'none';
          const elemBelow = document.elementFromPoint(upEv.clientX, upEv.clientY);
          pieceEl.style.pointerEvents = '';

          const targetSq = elemBelow ? elemBelow.closest('.square') : null;
          if (targetSq && targetSq.dataset.row !== undefined) {
            const tr = parseInt(targetSq.dataset.row, 10);
            const tc = parseInt(targetSq.dataset.col, 10);
            if (tr !== r || tc !== c) {
              this.handleSquareClick(tr, tc);
              return;
            }
          }
        } else {
          // Direct Tap / Click (No drag took place)
          if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
            this.deselectSquare();
          } else {
            this.selectSquare(r, c);
          }
        }
      };

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp, { once: true });
    });

    // Suppress native click to prevent double toggle deselect race condition
    pieceEl.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
  }

  // ==================== INTERACTIVE SQUARE CLICK ==================== //

  handleSquareClick(r, c) {
    if (this.isOpponentMoving || this.isAnimatingSolution) return;
    if (this.activeHistoryIdx !== this.boardSnapshots.length - 1) {
      this.jumpToHistoryStep(this.boardSnapshots.length - 1);
    }
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    if (!puzzle) return;

    const piece = this.boardState[r][c];

    // 1. If clicking own White piece: switch selection
    if (piece && piece.player === PLAYER_1) {
      this.selectSquare(r, c);
      return;
    }

    // 2. If a piece is selected and user clicks an empty dark square:
    if (this.selectedSquare) {
      const from = this.selectedSquare;
      const to = { r, c };

      // Must be a playable dark square
      if ((r + c) % 2 !== 0) {
        this.deselectSquare();
        return;
      }

      this.validateAndExecutePlayerMove(from, to);
    }
  }

  calculatePossibleMovesForPiece(r, c) {
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    const piece = this.boardState[r][c];
    if (!piece || piece.player !== PLAYER_1 || !this.engine) return [];

    const expectedStep = puzzle?.steps ? puzzle.steps[this.currentStepIdx] : null;
    const allMoves = this.engine.getAllLegalMoves(PLAYER_1);
    const pieceMoves = allMoves.filter(m => m.from.r === r && m.from.c === c);

    const moves = pieceMoves.map(m => ({
      r: m.to.r,
      c: m.to.c,
      isCapture: Boolean(m.isCapture),
      engineMove: m
    }));

    // If expected step is a multi-jump sequence from this piece, also project the final landing square
    if (expectedStep && expectedStep.from.r === r && expectedStep.from.c === c) {
      let chainIdx = this.currentStepIdx;
      let currPos = { r, c };
      let lastHop = null;
      while (chainIdx < puzzle.steps.length) {
        const s = puzzle.steps[chainIdx];
        if (s.mover !== PLAYER_1) break;
        if (s.from.r !== currPos.r || s.from.c !== currPos.c) break;
        lastHop = s;
        currPos = { r: s.to.r, c: s.to.c };
        chainIdx++;
      }
      if (lastHop && (lastHop.to.r !== expectedStep.to.r || lastHop.to.c !== expectedStep.to.c)) {
        if (!moves.some(m => m.r === lastHop.to.r && m.c === lastHop.to.c)) {
          moves.push({ r: lastHop.to.r, c: lastHop.to.c, isCapture: true });
        }
      }
    }

    return moves;
  }

  // ==================== MOVE VALIDATION & EXECUTION ==================== //

  validateAndExecutePlayerMove(from, to) {
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    const expectedStep = puzzle.steps[this.currentStepIdx];
    if (!expectedStep) return;

    // Direct match with immediate step
    const isImmediateMatch = (
      expectedStep.from.r === from.r &&
      expectedStep.from.c === from.c &&
      expectedStep.to.r === to.r &&
      expectedStep.to.c === to.c
    );

    // Multi-jump chain match (playing directly to the final landing square)
    let multiJumpSteps = [];
    let chainIdx = this.currentStepIdx;
    let currPiece = { ...from };
    while (chainIdx < puzzle.steps.length) {
      const s = puzzle.steps[chainIdx];
      if (s.mover !== PLAYER_1) break;
      if (s.from.r !== currPiece.r || s.from.c !== currPiece.c) break;
      multiJumpSteps.push(s);
      currPiece = { r: s.to.r, c: s.to.c };
      chainIdx++;
    }

    const isMultiHopChain = multiJumpSteps.length > 1;
    const finalHop = isMultiHopChain ? multiJumpSteps[multiJumpSteps.length - 1] : null;
    const isDirectMultiJumpMatch = (
      finalHop &&
      finalHop.to.r === to.r &&
      finalHop.to.c === to.c
    );

    // Check legality under authentic draughts engine
    const allLegalMoves = this.engine ? this.engine.getAllLegalMoves(PLAYER_1) : [];
    const isLegalInEngine = allLegalMoves.some(m =>
      m.from.r === from.r && m.from.c === from.c &&
      m.to.r === to.r && m.to.c === to.c
    );

    if (isDirectMultiJumpMatch) {
      // Execute the entire multi-jump sequence fluidly!
      this.clearTacticalSvg();
      this.hintLevel = 0;
      this.deselectSquare();
      this.executeMultiJumpSequence(multiJumpSteps);
    } else if (isImmediateMatch) {
      // Execute single immediate step
      this.clearTacticalSvg();
      this.hintLevel = 0;
      this.deselectSquare();

      this.executeMove(from, to, () => {
        this.highlightMoveSquares(from, to);
        this.currentStepIdx++;
        this.processNextPuzzleStep();
      });
    } else if (isLegalInEngine) {
      // Genuine legal draughts move, but not the winning tactical solution!
      this.onPuzzleFailed(from, to, 'Legal draughts move, but not the winning combination line! Try another move.');
    } else {
      // Genuine incorrect move
      this.onPuzzleFailed(from, to, 'Illegal move under authentic draughts rules!');
    }
  }

  executeMultiJumpSequence(hops) {
    let hopIdx = 0;
    this.isOpponentMoving = true; // Lock user input during automated multi-hops

    const playHop = () => {
      if (hopIdx >= hops.length) {
        this.isOpponentMoving = false;
        this.currentStepIdx += hops.length;
        this.highlightMoveSquares(hops[0].from, hops[hops.length - 1].to);
        this.processNextPuzzleStep();
        return;
      }

      const hop = hops[hopIdx];
      this.executeMove(hop.from, hop.to, () => {
        hopIdx++;
        if (hopIdx < hops.length) {
          setTimeout(playHop, 220); // 220ms natural rhythm between sequential hops
        } else {
          playHop();
        }
      });
    };

    playHop();
  }

  processNextPuzzleStep() {
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    if (this.currentStepIdx < puzzle.steps.length) {
      const nextStep = puzzle.steps[this.currentStepIdx];

      if (nextStep.mover === PLAYER_1) {
        // Consecutive player jump in multi-jump chain
        this.setFeedback({
          icon: '⚡',
          title: 'Best move! Continue the multi-jump...',
          desc: nextStep.note || 'Keep capturing through the diagonal highway!',
          statusClass: 'progress'
        });
        // Auto-select the jumping piece with its next target dot
        this.selectSquare(nextStep.from.r, nextStep.from.c);
      } else if (nextStep.isAi || nextStep.mover === PLAYER_2) {
        // Forced opponent response
        this.setFeedback({
          icon: '✓',
          title: 'Best move! Keep going...',
          desc: 'You found the tactical key! Watch opponent response.',
          statusClass: 'progress'
        });
        this.updateTurnBanner(PLAYER_2);
        this.isOpponentMoving = true;

        setTimeout(() => {
          this.executeOpponentMove(nextStep);
        }, 400);
      }
    } else {
      // Fully solved!
      this.onPuzzleSolved(puzzle);
    }
  }

  executeMove(from, to, callback = null) {
    const piece = this.boardState[from.r][from.c];
    if (!piece) {
      if (callback) callback();
      return;
    }

    const fromSqEl = document.getElementById(`puzzle-sq-${from.r}-${from.c}`);
    const toSqEl = document.getElementById(`puzzle-sq-${to.r}-${to.c}`);
    const pieceEl = fromSqEl ? fromSqEl.querySelector('.piece') : null;

    const dr = to.r - from.r;
    const dc = to.c - from.c;
    const dist = Math.abs(dr);
    const isJump = dist >= 2;

    // Collect captured pieces to smoothly fade them out
    const capturedPieceEls = [];
    if (isJump) {
      const stepR = dr > 0 ? 1 : -1;
      const stepC = dc > 0 ? 1 : -1;
      let currR = from.r + stepR;
      let currC = from.c + stepC;

      while (currR !== to.r && currC !== to.c) {
        if (this.boardState[currR][currC]) {
          const capSqEl = document.getElementById(`puzzle-sq-${currR}-${currC}`);
          const capEl = capSqEl ? capSqEl.querySelector('.piece') : null;
          if (capEl) capturedPieceEls.push(capEl);
          this.boardState[currR][currC] = null; // Captured in memory!
        }
        currR += stepR;
        currC += stepC;
      }
    }

    // Trigger smooth CSS slide animation
    let hasAnimated = false;
    if (pieceEl && fromSqEl && toSqEl) {
      const fromRect = fromSqEl.getBoundingClientRect();
      const toRect = toSqEl.getBoundingClientRect();
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;

      hasAnimated = true;
      pieceEl.classList.add('animating-move');
      pieceEl.style.transform = `translate(${dx}px, ${dy}px)`;

      capturedPieceEls.forEach(el => el.classList.add('captured-fade'));
    }

    const finalize = () => {
      if (isJump) {
        sound.playCapture();
      } else {
        sound.playMove();
      }

      if (this.engine) {
        this.engine.makeMove({ from, to });
      }
      this.syncBoardStateFromEngine();

      const newPiece = this.boardState[to.r][to.c];
      const promoted = Boolean(newPiece && newPiece.isKing && !piece.isKing);
      if (promoted) {
        sound.playKing();
      }

      this.renderPieces();

      if (promoted) {
        const pEl = document.getElementById(`piece-${to.r}-${to.c}`);
        if (pEl) pEl.classList.add('king-crowning');
      }

      // Record Move in Algebraic Draughts Notation (Manoury 1-50)
      const fromSqNum = rcToSq(from.r, from.c) || `${from.r},${from.c}`;
      const toSqNum = rcToSq(to.r, to.c) || `${to.r},${to.c}`;
      const notationStr = `${isJump ? fromSqNum + 'x' + toSqNum : fromSqNum + '-' + toSqNum}${promoted ? '👑' : ''}`;

      this.moveHistory.push({
        mover: piece.player,
        from: { ...from },
        to: { ...to },
        notation: notationStr,
        isJump,
        isKing: piece.isKing
      });

      this.saveBoardSnapshot(notationStr, from, to);
      this.updateNotationTable();
      this.calculateAndDisplayEval();

      if (callback) callback();
    };

    if (hasAnimated) {
      setTimeout(finalize, 200);
    } else {
      finalize();
    }
  }

  executeOpponentMove(step) {
    this.executeMove(step.from, step.to, () => {
      this.highlightMoveSquares(step.from, step.to);
      this.currentStepIdx++;
      this.isOpponentMoving = false;

      const puzzle = this.puzzles[this.currentPuzzleIdx];

      if (this.currentStepIdx < puzzle.steps.length) {
        this.updateTurnBanner(PLAYER_1);
        this.setFeedback({
          icon: '🎯',
          title: 'Your turn: Deliver the winning counter-strike!',
          desc: step.note || 'Dark was forced to take the bait. Now execute the trap!',
          statusClass: 'progress'
        });
        this.renderPieces();
      } else {
        this.onPuzzleSolved(puzzle);
      }
    });
  }

  onPuzzleFailed(from, to, customDesc = null) {
    sound.playError(); // Fixed: playError instead of non-existent playLoss
    this.showWrongSignOnBoard();

    const fromSqEl = document.getElementById(`puzzle-sq-${from.r}-${from.c}`);
    const toSqEl = document.getElementById(`puzzle-sq-${to.r}-${to.c}`);
    const pieceEl = fromSqEl ? fromSqEl.querySelector('.piece') : null;

    if (pieceEl && fromSqEl && toSqEl) {
      const fromRect = fromSqEl.getBoundingClientRect();
      const toRect = toSqEl.getBoundingClientRect();
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;

      // Lidraughts mistake snapback animation (glides towards error, shakes red, glides back to start)
      pieceEl.classList.add('animating-move');
      pieceEl.style.transform = `translate(${dx * 0.7}px, ${dy * 0.7}px)`;
      if (toSqEl) toSqEl.classList.add('sq-error-shake');

      setTimeout(() => {
        pieceEl.style.transform = 'translate(0px, 0px)';
        setTimeout(() => {
          pieceEl.classList.remove('animating-move');
          pieceEl.style.transform = '';
          if (toSqEl) toSqEl.classList.remove('sq-error-shake');
        }, 200);
      }, 180);
    } else if (toSqEl) {
      toSqEl.classList.add('sq-error-shake');
      setTimeout(() => toSqEl.classList.remove('sq-error-shake'), 600);
    }

    // Street draughts coach feedback on mistake
    if (this.dom.coachQuote) {
      const errorQuotes = [
        "Ah ah! You don fall into their trap. Check am well!",
        "No be like dat o! Re-calculate the capture line.",
        "Mba! That move go give opponent free king.",
        "Calm down! Spot the forced chop first.",
        "Wrong square! Black go counter-chop your piece."
      ];
      this.dom.coachQuote.textContent = errorQuotes[Math.floor(Math.random() * errorQuotes.length)];
    }

    this.streak = 0;
    this.userRating = Math.max(800, this.userRating - 10);
    this.sessionHistory.push({ delta: 10, isCorrect: false });
    if (this.sessionHistory.length > 20) this.sessionHistory.shift();
    try { localStorage.setItem('draughts_session_history', JSON.stringify(this.sessionHistory)); } catch {}
    this.persistPerformance();
    this.updatePerformanceHUD();
    this.renderSessionStrip();

    // Log attempt to API
    const currPuz = this.puzzles[this.currentPuzzleIdx];
    if (currPuz && currPuz.id) {
      fetch('api/puzzles.php?action=attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: currPuz.id,
          is_correct: 0,
          time_taken_ms: 5000,
          hints_used: this.hintLevel
        })
      }).catch(() => {});
    }

    this.setFeedback({
      icon: '❌',
      title: 'Not the best move',
      desc: customDesc || 'That move allows Dark to escape or blunders material. Try another move!',
      statusClass: 'error',
      actions: [
        {
          label: '💡 Get Tactical Hint',
          isPrimary: true,
          onClick: () => this.handleHintClick()
        },
        {
          label: '🔄 Reset Puzzle',
          isPrimary: false,
          onClick: () => this.loadPuzzle(this.currentPuzzleIdx)
        },
        {
          label: '👁️ View Solution',
          isPrimary: false,
          onClick: () => this.handleSolutionClick()
        }
      ]
    });

    this.deselectSquare();
  }

  onPuzzleSolved(puzzle) {
    sound.playTrap();

    this.solvedSet.add(puzzle.id);
    this.userRating += 25;
    this.streak += 1;
    this.sessionHistory.push({ delta: 25, isCorrect: true });
    if (this.sessionHistory.length > 20) this.sessionHistory.shift();
    try { localStorage.setItem('draughts_session_history', JSON.stringify(this.sessionHistory)); } catch {}
    this.persistPerformance();
    this.updatePerformanceHUD();
    this.renderSessionStrip();
    this.renderPuzzleChips();

    // Coach Congratulations
    if (this.dom.coachQuote) {
      this.dom.coachQuote.textContent = "GBAM! You scatter their board completely! Na world-class draughts master be that!";
    }
    this.updateEvalGauge('+Win', 100);

    // Credit coins via wallet API
    this.awardStreetCoins(50, `Solved Tactical Puzzle: ${puzzle.title}`);

    // Log successful attempt to API
    if (puzzle && puzzle.id) {
      fetch('api/puzzles.php?action=attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzle_id: puzzle.id,
          is_correct: 1,
          time_taken_ms: 12000,
          hints_used: this.hintLevel
        })
      }).catch(() => {});
    }

    this.setFeedback({
      icon: '🏆',
      title: 'GBAM! PUZZLE SOLVED!',
      desc: puzzle.explanation || 'Sweet execution! You saw through the position and delivered the master trap!',
      statusClass: 'success',
      rewards: {
        rating: 25,
        coins: 50
      },
      actions: [
        {
          label: '⚡ Continue Training (Next Puzzle) →',
          isPrimary: true,
          onClick: () => this.advanceToNextPuzzle()
        },
        {
          label: '🔄 Replay Puzzle',
          isPrimary: false,
          onClick: () => this.loadPuzzle(this.currentPuzzleIdx)
        }
      ]
    });

    this.deselectSquare();
  }

  // ==================== HINTS & SOLUTIONS ==================== //

  handleHintClick() {
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    const expectedStep = puzzle?.steps[this.currentStepIdx];
    if (!expectedStep || this.isOpponentMoving) return;

    this.hintLevel++;

    if (this.hintLevel === 1) {
      // Level 1: Pulsate the piece that needs to move & display broad thematic cue
      const hintMsg = (puzzle.hints && puzzle.hints[0]) || puzzle.hint || 'Find the active tactical motif for White.';
      this.setFeedback({
        icon: '💡',
        title: 'Tactical Hint: Level 1 (Sector / Piece Identified)',
        desc: `Look at the glowing piece on square (${expectedStep.from.r}, ${expectedStep.from.c}). ${hintMsg}`,
        statusClass: 'progress'
      });
      this.renderPieces();
    } else if (this.hintLevel === 2) {
      // Level 2: Project SVG vector arrow from 'from' to 'to'
      this.drawTacticalArrow(expectedStep.from, expectedStep.to);
      const hintMsg = (puzzle.hints && puzzle.hints[1]) || expectedStep.note || 'Follow the tactical trajectory arrow to deliver the strike!';
      this.setFeedback({
        icon: '🎯',
        title: 'Tactical Hint: Level 2 (Trajectory Arrow Projected)',
        desc: hintMsg,
        statusClass: 'progress'
      });
    } else {
      // Level 3: Specific Solution Line
      this.drawTacticalArrow(expectedStep.from, expectedStep.to);
      const hintMsg = (puzzle.hints && puzzle.hints[2]) || `Play move ${expectedStep.fromSq || ''}-${expectedStep.toSq || ''} to force the decisive combination!`;
      this.setFeedback({
        icon: '👑',
        title: 'Tactical Hint: Level 3 (Decisive Combination)',
        desc: hintMsg,
        statusClass: 'progress'
      });
      if (this.dom.coachQuote) {
        this.dom.coachQuote.textContent = `Strike with ${expectedStep.fromSq || ''}-${expectedStep.toSq || ''}! The trap go open immediately!`;
      }
    }
  }

  handleSolutionClick() {
    if (this.isAnimatingSolution) return;
    this.isAnimatingSolution = true;
    this.loadPuzzle(this.currentPuzzleIdx);

    const puzzle = this.puzzles[this.currentPuzzleIdx];
    let stepIndex = 0;

    const playNext = () => {
      if (stepIndex >= puzzle.steps.length) {
        this.isAnimatingSolution = false;
        this.setFeedback({
          icon: '👁️',
          title: 'Solution Demonstrated',
          desc: 'Study the tactical geometry above. Click Retry to solve it yourself!',
          statusClass: 'normal',
          actions: [
            {
              label: '🔄 Retry Puzzle Now',
              isPrimary: true,
              onClick: () => this.loadPuzzle(this.currentPuzzleIdx)
            }
          ]
        });
        return;
      }

      const step = puzzle.steps[stepIndex];
      this.highlightMoveSquares(step.from, step.to);
      this.drawTacticalArrow(step.from, step.to);
      this.executeMove(step.from, step.to, () => {
        stepIndex++;
        setTimeout(playNext, 450);
      });
    };

    setTimeout(playNext, 600);
  }

  advanceToNextPuzzle() {
    let nextIdx = (this.currentPuzzleIdx + 1) % this.puzzles.length;

    // If active filter, pick next puzzle matching filter
    if (this.activeFilter !== 'all') {
      const match = this.puzzles.findIndex((p, i) => i > this.currentPuzzleIdx && this.matchesFilter(p, this.activeFilter));
      if (match !== -1) {
        nextIdx = match;
      } else {
        const wrapMatch = this.puzzles.findIndex(p => this.matchesFilter(p, this.activeFilter));
        if (wrapMatch !== -1) nextIdx = wrapMatch;
      }
    }

    this.loadPuzzle(nextIdx);
  }

  // ==================== VISUAL HIGHLIGHTS & SVG OVERLAY ==================== //

  clearMoveHighlights() {
    document.querySelectorAll('.sq-last-from, .sq-last-to').forEach(el => {
      el.classList.remove('sq-last-from', 'sq-last-to');
    });
  }

  highlightMoveSquares(from, to) {
    this.clearMoveHighlights();
    if (from) {
      const fromSq = document.getElementById(`puzzle-sq-${from.r}-${from.c}`);
      if (fromSq) fromSq.classList.add('sq-last-from');
    }
    if (to) {
      const toSq = document.getElementById(`puzzle-sq-${to.r}-${to.c}`);
      if (toSq) toSq.classList.add('sq-last-to');
    }
  }

  drawTacticalArrow(from, to) {
    if (!this.dom.tacticalSvg || !this.dom.boardInner) return;
    this.clearTacticalSvg();

    const fromSq = document.getElementById(`puzzle-sq-${from.r}-${from.c}`);
    const toSq = document.getElementById(`puzzle-sq-${to.r}-${to.c}`);
    if (!fromSq || !toSq) return;

    const boardRect = this.dom.boardInner.getBoundingClientRect();
    const fromRect = fromSq.getBoundingClientRect();
    const toRect = toSq.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - boardRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - boardRect.top;
    const x2 = toRect.left + toRect.width / 2 - boardRect.left;
    const y2 = toRect.top + toRect.height / 2 - boardRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#f59e0b');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-dasharray', '8 4');
    line.setAttribute('marker-end', 'url(#arrowhead-gold)');
    line.classList.add('tactical-arrow-anim');

    this.dom.tacticalSvg.appendChild(line);
  }

  clearTacticalSvg() {
    if (!this.dom.tacticalSvg) return;
    const arrows = this.dom.tacticalSvg.querySelectorAll('line, path');
    arrows.forEach(a => a.remove());
  }

  // ==================== PERFORMANCE HUD & PERSISTENCE ==================== //

  updatePerformanceHUD() {
    if (this.dom.userRating) this.dom.userRating.textContent = `${this.userRating} Elo`;
    if (this.dom.userStreak) this.dom.userStreak.textContent = `🔥 Streak: ${this.streak}`;
    if (this.dom.userSolvedRatio) {
      this.dom.userSolvedRatio.textContent = `Solved: ${this.solvedSet.size}/${this.puzzles.length}`;
    }
  }

  renderSessionStrip() {
    if (!this.dom.sessionPillsWrap) return;
    this.dom.sessionPillsWrap.innerHTML = '';
    if (!this.sessionHistory || this.sessionHistory.length === 0) {
      const emptyMsg = document.createElement('span');
      emptyMsg.className = 'session-placeholder';
      emptyMsg.textContent = 'Session tracking: Complete puzzles to record results';
      this.dom.sessionPillsWrap.appendChild(emptyMsg);
      return;
    }
    this.sessionHistory.forEach(item => {
      const pill = document.createElement('span');
      pill.className = `session-pill ${item.isCorrect ? 'gain' : 'loss'}`;
      pill.textContent = item.isCorrect ? `+${item.delta}` : `${item.delta}`;
      this.dom.sessionPillsWrap.appendChild(pill);
    });
  }

  persistPerformance() {
    try {
      localStorage.setItem('draughts_puzzle_rating', String(this.userRating));
      localStorage.setItem('draughts_puzzle_streak', String(this.streak));
      localStorage.setItem('draughts_puzzles_solved', JSON.stringify(Array.from(this.solvedSet)));
    } catch {}
  }

  async awardStreetCoins(coins, description) {
    try {
      await fetch('api/wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_coins',
          amount: coins,
          description: description || 'Solved Draughts Tactical Puzzle'
        })
      });
    } catch {}
  }

  // ==================== FILTER PILLS & PUZZLE CHIPS ==================== //

  renderFilterPills() {
    if (!this.dom.filterPills) return;
    const pool = this.puzzles.filter(p => this.activeRuleset === 'all' || p.ruleset === this.activeRuleset);

    const counts = {
      all: pool.length,
      beginner: pool.filter(p => this.getPuzzleTier(p) <= 2).length,
      intermediate: pool.filter(p => [3, 4].includes(this.getPuzzleTier(p))).length,
      advanced: pool.filter(p => [5, 6].includes(this.getPuzzleTier(p))).length,
      expert: pool.filter(p => [7, 8].includes(this.getPuzzleTier(p))).length,
      master: pool.filter(p => [9, 10].includes(this.getPuzzleTier(p))).length,
      grandmaster: pool.filter(p => this.getPuzzleTier(p) === 11).length,
      superGm: pool.filter(p => this.getPuzzleTier(p) === 12).length
    };

    this.dom.filterPills.innerHTML = `
      <button type="button" class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" data-filter="all">All (${counts.all})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'beginner' ? 'active' : ''}" data-filter="beginner">🟢 Beginner (${counts.beginner})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'intermediate' ? 'active' : ''}" data-filter="intermediate">🟡 Intermediate (${counts.intermediate})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'advanced' ? 'active' : ''}" data-filter="advanced">🟠 Advanced (${counts.advanced})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'expert' ? 'active' : ''}" data-filter="expert">🟣 Expert (${counts.expert})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'master' ? 'active' : ''}" data-filter="master">🟤 Master (${counts.master})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'grandmaster' ? 'active' : ''}" data-filter="grandmaster">🔴 Grandmaster (${counts.grandmaster})</button>
      <button type="button" class="filter-btn ${this.activeFilter === 'super-gm' ? 'active' : ''}" data-filter="super-gm">⚡ Super GM (${counts.superGm})</button>
    `;
  }

  updateFilterButtons() {
    if (!this.dom.filterPills) return;
    const btns = this.dom.filterPills.querySelectorAll('.filter-btn');
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === this.activeFilter);
    });
  }

  renderPuzzleChips() {
    if (!this.dom.chipsGrid) return;
    this.dom.chipsGrid.innerHTML = '';

    const filtered = this.puzzles.map((p, idx) => ({ ...p, origIdx: idx })).filter(p => {
      // 1. Ruleset Filter
      if (this.activeRuleset !== 'all' && p.ruleset !== this.activeRuleset) {
        return false;
      }

      // 2. Difficulty Filter
      const tier = this.getPuzzleTier(p);
      if (this.activeFilter === 'beginner' && !(tier <= 2)) return false;
      if (this.activeFilter === 'intermediate' && !(tier === 3 || tier === 4)) return false;
      if (this.activeFilter === 'advanced' && !(tier === 5 || tier === 6)) return false;
      if (this.activeFilter === 'expert' && !(tier === 7 || tier === 8)) return false;
      if (this.activeFilter === 'master' && !(tier === 9 || tier === 10)) return false;
      if (this.activeFilter === 'grandmaster' && !(tier === 11)) return false;
      if (this.activeFilter === 'super-gm' && !(tier === 12)) return false;

      // 3. Search Query
      if (this.searchQuery) {
        const q = this.searchQuery;
        const numMatch = String(p.origIdx + 1).includes(q);
        const titleMatch = (p.title || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const badgeMatch = (p.badge || '').toLowerCase().includes(q);
        return numMatch || titleMatch || catMatch || badgeMatch;
      }

      return true;
    });

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'chips-empty-msg';
      empty.textContent = 'No matching puzzles found';
      this.dom.chipsGrid.appendChild(empty);
      return;
    }

    filtered.forEach(p => {
      const isSolved = this.solvedSet.has(p.id);
      const isCurrent = (p.origIdx === this.currentPuzzleIdx);
      const diffName = this.getPuzzleDiffName(p);
      const rating = this.getPuzzleRating(p);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `puzzle-chip ${isSolved ? 'solved' : ''} ${isCurrent ? 'active' : ''}`;
      chip.title = `${p.title} (${diffName} - ⭐ ${rating} Elo)`;
      chip.innerHTML = `
        <span class="chip-num">#${p.origIdx + 1}</span>
        <span class="chip-title">${p.title}</span>
        <span class="chip-status">${isSolved ? '✓' : (p.badge ? p.badge.split(' ')[0] : '🎯')}</span>
      `;

      chip.addEventListener('click', () => {
        this.loadPuzzle(p.origIdx);
      });

      this.dom.chipsGrid.appendChild(chip);
    });
  }

  // ==================== MOVE NOTATION & STEP REPLAY ==================== //

  saveBoardSnapshot(label, lastFrom, lastTo) {
    const clone = this.boardState.map(row => row.map(cell => cell ? { ...cell } : null));
    this.boardSnapshots.push({
      board: clone,
      label: label || '',
      from: lastFrom ? { ...lastFrom } : null,
      to: lastTo ? { ...lastTo } : null,
      stepIdx: this.currentStepIdx
    });
    this.activeHistoryIdx = this.boardSnapshots.length - 1;
    this.updateNotationControls();
  }

  jumpToHistoryStep(idx) {
    if (idx < 0 || idx >= this.boardSnapshots.length) return;
    this.activeHistoryIdx = idx;
    const snap = this.boardSnapshots[idx];

    // Reconstruct board state from snapshot
    this.boardState = snap.board.map(row => row.map(cell => cell ? { ...cell } : null));
    this.renderBoard();
    this.renderPieces();
    this.highlightMoveSquares(snap.from, snap.to);
    this.updateNotationControls();
    this.highlightActiveNotationCell(idx);
  }

  updateNotationTable() {
    if (!this.dom.notationTableBody) return;
    this.dom.notationTableBody.innerHTML = '';

    if (this.moveHistory.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = '<td colspan="3" class="notation-empty-msg">Waiting for first move...</td>';
      this.dom.notationTableBody.appendChild(emptyRow);
      return;
    }

    let moveNumber = 1;
    let currentRow = null;

    this.moveHistory.forEach((move, idx) => {
      const snapshotIdx = idx + 1; // 0 is initial position
      const isWhite = (move.mover === PLAYER_1);

      if (isWhite || !currentRow) {
        currentRow = document.createElement('tr');
        const numCell = document.createElement('td');
        numCell.className = 'col-num';
        numCell.textContent = `${moveNumber}.`;
        currentRow.appendChild(numCell);

        if (!isWhite) {
          // Opponent started with preparatory move
          const blankWhite = document.createElement('td');
          blankWhite.className = 'col-white notation-move-cell';
          blankWhite.textContent = '...';
          currentRow.appendChild(blankWhite);
        }
      }

      const moveCell = document.createElement('td');
      moveCell.className = `${isWhite ? 'col-white' : 'col-black'} notation-move-cell`;
      moveCell.textContent = move.notation;
      moveCell.dataset.snapshotIdx = snapshotIdx;
      moveCell.title = `Jump to move ${move.notation}`;
      moveCell.addEventListener('click', () => {
        this.jumpToHistoryStep(snapshotIdx);
      });

      currentRow.appendChild(moveCell);

      if (!isWhite || idx === this.moveHistory.length - 1) {
        this.dom.notationTableBody.appendChild(currentRow);
        if (!isWhite) {
          moveNumber++;
          currentRow = null;
        }
      }
    });

    this.highlightActiveNotationCell(this.activeHistoryIdx);
  }

  highlightActiveNotationCell(historyIdx) {
    if (!this.dom.notationTableBody) return;
    this.dom.notationTableBody.querySelectorAll('.notation-move-cell').forEach(cell => {
      const cellSnapIdx = parseInt(cell.dataset.snapshotIdx, 10);
      cell.classList.toggle('active-step', cellSnapIdx === historyIdx);
    });
  }

  updateNotationControls() {
    const total = this.boardSnapshots.length;
    const curr = this.activeHistoryIdx;

    if (this.dom.notationCounter) {
      this.dom.notationCounter.textContent = `Step ${curr}/${Math.max(0, total - 1)}`;
    }

    if (this.dom.btnStepFirst) this.dom.btnStepFirst.disabled = (curr <= 0);
    if (this.dom.btnStepPrev) this.dom.btnStepPrev.disabled = (curr <= 0);
    if (this.dom.btnStepNext) this.dom.btnStepNext.disabled = (curr >= total - 1);
    if (this.dom.btnStepLast) this.dom.btnStepLast.disabled = (curr >= total - 1);
  }

  // ==================== TACTICAL EVALUATION GAUGE ==================== //

  updateEvalGauge(scoreText, fillPercent) {
    if (this.dom.evalBar) {
      this.dom.evalBar.style.height = `${Math.max(5, Math.min(100, fillPercent))}%`;
    }
    if (this.dom.evalScore) {
      this.dom.evalScore.textContent = scoreText;
    }
  }

  calculateAndDisplayEval() {
    const puzzle = this.puzzles[this.currentPuzzleIdx];
    if (!puzzle) return;

    if (this.solvedSet.has(puzzle.id) || this.currentStepIdx >= puzzle.steps.length) {
      this.updateEvalGauge('+Win', 98);
      return;
    }

    const totalSteps = puzzle.steps.length;
    const progress = Math.min(1, this.currentStepIdx / Math.max(1, totalSteps));
    const pct = 50 + progress * 45; // 50% -> 95%
    const scoreVal = (progress * 8.5).toFixed(1);
    this.updateEvalGauge(`+${scoreVal}`, pct);
  }

  showWrongSignOnBoard() {
    if (!this.dom.boardFrame) return;
    document.querySelectorAll('.board-wrong-badge').forEach(el => el.remove());

    const badge = document.createElement('div');
    badge.className = 'board-wrong-badge';
    badge.innerHTML = '<span class="icon">❌</span> <span>WRONG MOVE! TRY AGAIN</span>';
    this.dom.boardFrame.appendChild(badge);

    setTimeout(() => {
      badge.remove();
    }, 1150);
  }
}

// Instantiate Trainer globally
window.puzzleTrainer = new PuzzleTrainer();
