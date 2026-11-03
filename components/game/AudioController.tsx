'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';

// Web Audio API sound synthesizer for zero external asset dependencies
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientNode: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  public muted: boolean = false;
  public volume: number = 0.5;

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    if (muted && this.ambientNode && this.ctx) {
      this.ambientNode.gain.setValueAtTime(0, this.ctx.currentTime);
    } else if (!muted && this.ambientNode && this.ctx) {
      this.ambientNode.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (!this.muted && this.ambientNode && this.ctx) {
      this.ambientNode.gain.setValueAtTime(vol * 0.2, this.ctx.currentTime);
    }
  }

  public startAmbient() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    if (this.droneOsc) return; // Already running

    try {
      // Low frequency creepy ambient drone (55Hz / A1 with subtle modulation)
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

      // Low-pass filter for muffled horror ambience
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, this.ctx.currentTime);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(this.volume * 0.15, this.ctx.currentTime);

      this.ambientNode = this.droneGain;

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc.start();
    } catch {
      // Audio autoplay restrictions caught
    }
  }

  public stopAmbient() {
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch {}
      this.droneOsc = null;
      this.ambientNode = null;
    }
  }

  public playClick() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(this.volume * 0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playSuccess() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playError() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playGameOver() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(40, now + 1.2);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  public playVictory() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.15);

      gain.gain.setValueAtTime(this.volume * 0.25, now + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.15);
      osc.stop(now + idx * 0.15 + 0.4);
    });
  }
}

export const soundEngine = new SoundEngine();

export default function AudioController() {
  const gameStatus = useGameStore(state => state.gameStatus);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const prevStatusRef = useRef(gameStatus);

  useEffect(() => {
    soundEngine.setMuted(muted);
    soundEngine.setVolume(volume);
  }, [muted, volume]);

  useEffect(() => {
    if (gameStatus === 'PLAYING') {
      soundEngine.startAmbient();
      if (prevStatusRef.current === 'MENU' || prevStatusRef.current === 'PAUSED') {
        soundEngine.playClick();
      }
    } else if (gameStatus === 'GAME_OVER') {
      soundEngine.stopAmbient();
      soundEngine.playGameOver();
    } else if (gameStatus === 'VICTORY') {
      soundEngine.stopAmbient();
      soundEngine.playVictory();
    } else if (gameStatus === 'PAUSED') {
      soundEngine.stopAmbient();
    }
    prevStatusRef.current = gameStatus;

    return () => {
      // Cleanup on unmount
    };
  }, [gameStatus]);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      soundEngine.setMuted(next);
      return next;
    });
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-xs">
      <button
        onClick={toggleMute}
        className="px-2.5 py-1 border border-gray-700 bg-black/40 text-gray-300 hover:border-cctv-green hover:text-cctv-green transition-colors"
        title={muted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {muted ? 'AUDIO: OFF' : 'AUDIO: ON'}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-16 accent-[#3DED97] cursor-pointer"
        title="Master Volume"
      />
    </div>
  );
}
