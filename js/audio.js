/**
 * Procedural Web Audio Sound Generator for Nigerian Draughts
 * Creates tactile, authentic board sound effects without needing external mp3 files.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = (typeof window !== 'undefined' && window.localStorage)
      ? window.localStorage.getItem('draughts_muted') === 'true'
      : false;
    this.initAudioContext();
  }

  initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  ensureAudio() {
    if (!this.ctx) this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  get muted() {
    return this.isMuted;
  }

  set muted(val) {
    this.isMuted = Boolean(val);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('draughts_muted', this.isMuted);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('draughts_muted', this.isMuted);
    }
    return this.isMuted;
  }

  /**
   * Heavy wooden piece placement ("GBAM!")
   */
  playMove() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.08);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    // Noise burst for the wooden slap
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
    noise.start(t);
  }

  /**
   * Crisp piece capture sound ("CHOP!")
   */
  playCapture() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Two quick claps
    [0, 0.04].forEach((offset, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(280 + idx * 80, t + offset);
      osc.frequency.exponentialRampToValueAtTime(70, t + offset + 0.09);

      gain.gain.setValueAtTime(0.8, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + 0.1);
    });
  }

  /**
   * King coronation fanfare ("OGA AT THE TOP!")
   */
  playKing() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0, t + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.4, t + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.4);
    });
  }

  /**
   * Victory sound
   */
  playWin() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const melody = [
      { f: 392, d: 0.12 }, // G4
      { f: 523.25, d: 0.14 }, // C5
      { f: 659.25, d: 0.14 }, // E5
      { f: 783.99, d: 0.4 }  // G5
    ];

    let cursor = t;
    melody.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, cursor);

      // Lowpass filter to make it warmer
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, cursor);

      gain.gain.setValueAtTime(0.35, cursor);
      gain.gain.exponentialRampToValueAtTime(0.001, cursor + note.d);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(cursor);
      osc.stop(cursor + note.d + 0.05);

      cursor += note.d * 0.85;
    });
  }

  /**
   * Invalid move thump / loss sound
   */
  playLoss() {
    this.playError();
  }

  playError() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  /**
   * Dramatic tactical trap / ambush sound ("GBAM! YOU DON ENTER TRAP!")
   * Synthesizes sharp whip-crack slap + heavy sub-bass punch + rising triumph chord.
   */
  playTrap() {
    if (this.isMuted) return;
    this.ensureAudio();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Heavy resonant sub-bass boom ("GBAM!")
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(110, t);
    subOsc.frequency.exponentialRampToValueAtTime(38, t + 0.28);
    subGain.gain.setValueAtTime(0.9, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.32);

    // 2. High-impact snap / whip-crack noise burst
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(800, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 3. Dramatic ascending power arpeggio (C4 -> E4 -> G4 -> C5)
    const trapNotes = [261.63, 329.63, 392.00, 523.25];
    trapNotes.forEach((freq, idx) => {
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      chordOsc.type = 'sawtooth';
      chordOsc.frequency.setValueAtTime(freq, t + 0.04 + idx * 0.06);

      const chordFilter = this.ctx.createBiquadFilter();
      chordFilter.type = 'lowpass';
      chordFilter.frequency.setValueAtTime(1600, t + 0.04 + idx * 0.06);

      chordGain.gain.setValueAtTime(0.001, t + 0.04 + idx * 0.06);
      chordGain.gain.linearRampToValueAtTime(0.28, t + 0.05 + idx * 0.06);
      chordGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + idx * 0.06);

      chordOsc.connect(chordFilter);
      chordFilter.connect(chordGain);
      chordGain.connect(this.ctx.destination);

      chordOsc.start(t + 0.04 + idx * 0.06);
      chordOsc.stop(t + 0.22 + idx * 0.06);
    });
  }
}

export const sound = new SoundController();

// Seamless global user gesture unlock for Web Audio API
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const unlockAudio = () => {
    sound.ensureAudio();
    ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
      document.removeEventListener(evt, unlockAudio, true);
    });
  };
  ['click', 'touchstart', 'pointerdown', 'keydown'].forEach(evt => {
    document.addEventListener(evt, unlockAudio, { once: true, capture: true, passive: true });
  });
}
