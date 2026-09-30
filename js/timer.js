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
    const p1Sec = this.initialSeconds + (this.initialSeconds > 0 ? this.p1Advantage : 0);
    const p2Sec = this.initialSeconds;
    this.timeLeft = {
      [PLAYER_1]: p1Sec,
      [PLAYER_2]: p2Sec
    };
    this.timeLeftMs = {
      [PLAYER_1]: p1Sec * 1000,
      [PLAYER_2]: p2Sec * 1000
    };

    this.activePlayer = null;
    this.intervalId = null;
    this.isRunning = false;
    this.lastTickTime = null;
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
    const p1Sec = this.initialSeconds + (this.initialSeconds > 0 ? this.p1Advantage : 0);
    const p2Sec = this.initialSeconds;
    this.timeLeft = {
      [PLAYER_1]: p1Sec,
      [PLAYER_2]: p2Sec
    };
    this.timeLeftMs = {
      [PLAYER_1]: p1Sec * 1000,
      [PLAYER_2]: p2Sec * 1000
    };
    this.activePlayer = null;
    this.lastTickTime = null;
    this.onTick(this.getTimeStrings(), this.timeLeft, null);
  }

  start(player = PLAYER_1) {
    if (this.isUntimed()) return;
    this.activePlayer = player;
    this.isRunning = true;
    this.lastTickTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    if (!this.timeLeftMs) {
      this.timeLeftMs = {
        [PLAYER_1]: (this.timeLeft[PLAYER_1] || 0) * 1000,
        [PLAYER_2]: (this.timeLeft[PLAYER_2] || 0) * 1000
      };
    }

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.isRunning || !this.activePlayer) return;

      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const elapsedMs = Math.max(0, now - this.lastTickTime);
      this.lastTickTime = now;

      if (elapsedMs > 0) {
        this.timeLeftMs[this.activePlayer] = Math.max(0, this.timeLeftMs[this.activePlayer] - elapsedMs);
        this.timeLeft[this.activePlayer] = Math.ceil(this.timeLeftMs[this.activePlayer] / 1000);

        this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);

        if (this.timeLeftMs[this.activePlayer] <= 0) {
          this.timeLeftMs[this.activePlayer] = 0;
          this.timeLeft[this.activePlayer] = 0;
          this.stop();
          this.onTimeout(this.activePlayer);
        }
      }
    }, 100);

    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);
  }

  switchTurn(newPlayer, prevPlayer = null) {
    if (this.isUntimed()) return;

    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

    // Deduct exact elapsed milliseconds spent by mover before switching
    const mover = prevPlayer || this.activePlayer;
    if (mover && this.lastTickTime) {
      const elapsedMs = Math.max(0, now - this.lastTickTime);
      if (this.timeLeftMs) {
        this.timeLeftMs[mover] = Math.max(0, this.timeLeftMs[mover] - elapsedMs);
        this.timeLeft[mover] = Math.ceil(this.timeLeftMs[mover] / 1000);
      }
    }

    // Apply Fischer increment to the player who just finished their move
    if (mover && this.increment > 0) {
      if (this.timeLeftMs) {
        this.timeLeftMs[mover] += this.increment * 1000;
        this.timeLeft[mover] = Math.ceil(this.timeLeftMs[mover] / 1000);
      } else {
        this.timeLeft[mover] = (this.timeLeft[mover] || 0) + this.increment;
      }
    }

    this.activePlayer = newPlayer;
    this.lastTickTime = now;
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);

    if (!this.isRunning) {
      this.start(newPlayer);
    }
  }

  applyIncrement(player) {
    if (this.isUntimed() || this.increment <= 0) return;
    if (this.timeLeftMs) {
      this.timeLeftMs[player] = (this.timeLeftMs[player] || 0) + (this.increment * 1000);
      this.timeLeft[player] = Math.ceil(this.timeLeftMs[player] / 1000);
    } else {
      this.timeLeft[player] = (this.timeLeft[player] || 0) + this.increment;
    }
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);
  }

  addTime(player, seconds = 15) {
    if (this.isUntimed()) return;
    if (this.timeLeftMs) {
      this.timeLeftMs[player] = (this.timeLeftMs[player] || 0) + (seconds * 1000);
      this.timeLeft[player] = Math.ceil(this.timeLeftMs[player] / 1000);
    } else {
      this.timeLeft[player] = (this.timeLeft[player] || 0) + seconds;
    }
    this.onTick(this.getTimeStrings(), this.timeLeft, this.activePlayer);
  }

  stop() {
    if (this.isRunning && this.activePlayer && this.lastTickTime) {
      const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
      const elapsedMs = Math.max(0, now - this.lastTickTime);
      if (this.timeLeftMs) {
        this.timeLeftMs[this.activePlayer] = Math.max(0, this.timeLeftMs[this.activePlayer] - elapsedMs);
        this.timeLeft[this.activePlayer] = Math.ceil(this.timeLeftMs[this.activePlayer] / 1000);
      }
    }
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.lastTickTime = null;
    this.onTick(this.getTimeStrings(), this.timeLeft, null);
  }

  isUntimed() {
    return this.preset === 'none' || this.preset === 'unlimited' || (this.initialSeconds <= 0 && this.timeLeft[PLAYER_1] <= 0 && this.timeLeft[PLAYER_2] <= 0);
  }

  formatTime(seconds) {
    if (this.isUntimed()) return '∞';
    const total = Math.max(0, parseInt(seconds, 10) || 0);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  getTimeStrings() {
    return {
      [PLAYER_1]: this.formatTime(this.timeLeft[PLAYER_1]),
      [PLAYER_2]: this.formatTime(this.timeLeft[PLAYER_2]),
      isP1Low: !this.isUntimed() && (this.timeLeft[PLAYER_1] <= 30) && (this.timeLeft[PLAYER_1] > 0),
      isP2Low: !this.isUntimed() && (this.timeLeft[PLAYER_2] <= 30) && (this.timeLeft[PLAYER_2] > 0)
    };
  }

  setTimeLeft(p1Sec, p2Sec) {
    const s1 = Math.max(0, parseInt(p1Sec, 10) || 0);
    const s2 = Math.max(0, parseInt(p2Sec, 10) || 0);
    this.timeLeft[PLAYER_1] = s1;
    this.timeLeft[PLAYER_2] = s2;
    this.timeLeftMs = {
      [PLAYER_1]: s1 * 1000,
      [PLAYER_2]: s2 * 1000
    };
    this.lastTickTime = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    this.onTick(this.getTimeStrings(), this.timeLeft, this.isRunning ? this.activePlayer : null);
  }
}
