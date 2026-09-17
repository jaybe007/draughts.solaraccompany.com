/**
 * Dual Draughts Clock Timer (Pro Edition)
 * Supports:
 * - Any minute presets (none, 1, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30 min)
 * - Fischer Time Increments (+1s, +3s, +5s)
 * - Time Advantages (+1m, +3m, +5m, +7m)
 */

import { PLAYER_1, PLAYER_2 } from './engine.js';

export class DraughtsTimer {
  constructor(options = {}) {
    this.preset = options.preset || 'rapid_5';
    this.increment = parseInt(options.increment || 0, 10);
    this.p1Advantage = parseInt(options.p1Advantage || 0, 10);
    this.onTimeout = options.onTimeout || (() => {});
    this.onTick = options.onTick || (() => {});

    this.initialSeconds = this.getInitialSeconds(this.preset);
    this.timeLeft = {
      [PLAYER_1]: this.initialSeconds + this.p1Advantage,
      [PLAYER_2]: this.initialSeconds
    };

    this.activePlayer = null;
    this.intervalId = null;
    this.isRunning = false;
  }

  getInitialSeconds(preset) {
    if (preset === 'none' || preset === 'unlimited') return 0;
    if (isFinite(preset) && parseInt(preset, 10) > 0) {
      return parseInt(preset, 10) * 60;
    }
    switch (preset) {
      case 'blitz_1': return 60;
      case 'blitz_3': return 180;
      case 'rapid_5': return 300;
      case 'classical_10': return 600;
      case 'classical_15': return 900;
      case 'classical_20': return 1200;
      case 'classical_30': return 1800;
      default:
        const parsed = parseInt(preset, 10);
        return isNaN(parsed) ? 300 : parsed * 60;
    }
  }

  setPreset(preset, increment = 0, p1Advantage = 0) {
    this.preset = preset;
    this.increment = parseInt(increment || 0, 10);
    this.p1Advantage = parseInt(p1Advantage || 0, 10);
    this.reset();
  }

  reset() {
    this.stop();
    this.initialSeconds = this.getInitialSeconds(this.preset);
    this.timeLeft = {
      [PLAYER_1]: this.initialSeconds + (this.initialSeconds > 0 ? this.p1Advantage : 0),
      [PLAYER_2]: this.initialSeconds
    };
    this.activePlayer = null;
    this.onTick(this.getTimeStrings(), this.timeLeft);
  }

  start(player = PLAYER_1) {
    if (this.isUntimed()) return;
    this.activePlayer = player;
    this.isRunning = true;
    this.lastTickTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.isRunning || !this.activePlayer) return;

      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const elapsedSec = Math.floor((now - this.lastTickTime) / 1000);
      if (elapsedSec >= 1) {
        this.timeLeft[this.activePlayer] = Math.max(0, this.timeLeft[this.activePlayer] - elapsedSec);
        this.lastTickTime += elapsedSec * 1000;

        this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);

        if (this.timeLeft[this.activePlayer] <= 0) {
          this.timeLeft[this.activePlayer] = 0;
          this.stop();
          this.onTimeout(this.activePlayer);
        }
      }
    }, 200);
  }

  switchTurn(newPlayer, prevPlayer = null) {
    if (this.isUntimed()) return;

    // Apply Fischer increment to the player who just finished their move
    if (prevPlayer && this.increment > 0) {
      this.timeLeft[prevPlayer] += this.increment;
    }

    this.activePlayer = newPlayer;
    this.lastTickTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);

    if (!this.isRunning) {
      this.start(newPlayer);
    }
  }

  applyIncrement(player) {
    if (this.isUntimed() || this.increment <= 0) return;
    this.timeLeft[player] += this.increment;
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);
  }

  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  isUntimed() {
    return this.preset === 'none' || this.preset === 'unlimited' || this.initialSeconds <= 0;
  }

  formatTime(seconds) {
    if (this.isUntimed()) return '∞';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getTimeStrings() {
    return {
      [PLAYER_1]: this.formatTime(this.timeLeft[PLAYER_1]),
      [PLAYER_2]: this.formatTime(this.timeLeft[PLAYER_2]),
    };
  }

  setTimeLeft(p1Sec, p2Sec) {
    this.timeLeft[PLAYER_1] = p1Sec;
    this.timeLeft[PLAYER_2] = p2Sec;
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);
  }
}
