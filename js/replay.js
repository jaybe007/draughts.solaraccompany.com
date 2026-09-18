/**
 * Interactive Match Replay Controller
 * Replays any saved match move-by-move on the Nigerian Draughts board
 * with Lidraughts-level post-game analysis and move quality classifications.
 */

import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './engine.js';
import { sound } from './audio.js';

export class MatchReplayController {
  constructor(options = {}) {
    this.app = options.app;
    this.moves = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.boardSize = 10;
    this.matchMeta = null;
    this.analysisSummary = null;

    this.initDOM();
  }

  initDOM() {
    this.dock = document.getElementById('replay-control-dock');
    this.stepLabel = document.getElementById('replay-step-label');
    this.metaLabel = document.getElementById('replay-meta-label');
    this.btnStart = document.getElementById('btn-replay-start');
    this.btnPrev = document.getElementById('btn-replay-prev');
    this.btnPlay = document.getElementById('btn-replay-play');
    this.btnNext = document.getElementById('btn-replay-next');
    this.btnEnd = document.getElementById('btn-replay-end');
    this.btnExit = document.getElementById('btn-replay-exit');

    if (this.btnStart) this.btnStart.addEventListener('click', () => this.goToStep(0));
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.stepBackward());
    if (this.btnPlay) this.btnPlay.addEventListener('click', () => this.toggleAutoPlay());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.stepForward());
    if (this.btnEnd) this.btnEnd.addEventListener('click', () => this.goToStep(this.moves.length));
    if (this.btnExit) this.btnExit.addEventListener('click', () => this.exitReplay());

    // Keyboard navigation shortcuts for replay review
    window.addEventListener('keydown', (e) => {
      if (!this.dock || !this.dock.classList.contains('active')) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.stepBackward();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.stepForward();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.toggleAutoPlay();
      } else if (e.key === 'Home') {
        e.preventDefault();
        this.goToStep(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        this.goToStep(this.moves.length);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.exitReplay();
      }
    });
  }

  loadMatch(match) {
    this.matchMeta = match;
    this.moves = Array.isArray(match.move_history) ? match.move_history : [];
    this.boardSize = parseInt(match.board_size, 10) || 10;
    this.currentStep = 0;
    this.isPlaying = false;

    // Show replay dock & update UI
    if (this.dock) this.dock.classList.add('active');
    if (this.metaLabel) {
      this.metaLabel.textContent = `Replaying: ${match.player1_name} vs ${match.player2_name} (${this.moves.length} moves)`;
    }

    // Build board states cache & compute move quality analysis
    this.reconstructBoardStates();
    this.goToStep(0);
    this.renderReplayMoveHistory();
    this.app.setBannerNotice(`Replay Mode: ${match.player1_name} vs ${match.player2_name} — Use ◀/▶ Arrow Keys or Space to play.`);
  }

  reconstructBoardStates() {
    this.states = [];
    const simEngine = new NigerianDraughtsEngine({
      boardSize: this.boardSize,
      ruleMode: this.matchMeta.rule_mode || 'nigeria'
    });

    let initialEval = 0;
    if (this.app?.ai?.evaluateBoard) {
      initialEval = this.app.ai.evaluateBoard(simEngine, PLAYER_1);
    }

    // Step 0: starting position
    this.states.push({
      board: simEngine.board.map(r => r.map(c => c ? { ...c } : null)),
      move: null,
      evalScore: initialEval,
      quality: null
    });

    let prevEval = initialEval;
    let p1LostAdvantage = 0, p1Count = 0;
    let p2LostAdvantage = 0, p2Count = 0;
    let bestCount = 0, inaccCount = 0, mistakeCount = 0, blunderCount = 0;

    for (let i = 0; i < this.moves.length; i++) {
      const m = this.moves[i];
      // Execute move on simulated engine
      try {
        simEngine.makeMove(m);
      } catch (e) {
        if (simEngine.board[m.from.r] && simEngine.board[m.from.r][m.from.c]) {
          const piece = simEngine.board[m.from.r][m.from.c];
          simEngine.board[m.from.r][m.from.c] = null;
          simEngine.board[m.to.r][m.to.c] = piece;
          if (m.isCapture && m.jumped) {
            simEngine.board[m.jumped.r][m.jumped.c] = null;
          }
          if (m.promoted) {
            piece.isKing = true;
          }
        }
      }

      let currentEval = prevEval;
      let quality = null;

      if (this.app?.ai?.evaluateBoard) {
        currentEval = this.app.ai.evaluateBoard(simEngine, PLAYER_1);
        const mover = m.player || (i % 2 === 0 ? PLAYER_1 : PLAYER_2);
        // evalDiff > 0 means advantage gained; < 0 means advantage dropped
        const evalDiff = mover === PLAYER_1 ? (currentEval - prevEval) : (prevEval - currentEval);

        if (evalDiff >= -15) {
          quality = { label: 'Best Move', icon: '🟢', class: 'best' };
          bestCount++;
        } else if (evalDiff >= -60) {
          quality = { label: 'Good Move', icon: '🔵', class: 'good' };
          bestCount++;
        } else if (evalDiff >= -160) {
          quality = { label: 'Inaccuracy', icon: '🟡', class: 'inaccuracy' };
          inaccCount++;
        } else if (evalDiff >= -320) {
          quality = { label: 'Mistake', icon: '🟠', class: 'mistake' };
          mistakeCount++;
        } else {
          quality = { label: 'Blunder', icon: '🔴', class: 'blunder' };
          blunderCount++;
        }

        const drop = Math.max(0, -evalDiff);
        if (mover === PLAYER_1) {
          p1LostAdvantage += drop;
          p1Count++;
        } else {
          p2LostAdvantage += drop;
          p2Count++;
        }

        prevEval = currentEval;
      }

      this.states.push({
        board: simEngine.board.map(r => r.map(c => c ? { ...c } : null)),
        move: m,
        evalScore: currentEval,
        quality
      });
    }

    const p1Acc = p1Count > 0 ? Math.max(45, Math.min(99, Math.round(100 - (p1LostAdvantage / (p1Count * 14))))) : 95;
    const p2Acc = p2Count > 0 ? Math.max(45, Math.min(99, Math.round(100 - (p2LostAdvantage / (p2Count * 14))))) : 95;

    this.analysisSummary = {
      p1Accuracy: p1Acc,
      p2Accuracy: p2Acc,
      best: bestCount,
      inaccuracy: inaccCount,
      mistake: mistakeCount,
      blunder: blunderCount
    };
  }

  renderReplayMoveHistory() {
    if (!this.app?.dom?.moveHistoryList) return;
    const container = this.app.dom.moveHistoryList;
    container.innerHTML = '';
    if (this.app.dom.moveCountBadge) {
      this.app.dom.moveCountBadge.textContent = `${this.moves.length} moves (Review)`;
    }

    if (this.moves.length === 0) {
      container.innerHTML = '<div class="history-empty">No moves recorded in this match.</div>';
      return;
    }

    this.moves.forEach((m, idx) => {
      const stepNum = idx + 1;
      const state = this.states[stepNum];
      const item = document.createElement('div');
      item.className = `history-item clickable-step ${m.isCapture ? 'is-capture' : ''}`;
      item.dataset.step = stepNum;

      const fromCoord = `${String.fromCharCode(65 + m.from.c)}${this.boardSize - m.from.r}`;
      const toCoord = `${String.fromCharCode(65 + m.to.c)}${this.boardSize - m.to.r}`;
      const symbol = m.isCapture ? 'x' : '-';
      const crown = m.promoted ? ' 👑' : '';
      const pName = (m.player === PLAYER_1 || idx % 2 === 0) ? 'P1' : 'P2';

      let qualityHtml = '';
      if (state?.quality) {
        qualityHtml = `<span class="replay-quality-pill ${state.quality.class}" title="${state.quality.label}">${state.quality.icon} ${state.quality.label}</span>`;
      }

      item.innerHTML = `
        <div class="history-move-info" style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <span>#${stepNum} <strong>${pName}</strong> ${fromCoord} ${symbol} ${toCoord}${crown}</span>
          ${qualityHtml}
        </div>
      `;

      item.addEventListener('click', () => {
        this.pauseAutoPlay();
        this.goToStep(stepNum);
      });

      container.appendChild(item);
    });

    this.updateActiveHistoryItem();
  }

  updateActiveHistoryItem() {
    if (!this.app?.dom?.moveHistoryList) return;
    const container = this.app.dom.moveHistoryList;
    container.querySelectorAll('.history-item').forEach(el => {
      const step = parseInt(el.dataset.step, 10);
      if (step === this.currentStep) {
        el.classList.add('active-step');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('active-step');
      }
    });
  }

  goToStep(step) {
    if (step < 0) step = 0;
    if (step > this.states.length - 1) step = this.states.length - 1;

    this.currentStep = step;
    const currentState = this.states[this.currentStep];

    // Apply board to app engine
    this.app.engine.board = currentState.board.map(r => r.map(c => c ? { ...c } : null));
    this.app.renderPieces();

    // Update real-time eval bar during replay
    if (typeof currentState.evalScore === 'number' && this.app?.updateEvaluationBar) {
      this.app.updateEvaluationBar(currentState.evalScore);
    }

    // Clear targets & highlight moved squares if any
    document.querySelectorAll('.square.valid-target, .square.valid-capture-target').forEach(sq => {
      sq.classList.remove('valid-target', 'valid-capture-target');
    });

    if (currentState.move) {
      const fromSq = document.getElementById(`sq-${currentState.move.from.r}-${currentState.move.from.c}`);
      const toSq = document.getElementById(`sq-${currentState.move.to.r}-${currentState.move.to.c}`);
      if (fromSq) fromSq.classList.add('valid-target');
      if (toSq) toSq.classList.add('valid-capture-target');

      if (currentState.move.isCapture) sound.playCapture();
      else sound.playMove();
    }

    // Update Step label with styled move quality pill
    if (this.stepLabel) {
      let qualityBadge = '';
      if (currentState.quality) {
        qualityBadge = `<span class="replay-quality-pill ${currentState.quality.class}">${currentState.quality.icon} ${currentState.quality.label}</span>`;
      }
      this.stepLabel.innerHTML = `<span class="replay-step-text">Move ${this.currentStep} / ${this.moves.length}</span>${qualityBadge}`;
    }

    this.updateActiveHistoryItem();
  }

  stepForward() {
    if (this.currentStep < this.states.length - 1) {
      const nextStep = this.currentStep + 1;
      const nextMove = this.moves[this.currentStep];
      if (nextMove && this.app?.animatePieceGlide) {
        this.app.animatePieceGlide(nextMove.from, nextMove.to, () => {
          this.goToStep(nextStep);
        });
      } else {
        this.goToStep(nextStep);
      }
    } else {
      this.pauseAutoPlay();
    }
  }

  stepBackward() {
    if (this.currentStep > 0) {
      this.goToStep(this.currentStep - 1);
    }
  }

  toggleAutoPlay() {
    if (this.isPlaying) {
      this.pauseAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.isPlaying = true;
    if (this.btnPlay) this.btnPlay.innerHTML = '⏸️';

    if (this.currentStep >= this.states.length - 1) {
      this.goToStep(0);
    }

    if (this.playInterval) clearInterval(this.playInterval);
    this.playInterval = setInterval(() => {
      if (this.currentStep < this.states.length - 1) {
        this.stepForward();
      } else {
        this.pauseAutoPlay();
      }
    }, 850);
  }

  pauseAutoPlay() {
    this.isPlaying = false;
    if (this.btnPlay) this.btnPlay.innerHTML = '▶️';
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }

  exitReplay() {
    this.pauseAutoPlay();
    if (this.dock) this.dock.classList.remove('active');
    this.app.restartGame();
    this.app.setBannerNotice('Exited replay. New game started.');
  }
}
