import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT } from '../fonts';
import { easeInOut, easeOut, prog } from '../lib/anim';
import { BRAND_GRADIENT, C } from '../theme';

type RevealProps = {
  text: string;
  /** absolute frame the first word starts */
  at: number;
  /** absolute frame the line starts leaving (optional) */
  out?: number;
  size?: number;
  weight?: number;
  color?: string;
  gradient?: string;
  stagger?: number;
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right';
  tracking?: number;
};

/**
 * Apple-keynote style line: each word rises out of a soft blur, staggered.
 * Pass an absolute frame; Reveal reads the global frame through `useAbsFrame`.
 */
export const Reveal: React.FC<RevealProps & { frame: number }> = ({
  frame,
  text,
  at,
  out,
  size = 96,
  weight = 700,
  color = C.ink,
  gradient,
  stagger = 3,
  style,
  align = 'center',
  tracking = -0.035,
}) => {
  const words = text.split(' ');
  const leave = out !== undefined ? prog(frame, out, 14, easeInOut) : 0;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight: 1.08,
        color,
        textAlign: align,
        opacity: 1 - leave,
        transform: `translateY(${-leave * size * 0.25}px)`,
        filter: leave > 0 ? `blur(${leave * 10}px)` : undefined,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = prog(frame, at + i * stagger, 22, easeOut);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: t,
              transform: `translateY(${(1 - t) * size * 0.32}px)`,
              filter: t < 1 ? `blur(${(1 - t) * 12}px)` : undefined,
              marginRight: i < words.length - 1 ? '0.26em' : 0,
              ...(gradient
                ? {
                    backgroundImage: gradient,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    paddingBottom: '0.08em',
                  }
                : null),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Absolute composition frame, even inside a <Sequence>. */
export const useAbsFrame = (from: number) => useCurrentFrame() + from;

// ------------------------------------------------------------------ chips

export const Chip: React.FC<{
  frame: number;
  at: number;
  out?: number;
  x: number;
  y: number;
  label: string;
  icon?: React.ReactNode;
  tone?: 'dark' | 'light' | 'glass';
  accent?: string;
  size?: number;
  anchor?: 'center' | 'left' | 'right';
}> = ({ frame, at, out, x, y, label, icon, tone = 'light', accent, size = 30, anchor = 'center' }) => {
  const t = prog(frame, at, 18, easeOut);
  const leave = out !== undefined ? prog(frame, out, 12, easeInOut) : 0;
  const a = t * (1 - leave);
  if (a <= 0.001) return null;
  const bg =
    tone === 'dark' ? 'rgba(28,28,30,0.92)' : tone === 'glass' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.92)';
  const fg = tone === 'light' ? C.ink : '#ffffff';
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) translateY(${(1 - t) * 18}px) scale(${0.92 + 0.08 * t})`,
        opacity: a,
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.42,
        padding: `${size * 0.42}px ${size * 0.8}px`,
        borderRadius: 999,
        background: bg,
        border: tone === 'glass' ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(0,0,0,0.06)',
        boxShadow: tone === 'light' ? '0 12px 40px rgba(0,0,0,0.10)' : '0 12px 40px rgba(0,0,0,0.35)',
        backdropFilter: tone === 'glass' ? 'blur(20px)' : undefined,
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: fg,
        whiteSpace: 'nowrap',
      }}
    >
      {accent && <span style={{ width: size * 0.5, height: size * 0.5, borderRadius: 99, background: accent }} />}
      {icon}
      {label}
    </div>
  );
};

// ------------------------------------------------------------------ logo

export const Wordmark: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.ink,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: '-0.055em',
      lineHeight: 1,
      color,
      display: 'flex',
      ...style,
    }}
  >
    <span>kov</span>
    <span
      style={{
        backgroundImage: BRAND_GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        paddingRight: '0.04em',
      }}
    >
      4
    </span>
  </div>
);

/** Flat SVG version of the app icon (used where a 3D icon would be overkill). */
export const IconMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.indigo} />
        <stop offset="0.55" stopColor={C.purple} />
        <stop offset="1" stopColor={C.violet} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22.5" fill="url(#kg)" />
    <g stroke="#fff" strokeWidth="7.2" strokeLinecap="round" fill="none">
      <path d="M22 30 C42 30 44 50 56 50" />
      <path d="M22 50 L56 50" />
      <path d="M22 70 C42 70 44 50 56 50" />
      <path d="M56 50 L77 50" />
    </g>
    <circle cx="80" cy="50" r="7" fill="#fff" />
  </svg>
);
