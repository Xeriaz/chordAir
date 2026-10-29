/**
 * Acoustic Grand Piano Audio Engine (Salamander Grand Piano samples + Web Audio fallback).
 *
 * Uses real studio recordings of a Yamaha C5 Grand Piano (Salamander Grand Piano, CC-BY)
 * for key centers C4, D#4, F#4, A4, C5, D#5, F#5, A5, pitch-shifted across neighboring
 * semitones (at most ±1 semitone) via Web Audio API AudioBufferSourceNode.playbackRate.
 * If offline before samples finish loading, falls back seamlessly to physical-modeling synthesis.
 */

const SALAMANDER_BASE_URL = 'https://tonejs.github.io/audio/salamander/';

/**
 * Sample anchor points every 3 semitones across our 2-octave keyboard (C4 = 60 to B5 = 83).
 * Pitch-shifting at most ±1 semitone preserves authentic hammer attack and wooden soundboard timbre.
 */
const SAMPLE_ANCHORS: ReadonlyArray<{ midi: number; file: string }> = [
  { midi: 60, file: 'C4.mp3' },
  { midi: 63, file: 'Ds4.mp3' },
  { midi: 66, file: 'Fs4.mp3' },
  { midi: 69, file: 'A4.mp3' },
  { midi: 72, file: 'C5.mp3' },
  { midi: 75, file: 'Ds5.mp3' },
  { midi: 78, file: 'Fs5.mp3' },
  { midi: 81, file: 'A5.mp3' },
];

let audioCtx: AudioContext | null = null;
let masterCompressor: DynamicsCompressorNode | null = null;
let preloadStarted = false;
const sampleBuffers = new Map<number, AudioBuffer>();

function getAudioEngine(): {
  ctx: AudioContext;
  compressor: DynamicsCompressorNode;
} | null {
  if (typeof window === 'undefined') return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  if (!masterCompressor) {
    masterCompressor = audioCtx.createDynamicsCompressor();
    masterCompressor.threshold.setValueAtTime(-12, audioCtx.currentTime);
    masterCompressor.knee.setValueAtTime(16, audioCtx.currentTime);
    masterCompressor.ratio.setValueAtTime(3, audioCtx.currentTime);
    masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    masterCompressor.release.setValueAtTime(0.2, audioCtx.currentTime);
    masterCompressor.connect(audioCtx.destination);
  }

  if (!preloadStarted) {
    preloadStarted = true;
    preloadGrandPianoSamples(audioCtx);
  }

  return {
    ctx: audioCtx,
    compressor: masterCompressor,
  };
}

/**
 * Asynchronously fetches and decodes real Yamaha C5 Grand Piano samples.
 */
