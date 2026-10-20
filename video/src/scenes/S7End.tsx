import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FONT } from '../fonts';
import { easeInOut, easeOut, mix, prog, spr } from '../lib/anim';
import { BRAND_GRADIENT, C } from '../theme';
import { cue, scene, sec } from '../timeline';
import { CameraRig, Scene3D, Studio } from '../three/core';
import { BlobShadow, Glow, Hub } from '../three/devices';
import { useAbsFrame, Wordmark } from '../ui/Type';
import { LIGHT_STUDIO } from './S3Reveal';

const S = scene('s7');

// Hub ~300px wide, 160px above centre.
const CAM = { pos: [0, -1.17, 14.8], target: [0, -1.17, 0], fov: 30 } as const;

export const S7End: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const spinAt = cue('logo_end', -0.55);
  const t = spr(frame, spinAt, 15, 85);
  const idle = Math.sin(frame / 45) * 0.06;
  const mark = prog(frame, cue('logo_end', -0.1), sec(0.8), easeOut);
  const tag1 = prog(frame, cue('tagline', 0.05), sec(0.7), easeOut);
  const tag2 = prog(frame, cue('tagline2', 0.0), sec(0.7), easeOut);
  const end = prog(frame, S.to - sec(0.7), sec(0.7), easeInOut);
  const float = Math.sin(frame / 38) * 0.06;

  const rise = (v: number): React.CSSProperties => ({
    opacity: v,
    transform: `translateY(${(1 - v) * 30}px)`,
    filter: v < 1 ? `blur(${(1 - v) * 12}px)` : undefined,
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - end }}>
      <Scene3D>
        <CameraRig cam={CAM} />
        <Studio {...LIGHT_STUDIO} />
        <Glow position={[0, 0, -0.8]} size={6.5} color="#e5732f" opacity={0.3 * t} />
        {frame >= spinAt && (
          <Hub position={[0, float, 0]} rotation={[mix(-0.6, 0.06, t), mix(2.8, 0, t) + idle, 0]} scale={Math.max(0.001, t)} />
        )}
        <BlobShadow position={[0, -1.75, 0]} size={2.6} opacity={0.22 * t * (1 - float * 2)} aspect={1.2} />
      </Scene3D>
      <AbsoluteFill style={{ alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: 560, ...rise(mark) }}>
          <Wordmark size={170} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: 790,
            display: 'flex',
            gap: 22,
            fontFamily: FONT,
            fontSize: 64,
            fontWeight: 650,
            letterSpacing: '-0.035em',
          }}
        >
          <span style={{ color: C.ink, ...rise(tag1) }}>Приеми.</span>
          <span
            style={{
              backgroundImage: BRAND_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              ...rise(tag2),
            }}
          >
            Готово.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
