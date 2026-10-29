/**
 * Lightweight Web Audio API synthesizer for playing individual piano keys and chords
 * without requiring external audio sample files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Plays a warm electric-piano-like tone for a single MIDI note.
 */
export function playNote(midi: number, startTimeOffset = 0, duration = 1.1, gainScale = 0.22): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime + startTimeOffset;
  const freq = midiToFrequency(midi);

  // Fundamental (triangle) + soft harmonic (sine) for a warm piano-like timbre
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, now);

  const harmonicGain = ctx.createGain();
  harmonicGain.gain.setValueAtTime(0.18, now);

  // Percussive piano envelope
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(gainScale, now + 0.018);
  gainNode.gain.exponentialRampToValueAtTime(gainScale * 0.45, now + 0.25);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc1.connect(gainNode);
  osc2.connect(harmonicGain);
  harmonicGain.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

/**
 * Plays a chord with a gentle upward arpeggio strum so individual notes and harmony are both clear.
 */
export function playChord(midis: number[]): void {
  if (midis.length === 0) return;
  const sorted = [...midis].sort((a, b) => a - b);
  const perNoteGain = Math.min(0.22, 0.65 / sorted.length);
  sorted.forEach((midi, idx) => {
    playNote(midi, idx * 0.045, 1.35, perNoteGain);
  });
}
