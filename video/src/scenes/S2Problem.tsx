import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { easeIn, easeInOut, easeOut, keyframes, mix, prog, rand, spr } from '../lib/anim';
import { drawPos, MONITOR_TEX, POS_CHARS } from '../screens/monitors';
import { drawPlatformReceipt, PLATFORM_RECEIPT_TEX } from '../screens/receipts';
import { drawTerminal, TERMINAL_TEX } from '../screens/terminal';
import { C, PLATFORMS, PLATFORM_LIST } from '../theme';
import { beat, cue, scene, sec } from '../timeline';
import { Cam, CameraRig, project, Scene3D, Studio, useCanvasTexture } from '../three/core';
import { BlobShadow, Monitor, Receipt, Terminal, TERMINAL, TERMINAL_SLOT } from '../three/devices';
import { ClockIcon, KeyboardIcon, ScooterIcon, XIcon } from '../ui/icons';
import { Chip, Reveal, useAbsFrame } from '../ui/Type';

const S = scene('s2');
const V03 = beat('v03');
const V04 = beat('v04');

const TERM_POS = [-3.4, 0, 0] as const;
const TERM_YAW = 0.28;
const POS_POS = [2.9, 0.55, -0.6] as const;
const RECEIPT_W = 1.2;
const RECEIPT_L = RECEIPT_W * (PLATFORM_RECEIPT_TEX.h / PLATFORM_RECEIPT_TEX.w);
const PILE_POS = [-6.1, -1.55, 1.3] as const;

const CAM_KEYS = [
  { f: V04.start - sec(0.7), v: [-3.0, 1.9, 9.6, -3.3, 0.7, 0] },
  { f: cue('tap1', 0.5), v: [-3.1, 1.8, 8.2, -3.3, 0.6, 0] },
  { f: cue('print1', 1.3), v: [-2.7, 2.3, 8.6, -3.3, 1.4, 0] },
  { f: cue('pan_pos', 1.0), v: [-0.15, 1.5, 11.6, -0.15, 0.85, -0.2] },
  { f: cue('item_by_item', -0.1), v: [0.0, 1.4, 11.0, 0.0, 0.8, -0.2] },
  { f: cue('pile', 0.6), v: [-0.9, 1.5, 14.2, -0.9, 0.3, 0] },
  { f: S.to, v: [-0.7, 1.3, 13.4, -0.7, 0.3, 0] },
];

const camAt = (frame: number): Cam => {
  const k = keyframes(frame, CAM_KEYS);
  // Rush-hour jolts on each warning
  const jolt = ['warn_delay', 'warn_error', 'warn_courier']
    .map((n) => {
      const d = frame - cue(n as 'warn_delay');
      return d >= 0 ? Math.exp(-d / 6) * Math.sin(d * 1.9) * 0.06 : 0;
    })
    .reduce((a, b) => a + b, 0);
  return { pos: [k[0] + jolt, k[1] + jolt * 0.6, k[2]], target: [k[3], k[4], k[5]], fov: 30 };
};

/** Human typing: bursts with small pauses, monotonic, finishing exactly at type_end. */
const typedAt = (frame: number) => {
  const a = cue('type_start');
  const b = cue('type_end') - sec(0.3);
  const t = Math.min(1, Math.max(0, (frame - a) / (b - a)));
  const wobble = Math.sin(t * Math.PI * 9) * 0.018 * Math.sin(t * Math.PI);
  return Math.floor(Math.min(1, Math.max(0, t + wobble)) * POS_CHARS);
};

const PILE = Array.from({ length: 6 }, (_, k) => ({
  at: cue('pile', -0.2) + Math.round(k * 5.5),
  platform: PLATFORM_LIST[(k + 1) % 3],
  rotZ: (rand(k * 4.1) - 0.5) * 0.5,
  dx: (rand(k * 7.3) - 0.5) * 0.35,
}));

