// js/audio.js - Web Audio API Synthesizer (Zero external dependencies)
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.sfxEnabled = true;
    this.bgmEnabled = true;
    this.bgmTimer = null;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.currentNoteIndex = 0;

    // Thai Pentatonic scale notes (approx. frequencies in Hz)
    // C4, D4, E4, G4, A4, C5, D5, E5, G5
    this.melody = [
      { note: 261.63, dur: 0.6 }, // C4
      { note: 293.66, dur: 0.6 }, // D4
      { note: 329.63, dur: 0.8 }, // E4
      { note: 392.00, dur: 0.6 }, // G4
      { note: 440.00, dur: 1.0 }, // A4
      { note: 392.00, dur: 0.6 }, // G4
      { note: 329.63, dur: 0.8 }, // E4
      { note: 293.66, dur: 0.6 }, // D4

      { note: 329.63, dur: 0.6 }, // E4
      { note: 392.00, dur: 0.6 }, // G4
      { note: 523.25, dur: 1.0 }, // C5
      { note: 440.00, dur: 0.6 }, // A4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 329.63, dur: 0.6 }, // E4
      { note: 293.66, dur: 1.2 }, // D4

      { note: 392.00, dur: 0.6 }, // G4
      { note: 440.00, dur: 0.6 }, // A4
      { note: 523.25, dur: 0.8 }, // C5
      { note: 587.33, dur: 0.6 }, // D5
      { note: 523.25, dur: 1.0 }, // C5
      { note: 440.00, dur: 0.6 }, // A4
      { note: 392.00, dur: 0.8 }, // G4
      { note: 329.63, dur: 1.2 }  // E4
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playWaterSplash() {
    if (!this.sfxEnabled) return;
    this.init();

    const t = this.ctx.currentTime;
    // Create soft water ripple / splash sound with filtered white noise
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
  }

  playBellChime() {
    if (!this.sfxEnabled) return;
    this.init();

    const t = this.ctx.currentTime;
    const freqs = [528, 1056, 1584, 2112];
    const amps = [0.35, 0.15, 0.08, 0.03];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(amps[idx], t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8 + idx * 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 2.2);
    });
  }

  playFirework() {
    if (!this.sfxEnabled) return;
    this.init();

    const t = this.ctx.currentTime;

    // 1. Launch whistle
    const whistleOsc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistleOsc.type = 'triangle';
    whistleOsc.frequency.setValueAtTime(300, t);
    whistleOsc.frequency.exponentialRampToValueAtTime(1200, t + 0.25);

    whistleGain.gain.setValueAtTime(0.15, t);
    whistleGain.gain.linearRampToValueAtTime(0.01, t + 0.25);

    whistleOsc.connect(whistleGain);
    whistleGain.connect(this.sfxGain);
    whistleOsc.start(t);
    whistleOsc.stop(t + 0.26);

    // 2. Explosion Boom (Noise + Low Frequency Pitch)
    const boomTime = t + 0.25;
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(180, boomTime);
    boomOsc.frequency.exponentialRampToValueAtTime(35, boomTime + 0.7);

    boomGain.gain.setValueAtTime(0.7, boomTime);
    boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.75);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(boomTime);
    boomOsc.stop(boomTime + 0.8);

    // Burst Noise
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, boomTime);
    filter.frequency.exponentialRampToValueAtTime(100, boomTime + 0.55);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, boomTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 0.58);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGain);

    noise.start(boomTime);

    // Crackle sparkles
    setTimeout(() => {
      if (!this.sfxEnabled) return;
      this.playCrackles(boomTime + 0.35);
    }, 280);
  }

  playCrackles(startTime) {
    if (!this.ctx) return;
    const count = 6;
    for (let i = 0; i < count; i++) {
      const crackleTime = this.ctx.currentTime + (i * 0.06) + Math.random() * 0.05;
      const buffer = this.ctx.createBuffer(1, 1500, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < 1500; j++) {
        data[j] = (Math.random() * 2 - 1) * Math.exp(-j / 200);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2500, crackleTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, crackleTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(crackleTime);
    }
  }

  playLanternRelease() {
    if (!this.sfxEnabled) return;
    this.init();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(650, t + 1.2);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 1.35);
  }

  startBGM() {
    this.init();
    if (this.bgmPlaying) return;
    this.bgmPlaying = true;
    this.scheduleNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  scheduleNextNote() {
    if (!this.bgmPlaying || !this.bgmEnabled) return;

    const noteObj = this.melody[this.currentNoteIndex];
    this.playTone(noteObj.note, noteObj.dur * 0.95);

    const delay = noteObj.dur * 1000;
    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextNote();
    }, delay);
  }

  playTone(freq, duration) {
    if (!this.ctx || !this.bgmEnabled) return;
    const t = this.ctx.currentTime;

    // Gentle Thai Ranat/Chime tone (harmonics)
    const osc = this.ctx.createOscillator();
    const oscHarmonic = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, t);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    oscHarmonic.start(t);
    osc.stop(t + duration);
    oscHarmonic.stop(t + duration);
  }

  toggleBGM() {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  toggleSFX() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

window.soundSystem = new SoundSystem();
