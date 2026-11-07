/**
 * Web Audio Metronome & Rhythm Audio Engine
 *
 * Provides ultra-accurate, zero-latency scheduling for rhythmic subdivision ticks.
 * Supports:
 * - Downbeat ticks (high accent)
 * - Main beat ticks (medium accent)
 * - Subdivision sub-ticks (light accent)
 * - Optional pitched note attack tones
 */

let rhythmAudioCtx: AudioContext | null = null;

function getRhythmAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!rhythmAudioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    rhythmAudioCtx = new AudioContextClass();
  }

  if (rhythmAudioCtx.state === 'suspended') {
    rhythmAudioCtx.resume().catch(() => {});
  }

  return rhythmAudioCtx;
}

export type TickType = 'downbeat' | 'mainbeat' | 'subtick';

/**
 * Plays a discrete synthesized metronome tick immediately or scheduled at audioTime.
 */
export function playMetronomeTick(type: TickType = 'subtick', scheduledTime?: number): void {
  const ctx = getRhythmAudioContext();
  if (!ctx) return;

  const startTime = scheduledTime ?? ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  let startFreq = 600;
  let endFreq = 250;
  let peakGain = 0.35;
  let duration = 0.025;

  if (type === 'downbeat') {
    startFreq = 1400;
    endFreq = 400;
    peakGain = 0.7;
    duration = 0.045;
  } else if (type === 'mainbeat') {
    startFreq = 950;
    endFreq = 320;
    peakGain = 0.5;
    duration = 0.035;
  } else {
    startFreq = 650;
    endFreq = 220;
    peakGain = 0.28;
    duration = 0.02;
  }

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, startTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.01);
}

/**
 * Plays a melodic pitched note tone (e.g. for note attacks on the rhythmic grid).
 */
export function playNoteAttackTone(midiNote = 60, duration = 0.2, scheduledTime?: number): void {
  const ctx = getRhythmAudioContext();
  if (!ctx) return;

  const startTime = scheduledTime ?? ctx.currentTime;
  const freq = 440 * Math.pow(2, (midiNote - 69) / 12);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(0.3, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(0.05, duration * 0.85));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}