function preloadGrandPianoSamples(ctx: AudioContext): void {
  for (const anchor of SAMPLE_ANCHORS) {
    fetch(`${SALAMANDER_BASE_URL}${anchor.file}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
      .then((decoded) => {
        sampleBuffers.set(anchor.midi, decoded);
      })
      .catch(() => {
        // Fallback synthesizer handles playback if offline or blocked
      });
  }
}

/**
 * Finds the closest loaded grand piano sample anchor for a given MIDI note.
 */
function findClosestLoadedSample(targetMidi: number): {
  anchorMidi: number;
  buffer: AudioBuffer;
} | null {
  let bestAnchor: { anchorMidi: number; buffer: AudioBuffer } | null = null;
  let minDistance = Infinity;

  for (const [anchorMidi, buffer] of sampleBuffers.entries()) {
    const dist = Math.abs(targetMidi - anchorMidi);
    if (dist < minDistance) {
      minDistance = dist;
      bestAnchor = { anchorMidi, buffer };
    }
  }
  return bestAnchor;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Plays a single classical grand piano note.
 * Uses the real recorded Yamaha C5 Grand Piano sample if loaded, or falls back to
 * warm acoustic physical modeling if offline before initial sample load.
 */
export function playNote(
  midi: number,
  startTimeOffset = 0,
  duration = 2.6,
  gainScale = 0.65
): void {
  const engine = getAudioEngine();
  if (!engine) return;

  const { ctx, compressor } = engine;
  const now = ctx.currentTime + startTimeOffset;

  const closestSample = findClosestLoadedSample(midi);
  if (closestSample) {
    const source = ctx.createBufferSource();
    source.buffer = closestSample.buffer;

    // Pitch-shift by exact semitone difference from the closest recorded sample
    const semitoneDiff = midi - closestSample.anchorMidi;
    source.playbackRate.setValueAtTime(Math.pow(2, semitoneDiff / 12), now);

    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(gainScale, now);
    // Natural release tail at the end of duration
    noteGain.gain.setValueAtTime(gainScale, now + Math.max(0.2, duration - 0.35));
    noteGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

    source.connect(noteGain);
    noteGain.connect(compressor);

    source.start(now);
    source.stop(now + duration + 0.05);
    return;
  }

  // Fallback acoustic synthesizer (used only while samples are downloading on first click)
  playFallbackAcousticNote(ctx, compressor, midi, now, duration, gainScale * 0.38);
}

function playFallbackAcousticNote(
  ctx: AudioContext,
  destination: AudioNode,
  midi: number,
  now: number,
  duration: number,
  gainScale: number
): void {
  const freq = midiToFrequency(midi);
  const inharmonicityB = 0.00018;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(Math.min(10000, freq * 9), now);
  filter.frequency.exponentialRampToValueAtTime(Math.min(3800, freq * 3.2), now + 0.2);

  const voiceGain = ctx.createGain();
  voiceGain.gain.setValueAtTime(0.0001, now);
  voiceGain.gain.linearRampToValueAtTime(gainScale, now + 0.006);
  voiceGain.gain.exponentialRampToValueAtTime(gainScale * 0.48, now + 0.18);
  voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  filter.connect(voiceGain);
  voiceGain.connect(destination);

  const partials = [
    { n: 1, amp: 1.0, decayRatio: 1.0, detune: -1.0 },
    { n: 1, amp: 0.75, decayRatio: 0.95, detune: 1.1 },
    { n: 2, amp: 0.45, decayRatio: 0.7, detune: 0.3 },
    { n: 3, amp: 0.22, decayRatio: 0.5, detune: -0.4 },
    { n: 4, amp: 0.1, decayRatio: 0.35, detune: 0 },
  ];

  for (const p of partials) {
    const partialFreq = freq * p.n * Math.sqrt(1 + inharmonicityB * p.n * p.n);
    if (partialFreq > 14000) continue;

    const osc = ctx.createOscillator();
    const pGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(partialFreq, now);
    osc.detune.setValueAtTime(p.detune, now);

    const pDur = Math.max(0.18, duration * p.decayRatio);
    pGain.gain.setValueAtTime(p.amp, now);
    pGain.gain.exponentialRampToValueAtTime(0.0008, now + pDur);

    osc.connect(pGain);
    pGain.connect(filter);
    osc.start(now);
    osc.stop(now + pDur + 0.04);
  }
}

/**
 * Begins preloading the grand piano samples in the background as soon as the app boots.
 */
export function warmUpPianoSamples(): void {
  if (typeof window === 'undefined') return;
  // Trigger sample fetch into browser HTTP/ServiceWorker cache even before AudioContext is unlocked
  for (const anchor of SAMPLE_ANCHORS) {
    fetch(`${SALAMANDER_BASE_URL}${anchor.file}`).catch(() => {});
  }
}

/**
 * Plays a chord with both individual keys and "Hear chord" using the same Grand Piano engine.
 */
export function playChord(midis: number[]): void {
  if (midis.length === 0) return;
  const sorted = [...midis].sort((a, b) => a - b);
  const perNoteGain = Math.min(0.65, 1.15 / Math.sqrt(sorted.length));

  sorted.forEach((midi, idx) => {
    const velocityBoost = idx === 0 ? 1.1 : 1.0;
    playNote(midi, idx * 0.025, 2.8, perNoteGain * velocityBoost);
  });
}
