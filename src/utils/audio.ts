/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SfxPlayer {
  private ctx: AudioContext | null = null;
  private drumInterval: any = null;
  private gallopInterval: any = null;
  private isMuted: boolean = true;

  constructor() {
    // Left uninitialized to fulfill autoplays policies
  }

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  setMute(mute: boolean) {
    this.isMuted = mute;
    if (mute) {
      this.stopAll();
    } else {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startDrumLoop();
      this.startGallopLoop();
    }
  }

  getMute(): boolean {
    return this.isMuted;
  }

  stopAll() {
    if (this.drumInterval) {
      clearInterval(this.drumInterval);
      this.drumInterval = null;
    }
    if (this.gallopInterval) {
      clearInterval(this.gallopInterval);
      this.gallopInterval = null;
    }
  }

  playDrum() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.45);

      gainNode.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch (e) {
      console.error("Audio synthesise error", e);
    }
  }

  playGallop() {
    if (!this.ctx || this.isMuted) return;
    try {
      const playStep = (delay: number, volume: number) => {
        if (!this.ctx) return;
        const time = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        // Bandpass click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

        gainNode.gain.setValueAtTime(volume * 0.1, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(380, time);
        filter.Q.setValueAtTime(1.2, time);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.12);
      };

      // Triple horse step syncopation
      playStep(0, 0.7);
      playStep(0.1, 0.4);
      playStep(0.22, 0.85);
    } catch (e) {
      console.error("Audio synthesise error", e);
    }
  }

  private startDrumLoop() {
    if (this.drumInterval) return;
    this.drumInterval = setInterval(() => {
      this.playDrum();
      // Double tap rhythm
      setTimeout(() => this.playDrum(), 420);
    }, 3200);
  }

  private startGallopLoop() {
    if (this.gallopInterval) return;
    this.gallopInterval = setInterval(() => {
      if (Math.random() > 0.45) {
        this.playGallop();
        setTimeout(() => this.playGallop(), 480);
        setTimeout(() => this.playGallop(), 960);
      }
    }, 4200);
  }

  playClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);
      gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.085);
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playFanfare(isSuccess: boolean) {
    if (!this.ctx || this.isMuted) return;
    try {
      const playNote = (pitch: number, start: number, duration: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, this.ctx.currentTime + start);
        gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime + start);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + start + duration - 0.01);
        osc.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + start);
        osc.stop(this.ctx.currentTime + start + duration);
      };

      if (isSuccess) {
        // Pentatonic major triumph
        playNote(293.66, 0, 0.12); // D4
        playNote(349.23, 0.12, 0.12); // F4
        playNote(392.00, 0.24, 0.12); // G4
        playNote(440.00, 0.36, 0.3); // A4
      } else {
        // Discordant drop
        playNote(220.00, 0, 0.2); // A3
        playNote(207.65, 0.18, 0.2); // G#3
        playNote(196.00, 0.36, 0.45); // G3
      }
    } catch (e) {}
  }
}

export const sfx = new SfxPlayer();
