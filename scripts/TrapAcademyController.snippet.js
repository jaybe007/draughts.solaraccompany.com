export class TrapAcademyController {
  constructor({ app }) {
    this.app = app;
    this.activeTrap = null;
    this.currentStepIdx = 0;
    this.isSolving = false;
    this.completedTraps = this.loadCompletedTraps();

    this.dom = {
      modal: document.getElementById('trap-academy-modal'),
      btnClose: document.getElementById('btn-close-trap-academy'),
      trapsList: document.getElementById('trap-cards-grid'),
      activeBanner: document.getElementById('trap-active-banner'),
      trapTitle: document.getElementById('trap-active-title'),
      trapBrief: document.getElementById('trap-active-brief'),
      trapStepNote: document.getElementById('trap-step-instruction'),
      btnHint: document.getElementById('btn-trap-hint'),
      btnReset: document.getElementById('btn-trap-reset'),
      btnExit: document.getElementById('btn-trap-exit'),
      winCelebration: document.getElementById('trap-celebration-overlay'),
      btnNextTrap: document.getElementById('btn-trap-next')
    };

    this.bindEvents();
  }

  loadCompletedTraps() {
    try {
      const stored = localStorage.getItem('naija_traps_completed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  saveCompletedTrap(trapId) {
    if (!this.completedTraps.includes(trapId)) {
      this.completedTraps.push(trapId);
      try {
        localStorage.setItem('naija_traps_completed', JSON.stringify(this.completedTraps));
      } catch {}
    }
  }

  bindEvents() {
    if (this.dom.btnClose) {
      this.dom.btnClose.addEventListener('click', () => this.closeAcademyModal());
    }
    if (this.dom.btnExit) {
      this.dom.btnExit.addEventListener('click', () => this.exitActiveTrap());
    }
    if (this.dom.btnReset) {
      this.dom.btnReset.addEventListener('click', () => {
        if (this.activeTrap) this.startTrap(this.activeTrap.id);
      });
    }
    if (this.dom.btnHint) {
      this.dom.btnHint.addEventListener('click', () => this.showHint());
    }
    if (this.dom.btnNextTrap) {
      this.dom.btnNextTrap.addEventListener('click', () => this.advanceToNextTrap());
    }
  }

  openAcademyModal() {
    this.renderTrapCards();
    if (this.dom.modal) {
      this.dom.modal.classList.remove('hidden');
      this.dom.modal.style.display = 'flex';
    }
  }

  closeAcademyModal() {
    if (this.dom.modal) {
      this.dom.modal.classList.add('hidden');
      this.dom.modal.style.display = 'none';
    }
  }

  renderTrapCards() {
    if (!this.dom.trapsList) return;
    this.dom.trapsList.innerHTML = '';

    TRAP_DATABASE.forEach((trap, idx) => {
      const isDone = this.completedTraps.includes(trap.id);
      const card = document.createElement('div');
      card.className = `trap-card ${isDone ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="trap-card-header">
          <span class="trap-badge">${trap.badge || 'Combination'}</span>
          <span class="trap-difficulty ${(trap.difficulty || 'beginner').toLowerCase().replace(/\s+/g, '-')}">${trap.difficulty || 'Beginner'}</span>
        </div>
        <h3 class="trap-card-title">${trap.title || 'Tactical Shot'}</h3>
        <p class="trap-card-desc">${trap.description || ''}</p>
        <div class="trap-card-footer">
          <span class="trap-ruleset-tag">Rules: ${(trap.ruleset || 'nigeria').toUpperCase()}</span>
          <button class="btn btn-small ${isDone ? 'btn-secondary' : 'btn-primary'} btn-launch-trap" data-trap-id="${trap.id}">
            ${isDone ? '✓ Solved (Replay)' : '⚡ Solve Trap'}
          </button>
        </div>
      `;

      card.querySelector('.btn-launch-trap')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startTrap(trap.id);
      });

      this.dom.trapsList.appendChild(card);
    });
  }

  startTrap(trapId) {
    const trap = TRAP_DATABASE.find(t => t.id === trapId);
    if (!trap) return;

    this.activeTrap = trap;
    this.currentStepIdx = 0;
    this.isSolving = true;
    this.closeAcademyModal();

    this.app.engine.ruleMode = trap.ruleset || 'nigeria';
    this.app.ruleMode = trap.ruleset || 'nigeria';

    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        this.app.engine.board[r][c] = null;
      }
    }

    trap.initialBoard.forEach(p => {
      this.app.engine.board[p.r][p.c] = {
        player: p.player,
        isKing: Boolean(p.isKing)
      };
    });

    this.app.engine.currentTurn = trap.startingTurn || PLAYER_1;
    this.app.engine.moveHistory = [];
    this.app.engine.activeMultiJump = null;
    this.app.engine.gameOver = false;
    this.app.gameMode = 'traps';

    if (this.dom.activeBanner) {
      this.dom.activeBanner.style.display = 'flex';
      if (this.dom.trapTitle) this.dom.trapTitle.textContent = `🎯 TRAP: ${trap.title}`;
      if (this.dom.trapBrief) this.dom.trapBrief.textContent = trap.description;
    }

    this.updateStepInstruction();
    this.app.renderBoard();
    this.app.renderPieces();
    this.app.updateUI();

    const currentStep = trap.steps[this.currentStepIdx];
    if (currentStep && currentStep.isAi) {
      setTimeout(() => this.executeAiStep(currentStep), 600);
    }
  }

  updateStepInstruction() {
    if (!this.activeTrap || !this.dom.trapStepNote) return;
    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step) return;

    if (step.isAi) {
      this.dom.trapStepNote.innerHTML = `<em>Opponent responding...</em> ${step.note || ''}`;
    } else {
      this.dom.trapStepNote.innerHTML = `<strong>Your Move (${this.currentStepIdx + 1}/${this.activeTrap.steps.length}):</strong> ${step.note || ''}`;
    }
  }

  handlePlayerMoveAttempt(move) {
    if (!this.activeTrap || !this.isSolving) return false;

    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step || step.isAi) return false;

    const fromMatches = move.from.r === step.from.r && move.from.c === step.from.c;
    const toMatches = move.to.r === step.to.r && move.to.c === step.to.c;

    if (!fromMatches || !toMatches) {
      sound.playError();
      this.app.setBannerNotice('Not the optimal trap move! Look for the compulsory sacrifice or kill.', true);
      return false;
    }

    this.currentStepIdx++;
    this.checkTrapProgress();
    return true;
  }

  checkTrapProgress() {
    if (!this.activeTrap) return;

    if (this.currentStepIdx >= this.activeTrap.steps.length) {
      this.completeTrap();
      return;
    }

    const nextStep = this.activeTrap.steps[this.currentStepIdx];
    this.updateStepInstruction();

    if (nextStep && nextStep.isAi) {
      setTimeout(() => this.executeAiStep(nextStep), 500);
    }
  }

  executeAiStep(step) {
    if (!this.activeTrap || !this.isSolving) return;

    const matchedMove = this.app.engine.getAllLegalMoves(step.mover).find(
      m => m.from.r === step.from.r && m.from.c === step.from.c &&
           m.to.r === step.to.r && m.to.c === step.to.c
    );

    if (matchedMove) {
      this.app.engine.makeMove(matchedMove);
    } else {
      const pc = this.app.engine.board[step.from.r][step.from.c];
      this.app.engine.board[step.from.r][step.from.c] = null;
      this.app.engine.board[step.to.r][step.to.c] = pc;
    }

    sound.playCapture();
    this.app.renderPieces();
    this.app.updateUI();

    this.currentStepIdx++;
    this.checkTrapProgress();
  }

  completeTrap() {
    this.isSolving = false;
    this.saveCompletedTrap(this.activeTrap.id);

    sound.playTrap();
    if (this.app.setCommentary) {
      this.app.setBannerNotice(`🏆 GBAM! ${this.activeTrap.title} SOLVED!`, false);
    }

    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.remove('hidden');
      this.dom.winCelebration.style.display = 'flex';
      const explEl = document.getElementById('trap-celebration-explanation');
      if (explEl) explEl.textContent = this.activeTrap.explanation || '';
    }

    try {
      fetch('api/wallet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'award_coins', amount: 50, reason: `Trap Academy: ${this.activeTrap.title}` })
      }).catch(() => {});
    } catch {}
  }

  advanceToNextTrap() {
    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.add('hidden');
      this.dom.winCelebration.style.display = 'none';
    }

    const currentIdx = TRAP_DATABASE.findIndex(t => t.id === this.activeTrap.id);
    const nextTrap = TRAP_DATABASE[(currentIdx + 1) % TRAP_DATABASE.length];
    if (nextTrap) {
      this.startTrap(nextTrap.id);
    }
  }

  exitActiveTrap() {
    this.activeTrap = null;
    this.isSolving = false;
    if (this.dom.activeBanner) {
      this.dom.activeBanner.style.display = 'none';
    }
    if (this.dom.winCelebration) {
      this.dom.winCelebration.classList.add('hidden');
      this.dom.winCelebration.style.display = 'none';
    }
    this.app.resetGame();
  }

  showHint() {
    if (!this.activeTrap || !this.isSolving) return;
    const step = this.activeTrap.steps[this.currentStepIdx];
    if (!step || step.isAi) return;

    const fromEl = document.getElementById(`sq-${step.from.r}-${step.from.c}`);
    const toEl = document.getElementById(`sq-${step.to.r}-${step.to.c}`);

    if (fromEl) fromEl.classList.add('trap-hint-pulse');
    if (toEl) toEl.classList.add('trap-hint-target');

    this.app.setBannerNotice(`💡 Hint: Move piece from (${step.from.r}, ${step.from.c}) to (${step.to.r}, ${step.to.c})!`, false);

    setTimeout(() => {
      if (fromEl) fromEl.classList.remove('trap-hint-pulse');
      if (toEl) toEl.classList.remove('trap-hint-target');
    }, 2800);
  }
}






