/**
 * Nigerian Draughts (Naija Draft) - Master Edition
 * Integrated with:
 * - Dual Clock Timers (Blitz, Rapid, Classical)
 * - AfroDraught-style Navigation (Play Setup, Players Directory, Games, Tournaments)
 * - Interactive Match Replay Controller
 * - Board Analysis & Position Editor with Master AI Evaluation
 * - Live Street Corner Chat & Nigerian Pidgin Banter Soundboard
 */

import { NigerianDraughtsEngine, PLAYER_1, PLAYER_2 } from './engine.js';
import { NigerianDraughtsAI } from './ai.js';
import { sound } from './audio.js';
import { DraughtsTimer } from './timer.js';
import { MatchReplayController } from './replay.js';
import { BoardAnalysisController } from './analysis.js';
import { StreetChatController } from './chat.js';
import { TrapAcademyController } from './traps.js';

class NigerianDraughtsApp {
  constructor() {
    this.boardSize = 10;
    this.ruleMode = 'nigeria';
    this.gameMode = 'pve'; // 'pve' | 'pvp' | 'eve'
    this.aiDifficulty = 'expert';
    this.timeControl = 'rapid_5';
    this.isBoardFlipped = false;
    this.selectedPieceSquare = null;
    this.validMovesForSelected = [];
    this.isAIThinking = false;
    this.historyStateStack = [];
    this.currentUser = null;
    this.onlineRoomCode = null;
    this.onlinePlayerRole = 'p1';
    this.onlinePollingInterval = null;
    this.premove = null; // Queued { from: { r, c }, to: { r, c } }
    this.premoveSource = null; // { r, c }
    this.lastPingMs = 35;
    this.isPremoveExecuting = false;

    // Street commentaries
    this.commentaryMap = {
      start: [
        '"Oya welcome! Place your hand on the board, make we see who sabi play pass."',
        '"Game on! Remember in Naija draft, ordinary seeds chop backward too!"',
        '"Highway (Central Line) is on your right. Who controls the highway controls the board!"',
        '"No sleeping on the board today. Who will be the true draughts champion?"'
      ],
      capture: [
        '"Chop am clean! No mercy on the board!"',
        '"Gbam! That seed don go so!"',
        '"Kiti-kiti! You dey chop like hungry lion!"',
        '"Double chop! Sweet trap, clean execution!"',
        '"Chop and clear! Board is getting light!"'
      ],
      trap: [
        '"Gbam! You don enter trap! Sweet execution!"',
        '"Chai! Clean ambush! Opponent walk right into the slaughter zone!"',
        '"Masterclass trap! Seed sacrificed, highway cleared, king unlocked!"',
        '"Otilo! The trap don snap! Pure draughts intelligence!"',
        '"E shock you! You think say na free seed? Welcome to the trap!"',
        '"Kiti-kiti! Trap sprung clean like professional champion!"'
      ],
      king: [
        '"Oba don enter! Respect the King!"',
        '"Oga at the top! Long King don show face!"',
        '"King don land! Flying diagonal power unlocked!"',
        '"Oba is active! Any distance, any direction!"'
      ],
      mandatory: [
        '"Compulsory chop! In Naija draft, you MUST eat!"',
        '"Food don ready! You cannot ignore this capture!"',
        '"Mandatory eating! Board law is strictly enforced!"'
      ],
      general: [
        '"Calculated move... the street is watching."',
        '"Tactical repositioning. Who sabi, sabi."',
        '"Defense solid like rock. Make we see your next plan."',
        '"Game dey tight! One wrong step and it is game over!"'
      ],
      win: [
        '"Chai! Grandmaster has fallen! All hail the new Draughts Champion!"',
        '"Otilo! You finish work! Sweet victory on the board!"',
        '"Masterclass performance! Board cleared, opponent humbled!"'
      ],
      defeat: [
        '"Grandmaster say: \'You try, but calculation no be beans!\' Game over!"',
        '"Gbam! Grandmaster lock the board! Seed no fit breathe again!"',
        '"Game over! The computer engine showed no mercy. Better luck in the rematch!"'
      ],
      draw: [
        '"Stalemate! Nobody gree for anybody, balanced peace on the board!"',
        '"Equal strength, no breakthrough! Respectful draw!"'
      ]
    };

    this.engine = new NigerianDraughtsEngine({
      boardSize: this.boardSize,
      ruleMode: this.ruleMode
    });

    this.ai = new NigerianDraughtsAI({
      difficulty: this.aiDifficulty
    });

    this.initTimer();
    this.initDOMReferences();
    this.bindEvents();

    // Sub-controllers
    this.replayController = new MatchReplayController({ app: this });
    this.analysisController = new BoardAnalysisController({ app: this });
    this.chatController = new StreetChatController({ app: this });
    this.trapAcademy = new TrapAcademyController({ app: this });
    this.isTrapRadarActive = false;

    this.initAuthAndBackend();
    this.renderBoard();
    this.updateUI();
    this.parseURLParameters();
    this.updateHighwayIndicators();
  }

  parseURLParameters() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramRoom = urlParams.get('room') || urlParams.get('room_code');
      const paramRole = urlParams.get('role') || 'p1';
      const paramMode = urlParams.get('mode');
      const paramRules = urlParams.get('rules');
      const paramTime = urlParams.get('time');
      const paramShort = urlParams.get('short');
      const paramMod = urlParams.get('mod');
      const paramTheme = urlParams.get('theme');
      const paramCoins = urlParams.get('coins');
      const paramUndo = urlParams.get('undo');
      const paramTowin = urlParams.get('towin');
      const paramChat = urlParams.get('chat');
      const paramSound = urlParams.get('sound');
      const paramHighlight = urlParams.get('highlight');
      const paramAnalysis = urlParams.get('analysis');
      const paramDiff = urlParams.get('diff');
      const paramView = urlParams.get('view');

      const paramReplay = urlParams.get('replay') || urlParams.get('match');
      if (paramReplay) {
        setTimeout(() => {
          this.loadAndReplayMatch(paramReplay);
        }, 400);
        return;
      }

      if (paramRoom) {
        this.initOnlineRoomMode(paramRoom, paramRole);
        return;
      }

      if (paramMode && ['traps', 'puzzles'].includes(paramMode)) {
        window.location.href = 'puzzles.php';
        return;
      }
      if (paramMode && ['pve', 'pvp', 'eve'].includes(paramMode)) {
        this.gameMode = paramMode;
        if (this.dom.setupGameMode) this.dom.setupGameMode.value = this.gameMode;
        if (this.dom.setupDiffBox) {
          this.dom.setupDiffBox.style.display = paramMode === 'pvp' ? 'none' : 'flex';
        }
      }

      if (paramDiff) {
        this.aiDifficulty = paramDiff;
        if (this.dom.setupAiDifficulty) this.dom.setupAiDifficulty.value = paramDiff;
        this.ai.setDifficulty(paramDiff);
      }

      if (paramRules) {
        const r = paramRules.toLowerCase().trim();
        this.ruleMode = (r === 'international' || r === 'tournament')
          ? 'international'
          : (r === 'ghana' || r === 'damii' ? 'ghana' : 'nigeria');
        this.engine.ruleMode = this.ruleMode;
        this.engine.ruleType = this.ruleMode;
      }

      if (paramShort !== null && paramShort !== undefined) {
        this.engine.p1Short = Math.max(0, Math.min(5, parseInt(paramShort, 10) || 0));
      }

      let increment = 0;
      let advantage = 0;
      if (paramMod) {
        this.engine.modifications = paramMod;
        if (paramMod === 'inc_1s') increment = 1;
        else if (paramMod === 'inc_3s') increment = 3;
        else if (paramMod === 'inc_5s') increment = 5;
        else if (paramMod === 'adv_1m') advantage = 60;
        else if (paramMod === 'adv_3m') advantage = 180;
        else if (paramMod === 'adv_5m') advantage = 300;
        else if (paramMod === 'adv_7m') advantage = 420;
      }

      if (paramTime) {
        this.timeControl = paramTime;
        this.timer.setPreset(paramTime, increment, advantage);
      }

      if (paramTheme) {
        this.setBoardTheme(paramTheme);
      }

      if (paramUndo !== null) {
        const undoAllowed = paramUndo === '1';
        if (this.dom.btnUndo) {
          this.dom.btnUndo.style.display = undoAllowed ? 'inline-flex' : 'none';
        }
      }

      if (paramChat !== null) {
        const chatEnabled = paramChat === '1';
        const chatBtn = document.getElementById('nav-chat');
        if (chatBtn) chatBtn.style.display = chatEnabled ? 'inline-flex' : 'none';
        const chatDock = document.getElementById('street-chat-dock');
        if (chatDock && !chatEnabled) chatDock.style.display = 'none';
      }

      if (paramSound !== null) {
        sound.muted = (paramSound === '0');
        this.updateSoundIcon();
      }

      if (paramHighlight !== null) {
        this.highlightMoves = (paramHighlight === '1');
      }

      if (paramTowin !== null) {
        this.toWinMode = (paramTowin === '1');
      }


      this.updatePlayerLabels();

      if (paramAnalysis === '1') {
        setTimeout(() => {
          if (this.analysisController) this.analysisController.open();
        }, 300);
      }

