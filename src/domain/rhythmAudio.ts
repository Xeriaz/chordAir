/**
 * Classical Grand Piano Metronome & Rhythm Audio Engine
 *
 * All rhythmic pulses and notes sound using the authentic Yamaha C5 Grand Piano
 * engine matching the piano board on the main page.
 *
 * Replaces synthetic oscillator sweeps/beeps with classical piano strokes:
 * - Downbeat (Beat 1): High, crisp accented staccato piano note (C6 / MIDI 84)
 * - Main beat: Medium-high staccato piano note (G5 / MIDI 79)
 * - Subtick: Gentle, quiet staccato piano tap (E5 / MIDI 76)
 * - Pitch note attack: Authentic rich acoustic grand piano note (e.g. Middle C / MIDI 60)
 */

import { getAudioEngine, playNote, warmUpPianoSamples } from './audio';

export type TickType = 'downbeat' | 'mainbeat' | 'subtick';

/**
 * Plays an authentic classical piano metronome tick.
 * Downbeat: High accented piano note (C6 = 84, crisp staccato velocity)
 * Mainbeat: Mid-high piano note (G5 = 79, staccato)
 * Subtick: Light piano subdivision tap (E5 = 76, quiet staccato)
 */
export function playMetronomeTick(type: TickType = 'subtick', scheduledTime?: number): void {
  warmUpPianoSamples();

  let midi: number;
  let duration: number;
  let gainScale: number;

  if (type === 'downbeat') {
    midi = 84; // C6 - clear bell-like high piano stroke for beat 1
    duration = 0.12;
    gainScale = 0.58;
  } else if (type === 'mainbeat') {
    midi = 79; // G5 - medium-high piano strike for main beats
    duration = 0.09;
    gainScale = 0.40;
  } else {
    midi = 76; // E5 - soft staccato piano tap for subdivisions
    duration = 0.06;
    gainScale = 0.20;
  }

  let offset = 0;
  if (typeof scheduledTime === 'number') {
    const engine = getAudioEngine();
    if (engine) {
      offset = Math.max(0, scheduledTime - engine.ctx.currentTime);
    }
  }

  playNote(midi, offset, duration, gainScale);
}

/**
 * Plays an authentic acoustic grand piano note for rhythmic attacks.
 * Default is Middle C (MIDI 60), perfectly matching the main page piano board.
 */
export function playNoteAttackTone(
  midiNote = 60,
  duration = 0.4,
  scheduledTime?: number
): void {
  warmUpPianoSamples();

  let offset = 0;
  if (typeof scheduledTime === 'number') {
    const engine = getAudioEngine();
    if (engine) {
      offset = Math.max(0, scheduledTime - engine.ctx.currentTime);
    }
  }

  playNote(midiNote, offset, duration, 0.70);
}
