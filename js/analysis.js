/**
 * Board Analysis & Position Editor Controller
 * Set up custom board states and evaluate tactical positions with the Master AI.
 */

import { PLAYER_1, PLAYER_2 } from './engine.js';
import { sound } from './audio.js';

export class BoardAnalysisController {
  constructor(options = {}) {
    this.app = options.app;
    this.isActive = false;
    this.selectedTool = 'p1_man'; // 'p1_man', 'p1_king', 'p2_man', 'p2_king', 'eraser'
    this.analysisTurn = PLAYER_1;

    this.initDOM();
  }

  initDOM() {
    this.dock = document.getElementById('analysis-palette-dock');
    this.btnToggle = document.getElementById('nav-analysis');
    this.btnEval = document.getElementById('btn-eval-position');
    this.btnClear = document.getElementById('btn-clear-board');
    this.btnReset = document.getElementById('btn-reset-board');
    this.btnExit = document.getElementById('btn-exit-analysis');
    this.evalScoreLabel = document.getElementById('eval-score-label');
    this.evalBarFill = document.getElementById('eval-bar-fill');
    this.evalBestMove = document.getElementById('eval-best-move');

    if (this.btnToggle) {
      this.btnToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleAnalysisMode();
      });
    }

    if (this.btnExit) {
      this.btnExit.addEventListener('click', () => this.exitAnalysisMode());
    }

    if (this.btnClear) {
      this.btnClear.addEventListener('click', () => this.clearBoard());
    }

    if (this.btnReset) {
      this.btnReset.addEventListener('click', () => this.resetStandardBoard());
    }

    if (this.btnEval) {
      this.btnEval.addEventListener('click', () => this.evaluatePosition());
    }

    // Palette tool buttons
    const toolBtns = document.querySelectorAll('.palette-btn');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedTool = btn.dataset.tool;
      });
    });

    // Analysis Turn toggle
    const selectTurn = document.getElementById('analysis-turn-select');
    if (selectTurn) {
      selectTurn.addEventListener('change', (e) => {
        this.analysisTurn = parseInt(e.target.value, 10);
        this.app.engine.currentTurn = this.analysisTurn;
        this.app.updateUI();
      });
    }
  }

  toggleAnalysisMode() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.enterAnalysisMode();
    } else {
      this.exitAnalysisMode();
    }
  }

  enterAnalysisMode() {
    this.isActive = true;
    if (this.dock) this.dock.classList.add('active');
    this.app.timer.stop();
    this.app.setBannerNotice('Analysis Mode Active: Click dark squares to place pieces or test tactics.');
    sound.playMove();
  }

  exitAnalysisMode() {
    this.isActive = false;
    if (this.dock) this.dock.classList.remove('active');
    this.app.restartGame();
    this.app.setBannerNotice('Exited analysis mode.');
  }

  handleSquareClick(r, c) {
    if (!this.isActive) return false;

    // In Nigerian draughts, only dark squares (r + c) % 2 === 0 are active
    if (!this.app.engine.isDarkSquare(r, c)) {
      sound.playError();
      return true; // handled
    }

    const currentPiece = this.app.engine.board[r][c];

    switch (this.selectedTool) {
      case 'p1_man':
        this.app.engine.board[r][c] = { player: PLAYER_1, isKing: false, id: `p1_m_${r}_${c}` };
        sound.playMove();
        break;
      case 'p1_king':
        this.app.engine.board[r][c] = { player: PLAYER_1, isKing: true, id: `p1_k_${r}_${c}` };
        sound.playKing();
        break;
      case 'p2_man':
        this.app.engine.board[r][c] = { player: PLAYER_2, isKing: false, id: `p2_m_${r}_${c}` };
        sound.playMove();
        break;
      case 'p2_king':
        this.app.engine.board[r][c] = { player: PLAYER_2, isKing: true, id: `p2_k_${r}_${c}` };
        sound.playKing();
        break;
      case 'eraser':
        this.app.engine.board[r][c] = null;
        sound.playMove();
        break;
    }

    this.app.renderPieces();
    this.app.updateUI();
    this.evaluatePosition();
    return true; // handled
  }

  clearBoard() {
    for (let r = 0; r < this.app.boardSize; r++) {
      for (let c = 0; c < this.app.boardSize; c++) {
        this.app.engine.board[r][c] = null;
      }
    }
    this.app.renderPieces();
    this.app.updateUI();
    this.evaluatePosition();
    sound.playMove();
  }

  resetStandardBoard() {
    this.app.engine.setupBoard();
    this.app.renderPieces();
    this.app.updateUI();
    this.evaluatePosition();
    sound.playMove();
  }

  evaluatePosition() {
    const engine = this.app.engine;
    const ai = this.app.ai;

    // Run static positional evaluation and find best move
    const rawScore = ai.evaluateBoard(engine, PLAYER_1);
    const bestMove = ai.getBestMove(engine, engine.currentTurn);

    // Calculate win probability percentage (sigmoid curve)
    const winProb = Math.round(100 / (1 + Math.exp(-rawScore / 300)));

    if (this.evalScoreLabel) {
      const sign = rawScore > 0 ? '+' : '';
      this.evalScoreLabel.textContent = `Evaluation: ${sign}${(rawScore / 100).toFixed(1)} (${winProb}% White)`;
    }

    if (this.evalBarFill) {
      this.evalBarFill.style.width = `${winProb}%`;
    }

    if (this.evalBestMove) {
      if (bestMove) {
        const fromCoord = `${String.fromCharCode(65 + bestMove.from.c)}${engine.boardSize - bestMove.from.r}`;
        const toCoord = `${String.fromCharCode(65 + bestMove.to.c)}${engine.boardSize - bestMove.to.r}`;
        const actionType = bestMove.isCapture ? 'Chop' : 'Move';
        this.evalBestMove.textContent = `Best Engine Move: ${fromCoord} -> ${toCoord} (${actionType})`;

        // Highlight recommended move
        const destSq = document.getElementById(`sq-${bestMove.to.r}-${bestMove.to.c}`);
        if (destSq) destSq.classList.add('valid-target');
      } else {
        this.evalBestMove.textContent = 'No legal moves in this position.';
      }
    }
  }
}
