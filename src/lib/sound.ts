"use client";

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (typeof window !== "undefined" && !this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }

  private playChord(frequencies: number[], duration: number, type: OscillatorType = "sine", volume: number = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    frequencies.forEach((freq) => {
      const osc = this.audioContext!.createOscillator();
      const gain = this.audioContext!.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

      gain.gain.setValueAtTime(volume, this.audioContext!.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext!.destination);

      osc.start(this.audioContext!.currentTime);
      osc.stop(this.audioContext!.currentTime + duration);
    });
  }

  dice() {
    this.playTone(400, 0.1, "square", 0.05);
    setTimeout(() => this.playTone(500, 0.1, "square", 0.05), 100);
    setTimeout(() => this.playTone(600, 0.15, "triangle", 0.08), 200);
  }

  move() {
    this.playTone(600, 0.1, "sine", 0.05);
    setTimeout(() => this.playTone(700, 0.1, "sine", 0.05), 80);
  }

  ladder() {
    this.playChord([523, 659, 784], 0.3, "sine", 0.08);
    setTimeout(() => this.playChord([659, 784, 1047], 0.4, "sine", 0.08), 150);
  }

  snake() {
    this.playTone(400, 0.2, "sawtooth", 0.04);
    setTimeout(() => this.playTone(300, 0.2, "sawtooth", 0.04), 100);
    setTimeout(() => this.playTone(200, 0.3, "sawtooth", 0.04), 200);
  }

  achievement() {
    this.playChord([523, 659, 784, 1047], 0.5, "sine", 0.08);
    setTimeout(() => this.playChord([784, 1047, 1319], 0.6, "sine", 0.08), 200);
  }

  victory() {
    const notes = [523, 587, 659, 784, 880, 1047, 1175, 1319];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.2, "sine", 0.06), i * 100);
    });
    setTimeout(() => {
      this.playChord([523, 659, 784, 1047], 0.8, "sine", 0.1);
    }, notes.length * 100 + 100);
  }

  question() {
    this.playChord([392, 523, 659], 0.3, "sine", 0.06);
  }

  click() {
    this.playTone(800, 0.05, "sine", 0.04);
  }

  heart() {
    this.playTone(880, 0.15, "sine", 0.06);
    setTimeout(() => this.playTone(1108, 0.2, "sine", 0.06), 100);
  }

  bgMusic() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioContext) return;

    const notes = [
      262, 294, 330, 349, 392, 349, 330, 294,
      262, 330, 392, 523, 392, 330, 294, 262,
    ];
    const noteDuration = 0.5;

    const playSequence = () => {
      notes.forEach((note, i) => {
        setTimeout(() => {
          this.playTone(note, noteDuration * 0.8, "sine", 0.02);
        }, i * noteDuration * 1000);
      });
    };

    playSequence();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  getEnabled() {
    return this.enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundEngine = new SoundEngine();
