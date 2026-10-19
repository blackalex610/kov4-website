import React from 'react';
import { AbsoluteFill } from 'remotion';
import { easeIn, easeInOut, easeOut, mix, prog, spr } from '../lib/anim';
import { C, LIGHT_BG } from '../theme';
import { beat, cue, scene, sec } from '../timeline';
import { CameraRig, Scene3D, Studio } from '../three/core';
import { Hub } from '../three/devices';
import { Reveal, useAbsFrame, Wordmark } from '../ui/Type';

const S = scene('s3');
const V08 = beat('v08');

/** Camera that puts the hub (world origin) 110px above centre at ~260px - S4 starts from the same view. */
export const LOGO_CAM = { pos: [0, -0.93, 17], target: [0, -0.93, 0], fov: 30 } as const;

/** Hub rotation/scale during the reveal; shared so S4 can pick up exactly where S3 leaves off. */
export const hubIntro = (frame: number) => {
  const t = spr(frame, cue('logo'), 15, 90);
  const idle = Math.sin((frame - cue('logo')) / 50) * 0.05 * t;
  return { rotY: mix(-2.4, 0, t) + idle, rotX: mix(0.5, 0, t), scale: mix(0.35, 1, t) };
};

/** Lighting shared by every light-world scene so hand-offs between canvases are invisible. */
export const LIGHT_STUDIO = { env: 1, keyLight: 2.1, rim: 1.15, ambient: 0.28 } as const;

export const S3Reveal: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const logo = cue('logo');
  const gather = prog(frame, cue('collapse'), sec(0.75), easeIn);
  const breathe = 1 + Math.sin(frame / 7) * 0.06;
  const pointY = mix(540, 400, prog(frame, V08.start, sec(0.8), easeInOut));
  const burst = prog(frame, logo - 2, sec(0.55), easeIn);
  const burstFade = prog(frame, logo + sec(0.7), sec(0.3));
  const textOut = logo - 3;
  const markIn = prog(frame, logo + 5, sec(0.7), easeOut);
  const markOut = prog(frame, cue('s4_in', -0.1), sec(0.5), easeInOut);
  const hub = hubIntro(frame);
  // S4 renders the very same hub from s4_in on, from an identical camera.
  const hubOn = frame >= logo - 1 && frame < cue('s4_in');

  return (
    <AbsoluteFill>
      {/* point of light the problem collapses into */}
      {burst < 1 && (
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: pointY,
              width: 0,
              height: 0,
              boxShadow: `0 0 ${60 * gather * breathe}px ${26 * gather * breathe}px rgba(255,255,255,0.9), 0 0 ${
                220 * gather
              }px ${70 * gather}px rgba(150,140,255,0.45)`,
              borderRadius: 999,
            }}
          />
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 120 }}>
            <Reveal frame={frame} text="Има по-лесен начин." at={V08.start - 2} out={textOut} size={92} weight={650} color={C.white} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {/* burst into the light world */}
      {burst > 0 && burstFade < 1 && (
        <AbsoluteFill
          style={{
            background: LIGHT_BG,
            clipPath: `circle(${burst * 2300}px at 960px ${pointY}px)`,
            opacity: 1 - burstFade,
          }}
        />
      )}

      {hubOn && (
        <Scene3D>
          <CameraRig cam={LOGO_CAM} />
          <Studio {...LIGHT_STUDIO} />
          <Hub rotation={[hub.rotX, hub.rotY, 0]} scale={hub.scale} />
        </Scene3D>
      )}

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 300,
          opacity: markIn * (1 - markOut),
          transform: `translateY(${(1 - markIn) * 40 - markOut * 20}px)`,
          filter: markIn < 1 ? `blur(${(1 - markIn) * 14}px)` : undefined,
        }}
      >
        <Wordmark size={176} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
