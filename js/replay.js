/**
 * Interactive Match Replay Controller
 * Replays any saved match move-by-move on the Nigerian Draughts board.
 */

import { NigerianDraughtsEngine } from './engine.js';
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

    // Build board states cache
    this.reconstructBoardStates();
    this.goToStep(0);
    this.app.setBannerNotice(`Replay Mode: ${match.player1_name} vs ${match.player2_name}`);
  }

  reconstructBoardStates() {
    this.states = [];
    const simEngine = new NigerianDraughtsEngine({
      boardSize: this.boardSize,
      ruleMode: this.matchMeta.rule_mode || 'nigerian'
    });

    // Step 0: starting position
    this.states.push({
      board: simEngine.board.map(r => r.map(c => c ? { ...c } : null)),
      move: null
    });

    for (let i = 0; i < this.moves.length; i++) {
      const m = this.moves[i];
      // Execute move on simulated engine
      try {
        simEngine.makeMove(m);
      } catch (e) {
        // Fallback: move piece manually if notation discrepancy
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

      this.states.push({
        board: simEngine.board.map(r => r.map(c => c ? { ...c } : null)),
        move: m
      });
    }
  }

  goToStep(step) {
    if (step < 0) step = 0;
    if (step > this.states.length - 1) step = this.states.length - 1;

    this.currentStep = step;
    const currentState = this.states[this.currentStep];

    // Apply board to app engine
    this.app.engine.board = currentState.board.map(r => r.map(c => c ? { ...c } : null));
    this.app.renderPieces();

    // Highlight moved squares if any
    if (currentState.move) {
      const fromSq = document.getElementById(`sq-${currentState.move.from.r}-${currentState.move.from.c}`);
      const toSq = document.getElementById(`sq-${currentState.move.to.r}-${currentState.move.to.c}`);
      if (fromSq) fromSq.classList.add('valid-target');
      if (toSq) toSq.classList.add('valid-capture-target');

      if (currentState.move.isCapture) sound.playCapture();
      else sound.playMove();
    }

    // Update Step label
    if (this.stepLabel) {
      this.stepLabel.textContent = `Move ${this.currentStep} / ${this.moves.length}`;
    }
  }

  stepForward() {
    if (this.currentStep < this.states.length - 1) {
      this.goToStep(this.currentStep + 1);
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
