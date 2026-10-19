import React from 'react';
import * as THREE from 'three';
import { AbsoluteFill, interpolate } from 'remotion';
import { easeInOut, mix, prog, rand, spr } from '../lib/anim';
import { drawTerminal, TERMINAL_TEX } from '../screens/terminal';
import { drawOrderCard, ORDER_CARD_TEX } from '../screens/misc';
import { Platform, PLATFORM_LIST, C } from '../theme';
import { cue, scene, sec } from '../timeline';
import { CameraRig, Scene3D, Studio, useCanvasTexture } from '../three/core';
import { Glow, Terminal } from '../three/devices';
import { Reveal, useAbsFrame } from '../ui/Type';

const S = scene('s1');
const PINGS = [cue('ping_glovo'), cue('ping_wolt'), cue('ping_bolt')];
const X = [-3.7, 0, 3.7];
const Z = [-0.5, 0.5, -0.5];
const YAW = [0.34, 0, -0.34];
const BASE_Y = 0.35;

// Each platform's orders arrive from its own side so paths never cross another terminal.
const ARCS = [
  [0.62, 1.22],
  [0.3, 0.7],
  [-0.22, 0.38],
];

const CARDS = Array.from({ length: 24 }, (_, i) => {
  const target = i % 3;
  const ang = mix(ARCS[target][0], ARCS[target][1], rand(i * 13.7)) * Math.PI;
  const dist = 9 + rand(i * 5.3) * 5;
  return {
    target,
    start: cue('rain') - sec(0.5) + Math.round(i * 1.6 + rand(i) * 4),
    dur: sec(1.1 + rand(i * 2.1) * 0.5),
    from: [X[target] + Math.cos(ang) * dist, BASE_Y + Math.sin(ang) * dist * 0.7, Z[target] - 4 + rand(i * 9.1) * 9],
    spin: (rand(i * 3.3) - 0.5) * 2.4,
  };
});

const arrivals = (frame: number, target: number) =>
  CARDS.filter((c) => c.target === target && frame >= c.start + c.dur).length;

const Unit: React.FC<{ p: Platform; i: number; frame: number }> = ({ p, i, frame }) => {
  const ping = PINGS[i];
  const lit = prog(frame, ping - 1, 9);
  const pulse = frame >= ping ? ((frame - ping) % 40) / 40 : 0;
  const badge = frame >= ping ? 1 + arrivals(frame, i) : 0;
  const screen = useCanvasTexture(
    TERMINAL_TEX.w,
    TERMINAL_TEX.h,
    (ctx) => drawTerminal(ctx, { platform: p, lit, accepted: 0, tap: -1, badge, pulse, orderNo: String(1042 + i * 7) }),
    `${lit.toFixed(3)}|${pulse.toFixed(3)}|${badge}`,
  );

  const rise = spr(frame, cue('rise') + i * 5, 20, 60);
  const bob = Math.sin((frame + i * 23) / 34) * 0.07;
  const pop = frame >= ping ? Math.exp(-(frame - ping) / 7) * Math.sin((frame - ping) / 2.2) * 0.05 : 0;
  const y = mix(-8, BASE_Y, rise) + bob;
  const yaw = YAW[i] + Math.sin((frame + i * 40) / 60) * 0.04;

  return (
    <group>
      <Glow position={[X[i], y, Z[i] - 0.9]} size={7.5} color={p.color} opacity={lit * 0.5} />
      <pointLight position={[X[i] + 0.4, y + 0.5, Z[i] + 2.4]} color={p.color} intensity={lit * 9} distance={7} decay={1.6} />
      <Terminal screen={screen} position={[X[i], y, Z[i]]} rotation={[0.05, yaw, 0]} scale={1 + pop} />
    </group>
  );
};

const Card: React.FC<{ c: (typeof CARDS)[number]; frame: number; tex: THREE.Texture[] }> = ({ c, frame, tex }) => {
  if (frame < c.start || frame > c.start + c.dur) return null;
  const t = prog(frame, c.start, c.dur, easeInOut);
  const to = [X[c.target], BASE_Y - 0.3, Z[c.target] + 0.2];
  const pos = c.from.map((v, k) => mix(v, to[k], t)) as [number, number, number];
  const s = mix(1, 0.15, t * t);
  const a = Math.min(1, t * 6) * (1 - prog(frame, c.start + c.dur * 0.85, c.dur * 0.15));
  return (
    <mesh position={pos} rotation={[0, c.spin * (1 - t), c.spin * 0.4 * (1 - t)]} scale={s}>
      <planeGeometry args={[1.9, 0.68]} />
      <meshBasicMaterial map={tex[c.target]} transparent opacity={a} toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

const Cards: React.FC<{ frame: number }> = ({ frame }) => {
  const tex = PLATFORM_LIST.map((p, i) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCanvasTexture(ORDER_CARD_TEX.w, ORDER_CARD_TEX.h, (ctx) => drawOrderCard(ctx, p, String(1050 + i * 3)), p.key),
  );
  return (
    <>
      {CARDS.map((c, i) => (
        <Card key={i} c={c} frame={frame} tex={tex} />
      ))}
    </>
  );
};

export const S1Hook: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const lights = prog(frame, 0, sec(1.4));
  const exit = prog(frame, cue('s2_in'), S.to - cue('s2_in'), easeInOut);
  const camZ = interpolate(frame, [0, S.to], [13.6, 12.2]);

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 18}px)` : undefined,
        transform: `scale(${1 + exit * 0.06})`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at 50% 45%, rgba(60,60,80,${0.35 * lights}) 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <Scene3D>
        <CameraRig cam={{ pos: [0, 0.5 + Math.sin(frame / 90) * 0.1, camZ], target: [0, 0.1, 0], fov: 30 }} />
        <Studio env={0.35 * lights} keyLight={2.4 * lights} rim={2.2 * lights} ambient={0.05} />
        {PLATFORM_LIST.map((p, i) => (
          <Unit key={p.key} p={p} i={i} frame={frame} />
        ))}
        <Cards frame={frame} />
      </Scene3D>
      <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 92 }}>
        <Reveal frame={frame} text="Поръчките валят отвсякъде." at={cue('rain', -0.55)} size={64} weight={650} color={C.white} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