const Problem3D: React.FC<{ frame: number; cam: Cam }> = ({ frame, cam }) => {
  const tap = frame >= cue('tap1') ? prog(frame, cue('tap1'), sec(0.5), easeOut) : -1;
  const accepted = prog(frame, cue('tap1', 0.12), sec(0.3));
  const newOrders = Math.floor(prog(frame, cue('pile', -0.2), sec(1.8), (t) => t) * 6.99);
  const pulse = accepted < 1 ? ((frame % 40) / 40) : 0;
  const reaccept = newOrders > 0 ? 0 : accepted;

  const screen = useCanvasTexture(
    TERMINAL_TEX.w,
    TERMINAL_TEX.h,
    (ctx) =>
      drawTerminal(ctx, {
        platform: PLATFORMS.glovo,
        lit: 1,
        accepted: reaccept,
        tap: newOrders > 0 ? -1 : tap,
        badge: 1 + newOrders,
        pulse: newOrders > 0 ? ((frame % 24) / 24) : pulse,
        orderNo: newOrders > 0 ? String(1042 + newOrders) : undefined,
      }),
    `${reaccept.toFixed(3)}|${tap.toFixed(3)}|${newOrders}|${(frame % 40)}`,
  );

  const receiptTex = useCanvasTexture(
    PLATFORM_RECEIPT_TEX.w,
    PLATFORM_RECEIPT_TEX.h,
    (ctx) => drawPlatformReceipt(ctx, PLATFORMS.glovo),
    'glovo',
  );
  const pileTex = [
    useCanvasTexture(PLATFORM_RECEIPT_TEX.w, PLATFORM_RECEIPT_TEX.h, (ctx) => drawPlatformReceipt(ctx, PLATFORMS.glovo), 'g'),
    useCanvasTexture(PLATFORM_RECEIPT_TEX.w, PLATFORM_RECEIPT_TEX.h, (ctx) => drawPlatformReceipt(ctx, PLATFORMS.wolt), 'w'),
    useCanvasTexture(PLATFORM_RECEIPT_TEX.w, PLATFORM_RECEIPT_TEX.h, (ctx) => drawPlatformReceipt(ctx, PLATFORMS.bolt), 'b'),
  ];
  const printLen = RECEIPT_L * prog(frame, cue('print1'), sec(1.5), (t) => easeInOut(t) * 0.85 + t * 0.15);

  const typed = typedAt(frame);
  const typing = frame >= cue('type_start') && frame < cue('type_end');
  const err = prog(frame, cue('warn_error'), sec(0.35));
  const posScreen = useCanvasTexture(
    MONITOR_TEX.w,
    MONITOR_TEX.h,
    (ctx) => drawPos(ctx, { typed, cursorOn: typing || Math.floor(frame / 9) % 2 === 0, error: err, lit: 1 }),
    `${typed}|${typing || Math.floor(frame / 9) % 2 === 0}|${err.toFixed(3)}`,
  );
  const posRise = spr(frame, cue('pan_pos', -0.2), 20, 70);

  return (
    <>
      <CameraRig cam={cam} />
      <Studio env={0.4} keyLight={2.4} rim={2.4} ambient={0.06} />
      <pointLight position={[TERM_POS[0], 0.4, 2.6]} color={PLATFORMS.glovo.color} intensity={5} distance={6} decay={1.6} />
      <Terminal
        screen={screen}
        position={TERM_POS}
        rotation={[0.0, TERM_YAW, 0]}
        receipt={{ tex: receiptTex, width: RECEIPT_W, maxLen: RECEIPT_L, len: printLen, curl: 0.07 }}
      />
      <BlobShadow position={[TERM_POS[0], -TERMINAL.h / 2 - 0.25, 0]} size={3.2} opacity={0.6} aspect={1.2} />
      <Monitor screen={posScreen} position={[POS_POS[0], mix(-7, POS_POS[1], posRise), POS_POS[2]]} rotation={[0, -0.24, 0]} scale={0.92} />
      {PILE.map((p, k) => {
        const t = spr(frame, p.at, 14, 110);
        if (frame < p.at) return null;
        return (
          <Receipt
            key={k}
            tex={pileTex[PLATFORM_LIST.indexOf(p.platform)]}
            width={RECEIPT_W}
            maxLen={RECEIPT_L}
            len={RECEIPT_L}
            curl={0.02}
            position={[PILE_POS[0] + p.dx, mix(3.5, PILE_POS[1] + k * 0.025, t), PILE_POS[2] + k * 0.03]}
            rotation={[-1.25 + (1 - t) * 0.9, 0, p.rotZ]}
            scale={0.62}
          />
        );
      })}
    </>
  );
};

/** Dashed "by hand" arc from the printed receipt to the POS screen. */
const ManualArrow: React.FC<{ frame: number; cam: Cam }> = ({ frame, cam }) => {
  const t = prog(frame, cue('manual', -0.25), sec(0.8), easeInOut);
  const out = prog(frame, cue('item_by_item', 0.6), sec(0.4));
  if (t <= 0 || out >= 1) return null;
  const cy = Math.cos(TERM_YAW);
  const sy = Math.sin(TERM_YAW);
  const slotWorld = [TERM_POS[0] + TERMINAL_SLOT[2] * sy, TERMINAL_SLOT[1] + RECEIPT_L * 0.55, TERM_POS[2] + TERMINAL_SLOT[2] * cy];
  const a = project(slotWorld, cam);
  const b = project([POS_POS[0] - 1.8, POS_POS[1] + 0.5, POS_POS[2] + 0.6], cam);
  const mx = (a.x + b.x) / 2;
  const my = Math.min(a.y, b.y) - 160;
  const d = `M ${a.x + 40} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg
        width="1920"
        height="1080"
        style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${Math.max(0, 1920 - (a.x + t * (b.x - a.x + 80)))}px 0 0)` }}
      >
        <defs>
          <marker id="ah" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0 0 L5 2.5 L0 5 z" fill={C.amber} />
          </marker>
        </defs>
        <path d={d} fill="none" stroke={C.amber} strokeWidth={5} strokeDasharray="14 12" strokeLinecap="round" markerEnd="url(#ah)" />
      </svg>
      <Chip
        frame={frame}
        at={cue('manual', 0.1)}
        x={mx}
        y={my + 52}
        label="Ръчно преписване"
        tone="dark"
        icon={<KeyboardIcon size={30} color="#ff9f0a" />}
      />
    </AbsoluteFill>
  );
};

