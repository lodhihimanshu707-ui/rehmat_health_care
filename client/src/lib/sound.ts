/**
 * Rehmat Health Care - Web Audio Sound Engine
 * Synthesizes ringtones, calling tones, and chat notifications purely in code.
 * Zero external mp3 dependencies, 0ms network latency, 100% reliable across browsers.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private callingInterval: any = null;
  private ringtoneInterval: any = null;
  private isCallingPlaying = false;
  private isRingtonePlaying = false;
  private muted = false;

  constructor() {
    if (typeof window !== "undefined") {
      // Auto-unlock audio context on first user interaction
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
      };

      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopCallingTone();
      this.stopIncomingRingtone();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // =========================================================================
  // 1. OUTGOING CALLING TONE (Ringback: Dual 440Hz + 480Hz periodic tone)
  // Standard telecom "Tutuut... Tutuut..." sound when calling a patient/doctor
  // =========================================================================
  public startCallingTone() {
    if (this.isCallingPlaying || this.muted) return;
    this.isCallingPlaying = true;

    const playBurst = () => {
      if (!this.isCallingPlaying || this.muted) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const duration = 1.2; // 1.2s tone

      // Dual frequencies standard in telecom ringback (440Hz + 480Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";
      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      // Smooth attack and release to prevent audio clicking
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.setValueAtTime(0.12, now + duration - 0.05);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    };

    // Play immediately, then repeat every 3.2 seconds (1.2s sound + 2.0s silence)
    playBurst();
    this.callingInterval = setInterval(playBurst, 3200);
  }

  public stopCallingTone() {
    this.isCallingPlaying = false;
    if (this.callingInterval) {
      clearInterval(this.callingInterval);
      this.callingInterval = null;
    }
  }

  // =========================================================================
  // 2. INCOMING CALL RINGTONE (Melodic smartphone / clinic bell melody loop)
  // Cheerful, high-clarity bell chime sequence for incoming consultations
  // =========================================================================
  public startIncomingRingtone() {
    if (this.isRingtonePlaying || this.muted) return;
    this.isRingtonePlaying = true;

    const playMelody = () => {
      if (!this.isRingtonePlaying || this.muted) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Note frequencies (E5, G#5, B5, E6, B5, E6)
      const notes = [
        { freq: 659.25, start: 0.00, dur: 0.14 }, // E5
        { freq: 830.61, start: 0.16, dur: 0.14 }, // G#5
        { freq: 987.77, start: 0.32, dur: 0.16 }, // B5
        { freq: 1318.51, start: 0.50, dur: 0.28 }, // E6
        { freq: 987.77, start: 0.82, dur: 0.14 }, // B5
        { freq: 1318.51, start: 0.98, dur: 0.38 }, // E6
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Warm bell timbre with triangle wave
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.linearRampToValueAtTime(0.22, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur);
      });
    };

    // Play immediately, then repeat every 2.4 seconds
    playMelody();
    this.ringtoneInterval = setInterval(playMelody, 2400);
  }

  public stopIncomingRingtone() {
    this.isRingtonePlaying = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // =========================================================================
  // 3. CHAT SOUNDS (Sent & Received message audio cues)
  // =========================================================================

  // Crisp short bubble chirp on sending message
  public playMessageSent() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Gentle double ping on incoming chat message
  public playMessageReceived() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Ping 1 (800Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(800, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Ping 2 (1200Hz, slightly delayed)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1200, now + 0.09);
      gain2.gain.setValueAtTime(0.15, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.22);
    } catch {}
  }

  // =========================================================================
  // 4. CALL STATUS TRANSITIONS (Connected & Disconnected)
  // =========================================================================

  // Ascending cheerful chime when call connects
  public playCallConnected() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(783.99, now + 0.15); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  // Descending tones when call ends or is rejected
  public playCallEnded() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(370, now + 0.1); // F#4
      osc.frequency.setValueAtTime(293.66, now + 0.2); // D4

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }
}

// Global Singleton Instance
export const soundManager = new SoundEngine();
