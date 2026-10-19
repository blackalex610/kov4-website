import { Easing, interpolate, spring } from 'remotion';
import { FPS } from '../timeline';

/** Apple-style deceleration: fast start, long soft landing. */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

/** 0..1 progress of `frame` through [start, start + dur]. */
export const prog = (frame: number, start: number, dur: number, easing: (t: number) => number = easeOut) =>
  interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const spr = (frame: number, start: number, damping = 16, stiffness = 120, mass = 1) =>
  spring({ frame: frame - start, fps: FPS, config: { damping, stiffness, mass } });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const mix3 = (a: readonly number[], b: readonly number[], t: number): [number, number, number] => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Fade in over [inAt, inAt+inDur], hold, fade out over [outAt, outAt+outDur]. */
export const window01 = (frame: number, inAt: number, inDur: number, outAt: number, outDur: number) =>
  Math.min(prog(frame, inAt, inDur), 1 - prog(frame, outAt, outDur, easeInOut));

/** Interpolate through camera/value keyframes [{f, v}] with easing between each pair. */
export const keyframes = (frame: number, keys: { f: number; v: readonly number[] }[], easing = easeInOut) => {
  if (frame <= keys[0].f) return [...keys[0].v];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = easing(clamp01((frame - a.f) / Math.max(1, b.f - a.f)));
      return a.v.map((x, j) => mix(x, b.v[j], t));
    }
  }
  return [...keys[keys.length - 1].v];
};

/** Deterministic pseudo random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
