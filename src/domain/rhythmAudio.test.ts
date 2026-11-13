import { describe, expect, it, vi } from 'vitest';
import * as audioModule from './audio';
import { playMetronomeTick, playNoteAttackTone } from './rhythmAudio';

describe('rhythmAudio engine', () => {
  it('delegates metronome ticks to classical piano notes without synthetic beeps', () => {
    const playNoteSpy = vi.spyOn(audioModule, 'playNote').mockImplementation(() => {});

    // Downbeat: should play high accented piano note C6 (84)
    playMetronomeTick('downbeat');
    expect(playNoteSpy).toHaveBeenCalledWith(84, 0, expect.any(Number), expect.any(Number));

    // Mainbeat: should play mid-high piano note G5 (79)
    playMetronomeTick('mainbeat');
    expect(playNoteSpy).toHaveBeenCalledWith(79, 0, expect.any(Number), expect.any(Number));

    // Subtick: should play light piano subdivision tap E5 (76)
    playMetronomeTick('subtick');
    expect(playNoteSpy).toHaveBeenCalledWith(76, 0, expect.any(Number), expect.any(Number));

    playNoteSpy.mockRestore();
  });

  it('delegates note attack tones to the authentic acoustic grand piano note', () => {
    const playNoteSpy = vi.spyOn(audioModule, 'playNote').mockImplementation(() => {});

    // Note attack: default Middle C (60)
    playNoteAttackTone(60, 0.8);
    expect(playNoteSpy).toHaveBeenCalledWith(60, 0, 0.8, expect.any(Number));

    playNoteSpy.mockRestore();
  });
});
