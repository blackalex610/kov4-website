import tl from './data/timeline.json';

export const FPS = tl.fps;
export const DURATION = tl.durationInFrames;

export const sec = (s: number) => Math.round(s * FPS);

export type CueName = keyof typeof tl.cues;
export type BeatId = keyof typeof tl.beats;
export type SceneId = keyof typeof tl.scenes;

/** Absolute frame of a named cue. */
export const cue = (name: CueName, offsetSec = 0) => sec(tl.cues[name] + offsetSec);

/** Absolute frames for a voiceover beat. */
export const beat = (id: BeatId) => {
  const b = tl.beats[id];
  return {
    start: sec(b.start),
    end: sec(b.end),
    word: (i: number, offsetSec = 0) => sec(b.words[i] + offsetSec),
  };
};

export const scene = (id: SceneId) => {
  const s = tl.scenes[id];
  const from = sec(s.from);
  return { from, to: sec(s.to), dur: sec(s.to) - from };
};
