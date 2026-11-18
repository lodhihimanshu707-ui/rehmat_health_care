/**
 * Rehmat Health Care - WhatsApp Style Web Audio Sound Engine
 * Synthesizes authentic WhatsApp calling tones, incoming ringtones,
 * and chat sent/received sounds purely in Web Audio API.
 */

class WhatsAppSoundEngine {
  private ctx: AudioContext | null = null;
  private callingInterval: any = null;
  private ringtoneInterval: any = null;
  private isCallingPlaying = false;
  private isRingtonePlaying = false;
  private muted = false;

  constructor() {
    if (typeof window !== "undefined") {
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
  // 1. WHATSAPP OUTGOING CALLING TONE (VoIP Ringback: Double Beep Cadence)
  // Pattern: "beep-beep .......... beep-beep .......... beep-beep"
  // Freq: 425Hz European/WhatsApp standard PBX tone
  // =========================================================================
  public startCallingTone() {
    if (this.isCallingPlaying || this.muted) return;
    this.isCallingPlaying = true;

    const playDoubleBeep = () => {
      if (!this.isCallingPlaying || this.muted) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Beep 1 (100ms)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(425, now);
      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain1.gain.setValueAtTime(0.18, now + 0.10);
      gain1.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Beep 2 (100ms, starts 220ms after beep 1)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(425, now + 0.22);
      gain2.gain.setValueAtTime(0.001, now + 0.22);
      gain2.gain.linearRampToValueAtTime(0.18, now + 0.24);
      gain2.gain.setValueAtTime(0.18, now + 0.32);
      gain2.gain.linearRampToValueAtTime(0.001, now + 0.34);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.34);
    };

    // Play immediately, then repeat every 2.6 seconds
    playDoubleBeep();
    this.callingInterval = setInterval(playDoubleBeep, 2600);
  }

  public stopCallingTone() {
    this.isCallingPlaying = false;
    if (this.callingInterval) {
      clearInterval(this.callingInterval);
      this.callingInterval = null;
    }
  }

  // =========================================================================
  // 2. WHATSAPP INCOMING CALL RINGTONE
  // The iconic marimba chime melody:
  // D5 -> F#5 -> A5 -> D6 -> C#6 -> A5 -> B5 -> D6
  // =========================================================================
  public startIncomingRingtone() {
    if (this.isRingtonePlaying || this.muted) return;
    this.isRingtonePlaying = true;

    const playMarimbaRingtone = () => {
      if (!this.isRingtonePlaying || this.muted) return;
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Authentic WhatsApp Marimba notes: [freq, startOffset, duration]
      const notes = [
        { freq: 587.33, t: 0.00, d: 0.12 }, // D5
        { freq: 739.99, t: 0.14, d: 0.12 }, // F#5
        { freq: 880.00, t: 0.28, d: 0.14 }, // A5
        { freq: 1174.66, t: 0.44, d: 0.22 }, // D6
        { freq: 1108.73, t: 0.68, d: 0.14 }, // C#6
        { freq: 880.00, t: 0.84, d: 0.14 }, // A5
        { freq: 987.77, t: 1.02, d: 0.18 }, // B5
        { freq: 1174.66, t: 1.22, d: 0.35 }, // D6 (accent)
      ];

      notes.forEach(({ freq, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Triangle wave gives the rich wooden percussive marimba sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + t);

        // Percussive strike envelope
        gain.gain.setValueAtTime(0.001, now + t);
        gain.gain.linearRampToValueAtTime(0.24, now + t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + t);
        osc.stop(now + t + d);
      });
    };

    // Play immediately, then loop every 2.4 seconds
    playMarimbaRingtone();
    this.ringtoneInterval = setInterval(playMarimbaRingtone, 2400);
  }

  public stopIncomingRingtone() {
    this.isRingtonePlaying = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // =========================================================================
  // 3. WHATSAPP CHAT SOUNDS
  // - Sent: Classic WhatsApp bubble 'pop'
  // - Received: Classic WhatsApp two-note chime bell ('Ding-dong')
  // =========================================================================

  // WhatsApp Message Sent Pop
  public playMessageSent() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Frequency drop simulates the WhatsApp message sent water droplet / pop
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // WhatsApp Incoming Message Chime
  public playMessageReceived() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: E6 (1318.5Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1318.51, now);
      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Note 2: G#6 (1661.2Hz) - crisp harmonic high chime
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1661.22, now + 0.08);
      gain2.gain.setValueAtTime(0.25, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.28);
    } catch {}
  }

  // Call Connected: subtle upward chime
  public playCallConnected() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5

      gain.gain.setValueAtTime(0.20, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.40);
    } catch {}
  }

  // Call Ended / Dropped: three subtle descending beeps
  public playCallEnded() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(425, now);
      osc.frequency.setValueAtTime(350, now + 0.1);
      osc.frequency.setValueAtTime(280, now + 0.2);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }
}

export const soundManager = new WhatsAppSoundEngine();
