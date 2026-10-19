import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { easeInOut, mix, prog } from '../lib/anim';
import { C } from '../theme';
import { cue, DURATION, sec } from '../timeline';

/**
 * Cinematic finishing layer over the whole film: light leaks on the big hits,
 * a vignette that is heavy in the dark act and barely there in the light one,
 * animated film grain, and fades in from / out to black.
 */

const LIGHT_AT = cue('logo') + sec(0.6);

// [cue frame, colour, x%, y%, strength]
const LEAKS: [number, string, number, number, number][] = [
  [cue('ping_glovo'), '#ffc244', 22, 40, 0.35],
  [cue('twice'), '#ff6a3d', 80, 25, 0.4],
  [cue('peak'), C.red, 50, 90, 0.35],
  [cue('logo'), C.violet, 50, 48, 0.9],
  [cue('accept'), C.indigo, 30, 60, 0.3],
  [cue('n40'), C.purple, 50, 30, 0.3],
  [cue('logo_end'), C.violet, 50, 45, 0.55],
];

const Leak: React.FC<{ frame: number; at: number; color: string; x: number; y: number; k: number }> = ({
  frame, at, color, x, y, k,
}) => {
  const a = Math.min(prog(frame, at - 3, 4), 1 - prog(frame, at + 2, sec(1.1), easeInOut)) * k;
  if (a <= 0.001) return null;
  const drift = prog(frame, at - 3, sec(1.4)) * 6;
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: 'screen',
        opacity: a,
        background: `radial-gradient(ellipse 70% 45% at ${x + drift}% ${y}%, ${color} 0%, ${color}55 35%, transparent 70%)`,
      }}
    />
  );
};

export const Film: React.FC = () => {
  const frame = useCurrentFrame();
  const light = frame >= LIGHT_AT;
  // the white flash that carries the jump from the dark world into the light one
  const flash = Math.min(prog(frame, LIGHT_AT - 4, 3), 1 - prog(frame, LIGHT_AT, sec(0.7), easeInOut));
  const vig = light ? 0.1 : 0.62;
  const black = Math.max(1 - prog(frame, 0, sec(0.8)), prog(frame, DURATION - sec(0.9), sec(0.9), easeInOut));
  // grain: new noise seed every 2 frames, like 12 fps film stock
  const seed = Math.floor(frame / 2) % 97;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {LEAKS.map(([at, color, x, y, k], i) => (
        <Leak key={i} frame={frame} at={at} color={color} x={x} y={y} k={k} />
      ))}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 78% 72% at 50% 48%, transparent 45%, rgba(0,0,0,${vig}) 100%)`,
        }}
      />
      <AbsoluteFill style={{ background: '#fff', opacity: flash * 0.6 }} />
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: light ? 0.16 : 0.24 }}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
      <AbsoluteFill style={{ background: '#000', opacity: mix(0, 1, black) }} />
    </AbsoluteFill>
  );
};

/** Colour grade for the content underneath: punchier contrast, a touch more colour. */
export const gradeFilter = (frame: number) =>
  frame >= LIGHT_AT ? 'contrast(1.03) saturate(1.06)' : 'contrast(1.1) saturate(1.12) brightness(0.98)';
