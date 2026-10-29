/**
 * Acoustic Grand Piano Web Audio API Synthesizer.
 *
 * Models the key characteristics of a real classical acoustic piano:
 * 1. Felt-hammer strike transient (bandpass-filtered short noise burst on key attack).
 * 2. Rich harmonic series (1st through 6th partials) with slight piano string
 *    inharmonicity (stiff-string stretching) and unison string pair detuning.
 * 3. Dynamic low-pass filter envelope (bright on hammer strike, mellowing into warm wood sustain).
 * 4. Two-stage piano decay (initial prompt soundboard decay -> longer resonant sustain).
 * 5. Subtle stereo concert-hall room ambience via a generated impulse response convolver.
 */

let audioCtx: AudioContext | null = null;
let masterCompressor: DynamicsCompressorNode | null = null;
let reverbNode: ConvolverNode | null = null;
let hammerNoiseBuffer: AudioBuffer | null = null;

function getAudioEngine(): {
  ctx: AudioContext;
  compressor: DynamicsCompressorNode;
  reverb: ConvolverNode;
  noiseBuffer: AudioBuffer;
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
    masterCompressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
    masterCompressor.knee.setValueAtTime(18, audioCtx.currentTime);
    masterCompressor.ratio.setValueAtTime(3.5, audioCtx.currentTime);
    masterCompressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
    masterCompressor.release.setValueAtTime(0.22, audioCtx.currentTime);
    masterCompressor.connect(audioCtx.destination);
  }

  if (!reverbNode) {
    reverbNode = createConcertHallReverb(audioCtx);
    const reverbGain = audioCtx.createGain();
    reverbGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterCompressor);
  }

  if (!hammerNoiseBuffer) {
    hammerNoiseBuffer = createHammerNoiseBuffer(audioCtx);
  }

  return {
    ctx: audioCtx,
    compressor: masterCompressor,
    reverb: reverbNode,
    noiseBuffer: hammerNoiseBuffer,
  };
}

/**
 * Generates a short noise buffer used to simulate the physical felt hammer hitting the strings.
 */
function createHammerNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * 0.045);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    // Exponentially decaying white/pink noise burst
    const env = Math.pow(1 - i / length, 2.4);
    data[i] = (Math.random() * 2 - 1) * env;
  }
  return buffer;
}

/**
 * Generates a warm, natural stereo room impulse response for subtle concert-hall resonance.
 */
function createConcertHallReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const duration = 1.6;
  const length = Math.floor(ctx.sampleRate * duration);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const channelData = impulse.getChannelData(ch);
    let lastSample = 0;
    for (let i = 0; i < length; i++) {
      const t = i / length;
      const decay = Math.exp(-t * 5.2);
      const white = Math.random() * 2 - 1;
      // Simple one-pole lowpass so the room reverb sounds like warm wood rather than metallic hiss
      lastSample = lastSample * 0.72 + white * 0.28;
      channelData[i] = lastSample * decay;
    }
  }

  convolver.buffer = impulse;
  return convolver;
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Synthesizes a single classical grand piano note using additive partials,
 * unison string detuning, dynamic soundboard filtering, and hammer transient.
 */