const Stopwatch: React.FC<{ frame: number }> = ({ frame }) => {
  const a = cue('type_start');
  const b = cue('type_end');
  const secs = Math.round(interpolate(frame, [a, b], [0, 84], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const label = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')} мин на поръчка`;
  return (
    <Chip
      frame={frame}
      at={a}
      out={cue('pile', 0.2)}
      x={1640}
      y={120}
      label={label}
      tone="dark"
      icon={<ClockIcon size={30} color="#ff9f0a" />}
    />
  );
};

export const S2Problem: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const cam = camAt(frame);
  const show3d = prog(frame, V04.start - sec(0.7), sec(0.8));
  const typeOut = V04.start - sec(0.55);
  const collapse = prog(frame, cue('collapse'), sec(0.75), easeIn);
  const queue = Math.floor(prog(frame, cue('pile', -0.2), sec(1.8), (t) => t) * 6.99);
  const redPulse = ['warn_delay', 'warn_error', 'warn_courier']
    .map((n) => {
      const d = frame - cue(n as 'warn_delay');
      return d >= 0 ? Math.exp(-d / 14) : 0;
    })
    .reduce((x, y) => Math.max(x, y), 0);
  const peak = prog(frame, cue('peak', -0.2), sec(0.6));

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - collapse,
        transform: `scale(${mix(1, 0.04, collapse)})`,
        filter: collapse > 0 ? `blur(${collapse * 30}px) brightness(${1 + collapse * 2})` : undefined,
      }}
    >
      {/* Typography: "every order, twice" */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Reveal frame={frame} text="Всяка поръчка." at={V03.word(2, -0.15)} out={typeOut} size={132} color={C.white} />
        <Reveal
          frame={frame}
          text="Два пъти."
          at={cue('twice', -0.1)}
          out={typeOut}
          size={132}
          gradient={`linear-gradient(100deg, ${C.amber}, ${C.red})`}
          stagger={4}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: show3d }}>
        <AbsoluteFill
          style={{
            background: `radial-gradient(70% 60% at 50% 50%, rgba(255,69,58,${0.18 * peak + 0.25 * redPulse}) 0%, rgba(0,0,0,0) 75%)`,
          }}
        />
        <Scene3D>
          <Problem3D frame={frame} cam={cam} />
        </Scene3D>
        <ManualArrow frame={frame} cam={cam} />

        <Chip
          frame={frame}
          at={cue('print1', 0.7)}
          out={cue('pan_pos', 0.3)}
          x={project([TERM_POS[0] + 1.6, 2.8, 0], cam).x}
          y={project([TERM_POS[0] + 1.6, 2.8, 0], cam).y}
          label="1. Бележка от платформата"
          tone="glass"
          anchor="left"
        />
        <Chip
          frame={frame}
          at={cue('pos_system', -0.1)}
          out={cue('item_by_item', 0.6)}
          x={project([POS_POS[0], -1.35, POS_POS[2]], cam).x}
          y={project([POS_POS[0], -1.35, POS_POS[2]], cam).y}
          label="2. Ръчно въвеждане в касата"
          tone="glass"
        />
        <Stopwatch frame={frame} />
        <Chip
          frame={frame}
          at={cue('pile', -0.1)}
          x={project([PILE_POS[0] + 0.3, PILE_POS[1] + 1.25, PILE_POS[2]], cam).x}
          y={project([PILE_POS[0] + 0.3, PILE_POS[1] + 1.25, PILE_POS[2]], cam).y}
          label={`Чакат въвеждане: ${1 + queue}`}
          tone="dark"
          accent={C.amber}
        />
        <Chip frame={frame} at={cue('peak', -0.2)} x={160} y={112} label="19:30 · Пиков час" tone="dark" accent={C.red} anchor="left" />
        <Chip frame={frame} at={cue('warn_delay', -0.05)} x={560} y={980} label="Забавяне" tone="dark" icon={<ClockIcon size={32} color={C.amber} />} size={34} />
        <Chip frame={frame} at={cue('warn_error', -0.05)} x={930} y={980} label="Грешки" tone="dark" icon={<XIcon size={32} color={C.red} />} size={34} />
        <Chip
          frame={frame}
          at={cue('warn_courier', -0.05)}
          x={1340}
          y={980}
          label="Изнервени куриери"
          tone="dark"
          icon={<ScooterIcon size={32} color={C.red} />}
          size={34}
        />
        {redPulse > 0 && (
          <AbsoluteFill
            style={{ boxShadow: `inset 0 0 ${220 * redPulse}px rgba(255,59,48,${0.45 * redPulse})`, pointerEvents: 'none' }}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