      if (paramView === 'tournaments') {
        setTimeout(() => {
          this.openModal(this.dom.modalTournaments);
          this.fetchTournaments();
        }, 300);
      } else if (paramView === 'players') {
        setTimeout(() => {
          this.openModal(this.dom.modalPlayers);
          this.fetchPlayersDirectory('');
        }, 300);
      } else if (paramView === 'games') {
        setTimeout(() => {
          this.openModal(this.dom.modalGames);
          this.fetchGamesArchive();
        }, 300);
      } else if (paramView === 'analysis') {
        setTimeout(() => {
          if (this.analysisController) this.analysisController.open();
        }, 300);
      } else if (paramView === 'chat') {
        setTimeout(() => {
          if (this.chatController) this.chatController.toggle();
        }, 300);
      } else if (paramView === 'traps' || paramView === 'puzzles') {
        window.location.href = 'puzzles.php';
        return;
      }
    } catch (e) {}
  }

  initTimer() {
    this.timer = new DraughtsTimer({
      preset: this.timeControl,
      onTick: (timeStrings, timeLeft, activePlayer) => {
        if (this.dom.p1Clock) {
          this.dom.p1Clock.textContent = timeStrings[PLAYER_1];
          this.dom.p1Clock.classList.toggle('urgent', timeStrings.isP1Low);
        }
        if (this.dom.p2Clock) {
          this.dom.p2Clock.textContent = timeStrings[PLAYER_2];
          this.dom.p2Clock.classList.toggle('urgent', timeStrings.isP2Low);
        }
      },
      onTimeout: (loserPlayer) => {
        sound.playError();
        const winner = loserPlayer === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        const winnerName = winner === PLAYER_1
          ? (this.currentUser ? this.currentUser.username : 'Player 1')
          : (this.gameMode === 'pve' ? 'Computer (AI)' : 'Player 2');

        this.engine.gameOver = true;
        this.engine.winner = winner;
        this.engine.winReason = `Player ${loserPlayer} lost on time!`;
        this.handleGameOver({
          winner,
          winReason: `Player ${loserPlayer} ran out of time! ${winnerName} wins!`
        });
      }
    });
  }

  initDOMReferences() {
    this.dom = {
      boardInner: document.getElementById('draughts-board'),
      boardFrame: document.getElementById('board-wood-frame'),
      boardTacticalSvg: document.getElementById('board-tactical-svg'),
      btnUndo: document.getElementById('btn-undo-move'),
      btnToggleTrapRadar: document.getElementById('btn-toggle-trap-radar'),
      btnFlip: document.getElementById('btn-flip-board'),
      btnSound: document.getElementById('btn-sound-toggle'),
      soundIcon: document.getElementById('sound-icon'),
      statusBanner: document.getElementById('status-banner'),
      bannerText: document.getElementById('banner-text'),
      commentaryTicker: document.getElementById('commentary-ticker'),
      moveHistoryList: document.getElementById('move-history-list'),
      moveCountBadge: document.getElementById('move-count-badge'),

      // World-Class Competitive Controls
      evalBar: document.getElementById('board-eval-bar'),
      evalBarFill: document.getElementById('eval-bar-fill'),
      evalBarScore: document.getElementById('eval-bar-score'),
      pingIndicator: document.getElementById('network-ping-indicator'),
      pingText: document.getElementById('ping-text'),
      btnShareMatchLink: document.getElementById('btn-share-match-link'),
      btnCopyPdnMatch: document.getElementById('btn-copy-pdn-match'),
      toastContainer: document.getElementById('toast-container'),

      // Players
      p1Card: document.getElementById('card-p1'),
      p2Card: document.getElementById('card-p2'),
      p1Indicator: document.getElementById('p1-indicator'),
      p2Indicator: document.getElementById('p2-indicator'),
      p1Clock: document.getElementById('p1-clock'),
      p2Clock: document.getElementById('p2-clock'),
      p1SeedsCount: document.getElementById('p1-seeds-count'),
      p1KingsCount: document.getElementById('p1-kings-count'),
      p1Score: document.getElementById('p1-score'),
      p1CapturedTray: document.getElementById('p1-captured-tray'),
      p2SeedsCount: document.getElementById('p2-seeds-count'),
      p2KingsCount: document.getElementById('p2-kings-count'),
      p2Score: document.getElementById('p2-score'),
      p2CapturedTray: document.getElementById('p2-captured-tray'),
      p1Name: document.getElementById('p1-name'),
      p1Role: document.getElementById('p1-role'),
      p2Name: document.getElementById('p2-name'),
      p2Role: document.getElementById('p2-role'),

      // Top Navigation Links
      navPlay: document.getElementById('nav-play'),
      navPlayers: document.getElementById('nav-players'),
      navGames: document.getElementById('nav-games'),
      navTournaments: document.getElementById('nav-tournaments'),
      navRules: document.getElementById('nav-rules'),
      btnOpenGameSetup: document.getElementById('btn-open-game-setup'),

      // Modals
      modalGameSetup: document.getElementById('modal-game-setup'),
      btnCloseGameSetup: document.getElementById('btn-close-game-setup'),
      btnCancelGameSetup: document.getElementById('btn-cancel-game-setup'),
      btnStartMatch: document.getElementById('btn-start-match'),
      btnSetupType1p: document.getElementById('btn-setup-type-1p'),
      btnSetupType2p: document.getElementById('btn-setup-type-2p'),
      setupGameType: document.getElementById('setup-game-type'),
      setupRuleType: document.getElementById('setup-rule-type'),
      setupCoinsRequired: document.getElementById('setup-coins-required'),
      setupCashWagerGroup: document.getElementById('setup-cash-wager-group'),
      setupCashStake: document.getElementById('setup-cash-stake'),
      cashWagerPreviewBadge: document.getElementById('cash-wager-preview-badge'),
      setupCustomCoinsWrap: document.getElementById('setup-custom-coins-wrap'),
      setupCustomCoinsVal: document.getElementById('setup-custom-coins-val'),
      setupPlayerTime: document.getElementById('setup-player-time'),
      setupP1Short: document.getElementById('setup-p1-short'),
      setupModifications: document.getElementById('setup-modifications'),
      setupBoardType: document.getElementById('setup-board-type'),
      setupToggleUndo: document.getElementById('setup-toggle-undo'),
      setupTogglePrivate: document.getElementById('setup-toggle-private'),
      setupToggleTowin: document.getElementById('setup-toggle-towin'),
      setupToggleChat: document.getElementById('setup-toggle-chat'),
      setupToggleSound: document.getElementById('setup-toggle-sound'),
      setupToggleHighlight: document.getElementById('setup-toggle-highlight'),
      setupToggleAnalysis: document.getElementById('setup-toggle-analysis'),
      setupAiDifficulty: document.getElementById('setup-ai-difficulty'),
      setupAiDifficultyWrap: document.getElementById('setup-ai-difficulty-wrap'),

      // Engine Telemetry HUD
      engineTelemetryPanel: document.getElementById('engine-telemetry-panel'),
      engineStatRuleset: document.getElementById('engine-stat-ruleset'),
      engineEvalBadge: document.getElementById('engine-eval-badge'),
      engineStatDepth: document.getElementById('engine-stat-depth'),
      engineStatNodes: document.getElementById('engine-stat-nodes'),
      engineStatNps: document.getElementById('engine-stat-nps'),
      engineStatTt: document.getElementById('engine-stat-tt'),
      enginePvLine: document.getElementById('engine-pv-line'),
      engineThinkingBar: document.getElementById('engine-thinking-bar'),
      enginePulseDot: document.getElementById('engine-pulse-dot'),

      modalPlayers: document.getElementById('modal-players'),
      btnClosePlayers: document.getElementById('btn-close-players'),
      playersDirectoryList: document.getElementById('players-directory-list'),
      playerSearchInput: document.getElementById('player-search-input'),

      modalGames: document.getElementById('modal-games'),
      btnCloseGames: document.getElementById('btn-close-games'),
      gamesArchiveList: document.getElementById('games-archive-list'),

      modalTournaments: document.getElementById('modal-tournaments'),
      btnCloseTournaments: document.getElementById('btn-close-tournaments'),
      tournamentsContainer: document.getElementById('tournaments-container'),

      rulesModal: document.getElementById('rules-modal'),
      btnCloseRules: document.getElementById('btn-close-rules'),
      btnModalGotIt: document.getElementById('btn-modal-got-it'),

      gameOverModal: document.getElementById('game-over-modal'),
      gameOverTitle: document.getElementById('game-over-title'),
      gameOverSub: document.getElementById('game-over-sub'),
      goMovesCount: document.getElementById('go-moves-count'),
      goP1Chopped: document.getElementById('go-p1-chopped'),
      goP2Chopped: document.getElementById('go-p2-chopped'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnCloseGameOver: document.getElementById('btn-close-game-over'),
      btnReviewBoard: document.getElementById('btn-review-board'),
      winnerTrophyIcon: document.getElementById('winner-trophy-icon'),
      goAccuracyPanel: document.getElementById('go-accuracy-panel'),
      goP1Accuracy: document.getElementById('go-p1-accuracy'),
      goP2Accuracy: document.getElementById('go-p2-accuracy'),
      goBestCount: document.getElementById('go-best-count'),
      goInaccCount: document.getElementById('go-inacc-count'),
      goMistakeCount: document.getElementById('go-mistake-count'),
      goBlunderCount: document.getElementById('go-blunder-count'),

      // Online Room
      onlineRoomBanner: document.getElementById('online-room-banner'),
      roomCodeDisplay: document.getElementById('room-code-display'),
      roomStatusDisplay: document.getElementById('room-status-display'),
      btnCopyRoomLink: document.getElementById('btn-copy-room-link'),
      btnResignRoom: document.getElementById('btn-resign-room'),

      // Auth
      authSection: document.getElementById('auth-section'),
      authModal: document.getElementById('auth-modal'),
      btnCloseAuth: document.getElementById('btn-close-auth'),
      tabLogin: document.getElementById('tab-login'),
      tabRegister: document.getElementById('tab-register'),
      formLogin: document.getElementById('form-login'),
      formRegister: document.getElementById('form-register'),
      formVerify: document.getElementById('form-verify'),
      verifyEmailDisplay: document.getElementById('game-verify-email-display'),
      verifyHiddenEmail: document.getElementById('game-verify-hidden-email'),
      gameVerifyCode: document.getElementById('game-verify-code'),
      btnSubmitGameVerify: document.getElementById('btn-submit-game-verify'),
      btnGameResendCode: document.getElementById('btn-game-resend-code'),
      gameResendTimer: document.getElementById('game-resend-timer'),
      btnGameBackLogin: document.getElementById('btn-game-back-login'),
      gameDevOtpHint: document.getElementById('game-dev-otp-hint'),
      gameDevOtpCode: document.getElementById('game-dev-otp-code'),
      authAlert: document.getElementById('auth-alert')
    };

    this.updateSoundIcon();
  }

  bindEvents() {
    // Navigation Menu Clicks
    this.dom.navPlay?.addEventListener('click', () => this.openModal(this.dom.modalGameSetup));
    this.dom.btnOpenGameSetup?.addEventListener('click', () => this.openModal(this.dom.modalGameSetup));
    this.dom.btnCloseGameSetup?.addEventListener('click', () => this.closeModal(this.dom.modalGameSetup));
    this.dom.btnCancelGameSetup?.addEventListener('click', () => this.closeModal(this.dom.modalGameSetup));

    // Trap Radar Toggle
    this.dom.btnToggleTrapRadar?.addEventListener('click', () => {
      this.isTrapRadarActive = !this.isTrapRadarActive;
      this.evaluateTrapRadar();
    });

    // Online Room Actions
    this.dom.btnCopyRoomLink?.addEventListener('click', () => this.copyRoomLink());
    this.dom.btnResignRoom?.addEventListener('click', () => this.resignOnlineRoom());

    // Share Match Replay URL
    this.dom.btnShareMatchLink?.addEventListener('click', () => this.shareMatchLink());

    // Copy Standard PDN Notation
    this.dom.btnCopyPdnMatch?.addEventListener('click', () => this.copyPDNToClipboard());

    // Right-Click on Board cancels queued Premove
    this.dom.boardInner?.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.premove || this.premoveSource) {
        this.clearPremove();
        this.showToast('Premove cancelled', 'info');
      }
    });

    // Game Setup: 1P vs 2P segmented toggle
    this.dom.btnSetupType1p?.addEventListener('click', () => {
      this.dom.btnSetupType1p.classList.add('active');
      this.dom.btnSetupType2p?.classList.remove('active');
      if (this.dom.setupGameType) this.dom.setupGameType.value = '1p';
      if (this.dom.setupAiDifficultyWrap) this.dom.setupAiDifficultyWrap.style.display = 'block';
      if (this.dom.setupCashWagerGroup) this.dom.setupCashWagerGroup.style.display = 'none';
    });
    this.dom.btnSetupType2p?.addEventListener('click', () => {
      this.dom.btnSetupType2p.classList.add('active');
      this.dom.btnSetupType1p?.classList.remove('active');
      if (this.dom.setupGameType) this.dom.setupGameType.value = '2p';
      if (this.dom.setupAiDifficultyWrap) this.dom.setupAiDifficultyWrap.style.display = 'none';
      if (this.dom.setupCashWagerGroup) this.dom.setupCashWagerGroup.style.display = 'block';
    });

    // Game Setup: Coins dropdown custom amount toggle
    this.dom.setupCoinsRequired?.addEventListener('change', (e) => {
      if (this.dom.setupCustomCoinsWrap) {
        if (e.target.value === 'custom') {
          this.dom.setupCustomCoinsWrap.style.display = 'block';
          this.dom.setupCustomCoinsVal?.focus();
        } else {
          this.dom.setupCustomCoinsWrap.style.display = 'none';
        }
      }
    });

    // Game Setup: Cash Stake dropdown preview
    this.dom.setupCashStake?.addEventListener('change', (e) => {
      const val = parseFloat(e.target.value) || 0;
      if (this.dom.cashWagerPreviewBadge) {
        if (val > 0) {
          this.dom.cashWagerPreviewBadge.style.display = 'block';
          const totalPot = val * 2;
          const stdWin = totalPot * 0.92;
          const obaWin = totalPot * 0.96;
          this.dom.cashWagerPreviewBadge.innerHTML = `⚡ <strong>₦${val.toLocaleString()} Stake:</strong> Winner receives <strong>₦${stdWin.toLocaleString()}</strong> (Pot: ₦${totalPot.toLocaleString()}, 8% House Rake • ₦${obaWin.toLocaleString()} for VIP Oba). Escrow locked upon starting match.`;
        } else {
          this.dom.cashWagerPreviewBadge.style.display = 'none';
        }
      }
    });

    // Launch Match Button
    this.dom.btnStartMatch?.addEventListener('click', async (e) => {
      e.preventDefault();
      const gameType = this.dom.setupGameType ? this.dom.setupGameType.value : '1p';
      const ruleType = this.dom.setupRuleType ? this.dom.setupRuleType.value : 'nigeria';

      let wagerCoins = 0;
      if (this.dom.setupCoinsRequired) {
        if (this.dom.setupCoinsRequired.value === 'custom') {
          wagerCoins = parseInt(this.dom.setupCustomCoinsVal?.value, 10) || 0;
          if (wagerCoins < 1) {
            alert('Please enter a valid custom coin amount (minimum 1 coin).');
            return;
          }
        } else if (this.dom.setupCoinsRequired.value !== 'free') {
          wagerCoins = parseInt(this.dom.setupCoinsRequired.value, 10) || 0;
        }
      }

      let wagerNaira = 0;
      if (gameType === '2p' && this.dom.setupCashStake) {
        wagerNaira = parseFloat(this.dom.setupCashStake.value) || 0;
      }

      const playerTime = this.dom.setupPlayerTime ? this.dom.setupPlayerTime.value : '5';
      const p1Short = this.dom.setupP1Short ? (parseInt(this.dom.setupP1Short.value, 10) || 0) : 0;
      const modifications = this.dom.setupModifications ? this.dom.setupModifications.value : 'none';
      const boardType = this.dom.setupBoardType ? this.dom.setupBoardType.value : 'default';

      const settings = {
        undo_allowed: this.dom.setupToggleUndo ? this.dom.setupToggleUndo.checked : true,
        private_game: this.dom.setupTogglePrivate ? this.dom.setupTogglePrivate.checked : false,
        to_win: this.dom.setupToggleTowin ? this.dom.setupToggleTowin.checked : true,
        disable_chat: this.dom.setupToggleChat ? this.dom.setupToggleChat.checked : false,
        sound_on: this.dom.setupToggleSound ? this.dom.setupToggleSound.checked : true,
        highlight_moves: this.dom.setupToggleHighlight ? this.dom.setupToggleHighlight.checked : true,
        analysis_mode: this.dom.setupToggleAnalysis ? this.dom.setupToggleAnalysis.checked : false
      };

      const r = (ruleType || 'nigeria').toLowerCase().trim();
      this.ruleMode = (r === 'international' || r === 'tournament')
        ? 'international'
        : (r === 'ghana' || r === 'damii' ? 'ghana' : 'nigeria');
      this.engine.ruleMode = this.ruleMode;
      this.engine.ruleType = this.ruleMode;
      this.engine.p1Short = p1Short;
      this.engine.modifications = modifications;

      if (gameType === '1p') {
        // 1 Player: Configure local engine & restart
        this.gameMode = 'pve';
        const aiDiff = this.dom.setupAiDifficulty ? this.dom.setupAiDifficulty.value : 'expert';
        this.aiDifficulty = aiDiff;
        this.ai.setDifficulty(aiDiff);

        let increment = 0;
        let advantage = 0;
        if (modifications === 'inc_1s') increment = 1;
        else if (modifications === 'inc_3s') increment = 3;
        else if (modifications === 'inc_5s') increment = 5;
        else if (modifications === 'adv_1m') advantage = 60;
        else if (modifications === 'adv_3m') advantage = 180;
        else if (modifications === 'adv_5m') advantage = 300;
        else if (modifications === 'adv_7m') advantage = 420;

        this.timeControl = playerTime;
        this.timer.setPreset(playerTime, increment, advantage);
        this.setBoardTheme(boardType);

        if (this.dom.btnUndo) {
          this.dom.btnUndo.style.display = settings.undo_allowed ? 'inline-flex' : 'none';
        }
        if (this.dom.navChat) {
          this.dom.navChat.style.display = settings.disable_chat ? 'none' : 'inline-flex';
        }
        sound.muted = !settings.sound_on;
        this.updateSoundIcon();
        this.highlightMoves = settings.highlight_moves;
        this.toWinMode = settings.to_win;

        this.closeModal(this.dom.modalGameSetup);
        this.updatePlayerLabels();
        this.restartGame();

        if (settings.analysis_mode && this.analysisController) {
          setTimeout(() => this.analysisController.open(), 300);
        }
      } else {
        // 2 Player: Create room via backend
        let timeIncrement = 0;
        if (modifications === 'inc_1s') timeIncrement = 1;
        else if (modifications === 'inc_3s') timeIncrement = 3;
        else if (modifications === 'inc_5s') timeIncrement = 5;

        try {
          const res = await fetch('api/rooms.php?action=create_room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              game_type: 'p2p',
              rule_type: ruleType,
              rule_mode: this.ruleMode,
              player_time: playerTime,
              time_increment: timeIncrement,
              p1_short: p1Short,
              modifications: modifications,
              board_type: boardType,
              wager_coins: wagerCoins,
              wager_naira: wagerNaira,
              is_private: settings.private_game ? 1 : 0,
              settings: settings
            })
          });
          const data = await res.json();
          if (data.success && data.room_code) {
            this.closeModal(this.dom.modalGameSetup);
            window.location.href = `game.php?room=${encodeURIComponent(data.room_code)}&role=p1`;
          } else {
            alert(data.message || 'Failed to create room.');
          }
        } catch(err) {
          alert('Network error creating game room.');
        }
      }
    });

    // Players Directory
    this.dom.navPlayers?.addEventListener('click', () => {
      this.openModal(this.dom.modalPlayers);
      this.fetchPlayersDirectory('');
    });
    this.dom.btnClosePlayers?.addEventListener('click', () => this.closeModal(this.dom.modalPlayers));
    this.dom.playerSearchInput?.addEventListener('input', (e) => {
      this.fetchPlayersDirectory(e.target.value.trim());
    });

    // Games Archive
    this.dom.navGames?.addEventListener('click', () => {
      this.openModal(this.dom.modalGames);
      this.fetchGamesArchive();
    });
    this.dom.btnCloseGames?.addEventListener('click', () => this.closeModal(this.dom.modalGames));

    // Tournaments Hub
    this.dom.navTournaments?.addEventListener('click', () => {
      this.openModal(this.dom.modalTournaments);
      this.fetchTournaments();
    });
    this.dom.btnCloseTournaments?.addEventListener('click', () => this.closeModal(this.dom.modalTournaments));

    // Rules
    this.dom.navRules?.addEventListener('click', () => this.openModal(this.dom.rulesModal));
    this.dom.btnCloseRules?.addEventListener('click', () => this.closeModal(this.dom.rulesModal));
    this.dom.btnModalGotIt?.addEventListener('click', () => this.closeModal(this.dom.rulesModal));

    // Ruleset Selector Bar Radios
    document.querySelectorAll('input[name="ruleset_choice"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.switchRuleset(e.target.value);
        }
      });
    });

    // Quick Actions
    this.dom.btnUndo?.addEventListener('click', () => this.handleUndo());
    this.dom.btnFlip?.addEventListener('click', () => this.toggleBoardFlip());
    this.dom.btnSound?.addEventListener('click', () => this.toggleSound());
    this.dom.btnPlayAgain?.addEventListener('click', () => {
      this.closeModal(this.dom.gameOverModal);
      this.restartGame();
    });
    this.dom.btnCloseGameOver?.addEventListener('click', () => {
      this.closeModal(this.dom.gameOverModal);
    });
    this.dom.btnReviewBoard?.addEventListener('click', () => {
      this.closeModal(this.dom.gameOverModal);
      if (this.lastCompletedMatch && this.replayController) {
        this.replayController.loadMatch(this.lastCompletedMatch);
      }
    });

    // Auth
    this.dom.btnCloseAuth?.addEventListener('click', () => this.closeModal(this.dom.authModal));
    this.dom.tabLogin?.addEventListener('click', () => this.switchAuthTab('login'));
    this.dom.tabRegister?.addEventListener('click', () => this.switchAuthTab('register'));
    this.dom.formLogin?.addEventListener('submit', (e) => this.handleLoginSubmit(e));
    this.dom.formRegister?.addEventListener('submit', (e) => this.handleRegisterSubmit(e));
    this.dom.formVerify?.addEventListener('submit', (e) => this.handleVerifySubmit(e));
    this.dom.btnGameResendCode?.addEventListener('click', (e) => this.handleResendSubmit(e));
    this.dom.btnGameBackLogin?.addEventListener('click', () => this.switchAuthTab('login'));
  }

  // ================= AFRODRAUGHT-STYLE BACKEND API INTEGRATION ================= //

  async initAuthAndBackend() {
    try {
      const res = await fetch('api/auth.php?action=me');
      const data = await res.json();
      if (data.success && data.user) {
        this.setCurrentUser(data.user);
      }
    } catch (err) {}
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.renderAuthSection();
    this.updatePlayerLabels();
  }

  renderAuthSection() {
    if (!this.dom.authSection) return;

    if (this.currentUser) {
      this.dom.authSection.innerHTML = `
        <div class="user-pill" id="user-pill">
          <span class="user-pill-avatar">👑</span>
          <span class="user-pill-name">${this.escapeHTML(this.currentUser.username)}</span>
          <span class="user-pill-rating">${this.currentUser.rating} Elo</span>
        </div>
        <button id="btn-logout" class="btn btn-small btn-secondary" title="Sign Out">Logout</button>
      `;
      document.getElementById('btn-logout')?.addEventListener('click', () => this.handleLogout());
    } else {
      this.dom.authSection.innerHTML = `
        <button id="btn-open-auth" class="btn btn-primary btn-small" title="Sign in or register">
          <span class="icon">👤</span> Sign In
        </button>
      `;
      document.getElementById('btn-open-auth')?.addEventListener('click', () => {
        this.openModal(this.dom.authModal);
      });
    }
  }

  async fetchPlayersDirectory(query = '') {
    if (!this.dom.playersDirectoryList) return;
    this.dom.playersDirectoryList.innerHTML = '<p class="text-center">Searching champions...</p>';

    try {
      const url = query ? `api/players.php?q=${encodeURIComponent(query)}` : 'api/players.php';
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && data.players.length > 0) {
        this.dom.playersDirectoryList.innerHTML = data.players.map(p => {
          const flag = p.country_code === 'NG' ? '🇳🇬' : (p.country_code === 'GH' ? '🇬🇭' : '🇨🇲');
          return `
            <div class="player-dir-card">
              <div class="player-avatar-box">${p.username.charAt(0).toUpperCase()}</div>
              <div class="player-info-meta">
                <div class="player-name-row">
                  <span class="player-username">${this.escapeHTML(p.username)}</span>
                  <span class="player-rating-pill">${p.rating} Elo</span>
                </div>
                <div class="player-country">${flag} ${this.escapeHTML(p.country || 'Nigeria')} • ${this.escapeHTML(p.title || 'Master')}</div>
                <div class="player-stats-mini">
                  <span>🏆 ${p.wins} Wins</span>
                  <span>🍗 ${p.total_chopped} Chops</span>
                  <span>🔥 ${p.win_rate}% Win</span>
                </div>
              </div>
            </div>
          `;
        }).join('');
      } else {
        this.dom.playersDirectoryList.innerHTML = '<p class="text-center text-muted">No players matched your search.</p>';
      }
    } catch (e) {
      this.dom.playersDirectoryList.innerHTML = '<p class="text-center" style="color:#ef4444;">Failed to load player directory.</p>';
    }
  }

  async fetchGamesArchive() {
    if (!this.dom.gamesArchiveList) return;
    this.dom.gamesArchiveList.innerHTML = '<p class="text-center">Loading matches...</p>';

    try {
      const res = await fetch('api/matches.php?action=get_history');
      const data = await res.json();

      if (data.success && data.matches.length > 0) {
        this.dom.gamesArchiveList.innerHTML = data.matches.map(m => {
          let badgeClass = 'draw';
          let badgeText = 'Draw';
          if (m.result === 'p1_won') { badgeClass = 'won'; badgeText = 'P1 Won'; }
          else if (m.result === 'p2_won') { badgeClass = 'lost'; badgeText = 'P2 Won'; }

          return `
            <div class="match-card">
              <div class="match-meta-left">
                <div class="match-opponents">${this.escapeHTML(m.player1_name)} vs ${this.escapeHTML(m.player2_name)}</div>
                <div class="match-subinfo">${m.board_size}x${m.board_size} • ${m.moves_count} moves • ${m.p1_chopped} chopped • ${new Date(m.created_at).toLocaleDateString()}</div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="match-badge ${badgeClass}">${badgeText}</span>
                <button class="btn btn-small btn-secondary btn-replay-match" data-match-id="${m.id}" title="Replay match on the board">
                  ▶️ Replay
                </button>
              </div>
            </div>
          `;
        }).join('');

        // Bind Replay Buttons
        document.querySelectorAll('.btn-replay-match').forEach(btn => {
          btn.addEventListener('click', async () => {
            const matchId = btn.dataset.matchId;
            this.closeModal(this.dom.modalGames);
            await this.loadAndReplayMatch(matchId);
          });
        });
      } else {
        this.dom.gamesArchiveList.innerHTML = '<p class="text-center text-muted">No past games recorded yet.</p>';
      }
    } catch (e) {
      this.dom.gamesArchiveList.innerHTML = '<p class="text-center" style="color:#ef4444;">Failed to load match archive.</p>';
    }
  }

  async loadAndReplayMatch(matchId) {
    try {
      const res = await fetch(`api/matches.php?action=get_match&id=${matchId}`);
      const data = await res.json();
      if (data.success && data.match) {
        this.replayController.loadMatch(data.match);
      }
    } catch (e) {
      this.setBannerNotice('Failed to load match replay.', true);
    }
  }

  async fetchTournaments() {
    if (!this.dom.tournamentsContainer) return;
    this.dom.tournamentsContainer.innerHTML = '<p class="text-center">Loading tournament championships & knockout brackets...</p>';

    try {
      const res = await fetch('api/tournaments.php?action=list_tournaments');
      const data = await res.json();

      if (data.success && data.tournaments && data.tournaments.length > 0) {
        const currentUserId = data.current_user_id || (this.currentUser ? this.currentUser.id : null);

        this.dom.tournamentsContainer.innerHTML = data.tournaments.map(t => {
          const brackets = t.brackets || {};
          const qf = brackets.quarter_finals || [];
          const sf = brackets.semi_finals || [];
          const finalMatch = brackets.finals || {};

          const isCompleted = t.status === 'completed';
          const isLive = t.status === 'live';
          const isUpcoming = t.status === 'upcoming';
          const isUserRegistered = !!t.is_registered;

          let statusBadge = '';
          if (isCompleted) {
            statusBadge = '<span class="meta-pill" style="background:#22c55e;color:#000;font-weight:800;">🏁 Completed</span>';
          } else if (isLive) {
            statusBadge = `<span class="meta-pill" style="background:#ef4444;color:#fff;font-weight:800;">🔴 LIVE (${this.escapeHTML(t.current_round || 'In Progress')})</span>`;
          } else {
            statusBadge = `<span class="meta-pill" style="background:#f59e0b;color:#000;font-weight:800;">⏳ ${t.registered_count}/${t.max_participants} Players Enrolled</span>`;
          }

          const renderPlayerSlot = (player, winner) => {
            if (!player) return `<div class="bracket-player-slot text-muted" style="font-size:0.75rem; font-style:italic;">Contender TBD</div>`;
            const isWinner = winner && (winner.id === player.id || winner.username === player.username);
            return `
              <div class="bracket-player-slot ${isWinner ? 'winner' : ''}">
                <div>
                  ${player.seed ? `<span class="bracket-seed-badge">#${player.seed}</span>` : ''}
                  <strong>${this.escapeHTML(player.username || 'Player')}</strong>
                </div>
                ${isWinner ? '<span style="color:var(--accent-gold); font-size:0.82rem; font-weight:800;">🏆 Win</span>' : ''}
              </div>
            `;
          };

          const renderMatchActions = (match) => {
            if (!match || !match.room_code) return '';
            const p1Id = match.p1 ? match.p1.id : null;
            const p2Id = match.p2 ? match.p2.id : null;
            const isContender = currentUserId && (currentUserId === p1Id || currentUserId === p2Id);

            if (match.status === 'completed') {
              return `<div style="font-size:0.7rem; color:#94a3b8; margin-top:3px;">Match Concluded</div>`;
            }

            if (isContender) {
              return `
                <div class="bracket-match-action">
                  <a href="game.php?room=${match.room_code}" class="btn-bracket-play">
                    ▶ Play Match (${match.room_code})
                  </a>
                </div>
              `;
            } else {
              return `
                <div class="bracket-match-action">
                  <a href="game.php?room=${match.room_code}" class="btn-bracket-watch">
                    👁 Spectate (${match.room_code})
                  </a>
                </div>
              `;
            }
          };

          return `
            <div class="tournament-card" style="margin-bottom:24px;">
              <div class="tournament-header">
                <div>
                  <h3 class="tournament-title">🏆 ${this.escapeHTML(t.name)}</h3>
                  <p class="text-muted" style="font-size:0.82rem; margin-top:2px;">${this.escapeHTML(t.tagline || 'Official Nigerian Draughts Championship')}</p>
                </div>
                <div class="tournament-meta-pills">
                  ${statusBadge}
                  <span class="meta-pill prize">💰 ${t.prize_pool_naira > 0 ? `₦${t.prize_pool_naira.toLocaleString()}` : this.escapeHTML(t.prize_pool)}</span>
                  <span class="meta-pill">📍 ${this.escapeHTML(t.location || 'Lagos, NG')}</span>
                </div>
              </div>

              ${isCompleted && t.winner_name ? `
                <div class="tournament-champ-banner">
                  <div class="tournament-champ-title">
                    <span>👑 Champion:</span>
                    <strong>${this.escapeHTML(t.winner_name)}</strong>
                    <span style="font-size:0.75rem; background:#22c55e; color:#000; padding:2px 6px; border-radius:4px; font-weight:800;">70% Cash Pot</span>
                  </div>
                  <div class="tournament-champ-sub">
                    🥈 Runner-Up: <strong>${this.escapeHTML(t.runner_up_name || 'Contender')}</strong> (20% Share)
                  </div>
                </div>
              ` : ''}

              <!-- Visual Knockout Bracket Tree -->
              <div class="bracket-tree">
                <!-- Quarter-Finals -->
                <div class="bracket-column">
                  <span class="bracket-round-title">Quarter-Finals (R1)</span>
                  ${qf.map((m, idx) => {
                    const isUserM = currentUserId && ((m.p1 && m.p1.id === currentUserId) || (m.p2 && m.p2.id === currentUserId));
                    return `
                      <div class="bracket-match-box ${m.status === 'ready' ? 'ready' : ''} ${isUserM ? 'user-match' : ''}">
                        <div style="font-size:0.68rem; color:#64748b; font-weight:700; margin-bottom:2px;">MATCH #${idx + 1}</div>
                        ${renderPlayerSlot(m.p1, m.winner)}
                        ${renderPlayerSlot(m.p2, m.winner)}
                        ${renderMatchActions(m)}
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- Semi-Finals -->
                <div class="bracket-column">
                  <span class="bracket-round-title">Semi-Finals (R2)</span>
                  ${sf.map((m, idx) => {
                    const isUserM = currentUserId && ((m.p1 && m.p1.id === currentUserId) || (m.p2 && m.p2.id === currentUserId));
                    return `
                      <div class="bracket-match-box ${m.status === 'ready' ? 'ready' : ''} ${isUserM ? 'user-match' : ''}">
                        <div style="font-size:0.68rem; color:#64748b; font-weight:700; margin-bottom:2px;">SEMI-FINAL #${idx + 1}</div>
                        ${renderPlayerSlot(m.p1, m.winner)}
                        ${renderPlayerSlot(m.p2, m.winner)}
                        ${renderMatchActions(m)}
                      </div>
                    `;
                  }).join('')}
                </div>

                <!-- Grand Finals -->
                <div class="bracket-column">
                  <span class="bracket-round-title">Grand Final</span>
                  <div class="bracket-match-box ${finalMatch.status === 'ready' ? 'ready' : ''}" style="border-color:var(--accent-gold); background:rgba(234, 179, 8, 0.06);">
                    <div style="font-size:0.68rem; color:var(--accent-gold); font-weight:800; margin-bottom:2px;">🏆 TITLE MATCH</div>
                    ${renderPlayerSlot(finalMatch.p1, finalMatch.winner)}
                    ${renderPlayerSlot(finalMatch.p2, finalMatch.winner)}
                    ${renderMatchActions(finalMatch)}
                  </div>
                </div>
              </div>

              <!-- Registration Action Footer for Upcoming Tournaments -->
              ${isUpcoming ? `
                <div class="tournament-reg-footer">
                  <div style="font-size:0.85rem; color:#94a3b8;">
                    ${t.entry_fee_naira > 0 ? `Entry Fee: <strong style="color:#ffffff;">₦${t.entry_fee_naira.toLocaleString()}</strong>` : ''}
                    ${t.entry_fee_coins > 0 ? `Entry Coins: <strong style="color:#fde047;">${t.entry_fee_coins} 🪙</strong>` : ''}
                    ${t.entry_fee_naira === 0 && t.entry_fee_coins === 0 ? '<strong style="color:#4ade80;">Free Entry</strong>' : ''}
                  </div>
                  <div>
                    ${isUserRegistered ? `
                      <span class="badge-registered-chip">✓ Registered (Seed #${t.user_seed || 1})</span>
                    ` : `
                      <button type="button" class="btn-join-championship" onclick="app.joinTournament(${t.id})">
                        ⚔️ Register / Enter Championship
                      </button>
                    `}
                  </div>
                </div>
              ` : ''}

            </div>
          `;
        }).join('');
      } else {
        this.dom.tournamentsContainer.innerHTML = '<p class="text-center text-muted">No championships available at this time.</p>';
      }
    } catch (e) {
      console.error(e);
      this.dom.tournamentsContainer.innerHTML = '<p class="text-center" style="color:#ef4444;">Failed to load tournaments.</p>';
    }
  }

  async joinTournament(tournId) {
    try {
      const res = await fetch('api/tournaments.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournId })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'Successfully registered for championship!');
        this.fetchTournaments();
      } else {
        alert(data.message || 'Could not register for championship.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to tournament server.');
    }
  }

  switchAuthTab(tab) {
    if (this.dom.formVerify) this.dom.formVerify.style.display = 'none';
    if (tab === 'login') {
      this.dom.tabLogin?.classList.add('active');
      this.dom.tabRegister?.classList.remove('active');
      this.dom.formLogin?.classList.add('active');
      if (this.dom.formLogin) this.dom.formLogin.style.display = 'block';
      this.dom.formRegister?.classList.remove('active');
      if (this.dom.formRegister) this.dom.formRegister.style.display = 'none';
    } else {
      this.dom.tabRegister?.classList.add('active');
      this.dom.tabLogin?.classList.remove('active');
      this.dom.formRegister?.classList.add('active');
      if (this.dom.formRegister) this.dom.formRegister.style.display = 'block';
      this.dom.formLogin?.classList.remove('active');
      if (this.dom.formLogin) this.dom.formLogin.style.display = 'none';
    }
    this.showAuthAlert('', false);
  }

  showVerificationModal(email, devOtp = null) {
    if (this.dom.tabLogin) this.dom.tabLogin.classList.remove('active');
    if (this.dom.tabRegister) this.dom.tabRegister.classList.remove('active');
    if (this.dom.formLogin) {
      this.dom.formLogin.classList.remove('active');
      this.dom.formLogin.style.display = 'none';
    }
    if (this.dom.formRegister) {
      this.dom.formRegister.classList.remove('active');
      this.dom.formRegister.style.display = 'none';
    }
    if (this.dom.formVerify) {
      this.dom.formVerify.style.display = 'block';
      if (this.dom.verifyEmailDisplay) this.dom.verifyEmailDisplay.textContent = email;
      if (this.dom.verifyHiddenEmail) this.dom.verifyHiddenEmail.value = email;
      if (this.dom.gameVerifyCode) {
        this.dom.gameVerifyCode.value = '';
        setTimeout(() => this.dom.gameVerifyCode.focus(), 150);
      }
      if (devOtp && this.dom.gameDevOtpHint && this.dom.gameDevOtpCode) {
        this.dom.gameDevOtpCode.textContent = devOtp;
        this.dom.gameDevOtpHint.style.display = 'block';
        this.dom.gameDevOtpHint.onclick = () => {
          this.dom.gameVerifyCode.value = devOtp;
          this.dom.gameVerifyCode.focus();
        };
      } else if (this.dom.gameDevOtpHint) {
        this.dom.gameDevOtpHint.style.display = 'none';
      }
    }
  }

  showAuthAlert(msg, isError = true) {
    if (!this.dom.authAlert) return;
    if (!msg) {
      this.dom.authAlert.style.display = 'none';
      return;
    }
    this.dom.authAlert.textContent = msg;
    this.dom.authAlert.className = `auth-alert ${isError ? 'error' : 'success'}`;
    this.dom.authAlert.style.display = 'block';
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    const loginId = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;

    try {
      const res = await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', login: loginId, password })
      });
      const data = await res.json();

      if (data.requires_verification) {
        this.showVerificationModal(data.email || loginId, data.dev_otp);
        this.showAuthAlert(data.message || 'Please verify your email address to enter arena.', true);
      } else if (data.success) {
        this.setCurrentUser(data.user);
        this.closeModal(this.dom.authModal);
        this.setBannerNotice(`Welcome back, Champion ${data.user.username}!`);
        sound.playWin();
      } else {
        this.showAuthAlert(data.message || 'Login failed', true);
      }
    } catch (err) {
      this.showAuthAlert('Network error connecting to MySQL server.', true);
    }
  }

  async handleRegisterSubmit(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;

    try {
      const res = await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', username, email, password })
      });
      const data = await res.json();

      if (data.requires_verification) {
        this.showVerificationModal(email, data.dev_otp);
        this.showAuthAlert(data.message || 'Account created! Enter the 6-digit code sent to your email.', false);
      } else if (data.success) {
        this.setCurrentUser(data.user);
        this.closeModal(this.dom.authModal);
        this.setBannerNotice(`Account created! Welcome, Champion ${data.user.username}!`);
        sound.playKing();
      } else {
        this.showAuthAlert(data.message || 'Registration failed', true);
      }
    } catch (err) {
      this.showAuthAlert('Network error connecting to MySQL server.', true);
    }
  }

  async handleVerifySubmit(e) {
    e.preventDefault();
    const email = this.dom.verifyHiddenEmail ? this.dom.verifyHiddenEmail.value.trim() : '';
    const code = this.dom.gameVerifyCode ? this.dom.gameVerifyCode.value.trim() : '';

    if (!email) {
      this.showAuthAlert('Email address missing. Please sign in again.', true);
      return;
    }
    if (!code || code.length !== 6) {
      this.showAuthAlert('Please enter the complete 6-digit code.', true);
      return;
    }

    if (this.dom.btnSubmitGameVerify) {
      this.dom.btnSubmitGameVerify.disabled = true;
      this.dom.btnSubmitGameVerify.textContent = 'Verifying...';
    }

    try {
      const res = await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', email, code })
      });
      const data = await res.json();

      if (data.success && data.user) {
        this.setCurrentUser(data.user);
        this.closeModal(this.dom.authModal);
        this.setBannerNotice(data.message || `Email verified! Welcome, Champion ${data.user.username}!`);
        sound.playKing();
      } else {
        this.showAuthAlert(data.message || 'Verification failed. Please check your code.', true);
      }
    } catch (err) {
      this.showAuthAlert('Network error communicating with server.', true);
    } finally {
      if (this.dom.btnSubmitGameVerify) {
        this.dom.btnSubmitGameVerify.disabled = false;
        this.dom.btnSubmitGameVerify.textContent = 'Verify Code & Enter Arena →';
      }
    }
  }

  async handleResendSubmit(e) {
    e.preventDefault();
    const email = this.dom.verifyHiddenEmail ? this.dom.verifyHiddenEmail.value.trim() : '';
    if (!email) return;

    if (this.dom.btnGameResendCode) {
      this.dom.btnGameResendCode.disabled = true;
      this.dom.btnGameResendCode.style.opacity = '0.5';
    }

    try {
      const res = await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend_verification', email })
      });
      const data = await res.json();

      if (data.success) {
        this.showAuthAlert('New 6-digit code sent! Check your inbox.', false);
        if (data.dev_otp && this.dom.gameDevOtpCode && this.dom.gameDevOtpHint) {
          this.dom.gameDevOtpCode.textContent = data.dev_otp;
          this.dom.gameDevOtpHint.style.display = 'block';
          this.dom.gameDevOtpHint.onclick = () => {
            this.dom.gameVerifyCode.value = data.dev_otp;
            this.dom.gameVerifyCode.focus();
          };
        }

        let countdown = 60;
        if (this.dom.gameResendTimer) {
          this.dom.gameResendTimer.style.display = 'inline';
          this.dom.gameResendTimer.textContent = ` (${countdown}s)`;
          const timer = setInterval(() => {
            countdown--;
            if (countdown <= 0) {
              clearInterval(timer);
              this.dom.gameResendTimer.style.display = 'none';
              if (this.dom.btnGameResendCode) {
                this.dom.btnGameResendCode.disabled = false;
                this.dom.btnGameResendCode.style.opacity = '1';
              }
            } else {
              this.dom.gameResendTimer.textContent = ` (${countdown}s)`;
            }
          }, 1000);
        }
      } else {
        this.showAuthAlert(data.message || 'Could not resend code.', true);
        if (this.dom.btnGameResendCode) {
          this.dom.btnGameResendCode.disabled = false;
          this.dom.btnGameResendCode.style.opacity = '1';
        }
      }
    } catch (err) {
      this.showAuthAlert('Network error communicating with server.', true);
      if (this.dom.btnGameResendCode) {
        this.dom.btnGameResendCode.disabled = false;
        this.dom.btnGameResendCode.style.opacity = '1';
      }
    }
  }

  async handleLogout() {
    try {
      await fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
      });
    } catch (e) {}

    this.currentUser = null;
    this.renderAuthSection();
    this.updatePlayerLabels();
    this.setBannerNotice('Logged out. Playing as Guest.');
  }

  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ================= GAMEPLAY ENGINE INTERACTIONS ================= //

  updateSoundIcon() {
    this.dom.soundIcon.textContent = sound.isMuted ? '🔇' : '🔊';
  }

  toggleSound() {
    const isMuted = sound.toggleMute();
    this.updateSoundIcon();
    this.setBannerNotice(isMuted ? 'Sound effects muted' : 'Sound effects enabled');
  }

  toggleBoardFlip() {
    this.isBoardFlipped = !this.isBoardFlipped;
    this.dom.boardFrame.classList.toggle('flipped', this.isBoardFlipped);
  }

  setBoardTheme(theme) {
    if (!this.dom.boardFrame) return;
    const themeClasses = [
      'theme-default', 'theme-eco-giant', 'theme-golden-state',
      'theme-safari-land', 'theme-mineral-grove', 'theme-diamond-coast'
    ];
    this.dom.boardFrame.classList.remove(...themeClasses);
    const clean = (theme || 'default').replace('_', '-');
    const target = `theme-${clean}`;
    if (themeClasses.includes(target)) {
      this.dom.boardFrame.classList.add(target);
    } else {
      this.dom.boardFrame.classList.add('theme-default');
    }
  }

  openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  updatePlayerLabels() {
    if (this.currentUser) {
      this.dom.p1Name.textContent = this.currentUser.username;
      this.dom.p1Role.textContent = `Rating: ${this.currentUser.rating} Elo`;
    } else {
      this.dom.p1Name.textContent = 'Champion (Guest)';
      this.dom.p1Role.textContent = 'Player 1';
    }

    if (this.gameMode === 'pve') {
      this.dom.p2Role.textContent = 'Computer (AI Engine)';
      const diffNames = {
        beginner: 'Street Rookie (Beginner)',
        intermediate: 'Street Hustler (Intermediate)',
        advanced: 'State Contender (Advanced)',
        expert: 'National Master (Expert)',
        master: 'Grandmaster Oba (Master)',
        grandmaster: 'World Champion Engine (GM)'
      };
      let mappedDiff = this.aiDifficulty;
      if (mappedDiff === 'easy') mappedDiff = 'beginner';
      else if (mappedDiff === 'medium') mappedDiff = 'intermediate';
      else if (mappedDiff === 'hard') mappedDiff = 'expert';

      this.dom.p2Name.textContent = diffNames[mappedDiff] || 'Grandmaster Engine';
    } else if (this.gameMode === 'pvp') {
      this.dom.p2Role.textContent = 'Player 2';
      this.dom.p2Name.textContent = 'Challenger';
    } else {
      this.dom.p2Role.textContent = 'AI 2 (Spectate)';
      this.dom.p2Name.textContent = 'Grandmaster Engine (GM)';
    }
  }

  restartGame() {
    if (this.ai && this.ai.stopSearch) this.ai.stopSearch();
    this.saveState();
    this.timer.reset();

    const p1Short = this.engine ? (this.engine.p1Short || 0) : 0;
    const modifications = this.engine ? (this.engine.modifications || 'none') : 'none';

    this.engine = new NigerianDraughtsEngine({
      boardSize: this.boardSize,
      ruleMode: this.ruleMode,
      p1Short: p1Short,
      modifications: modifications
    });

    this.selectedPieceSquare = null;
    this.validMovesForSelected = [];
    this.historyStateStack = [];
    this.isAIThinking = false;

    // Reset Engine Telemetry HUD
    if (this.dom.engineStatRuleset) this.dom.engineStatRuleset.textContent = this.ruleMode.toUpperCase();
    if (this.dom.engineStatDepth) this.dom.engineStatDepth.textContent = '-';
    if (this.dom.engineStatNodes) this.dom.engineStatNodes.textContent = '0';
    if (this.dom.engineStatNps) this.dom.engineStatNps.textContent = '-';
    if (this.dom.engineStatTt) this.dom.engineStatTt.textContent = '0%';
    if (this.dom.engineEvalBadge) {
      this.dom.engineEvalBadge.textContent = '+0.00';
      this.dom.engineEvalBadge.className = 'engine-eval-badge eval-neutral';
    }
    if (this.dom.enginePvLine) {
      this.dom.enginePvLine.textContent = 'Position balanced. Waiting for turn...';
    }
    if (this.dom.engineThinkingBar) {
      this.dom.engineThinkingBar.style.display = 'none';
    }
    if (this.dom.enginePulseDot) {
      this.dom.enginePulseDot.classList.remove('thinking');
    }

    this.renderBoard();
    this.updateUI();
    this.setCommentary('start');
    this.setBannerNotice(`Match ready! ${this.boardSize}x${this.boardSize} Nigerian board. White starts.`);
    sound.playMove();

    if (this.gameMode === 'eve') {
      this.scheduleAIMove();
    }
  }

  updateHighwayIndicators() {
    const highwayText = document.getElementById('highway-indicator-text');
    if (highwayText) {
      if (this.ruleMode === 'ghana') {
        highwayText.textContent = '🇬🇭 Ghanaian Damii Active — Immediate Crown Stop & 16-Move 3v1 Countdown';
      } else if (this.ruleMode === 'international') {
        highwayText.textContent = '🌍 FMJD International Draughts Active — Strict Majority Capture & Rule 3.5';
      } else {
        highwayText.textContent = '🇳🇬 Nigerian Highway (Central Line) Active — Free Capture Choice';
      }
    }

    const pills = document.querySelectorAll('.ruleset-pill-lbl');
    pills.forEach(pill => {
      const radio = pill.querySelector('input[type="radio"]');
      if (radio) {
        const isMatched = radio.value === this.ruleMode;
        radio.checked = isMatched;
        pill.classList.toggle('active', isMatched);
      }
    });

    if (this.dom.engineStatRuleset) {
      this.dom.engineStatRuleset.textContent = this.ruleMode.toUpperCase();
    }
  }

  switchRuleset(rule) {
    const r = (rule || 'nigeria').toLowerCase().trim();
    this.ruleMode = (r === 'international' || r === 'tournament')
      ? 'international'
      : (r === 'ghana' || r === 'damii' ? 'ghana' : 'nigeria');

    if (this.engine) {
      this.engine.ruleMode = this.ruleMode;
      this.engine.ruleType = this.ruleMode;
      if (this.engine.setRuleset) {
        this.engine.setRuleset(this.ruleMode);
      }
    }
    if (this.ai && this.ai.setRuleset) {
      this.ai.setRuleset(this.ruleMode);
    }

    this.updateHighwayIndicators();
    this.restartGame();

    const bannerNames = {
      nigeria: '🇳🇬 Nigeria Rules (Highway Right, Free Choice)',
      ghana: '🇬🇭 Ghana Rules (Damii - Immediate Promotion, 16-Move 3v1)',
      international: '🌍 International Rules (FMJD - Majority Capture, Rule 3.5)'
    };
    if (this.dom.bannerText) {
      this.dom.bannerText.textContent = `Active Ruleset: ${bannerNames[this.ruleMode] || this.ruleMode}`;
    }
  }

  saveState() {
    this.historyStateStack.push({
      board: this.engine.board.map(r => r.map(c => c ? { ...c } : null)),
      currentTurn: this.engine.currentTurn,
      moveHistory: [...this.engine.moveHistory],
      captured: {
        [PLAYER_1]: [...this.engine.capturedPieces[PLAYER_1]],
        [PLAYER_2]: [...this.engine.capturedPieces[PLAYER_2]]
      }
    });
  }

  handleUndo() {
    if (this.isAIThinking || this.historyStateStack.length === 0) return;
    if (this.ai && this.ai.stopSearch) this.ai.stopSearch();

    const steps = (this.gameMode === 'pve' && this.historyStateStack.length >= 2) ? 2 : 1;
    let targetState = null;
    for (let i = 0; i < steps; i++) {
      targetState = this.historyStateStack.pop();
    }

    if (targetState) {
      this.engine.board = targetState.board;
      this.engine.currentTurn = targetState.currentTurn;
      this.engine.moveHistory = targetState.moveHistory;
      this.engine.capturedPieces = targetState.captured;
      this.engine.activeMultiJump = null;
      this.engine.gameOver = false;
      this.engine.winner = null;
      this.selectedPieceSquare = null;
      this.validMovesForSelected = [];
      this.renderPieces();
      this.updateUI();
      sound.playMove();
      this.setBannerNotice('Move undone.');
    }
  }

  renderBoard() {
    const size = this.boardSize;
    this.dom.boardInner.innerHTML = '';
    this.dom.boardInner.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.dom.boardInner.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const sq = document.createElement('div');
        const isDark = this.engine.isDarkSquare(r, c);
        const isHighway = isDark && (r === c); // Long diagonal running on player's right
        sq.className = `square ${isDark ? 'dark' : 'light'} ${isHighway ? 'central-line-sq' : ''}`;
        sq.dataset.row = r;
        sq.dataset.col = c;
        sq.id = `sq-${r}-${c}`;
        if (isHighway) {
          sq.title = this.ruleMode === 'ghana'
            ? 'Ghanaian Damii Central Line'
            : (this.ruleMode === 'international' ? 'FMJD Main Diagonal (Sq 50-1)' : 'Nigerian Central Line (Highway)');
        }

        if (c === 0) {
          const rowLabel = document.createElement('span');
          rowLabel.className = 'square-coord row-label';
          rowLabel.textContent = size - r;
          sq.appendChild(rowLabel);
        }
        if (r === size - 1) {
          const colLabel = document.createElement('span');
          colLabel.className = 'square-coord col-label';
          colLabel.textContent = String.fromCharCode(65 + c);
          sq.appendChild(colLabel);
        }

        sq.addEventListener('click', () => this.handleSquareClick(r, c));
        this.dom.boardInner.appendChild(sq);
      }
    }

    this.renderPieces();
  }

  renderPieces() {
    const size = this.boardSize;
    const allLegalMoves = this.engine.getAllLegalMoves();
    const hasCaptures = allLegalMoves.some(m => m.isCapture);

    const captureFromSet = new Set(
      allLegalMoves.filter(m => m.isCapture).map(m => `${m.from.r},${m.from.c}`)
    );

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const sq = document.getElementById(`sq-${r}-${c}`);
        if (!sq) continue;
        const existingPiece = sq.querySelector('.piece');
        if (existingPiece) sq.removeChild(existingPiece);

        sq.classList.remove('valid-target', 'valid-capture-target');

        const piece = this.engine.board[r][c];
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = `piece p${piece.player} ${piece.isKing ? 'king' : ''}`;
          pieceEl.dataset.id = piece.id;

          if (this.selectedPieceSquare && this.selectedPieceSquare.r === r && this.selectedPieceSquare.c === c) {
            pieceEl.classList.add('selected');
          }

          if (hasCaptures && captureFromSet.has(`${r},${c}`)) {
            pieceEl.classList.add('must-capture');
            pieceEl.title = 'Mandatory Capture ("Must Chop!")';
          }

          sq.appendChild(pieceEl);
        }
      }
    }

    this.clearTacticalArrows();
    if (this.validMovesForSelected.length > 0 && this.highlightMoves !== false) {
      for (const move of this.validMovesForSelected) {
        const destSq = document.getElementById(`sq-${move.to.r}-${move.to.c}`);
        if (destSq) {
          destSq.classList.add(move.isCapture ? 'valid-capture-target' : 'valid-target');
        }
        if (move.isCapture) {
          this.drawTacticalArrow(move.from.r, move.from.c, move.to.r, move.to.c, true);
        }
      }
    }
  }

  drawTacticalArrow(fromR, fromC, toR, toC, isCapture = false) {
    const svg = this.dom.boardTacticalSvg || document.getElementById('board-tactical-svg');
    if (!svg) return;

    const fromR_draw = this.isBoardFlipped ? 9 - fromR : fromR;
    const fromC_draw = this.isBoardFlipped ? 9 - fromC : fromC;
    const toR_draw = this.isBoardFlipped ? 9 - toR : toR;
    const toC_draw = this.isBoardFlipped ? 9 - toC : toC;

    const x1 = (fromC_draw + 0.5) * 10;
    const y1 = (fromR_draw + 0.5) * 10;
    const x2 = (toC_draw + 0.5) * 10;
    const y2 = (toR_draw + 0.5) * 10;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${x1}%`);
    line.setAttribute('y1', `${y1}%`);
    line.setAttribute('x2', `${x2}%`);
    line.setAttribute('y2', `${y2}%`);
    line.setAttribute('class', `tactical-arrow-path ${isCapture ? 'capture' : ''}`);
    line.setAttribute('marker-end', `url(#arrowhead-${isCapture ? 'green' : 'gold'})`);

    svg.appendChild(line);
  }

  clearTacticalArrows() {
    const svg = this.dom.boardTacticalSvg || document.getElementById('board-tactical-svg');
    if (!svg) return;
    const lines = svg.querySelectorAll('line, path.dynamic-arrow');
    lines.forEach(l => l.remove());
  }

  handlePremoveClick(r, c) {
    const myPlayer = (this.gameMode === 'room_online' && this.onlinePlayerRole === 'p2') ? PLAYER_2 : PLAYER_1;
    const clickedPiece = this.engine.board[r][c];

    // If player clicks their own seed/king, select it as premove source
    if (clickedPiece && clickedPiece.player === myPlayer) {
      this.clearPremove();
      this.premoveSource = { r, c };
      const sq = document.getElementById(`sq-${r}-${c}`);
      if (sq) sq.classList.add('premove-source');
      sound.playMove();
      this.setBannerNotice('⚡ Premove: Piece selected. Now click destination square to queue your move.');
      return;
    }

    // If premove piece already selected, set destination target
    if (this.premoveSource) {
      if (r === this.premoveSource.r && c === this.premoveSource.c) {
        this.clearPremove();
        return;
      }

      if (this.engine.isDarkSquare(r, c)) {
        this.premove = {
          from: { r: this.premoveSource.r, c: this.premoveSource.c },
          to: { r, c }
        };
        this.premoveSource = null;
        this.renderPremove();
        sound.playMove();
        this.showToast('⚡ Premove Queued! Will execute instantly on your turn.', 'success');
        this.setBannerNotice('⚡ Premove queued! Right-click anywhere on the board to cancel.');
        return;
      }
    }

    this.clearPremove();
  }

  renderPremove() {
    this.clearPremoveHighlights();
    if (!this.premove) return;

    const fromSq = document.getElementById(`sq-${this.premove.from.r}-${this.premove.from.c}`);
    const toSq = document.getElementById(`sq-${this.premove.to.r}-${this.premove.to.c}`);
    if (fromSq) fromSq.classList.add('premove-source');
    if (toSq) toSq.classList.add('premove-target');
  }

  clearPremoveHighlights() {
    document.querySelectorAll('.premove-source, .premove-target').forEach(el => {
      el.classList.remove('premove-source', 'premove-target');
    });
  }

  clearPremove() {
    this.premove = null;
    this.premoveSource = null;
    this.clearPremoveHighlights();
  }

  tryExecutePremove() {
    if (!this.premove || this.isPremoveExecuting) return;
    const myPlayer = (this.gameMode === 'room_online' && this.onlinePlayerRole === 'p2') ? PLAYER_2 : PLAYER_1;
    if (this.engine.currentTurn !== myPlayer || this.engine.gameOver) {
      return;
    }

    const queued = { ...this.premove };
    this.clearPremove();

    const legalMoves = this.engine.getAllLegalMoves(myPlayer);
    const matchingMove = legalMoves.find(
      m => m.from.r === queued.from.r && m.from.c === queued.from.c &&
           m.to.r === queued.to.r && m.to.c === queued.to.c
    );

    if (matchingMove) {
      this.isPremoveExecuting = true;
      this.showToast('⚡ Premove Executed with 0ms delay!', 'success');
      this.executePlayerMove(matchingMove);
      this.isPremoveExecuting = false;
    } else {
      this.clearPremove();
    }
  }

  handleSquareClick(r, c) {
    // If analysis mode is active, forward click to analysis palette
    if (this.analysisController && this.analysisController.isActive) {
      this.analysisController.handleSquareClick(r, c);
      return;
    }

    if (this.engine.gameOver || this.isAIThinking) return;

    // PREMOVE LOGIC: When it is opponent's turn in PvE or Online Match
    const isPveOpponent = (this.gameMode === 'pve' && this.engine.currentTurn === PLAYER_2);
    const isOnlineOpponent = (this.gameMode === 'room_online' && (
      (this.onlinePlayerRole === 'p1' && this.engine.currentTurn === PLAYER_2) ||
      (this.onlinePlayerRole === 'p2' && this.engine.currentTurn === PLAYER_1)
    ));

    if (isPveOpponent || isOnlineOpponent) {
      this.handlePremoveClick(r, c);
      return;
    }

    // Normal Turn Play: Clear any stale premove
    this.clearPremove();

    const clickedPiece = this.engine.board[r][c];
    const currentTurn = this.engine.currentTurn;

    if (this.selectedPieceSquare) {
      const matchingMove = this.validMovesForSelected.find(
        m => m.to.r === r && m.to.c === c
      );

      if (matchingMove) {
        if (this.gameMode === 'traps' && this.trapAcademy) {
          const validTrapStep = this.trapAcademy.handlePlayerMoveAttempt(matchingMove);
          if (!validTrapStep) return;
        }
        this.executePlayerMove(matchingMove);
        return;
      }
    }

    if (this.engine.activeMultiJump) {
      if (this.selectedPieceSquare && r === this.selectedPieceSquare.r && c === this.selectedPieceSquare.c) {
        return;
      }
      sound.playError();
      this.setBannerNotice('Must finish multi-jump sequence with current piece!', true);
      return;
    }

    if (clickedPiece && clickedPiece.player === currentTurn) {
      const allMoves = this.engine.getAllLegalMoves(currentTurn);

      if (allMoves.length === 0) {
        this.engine.gameOver = true;
        this.engine.winner = currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
        this.engine.winReason = `Player ${currentTurn === PLAYER_1 ? 1 : 2} has no legal moves (Locked)!`;
        if (this.timer) this.timer.stop();
        this.handleGameOver({
          winner: this.engine.winner,
          winReason: this.engine.winReason
        });
        return;
      }

      const pieceMoves = allMoves.filter(m => m.from.r === r && m.from.c === c);

      if (pieceMoves.length === 0) {
        const hasAnyCaptures = allMoves.some(m => m.isCapture);
        if (hasAnyCaptures) {
          sound.playError();
          this.setBannerNotice('Compulsory Capture! You must move a piece that can capture.', true);
          this.setCommentary('mandatory');
        } else {
          sound.playError();
          this.setBannerNotice('This piece has no legal moves.');
        }
        return;
      }

      this.selectedPieceSquare = { r, c };
      this.validMovesForSelected = pieceMoves;
      this.renderPieces();
      return;
    }

    this.selectedPieceSquare = null;
    this.validMovesForSelected = [];
    this.renderPieces();
  }

  executePlayerMove(move) {
    this.saveState();

    // Start timer on first move
    if (!this.timer.isRunning) {
      this.timer.start(this.engine.currentTurn);
    }

    const res = this.engine.makeMove(move);

    if (!res.success) {
      sound.playError();
      return;
    }

    // Mobile tactile haptics on capture / promotion
    if (res.isCapture && 'vibrate' in navigator) {
      try { navigator.vibrate([35, 15, 35]); } catch (e) {}
    } else if (res.justPromoted && 'vibrate' in navigator) {
      try { navigator.vibrate([60, 25, 80]); } catch (e) {}
    }

    if (res.justPromoted) {
      sound.playKing();
      this.setCommentary('king');
    } else if (res.isCapture) {
      // Check if this capture was part of a tactical trap or multi-jump
      const isMultiJump = !res.turnEnded || (this.engine.moveHistory.length > 1 && this.engine.moveHistory[this.engine.moveHistory.length - 2]?.isCapture);
      const isKingCaptured = res.capturedPiece && res.capturedPiece.isKing;

      if (isMultiJump || isKingCaptured || this.gameMode === 'traps') {
        sound.playTrap();
        this.setCommentary('trap');
      } else {
        sound.playCapture();
        this.setCommentary('capture');
      }
    } else {
      sound.playMove();
      this.setCommentary('general');
    }

    if (!res.turnEnded) {
      this.selectedPieceSquare = { r: move.to.r, c: move.to.c };
      this.validMovesForSelected = this.engine.getAllLegalMoves();
      this.setBannerNotice('Multi-jump available! Continue chopping!');
    } else {
      this.selectedPieceSquare = null;
      this.validMovesForSelected = [];
      // Switch active timer to next player with Fischer increment applied to mover
      const prevPlayer = this.engine.currentTurn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
      this.timer.switchTurn(this.engine.currentTurn, prevPlayer);
    }

    // Smooth piece slide animation
    const fromSq = document.getElementById(`sq-${move.from.r}-${move.from.c}`);
    const toSq = document.getElementById(`sq-${move.to.r}-${move.to.c}`);
    const pieceEl = fromSq ? fromSq.querySelector('.piece') : null;

    const commitAndRender = () => {
      this.renderPieces();
      this.updateUI();

      if (this.gameMode === 'room_online') {
        this.sendRoomMove(res);
      }

      if (res.gameOver) {
        this.timer.stop();
        this.handleGameOver(res);
        return;
      }

      if (res.turnEnded) {
        if (this.gameMode === 'pve' && this.engine.currentTurn === PLAYER_2) {
          this.scheduleAIMove();
        } else if (this.gameMode === 'eve') {
          this.scheduleAIMove();
        }
      }
    };

    if (pieceEl && toSq) {
      const fromRect = fromSq.getBoundingClientRect();
      const toRect = toSq.getBoundingClientRect();
      const dx = toRect.left - fromRect.left;
      const dy = toRect.top - fromRect.top;

      pieceEl.classList.add('sliding');
      pieceEl.style.transform = `translate(${dx}px, ${dy}px)`;
      setTimeout(() => {
        commitAndRender();
      }, 140);
    } else {
      commitAndRender();
    }
  }

  async scheduleAIMove() {
    if (this.engine.gameOver || this.isAIThinking) return;
    this.isAIThinking = true;

    // Show telemetry HUD
    if (this.dom.engineTelemetryPanel && this.gameMode !== 'pvp') {
      this.dom.engineTelemetryPanel.classList.remove('hidden');
    }
    if (this.dom.engineThinkingBar) {
      this.dom.engineThinkingBar.style.display = 'block';
    }
    if (this.dom.enginePulseDot) {
      this.dom.enginePulseDot.classList.add('thinking');
    }

    const mover = this.engine.currentTurn;
    const aiName = mover === PLAYER_2 ? (this.dom.p2Name?.textContent || 'AI') : (this.dom.p1Name?.textContent || 'AI 1');
    this.setBannerNotice(`${aiName} is calculating optimal line...`, false);

    const clockTime = (this.timer && this.timer.timeLeft) ? (this.timer.timeLeft[mover] || 300) : 300;
    const increment = (this.timer && this.timer.increment) ? this.timer.increment : 0;

    const minDelay = this.aiDifficulty === 'beginner' ? 300 : (this.aiDifficulty === 'intermediate' ? 450 : 250);
    const minDelayPromise = new Promise(r => setTimeout(r, minDelay));

    const currentEngineInstance = this.engine;
    const moveTurnNumber = this.engine.moveHistory.length;

    try {
      const [searchResult] = await Promise.all([
        this.ai.getBestMoveAsync(
          this.engine,
          mover,
          clockTime,
          increment,
          (telemetry) => this.updateEngineTelemetry(telemetry)
        ),
        minDelayPromise
      ]);

      if (this.dom.engineThinkingBar) {
        this.dom.engineThinkingBar.style.display = 'none';
      }
      if (this.dom.enginePulseDot) {
        this.dom.enginePulseDot.classList.remove('thinking');
      }

      // Concurrency guard: abort if engine was restarted, undone, or superseded during await
      if (this.engine !== currentEngineInstance || this.engine.moveHistory.length !== moveTurnNumber || this.engine.gameOver) {
        this.isAIThinking = false;
        return;
      }

      if (this.engine.gameOver) {
        this.isAIThinking = false;
        this.timer?.stop();
        this.handleGameOver({
          winner: this.engine.winner,
          winReason: this.engine.winReason
        });
        return;
      }

      const aiMove = searchResult?.move || searchResult;

      if (!aiMove) {
        this.isAIThinking = false;
        this.engine.checkEndGame();
        this.updateUI();
        if (this.engine.gameOver) {
          this.timer?.stop();
          this.handleGameOver({
            winner: this.engine.winner,
            winReason: this.engine.winReason
          });
        }
        return;
      }

      const res = this.engine.makeMove(aiMove);

      if (res.justPromoted) {
        sound.playKing();
        this.setCommentary('king');
      } else if (res.isCapture) {
        sound.playCapture();
        this.setCommentary('capture');
      } else {
        sound.playMove();
      }

      this.renderPieces();
      this.updateUI();

      if (res.gameOver) {
        this.isAIThinking = false;
        this.timer?.stop();
        this.handleGameOver(res);
        return;
      }

      if (!res.turnEnded) {
        // Multi-jump continues
        this.isAIThinking = false;
        setTimeout(() => this.scheduleAIMove(), 250);
      } else {
        this.isAIThinking = false;
        const prevPlayer = mover;
        this.timer.switchTurn(this.engine.currentTurn, prevPlayer);

        // Check if next player has any legal moves available
        const nextMoves = this.engine.getAllLegalMoves(this.engine.currentTurn);
        if (nextMoves.length === 0 && !this.engine.gameOver) {
          this.engine.gameOver = true;
          this.engine.winner = prevPlayer;
          this.engine.winReason = `Player ${this.engine.currentTurn === PLAYER_1 ? 1 : 2} has no legal moves (Locked)!`;
          this.timer?.stop();
          this.handleGameOver({
            winner: this.engine.winner,
            winReason: this.engine.winReason
          });
          return;
        }

        if (this.gameMode === 'eve') {
          setTimeout(() => this.scheduleAIMove(), 350);
        } else {
          // Trigger Premove if queued by player
          this.tryExecutePremove();
        }
      }
    } catch (err) {
      console.error('Error during AI calculation:', err);
      this.isAIThinking = false;
      if (this.dom.engineThinkingBar) this.dom.engineThinkingBar.style.display = 'none';
      if (this.dom.enginePulseDot) this.dom.enginePulseDot.classList.remove('thinking');

      // Safe fallback
      const fallback = this.ai.getBestMove(this.engine, mover);
      if (fallback) {
        const res = this.engine.makeMove(fallback);
        this.renderPieces();
        this.updateUI();
        this.tryExecutePremove();
      }
        if (res.gameOver) {
          this.timer?.stop();
          this.handleGameOver(res);
          return;
        }
        if (!res.turnEnded) {
          setTimeout(() => this.scheduleAIMove(), 250);
        } else {
          this.timer.switchTurn(this.engine.currentTurn, mover);
          const nextMoves = this.engine.getAllLegalMoves(this.engine.currentTurn);
          if (nextMoves.length === 0 && !this.engine.gameOver) {
            this.engine.gameOver = true;
            this.engine.winner = mover;
            this.engine.winReason = `Player ${this.engine.currentTurn === PLAYER_1 ? 1 : 2} has no legal moves (Locked)!`;
            this.timer?.stop();
            this.handleGameOver({ winner: this.engine.winner, winReason: this.engine.winReason });
            return;
          }
          if (this.gameMode === 'eve') {
            setTimeout(() => this.scheduleAIMove(), 350);
          }
        }
      } else {
        this.engine.checkEndGame();
        if (this.engine.gameOver) {
          this.timer?.stop();
          this.handleGameOver({ winner: this.engine.winner, winReason: this.engine.winReason });
        }
      }
    }
  }

  updateEngineTelemetry(telemetry) {
    if (!telemetry) return;

    if (this.dom.engineStatRuleset && telemetry.ruleset) {
      this.dom.engineStatRuleset.textContent = telemetry.ruleset;
    }

    if (this.dom.engineStatDepth && telemetry.depth !== undefined) {
      const sel = telemetry.seldepth || telemetry.depth;
      this.dom.engineStatDepth.textContent = `${telemetry.depth} / ${sel}`;
    }

    if (this.dom.engineStatNodes && telemetry.nodes !== undefined) {
      if (telemetry.nodes >= 1000000) {
        this.dom.engineStatNodes.textContent = (telemetry.nodes / 1000000).toFixed(2) + 'M';
      } else if (telemetry.nodes >= 1000) {
        this.dom.engineStatNodes.textContent = (telemetry.nodes / 1000).toFixed(1) + 'k';
      } else {
        this.dom.engineStatNodes.textContent = String(telemetry.nodes);
      }
    }

    if (this.dom.engineStatNps && telemetry.nps !== undefined) {
      if (telemetry.nps >= 1000000) {
        this.dom.engineStatNps.textContent = (telemetry.nps / 1000000).toFixed(2) + 'M/s';
      } else if (telemetry.nps >= 1000) {
        this.dom.engineStatNps.textContent = (telemetry.nps / 1000).toFixed(1) + 'k/s';
      } else {
        this.dom.engineStatNps.textContent = `${telemetry.nps || 0}/s`;
      }
    }

    if (this.dom.engineStatTt) {
      if (telemetry.ttHitRate !== undefined && telemetry.ttHitRate !== null) {
        this.dom.engineStatTt.textContent = `${Math.round(telemetry.ttHitRate * 100)}%`;
      } else if (telemetry.ttHits !== undefined) {
        this.dom.engineStatTt.textContent = String(telemetry.ttHits);
      }
    }

    if (this.dom.engineEvalBadge && telemetry.score !== undefined) {
      let scoreNum = 0;
      let badgeText = '';
      if (typeof telemetry.score === 'string') {
        badgeText = telemetry.score;
        scoreNum = telemetry.score.includes('-') ? -999 : 999;
      } else {
        scoreNum = telemetry.score;
        const pawns = (scoreNum / 100).toFixed(2);
        badgeText = (scoreNum > 0 ? '+' : '') + pawns;
      }
      this.dom.engineEvalBadge.textContent = badgeText;
      this.dom.engineEvalBadge.classList.remove('eval-p1', 'eval-p2', 'eval-neutral');
      if (scoreNum > 60) {
        this.dom.engineEvalBadge.classList.add('eval-p2');
      } else if (scoreNum < -60) {
        this.dom.engineEvalBadge.classList.add('eval-p1');
      } else {
        this.dom.engineEvalBadge.classList.add('eval-neutral');
      }
    }

    if (this.dom.enginePvLine && telemetry.pv) {
      let pvStr = '';
      if (Array.isArray(telemetry.pv)) {
        pvStr = telemetry.pv.slice(0, 6).map(m => {
          if (typeof m === 'string') return m;
          if (m && m.from !== undefined && m.to !== undefined) {
            if (typeof m.from === 'number') {
              return `${m.from}-${m.to}`;
            }
            if (m.from.sq) {
              return `${m.from.sq}-${m.to.sq}`;
            }
            const fSq = m.from.r * 5 + Math.floor(m.from.c / 2) + 1;
            const tSq = m.to.r * 5 + Math.floor(m.to.c / 2) + 1;
            return `${fSq}-${tSq}`;
          }
          return '';
        }).filter(Boolean).join(' ');
      } else {
        pvStr = String(telemetry.pv);
      }
      if (pvStr) {
        this.dom.enginePvLine.textContent = pvStr;
      }
    }
  }

  updateUI() {
    const stats = this.engine.getStats();

    this.dom.p1SeedsCount.textContent = stats.p1.men;
    this.dom.p1KingsCount.textContent = stats.p1.kings;
    this.dom.p1Score.textContent = this.engine.capturedPieces[PLAYER_1].length;

    this.dom.p2SeedsCount.textContent = stats.p2.men;
    this.dom.p2KingsCount.textContent = stats.p2.kings;
    this.dom.p2Score.textContent = this.engine.capturedPieces[PLAYER_2].length;

    if (this.engine.gameOver) {
      // Deactivate active indicators and clocks
      this.dom.p1Indicator.classList.remove('active');
      this.dom.p2Indicator.classList.remove('active');
      if (this.dom.p1Clock) this.dom.p1Clock.classList.remove('active');
      if (this.dom.p2Clock) this.dom.p2Clock.classList.remove('active');

      const isWinnerP1 = this.engine.winner === PLAYER_1;
      const isDrawGame = this.engine.winner === 'draw';
      let bannerMsg = '';
      let bannerVariant = 'normal';

      if (isDrawGame) {
        bannerMsg = `🏁 GAME OVER: Stalemate! ${this.engine.winReason || 'Game drawn.'}`;
        bannerVariant = 'normal';
      } else if (isWinnerP1) {
        const p1Title = this.currentUser ? this.currentUser.username : 'Player 1';
        bannerMsg = `🏆 GAME OVER: Victory! ${p1Title} won the match! ${this.engine.winReason || ''}`;
        bannerVariant = 'victory';
      } else {
        const oppTitle = this.gameMode === 'pve' ? 'Grandmaster Engine' : 'Player 2';
        bannerMsg = `💀 GAME OVER: ${oppTitle} Wins! ${this.engine.winReason || 'All opponent seeds captured or locked.'}`;
        bannerVariant = 'gameover';
      }
      this.setBannerNotice(bannerMsg, bannerVariant);
    } else {
      const isP1 = stats.currentTurn === PLAYER_1;
      this.dom.p1Indicator.classList.toggle('active', isP1);
      this.dom.p2Indicator.classList.toggle('active', !isP1);

      if (this.dom.p1Clock) this.dom.p1Clock.classList.toggle('active', isP1);
      if (this.dom.p2Clock) this.dom.p2Clock.classList.toggle('active', !isP1);

      if (!this.isAIThinking) {
        const playerStr = isP1 ? 'White (Player 1)' : 'Dark (Player 2)';
        const captures = this.engine.getAllLegalMoves().filter(m => m.isCapture);
        if (captures.length > 0) {
          this.setBannerNotice(`⚠️ ${playerStr} MUST CHOP! Mandatory capture in play.`, 'warning');
        } else {
          this.setBannerNotice(`${playerStr} to move.`);
        }
      }
    }

    this.updateEvaluationBar(stats);
    this.evaluateTrapRadar();
  }

  evaluateTrapRadar() {
    const radarBtn = this.dom.btnToggleTrapRadar || document.getElementById('btn-toggle-trap-radar');
    if (!radarBtn) return;

    if (!this.isTrapRadarActive) {
      radarBtn.classList.remove('btn-trap-radar-active');
      radarBtn.innerHTML = '⚡ Trap Radar';
      return;
    }

    radarBtn.classList.add('btn-trap-radar-active');

    if (this.engine.gameOver) {
      radarBtn.innerHTML = '⚡ Radar: Idle';
      return;
    }

    const legalMoves = this.engine.getAllLegalMoves(this.engine.currentTurn);
    const multiJumps = legalMoves.filter(m => m.isCapture && (m.totalChainLength >= 2 || !m.turnEnded));

    if (multiJumps.length > 0) {
      radarBtn.innerHTML = '🪤 TRAP ACTIVE!';
      this.setBannerNotice(`⚡ TRAP OPPORTUNITY DETECTED! ${multiJumps.length} multi-capture combination(s) available on the board!`, 'warning');
      multiJumps.forEach(m => {
        const sq = document.getElementById(`sq-${m.from.r}-${m.from.c}`);
        if (sq) sq.classList.add('trap-hint-pulse');
      });
    } else {
      radarBtn.innerHTML = '⚡ Radar: Active';
    }

    this.renderCapturedTray(this.dom.p1CapturedTray, this.engine.capturedPieces[PLAYER_1], 2);
    this.renderCapturedTray(this.dom.p2CapturedTray, this.engine.capturedPieces[PLAYER_2], 1);

    this.renderMoveHistory();

    if (this.dom.engineTelemetryPanel) {
      if (this.gameMode === 'pvp') {
        this.dom.engineTelemetryPanel.classList.add('hidden');
      } else {
        this.dom.engineTelemetryPanel.classList.remove('hidden');
      }
    }
  }

  renderCapturedTray(container, pieces, opponentPlayer) {
    container.innerHTML = '';
    for (const p of pieces) {
      const dot = document.createElement('span');
      dot.className = `mini-captured-piece mini-p${opponentPlayer} ${p.isKing ? 'mini-king' : ''}`;
      dot.title = p.isKing ? 'Captured Flying King' : 'Captured Seed';
      container.appendChild(dot);
    }
  }

  renderMoveHistory() {
    const moves = this.engine.moveHistory;
    this.dom.moveCountBadge.textContent = `${moves.length} moves`;

    if (moves.length === 0) {
      this.dom.moveHistoryList.innerHTML = '<div class="history-empty">No moves yet. Make your opening move!</div>';
      return;
    }

    this.dom.moveHistoryList.innerHTML = '';
    moves.slice(-15).forEach((m, idx) => {
      const item = document.createElement('div');
      item.className = `history-item ${m.isCapture ? 'is-capture' : ''}`;

      const fromCoord = `${String.fromCharCode(65 + m.from.c)}${this.boardSize - m.from.r}`;
      const toCoord = `${String.fromCharCode(65 + m.to.c)}${this.boardSize - m.to.r}`;
      const symbol = m.isCapture ? 'x' : '-';
      const crown = m.promoted ? ' 👑' : '';
      const pName = m.player === PLAYER_1 ? 'P1' : 'P2';

      item.innerHTML = `<span>#${idx + 1} <strong>${pName}</strong></span> <span>${fromCoord} ${symbol} ${toCoord}${crown}</span>`;
      this.dom.moveHistoryList.appendChild(item);
    });

    this.dom.moveHistoryList.scrollTop = this.dom.moveHistoryList.scrollHeight;
  }

  setBannerNotice(text, variant = 'normal') {
    this.dom.bannerText.textContent = text;
    this.dom.statusBanner.classList.remove('alert-warning', 'alert-victory', 'alert-gameover');
    if (variant === true || variant === 'warning') {
      this.dom.statusBanner.classList.add('alert-warning');
    } else if (variant === 'victory') {
      this.dom.statusBanner.classList.add('alert-victory');
    } else if (variant === 'gameover' || variant === 'defeat') {
      this.dom.statusBanner.classList.add('alert-gameover');
    }
  }

  setCommentary(category) {
    const list = this.commentaryMap[category] || this.commentaryMap.general;
    const quote = list[Math.floor(Math.random() * list.length)];
    this.dom.commentaryTicker.textContent = quote;
  }

  handleGameOver(res) {
    if (this.timer) {
      this.timer.stop();
    }
    this.isAIThinking = false;

    // Enforce 2nd player find draw condition
    if (res.winner === 'draw' && this.engine.modifications === 'draw_odds_p2') {
      res.winner = PLAYER_2;
      res.winReason = 'Player 2 wins on Draw Odds (Nigerian Draughts rule)!';
    }

    this.engine.gameOver = true;
    this.engine.winner = res.winner;
    this.engine.winReason = res.winReason;

    const isP1 = res.winner === PLAYER_1;
    const isDraw = res.winner === 'draw';
    const isPvE = this.gameMode === 'pve';

    // 1. Audio Feedback
    if (isP1) {
      sound.playWin();
    } else if (isDraw) {
      sound.playMove();
    } else {
      sound.playError();
    }

    // 2. Clear Active Clocks & Player Turn Highlights
    if (this.dom.p1Indicator) this.dom.p1Indicator.classList.remove('active');
    if (this.dom.p2Indicator) this.dom.p2Indicator.classList.remove('active');
    if (this.dom.p1Clock) this.dom.p1Clock.classList.remove('active');
    if (this.dom.p2Clock) this.dom.p2Clock.classList.remove('active');

    // 3. Engine Thinking Indicators
    if (this.dom.engineThinkingBar) this.dom.engineThinkingBar.style.display = 'none';
    if (this.dom.enginePulseDot) this.dom.enginePulseDot.classList.remove('thinking');

    // 4. Status Banner Feedback
    let bannerMsg = '';
    let bannerVariant = 'normal';
    if (isDraw) {
      bannerMsg = `🏁 GAME OVER: Stalemate! ${res.winReason || 'Game ended in a draw.'}`;
      bannerVariant = 'normal';
    } else if (isP1) {
      const p1Title = this.currentUser ? this.currentUser.username : 'Player 1';
      bannerMsg = `🏆 GAME OVER: Victory! ${p1Title} won the match! ${res.winReason || ''}`;
      bannerVariant = 'victory';
    } else {
      const oppTitle = isPvE ? 'Grandmaster Engine' : 'Player 2';
      bannerMsg = `💀 GAME OVER: ${oppTitle} Wins! ${res.winReason || 'All opponent seeds captured or locked.'}`;
      bannerVariant = 'gameover';
    }
    this.setBannerNotice(bannerMsg, bannerVariant);

    // 5. Street Commentary Announcement
    if (this.dom.commentaryTicker) {
      if (isDraw) {
        this.setCommentary('draw');
      } else if (isP1) {
        this.setCommentary('win');
      } else {
        this.setCommentary('defeat');
      }
    }

    // 6. Engine Telemetry HUD Game Over Evaluation
    if (this.dom.enginePvLine) {
      this.dom.enginePvLine.textContent = isDraw
        ? 'Game Over: Draw (Dead drawn position)'
        : (isP1 ? 'Game Over: Player 1 Won (-M0)' : 'Game Over: Grandmaster Won (+M0)');
    }
    if (this.dom.engineEvalBadge) {
      this.dom.engineEvalBadge.textContent = isDraw ? '0.00' : (isP1 ? '-M0' : '+M0');
      this.dom.engineEvalBadge.className = `engine-eval-badge ${isDraw ? 'eval-neutral' : (isP1 ? 'negative' : 'positive')}`;
    }

    // 7. Modal Presentation (Victory vs Defeat vs Stalemate)
    if (isDraw) {
      if (this.dom.winnerTrophyIcon) this.dom.winnerTrophyIcon.textContent = '🤝';
      this.dom.gameOverTitle.textContent = 'STALEMATE!';
      this.dom.gameOverTitle.style.color = '#94a3b8';
      this.dom.gameOverSub.textContent = res.winReason || 'Game ended in a draw!';
    } else if (isP1) {
      if (this.dom.winnerTrophyIcon) this.dom.winnerTrophyIcon.textContent = '🏆';
      this.dom.gameOverTitle.textContent = 'VICTORY!';
      this.dom.gameOverTitle.style.color = '#22c55e';
      const winnerName = this.currentUser ? this.currentUser.username : 'PLAYER 1 (YOU)';
      this.dom.gameOverSub.textContent = `${winnerName} WINS! ${res.winReason || ''}`;
    } else {
      if (this.dom.winnerTrophyIcon) this.dom.winnerTrophyIcon.textContent = isPvE ? '🤖' : '💀';
      this.dom.gameOverTitle.textContent = isPvE ? 'DEFEAT!' : 'GAME OVER!';
      this.dom.gameOverTitle.style.color = '#ef4444';
      const winnerName = isPvE ? 'GRANDMASTER ENGINE' : 'PLAYER 2';
      this.dom.gameOverSub.textContent = `${winnerName} WINS! ${res.winReason || ''}`;
    }

    this.dom.goMovesCount.textContent = this.engine.moveHistory.length;
    this.dom.goP1Chopped.textContent = this.engine.capturedPieces[PLAYER_1].length;
    this.dom.goP2Chopped.textContent = this.engine.capturedPieces[PLAYER_2].length;

    // Build completed match object for replay & automated accuracy review
    const currentMatch = {
      player1_name: this.currentUser ? this.currentUser.username : 'Player 1',
      player2_name: isPvE ? `Grandmaster Engine (${this.aiDifficulty})` : (this.dom.p2Name?.textContent || 'Player 2'),
      board_size: this.boardSize,
      rule_mode: this.ruleMode,
      move_history: [...this.engine.moveHistory],
      result: res.winner === PLAYER_1 ? 'p1_won' : (res.winner === PLAYER_2 ? 'p2_won' : 'draw')
    };
    this.lastCompletedMatch = currentMatch;

    if (this.replayController) {
      try {
        this.replayController.loadMatch(currentMatch);
        const summary = this.replayController.analysisSummary;
        if (summary) {
          if (this.dom.goP1Accuracy) this.dom.goP1Accuracy.textContent = `${summary.p1Accuracy}%`;
          if (this.dom.goP2Accuracy) this.dom.goP2Accuracy.textContent = `${summary.p2Accuracy}%`;
          if (this.dom.goBestCount) this.dom.goBestCount.textContent = summary.best;
          if (this.dom.goInaccCount) this.dom.goInaccCount.textContent = summary.inaccuracy;
          if (this.dom.goMistakeCount) this.dom.goMistakeCount.textContent = summary.mistake;
          if (this.dom.goBlunderCount) this.dom.goBlunderCount.textContent = summary.blunder;
        }
      } catch (err) {
        console.warn('Replay accuracy analysis error:', err);
      }
    }

    this.openModal(this.dom.gameOverModal);

    // Save match with move history for replay
    this.saveMatchToBackend(res);
  }

  async saveMatchToBackend(res) {
    try {
      let result = 'in_progress';
      if (res.winner === PLAYER_1) result = 'p1_won';
      else if (res.winner === PLAYER_2) result = 'p2_won';
      else if (res.winner === 'draw') result = 'draw';

      const payload = {
        action: 'save_match',
        game_mode: this.gameMode,
        ai_difficulty: this.aiDifficulty,
        board_size: this.boardSize,
        rule_mode: this.ruleMode,
        time_control: this.timeControl,
        result,
        win_reason: res.winReason || '',
        moves_count: this.engine.moveHistory.length,
        p1_chopped: this.engine.capturedPieces[PLAYER_1].length,
        p2_chopped: this.engine.capturedPieces[PLAYER_2].length,
        player2_name: this.dom.p2Name.textContent,
        move_history_json: this.engine.moveHistory
      };

      const response = await fetch('api/matches.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.success && data.user) {
        this.currentUser = data.user;
        this.renderAuthSection();
        this.updatePlayerLabels();
      }
    } catch (err) {}
  }

  // ================= ONLINE ROOM MULTIPLAYER ================= //

  initOnlineRoomMode(roomCode, playerRole) {
    this.gameMode = 'room_online';
    this.onlineRoomCode = roomCode;
    this.onlinePlayerRole = playerRole;
    this.timer?.stop?.();

    if (this.dom.onlineRoomBanner) {
      this.dom.onlineRoomBanner.style.display = 'flex';
      if (this.dom.roomCodeDisplay) this.dom.roomCodeDisplay.textContent = roomCode;
    }

    // Flip board if Dark player
    if (this.onlinePlayerRole === 'p2' && !this.isBoardFlipped) {
      this.toggleBoardFlip();
    }

    this.setBannerNotice(`Online Room ${roomCode}. Connecting to game...`);

    // Start polling
    this.pollOnlineRoom();
    if (this.onlinePollingInterval) clearInterval(this.onlinePollingInterval);
    this.onlinePollingInterval = setInterval(() => this.pollOnlineRoom(), 1200);
  }

  async pollOnlineRoom() {
    if (!this.onlineRoomCode || this.gameMode !== 'room_online') return;

    try {
      const t0 = performance.now();
      const res = await fetch(`api/rooms.php?action=get_state&room_code=${encodeURIComponent(this.onlineRoomCode)}`);
      const pingMs = Math.max(10, Math.round(performance.now() - t0));
      this.updatePingIndicator(pingMs);
      const data = await res.json();
      if (!data.success || !data.room) return;

      const room = data.room;

      // Apply room theme, rules, and handicap if available
      if (room.board_type && !this._appliedOnlineTheme) {
        this.setBoardTheme(room.board_type);
        this._appliedOnlineTheme = true;
      }
      if (room.rule_type || room.rule_mode) {
        const rawRule = (room.rule_type || room.rule_mode || '').toLowerCase().trim();
        const normRule = (rawRule === 'international' || rawRule === 'tournament' || rawRule === 'fmjd')
          ? 'international'
          : ((rawRule === 'ghana' || rawRule === 'damii') ? 'ghana' : 'nigeria');
        if (this.ruleMode !== normRule) {
          this.ruleMode = normRule;
          this.engine.ruleMode = normRule;
          this.engine.ruleType = normRule;
          this.updateHighwayIndicators();
        }
      }
      if (room.p1_short && !this._appliedOnlineHandicap) {
        this.engine.p1Short = parseInt(room.p1_short, 10) || 0;
        this._appliedOnlineHandicap = true;
      }
      if (room.modifications) {
        this.engine.modifications = room.modifications;
      }
      if (room.settings_json && !this._appliedOnlineSettings) {
        try {
          const stg = typeof room.settings_json === 'string' ? JSON.parse(room.settings_json) : room.settings_json;
          if (stg.undo_allowed === false && this.dom.btnUndo) {
            this.dom.btnUndo.style.display = 'none';
          }
          if (stg.disable_chat && document.getElementById('nav-chat')) {
            document.getElementById('nav-chat').style.display = 'none';
            const chatDock = document.getElementById('street-chat-dock');
            if (chatDock) chatDock.style.display = 'none';
          }
          if (stg.sound_on === false) {
            sound.muted = true;
            this.updateSoundIcon();
          }
          if (stg.highlight_moves !== undefined) {
            this.highlightMoves = !!stg.highlight_moves;
          }
        } catch(e){}
        this._appliedOnlineSettings = true;
      }
      if (room.host_name) {
        this.dom.p1Name.textContent = room.host_name;
        this.dom.p1Role.textContent = this.onlinePlayerRole === 'p1' ? 'Player 1 (You - White)' : 'Player 1 (Host - White)';
      }
      if (room.guest_name) {
        this.dom.p2Name.textContent = room.guest_name;
        this.dom.p2Role.textContent = this.onlinePlayerRole === 'p2' ? 'Player 2 (You - Dark)' : 'Player 2 (Guest - Dark)';
      }

      // Update clocks
      if (this.dom.p1Clock && room.p1_time_left !== null) {
        const m = Math.floor(room.p1_time_left / 60);
        const s = room.p1_time_left % 60;
        this.dom.p1Clock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        this.dom.p1Clock.classList.toggle('urgent', room.p1_time_left <= 30);
      }
      if (this.dom.p2Clock && room.p2_time_left !== null) {
        const m = Math.floor(room.p2_time_left / 60);
        const s = room.p2_time_left % 60;
        this.dom.p2Clock.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        this.dom.p2Clock.classList.toggle('urgent', room.p2_time_left <= 30);
      }

      // Update room banner status
      if (this.dom.roomStatusDisplay) {
        if (room.status === 'waiting') {
          this.dom.roomStatusDisplay.textContent = '⏳ Waiting for opponent to join code ' + room.room_code;
          this.setBannerNotice(`Share room code ${room.room_code} with a friend to begin.`);
        } else if (room.status === 'active') {
          const isMyTurn = (this.onlinePlayerRole === 'p1' && parseInt(room.current_turn, 10) === 1) ||
                           (this.onlinePlayerRole === 'p2' && parseInt(room.current_turn, 10) === 2);
          if (isMyTurn) {
            this.dom.roomStatusDisplay.textContent = '🟢 Your Turn! Make your move.';
            this.setBannerNotice('🟢 Your Turn! Select a piece to move or chop.');
          } else {
            this.dom.roomStatusDisplay.textContent = '⏳ Opponent is calculating move...';
            this.setBannerNotice("Opponent's turn. Awaiting their move...");
          }
        } else if (room.status === 'finished') {
          this.dom.roomStatusDisplay.textContent = `🏁 Match Concluded: ${room.win_reason || 'Game over'}`;
          if (!this.engine.gameOver) {
            this.engine.gameOver = true;
            this.engine.winner = room.result === 'p1_won' ? PLAYER_1 : (room.result === 'p2_won' ? PLAYER_2 : 'draw');
            this.handleGameOver({
              winner: this.engine.winner,
              winReason: room.win_reason || 'Match ended.'
            });
          }
          if (this.onlinePollingInterval) {
            clearInterval(this.onlinePollingInterval);
            this.onlinePollingInterval = null;
          }
        }
      }

      // Check if new move was played by opponent
      if (room.move_history_json) {
        const remoteMoves = JSON.parse(room.move_history_json);
        if (Array.isArray(remoteMoves) && remoteMoves.length > this.engine.moveHistory.length) {
          if (room.board_state_json) {
            this.engine.board = JSON.parse(room.board_state_json);
          }
          this.engine.moveHistory = remoteMoves;
          this.engine.currentTurn = parseInt(room.current_turn, 10);
          sound.playMove();
          this.renderPieces();
          this.updateUI();
          this.tryExecutePremove();
        }
      }
    } catch (err) {}
  }

  async sendRoomMove(res) {
    if (!this.onlineRoomCode || this.gameMode !== 'room_online') return;

    try {
      const isGameOver = res.gameOver || this.engine.gameOver;
      const winnerRole = this.engine.winner === PLAYER_1 ? 'p1' : (this.engine.winner === PLAYER_2 ? 'p2' : (this.engine.winner === 'draw' ? 'draw' : null));

      await fetch('api/rooms.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'make_move',
          room_code: this.onlineRoomCode,
          player_role: this.onlinePlayerRole,
          board_state_json: JSON.stringify(this.engine.board),
          move_history_json: JSON.stringify(this.engine.moveHistory),
          turn_ended: res.turnEnded !== false,
          is_game_over: isGameOver,
          winner_role: winnerRole,
          win_reason: res.winReason || this.engine.winReason || ''
        })
      });
    } catch (e) {}
  }

  copyRoomLink() {
    if (!this.onlineRoomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(this.onlineRoomCode)}&role=p2`;
    navigator.clipboard.writeText(url).then(() => {
      this.setBannerNotice('📋 Invite link copied to clipboard! Send to your opponent.', false);
    }).catch(() => {
      prompt('Copy this match invite link:', url);
    });
  }

  async resignOnlineRoom() {
    if (!this.onlineRoomCode) return;
    if (!confirm('Are you sure you want to surrender and resign this match?')) return;

    try {
      await fetch('api/rooms.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resign',
          room_code: this.onlineRoomCode,
          player_role: this.onlinePlayerRole
        })
      });
      this.setBannerNotice('You surrendered. Match ended.');
    } catch (e) {}
  }

  // ================= WORLD-CLASS COMPETITIVE SUITE HELPERS ================= //

  updateEvaluationBar(statsOrScore) {
    if (!this.dom.evalBarFill || !this.dom.evalBarScore) return;

    let evalCentipawns = 0;
    if (typeof statsOrScore === 'number') {
      evalCentipawns = statsOrScore;
    } else if (this.ai?.evaluateBoard && this.engine && !this.engine.gameOver) {
      evalCentipawns = this.ai.evaluateBoard(this.engine, PLAYER_1);
    } else if (statsOrScore && statsOrScore.p1 && statsOrScore.p2) {
      const p1Material = (statsOrScore.p1.men * 100) + (statsOrScore.p1.kings * 320);
      const p2Material = (statsOrScore.p2.men * 100) + (statsOrScore.p2.kings * 320);
      evalCentipawns = p1Material - p2Material;
    }

    // Map centipawns smoothly with sigmoid curve (-800 to +800 => 8% to 92%)
    const pct = Math.max(8, Math.min(92, Math.round(100 / (1 + Math.exp(-evalCentipawns / 350)))));
    this.dom.evalBarFill.style.height = `${pct}%`;

    const pawnsAdvantage = (Math.abs(evalCentipawns) / 100).toFixed(1);
    if (evalCentipawns > 25) {
      this.dom.evalBarScore.textContent = `+${pawnsAdvantage}`;
      this.dom.evalBarScore.classList.remove('black-lead');
    } else if (evalCentipawns < -25) {
      this.dom.evalBarScore.textContent = `-${pawnsAdvantage}`;
      this.dom.evalBarScore.classList.add('black-lead');
    } else {
      this.dom.evalBarScore.textContent = '0.0';
      this.dom.evalBarScore.classList.remove('black-lead');
    }
  }

  updatePingIndicator(pingMs) {
    this.lastPingMs = pingMs;
    if (this.dom.pingText) {
      this.dom.pingText.textContent = `${pingMs}ms`;
    }
    if (this.dom.pingIndicator) {
      this.dom.pingIndicator.classList.remove('warning', 'critical');
      if (pingMs > 260) {
        this.dom.pingIndicator.classList.add('critical');
      } else if (pingMs > 130) {
        this.dom.pingIndicator.classList.add('warning');
      }
    }
  }

  showToast(message, type = 'info') {
    const container = this.dom.toastContainer || document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => toast.remove(), 320);
    }, 3200);
  }

  shareMatchLink() {
    let shareUrl = window.location.href;
    if (this.onlineRoomCode) {
      shareUrl = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(this.onlineRoomCode)}&mode=spectator`;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.showToast('🔗 Match share link copied to clipboard! Send to friends on WhatsApp or Twitter.', 'success');
      }).catch(() => {
        prompt('Copy this match share link:', shareUrl);
      });
    } else {
      prompt('Copy this match share link:', shareUrl);
    }
  }

  copyPDNToClipboard() {
    const pdn = this.generatePDN();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pdn).then(() => {
        this.showToast('📋 Portable Draughts Notation (PDN) copied to clipboard!', 'success');
      }).catch(() => {
        prompt('Copy PDN Notation:', pdn);
      });
    } else {
      prompt('Copy PDN Notation:', pdn);
    }
  }

  generatePDN() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const p1 = this.dom.p1Name ? this.dom.p1Name.textContent.trim() : 'Player 1';
    const p2 = this.dom.p2Name ? this.dom.p2Name.textContent.trim() : 'Player 2';
    const rule = this.ruleMode.toUpperCase();

    let resultStr = '*';
    if (this.engine.gameOver) {
      if (this.engine.winner === PLAYER_1) resultStr = '1-0';
      else if (this.engine.winner === PLAYER_2) resultStr = '0-1';
      else if (this.engine.winner === 'draw') resultStr = '1/2-1/2';
    }

    let pdn = `[Event "Naija Draughts Arena Match"]\n`;
    pdn += `[Site "draughts.solaraccompany.com"]\n`;
    pdn += `[Date "${date}"]\n`;
    pdn += `[White "${p1}"]\n`;
    pdn += `[Black "${p2}"]\n`;
    pdn += `[Result "${resultStr}"]\n`;
    pdn += `[Ruleset "${rule}"]\n\n`;

    const moves = this.engine.moveHistory;
    let moveCount = 1;
    for (let i = 0; i < moves.length; i += 2) {
      const wMove = moves[i];
      const bMove = moves[i + 1];

      const formatMove = (m) => {
        if (!m) return '';
        const fSq = (m.from.r * 5) + Math.floor(m.from.c / 2) + 1;
        const tSq = (m.to.r * 5) + Math.floor(m.to.c / 2) + 1;
        const sep = m.isCapture ? 'x' : '-';
        return `${fSq}${sep}${tSq}`;
      };

      pdn += `${moveCount}. ${formatMove(wMove)} ${formatMove(bMove)} `.trim() + '\n';
      moveCount++;
    }

    if (resultStr !== '*') {
      pdn += ` ${resultStr}\n`;
    }

    return pdn.trim();
  }
}

// Global rulebook tab switcher helper
window.switchRuleModalTab = function(tab) {
  const tabs = ['nigeria', 'ghana', 'international'];
  const tabIds = {
    nigeria: 'tab-rule-nigeria',
    ghana: 'tab-rule-ghana',
    international: 'tab-rule-intl'
  };
  const panelIds = {
    nigeria: 'rule-panel-nigeria',
    ghana: 'rule-panel-ghana',
    international: 'rule-panel-international'
  };

  tabs.forEach(t => {
    const btn = document.getElementById(tabIds[t]);
    const pnl = document.getElementById(panelIds[t]);
    if (btn) btn.classList.toggle('active', t === tab);
    if (pnl) {
      if (t === tab) {
        pnl.classList.add('active');
        pnl.style.display = 'block';
      } else {
        pnl.classList.remove('active');
        pnl.style.display = 'none';
      }
    }
  });
};

// Global ruleset switch helper
window.switchRuleset = function(rule) {
  if (window.app && window.app.switchRuleset) {
    window.app.switchRuleset(rule);
  }
};

// Bootstrap game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new NigerianDraughtsApp();
});