export function playNote(
  midi: number,
  startTimeOffset = 0,
  duration = 2.4,
  gainScale = 0.26
): void {
  const engine = getAudioEngine();
  if (!engine) return;

  const { ctx, compressor, reverb, noiseBuffer } = engine;
  const now = ctx.currentTime + startTimeOffset;
  const freq = midiToFrequency(midi);

  // Real piano strings have slight stiffness (inharmonicity coefficient B),
  // which stretches upper harmonics slightly sharp and gives a piano its bell-like warmth.
  const inharmonicityB = 0.00018;

  // Voice bus: dynamic soundboard lowpass filter -> note envelope -> dry + reverb
  const soundboardFilter = ctx.createBiquadFilter();
  soundboardFilter.type = 'lowpass';
  // Bright on hammer attack, quickly settling into warm acoustic sustain
  const attackCutoff = Math.min(12000, freq * 11);
  const sustainCutoff = Math.min(4800, freq * 3.8);
  soundboardFilter.frequency.setValueAtTime(attackCutoff, now);
  soundboardFilter.frequency.exponentialRampToValueAtTime(sustainCutoff, now + 0.22);
  soundboardFilter.frequency.exponentialRampToValueAtTime(Math.max(400, freq * 1.8), now + duration);
  soundboardFilter.Q.setValueAtTime(0.7, now);

  // High-pass slightly to prevent muddy sub-bass buildup when playing 4-note chords
  const bodyHighpass = ctx.createBiquadFilter();
  bodyHighpass.type = 'highpass';
  bodyHighpass.frequency.setValueAtTime(Math.max(85, freq * 0.65), now);

  const voiceGain = ctx.createGain();
  // Two-stage piano envelope: fast hammer strike -> initial prompt decay -> long singing sustain
  voiceGain.gain.setValueAtTime(0.0001, now);
  voiceGain.gain.linearRampToValueAtTime(gainScale, now + 0.006);
  voiceGain.gain.exponentialRampToValueAtTime(gainScale * 0.52, now + 0.16);
  voiceGain.gain.exponentialRampToValueAtTime(gainScale * 0.16, now + 0.95);
  voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  soundboardFilter.connect(bodyHighpass);
  bodyHighpass.connect(voiceGain);
  voiceGain.connect(compressor);
  voiceGain.connect(reverb);

  // 1. Felt Hammer Strike Transient
  const hammerSource = ctx.createBufferSource();
  hammerSource.buffer = noiseBuffer;

  const hammerFilter = ctx.createBiquadFilter();
  hammerFilter.type = 'bandpass';
  hammerFilter.frequency.setValueAtTime(Math.min(3600, freq * 3.2), now);
  hammerFilter.Q.setValueAtTime(1.4, now);

  const hammerGain = ctx.createGain();
  hammerGain.gain.setValueAtTime(gainScale * 0.38, now);
  hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  hammerSource.connect(hammerFilter);
  hammerFilter.connect(hammerGain);
  hammerGain.connect(compressor);
  hammerSource.start(now);

  // 2. Acoustic String Partials (Harmonics 1..6)
  // Higher partials decay much faster than the fundamental, just like real piano strings.
  const partials = [
    { n: 1, amp: 1.0, decayRatio: 1.0, detuneCents: -1.1 },
    { n: 1, amp: 0.75, decayRatio: 0.95, detuneCents: 1.2 }, // Unison string pair for chorus warmth
    { n: 2, amp: 0.46, decayRatio: 0.72, detuneCents: 0.4 },
    { n: 3, amp: 0.24, decayRatio: 0.52, detuneCents: -0.5 },
    { n: 4, amp: 0.11, decayRatio: 0.36, detuneCents: 0.8 },
    { n: 5, amp: 0.055, decayRatio: 0.25, detuneCents: 0 },
    { n: 6, amp: 0.028, decayRatio: 0.18, detuneCents: 0 },
  ];

  for (const p of partials) {
    // Stiff-string inharmonicity formula: f_n = n * f_0 * sqrt(1 + B * n^2)
    const partialFreq = freq * p.n * Math.sqrt(1 + inharmonicityB * p.n * p.n);
    if (partialFreq > 14000) continue;

    const osc = ctx.createOscillator();
    const partialGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(partialFreq, now);
    if (p.detuneCents !== 0) {
      osc.detune.setValueAtTime(p.detuneCents, now);
    }

    const partialDuration = Math.max(0.18, duration * p.decayRatio);
    partialGain.gain.setValueAtTime(p.amp, now);
    partialGain.gain.exponentialRampToValueAtTime(0.0008, now + partialDuration);

    osc.connect(partialGain);
    partialGain.connect(soundboardFilter);

    osc.start(now);
    osc.stop(now + partialDuration + 0.04);
  }
}

/**
 * Plays a chord with a subtle, natural two-handed pianist roll and balanced voicing.
 */
export function playChord(midis: number[]): void {
  if (midis.length === 0) return;
  const sorted = [...midis].sort((a, b) => a - b);
  const perNoteGain = Math.min(0.25, 0.76 / Math.sqrt(sorted.length));

  sorted.forEach((midi, idx) => {
    // Subtle 22ms pianist roll from bass to treble, giving the bass note slightly fuller weight
    const velocityBoost = idx === 0 ? 1.12 : 1.0;
    playNote(midi, idx * 0.022, 2.5, perNoteGain * velocityBoost);
  });
}
