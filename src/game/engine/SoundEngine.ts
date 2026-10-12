// Gentle OS Sound Engine with Audio File Loading & Web Audio Synth Fallback

import { getAssetUrl } from '../types';

type MuteListener = (muted: boolean) => void;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private osVolume: number = 0.35; // 30% quieter than music/voice
  private muteListeners: Set<MuteListener> = new Set();

  // Spam protection for clicks
  private lastClickTime: number = 0;
  private activeClickCount: number = 0;
  private maxConcurrentClicks: number = 3;

  // Cached Audio Elements for ultra-fast instant playback
  private audioPool: Map<string, HTMLAudioElement[]> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedMute = localStorage.getItem('spark_os_sound_muted');
        if (savedMute !== null) {
          this.muted = savedMute === 'true';
        }
      } catch {
        // ignore storage error
      }
      this.preloadOsSounds();
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Preload audio files from /assets/sounds/os/
  private preloadOsSounds() {
    const soundNames = [
      'boot',
      'click',
      'open_window',
      'close_window',
      'mail_new',
      'error_soft',
      'laptop_close',
    ];

    soundNames.forEach((name) => {
      const path = getAssetUrl(`/assets/sounds/os/${name}.mp3`);
      const audioArray: HTMLAudioElement[] = [];
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(path);
        audio.preload = 'auto';
        audioArray.push(audio);
      }
      this.audioPool.set(name, audioArray);
    });
  }

  // Play audio file from pool with volume and fallback to synth
  private playSoundFile(name: string, synthFallback: () => void) {
    if (this.muted) return;

    const pool = this.audioPool.get(name);
    if (pool && pool.length > 0) {
      // Find an available audio element
      let audio = pool.find((a) => a.paused || a.ended);
      if (!audio) {
        audio = pool[0]; // Reuse oldest
      }
      try {
        audio.currentTime = 0;
        audio.volume = this.osVolume;
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Autoplay restriction or network error -> use synth fallback
            synthFallback();
          });
        }
      } catch {
        synthFallback();
      }
    } else {
      synthFallback();
    }
  }

  // Sound On / Off Controls
  isMuted(): boolean {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('spark_os_sound_muted', String(muted));
      } catch {
        // ignore storage error
      }
    }
    this.muteListeners.forEach((listener) => listener(muted));
  }

  toggleMute(): boolean {
    const next = !this.muted;
    this.setMuted(next);
    if (!next) {
      this.playOsClick();
    }
    return next;
  }

  subscribeMute(listener: MuteListener): () => void {
    this.muteListeners.add(listener);
    return () => {
      this.muteListeners.delete(listener);
    };
  }

  // 1. BOOT SOUND (1-2 sec soft digital startup chime)
  playBoot() {
    this.playSoundFile('boot', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      // F#4, A#4, C#5, F#5 shimmer chord
      const notes = [369.99, 466.16, 554.37, 739.99];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.08 * this.osVolume * 2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    });
  }

  // 2. OS CLICK (Short, pleasant tap with rate-limiting)
  playOsClick() {
    if (this.muted) return;

    const now = Date.now();
    if (now - this.lastClickTime < 45) return; // Debounce rapid spam
    if (this.activeClickCount >= this.maxConcurrentClicks) return;

    this.lastClickTime = now;
    this.activeClickCount++;
    setTimeout(() => {
      this.activeClickCount = Math.max(0, this.activeClickCount - 1);
    }, 60);

    this.playSoundFile('click', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12 * this.osVolume * 2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    });
  }

  // Backward compatible alias
  playClick() {
    this.playOsClick();
  }

  // 3. OPEN WINDOW (Gentle whoosh-in + chime)
  playOpenWindow() {
    this.playSoundFile('open_window', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.18);
      gain.gain.setValueAtTime(0.09 * this.osVolume * 2, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // 4. CLOSE WINDOW (Gentle reverse whoosh)
  playCloseWindow() {
    this.playSoundFile('close_window', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
      gain.gain.setValueAtTime(0.08 * this.osVolume * 2, now);
      gain.gain.exponentialRampToValueAtTime(0.002, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    });
  }

  // 5. NEW MAIL (Delicate two-tone crystal chime)
  playMailNew() {
    this.playSoundFile('mail_new', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const notes = [587.33, 880]; // D5, A5
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + i * 0.12;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.12 * this.osVolume * 2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    });
  }

  // Backward compatible alias
  playNotification() {
    this.playMailNew();
  }

  // 6. ERROR SOFT (Kind, gentle droplet bubble for inactive zones)
  playErrorSoft() {
    this.playSoundFile('error_soft', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.09 * this.osVolume * 2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.14);
    });
  }

  // 7. LAPTOP CLOSE (Soft thump & shutdown chime)
  playLaptopClose() {
    this.playSoundFile('laptop_close', () => {
      this.init();
      if (!this.ctx || this.muted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.22);
      gain.gain.setValueAtTime(0.1 * this.osVolume * 2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    });
  }

  playPop() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.12 * this.osVolume * 2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playTestStart() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(600, now + 0.15);
    osc.frequency.linearRampToValueAtTime(900, now + 0.3);
    gain.gain.setValueAtTime(0.15 * this.osVolume * 2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.35);
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.1;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12 * this.osVolume * 2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  playLaugh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    [400, 550, 450, 600].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + i * 0.08;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1 * this.osVolume * 2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.07);
    });
  }
}

export const soundEngine = new SoundEngine();
