import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { FONT } from '../fonts';
import { easeInOut, easeOut, mix, prog } from '../lib/anim';
import { BRAND_GRADIENT, C } from '../theme';
import { beat, cue, scene, sec } from '../timeline';
import { ChefIcon } from '../ui/icons';
import { Reveal, useAbsFrame } from '../ui/Type';

const S = scene('s6');
const V17 = beat('v17');

const count = (frame: number, at: number, to: number, dur = sec(0.8)) =>
  Math.round(interpolate(frame, [at, at + dur], [0, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut }));

const appear = (frame: number, at: number, dur = sec(0.6)) => {
  const t = prog(frame, at, dur, easeOut);
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * 40}px)`,
    filter: t < 1 ? `blur(${(1 - t) * 14}px)` : undefined,
  } as React.CSSProperties;
};

const Big: React.FC<{ children: React.ReactNode; size: number; gradient?: boolean; color?: string }> = ({
  children,
  size,
  gradient,
  color = C.ink,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: '-0.045em',
      lineHeight: 1,
      fontVariantNumeric: 'tabular-nums',
      ...(gradient
        ? { backgroundImage: BRAND_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', paddingBottom: '0.06em' }
        : { color }),
    }}
  >
    {children}
  </div>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 500, color: C.inkSoft, marginTop: 18, letterSpacing: '-0.01em' }}>
    {children}
  </div>
);

const Card: React.FC<{ frame: number; at: number; icon: React.ReactNode; label: string }> = ({ frame, at, icon, label }) => (
  <div
    style={{
      ...appear(frame, at, sec(0.7)),
      display: 'flex',
      alignItems: 'center',
      gap: 30,
      padding: '34px 54px 34px 34px',
      background: '#ffffff',
      borderRadius: 44,
      boxShadow: '0 30px 80px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
      fontFamily: FONT,
      fontSize: 54,
      fontWeight: 650,
      letterSpacing: '-0.03em',
      color: C.ink,
    }}
  >
    <span
      style={{
        width: 104,
        height: 104,
        borderRadius: 32,
        background: BRAND_GRADIENT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </span>
    {label}
  </div>
);

const PeopleIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.4" />
    <path d="M2.8 20c.6-3.4 3.1-5.4 6.2-5.4s5.6 2 6.2 5.4" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M16.4 14.3c2.6.2 4.4 2 4.9 4.9" />
  </svg>
);

export const S6Value: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const n40 = cue('n40');
  const lift = prog(frame, n40 - sec(0.45), sec(0.7), easeInOut);
  const mathOut = prog(frame, V17.start - sec(0.35), sec(0.5), easeInOut);
  const keep = prog(frame, V17.start - sec(0.45), sec(0.8), easeInOut);
  const exit = prog(frame, cue('s7_in'), sec(0.55), easeInOut);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 16}px)` : undefined }}>
      {/* the maths */}
      <AbsoluteFill
        style={{
          opacity: 1 - mathOut,
          filter: mathOut > 0 ? `blur(${mathOut * 16}px)` : undefined,
          transform: `scale(${1 - mathOut * 0.06})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: mix(330, 150, lift),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: mix(90, 60, lift),
            transform: `scale(${mix(1, 0.62, lift)})`,
            transformOrigin: '50% 0%',
          }}
        >
          <div style={{ textAlign: 'center', ...appear(frame, cue('n80', -0.25)) }}>
            <Big size={240}>{count(frame, cue('n80', -0.2), 80)}</Big>
            <Caption>поръчки на ден</Caption>
          </div>
          <div style={{ ...appear(frame, cue('n1', -0.45)), paddingTop: 60 }}>
            <Big size={140} color={C.inkFaint}>
              ×
            </Big>
          </div>
          <div style={{ textAlign: 'center', ...appear(frame, cue('n1', -0.2)) }}>
            <Big size={240}>1 мин</Big>
            <Caption>ръчно въвеждане</Caption>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 56,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: FONT,
            fontSize: 26,
            color: C.inkFaint,
            ...appear(frame, n40 + sec(0.6)),
          }}
        >
          Пример: 80 поръчки × 1 мин × 30 дни = 2 400 мин = 40 часа
        </div>
      </AbsoluteFill>

      {/* the result stays on screen as context for the closing line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: mix(480, 110, keep),
          textAlign: 'center',
          transform: `scale(${mix(1, 0.42, keep)})`,
          transformOrigin: '50% 0%',
        }}
      >
        <div style={{ display: 'inline-block', ...appear(frame, n40 - sec(0.15), sec(0.7)) }}>
          <Big size={300} gradient>
            {count(frame, n40 - sec(0.1), 40, sec(0.9))} часа
          </Big>
        </div>
        <div style={{ ...appear(frame, cue('month', -0.15)) }}>
          <div style={{ fontFamily: FONT, fontSize: 64, fontWeight: 650, color: C.ink, letterSpacing: '-0.03em', marginTop: 6 }}>
            всеки месец
          </div>
        </div>
      </div>
      {/* what that time is for */}
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 440, left: 0, right: 0 }}>
          <Reveal frame={frame} text="Време за това, което има значение." at={V17.start + 4} size={96} weight={700} />
        </div>
        <div style={{ position: 'absolute', top: 650, display: 'flex', gap: 48 }}>
          <Card frame={frame} at={cue('kitchen_word', -0.2)} icon={<ChefIcon size={58} color="#fff" />} label="В кухнята" />
          <Card frame={frame} at={cue('clients', -0.2)} icon={<PeopleIcon size={58} color="#fff" />} label="При клиентите" />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
