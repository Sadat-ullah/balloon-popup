// Web Audio API Synthesizer for Balloon Math Blast
// Generates bouncy arcade sounds & an upbeat marimba/ukulele BGM loop

class SoundManager {
  private ctx: AudioContext | null = null;
  public isSoundEnabled: boolean = true;
  public isMusicEnabled: boolean = true;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    const soundPref = localStorage.getItem('bmb_sound');
    const musicPref = localStorage.getItem('bmb_music');
    this.isSoundEnabled = soundPref !== null ? soundPref === 'true' : true;
    this.isMusicEnabled = musicPref !== null ? musicPref === 'true' : true;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    localStorage.setItem('bmb_sound', String(this.isSoundEnabled));
    if (this.isSoundEnabled) {
      this.playPop();
    }
    return this.isSoundEnabled;
  }

  public toggleMusic(): boolean {
    this.isMusicEnabled = !this.isMusicEnabled;
    localStorage.setItem('bmb_music', String(this.isMusicEnabled));
    if (this.isMusicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.isMusicEnabled;
  }

  // Crisp balloon pop
  public playPop() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Quick burst of noise
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass filter for rubbery pop body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, t);
    filter.frequency.exponentialRampToValueAtTime(180, t + 0.08);
    filter.Q.setValueAtTime(3, t);

    // Sine thump
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.09);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    noise.start(t);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Punchy balloon pop / blast for gameplay & interactive home balloons
  public playBalloonPop() {
    this.playPop();
  }

  // Gentle rubber wobble / deflate error sound
  public playDeflate() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';

    // Slide down pitch with vibrato
    osc.frequency.setValueAtTime(340, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(200, t + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Triumphant win fanfare
  public playWin() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.11;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + (idx === 3 ? 0.6 : 0.25));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + (idx === 3 ? 0.65 : 0.3));
    });
  }

  // Star ding
  public playStar(starIndex: number = 0) {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [659.25, 783.99, 1046.50]; // E5, G5, C6
    const freq = freqs[starIndex % freqs.length];
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  // Bouncy button click
  public playClick() {
    if (!this.isSoundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  // Cheerful background music: Upbeat tropical marimba arpeggio loop
  public startMusic() {
    if (!this.isMusicEnabled || this.bgmInterval !== null) return;
    this.initContext();

    // Scale notes in C Pentatonic / Major: C4, D4, E4, G4, A4, C5, D5, E5
    const marimbaScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const bassScale = [130.81, 146.83, 164.81, 196.00];

    // Cheerful 16-step marimba & ukulele rhythmic pattern
    const melody = [0, 2, 4, 2, 5, 4, 2, 3, 0, 4, 3, 2, 5, 7, 5, 4];
    const bass = [0, -1, 3, -1, 2, -1, 1, -1, 0, -1, 3, -1, 2, -1, 1, -1];

    this.bgmStep = 0;
    this.bgmInterval = window.setInterval(() => {
      if (!this.isMusicEnabled || !this.ctx) return;
      
      const t = this.ctx.currentTime;
      const mIdx = melody[this.bgmStep % melody.length];
      const bIdx = bass[this.bgmStep % bass.length];

      // Marimba voice
      if (mIdx >= 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(marimbaScale[mIdx], t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      }

      // Ukulele / Bass accompaniment
      if (bIdx >= 0) {
        const bOsc = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassScale[bIdx], t);

        bGain.gain.setValueAtTime(0.07, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        bOsc.connect(bGain);
        bGain.connect(this.ctx.destination);

        bOsc.start(t);
        bOsc.stop(t + 0.26);
      }

      this.bgmStep++;
    }, 220); // ~136 BPM feel
  }

  public stopMusic() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sounds = new SoundManager();
