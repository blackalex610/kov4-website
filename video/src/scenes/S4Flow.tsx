import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { easeInOut, easeOut, keyframes, mix, prog, spr } from '../lib/anim';
import { drawKds, KDS_QUEUE, KdsTicket, MONITOR_TEX } from '../screens/monitors';
import { drawFiscalReceipt, drawPlatformReceipt, FISCAL_RECEIPT_TEX, PLATFORM_RECEIPT_TEX } from '../screens/receipts';
import { drawTerminal, TERMINAL_TEX } from '../screens/terminal';
import { C, Platform, PLATFORMS, PLATFORM_LIST } from '../theme';
import { beat, cue, scene, sec } from '../timeline';
import { Cam, CameraRig, project, Scene3D, Studio, useCanvasTexture, V3 } from '../three/core';
import { BlobShadow, FiscalPrinter, Glow, Hub, Monitor, Terminal } from '../three/devices';
import { makeCurve, Packet, Stream } from '../three/Stream';
import { CheckIcon, PrinterIcon, ChefIcon, MergeIcon } from '../ui/icons';
import { Chip, useAbsFrame } from '../ui/Type';
import { hubIntro, LIGHT_STUDIO, LOGO_CAM } from './S3Reveal';

const S = scene('s4');
const V10 = beat('v10');
const V11 = beat('v11');

const TERM_X = -5.3;
const TERM_Y = [2.45, 0, -2.45];
const TERM_SCALE = 0.56;
const KDS_POS = [5.25, 1.35, -0.3] as const;
const KDS_SCALE = 0.64;
const PRN_POS = [5.0, -3.05, 0.4] as const;
const PRN_SCALE = 0.78;
const BRAND = '#8b5cf6';

const WIDE: Cam = { pos: [0, 0.2, 17], target: [0, 0, 0], fov: 30 };

const camAt = (frame: number): Cam => {
  const k = keyframes(frame, [
    { f: cue('s4_in'), v: [...LOGO_CAM.pos, ...LOGO_CAM.target] },
    { f: V10.start + sec(0.4), v: [...WIDE.pos, ...WIDE.target] },
    { f: cue('press', -0.4), v: [...WIDE.pos, ...WIDE.target] },
    { f: cue('accept', 0.4), v: [-0.9, 0.6, 15.6, -0.7, 0.35, 0] },
    { f: cue('kitchen', -0.2), v: [0.2, 0.3, 16.4, 0.2, 0.1, 0] },
    { f: cue('print2', 0.2), v: [0.3, -0.05, 16.8, 0.3, -0.15, 0] },
    { f: cue('check2'), v: [0, 0.2, 17.4, 0, 0, 0] },
    { f: cue('s5_in', -0.2), v: [0, 0.2, 17.6, 0, 0, 0] },
    { f: cue('s5_in', 0.6), v: [4.6, -1.6, 9.5, 4.9, -2.0, 0.4] },
  ]);
  return { pos: [k[0], k[1], k[2]], target: [k[3], k[4], k[5]], fov: 30 };
};

// Order packets: departure, arrival at the hub, arrival at the destination.
// `shared` trips ride along with the previous packet on the way in, then branch off.
type Trip = { p: Platform; depart: number; hub: number; arrive: number; to: 'kds' | 'printer'; shared?: boolean };
const TRIPS: Trip[] = [
  { p: PLATFORMS.glovo, depart: cue('accept', 0.15), hub: cue('accept', 0.9), arrive: cue('kitchen'), to: 'kds' },
  { p: PLATFORMS.glovo, depart: cue('accept', 0.15), hub: cue('accept', 0.9), arrive: cue('print2', -0.05), to: 'printer', shared: true },
  { p: PLATFORMS.wolt, depart: cue('check1', -0.6), hub: cue('check1', 0.1), arrive: cue('check1', 0.9), to: 'kds' },
  { p: PLATFORMS.bolt, depart: cue('check2', -0.7), hub: cue('check2', 0.0), arrive: cue('check2', 0.8), to: 'kds' },
];

const TERM_RECEIPT_L = 1.1 * (PLATFORM_RECEIPT_TEX.h / PLATFORM_RECEIPT_TEX.w);

const termAnchor = (i: number): [number, number, number] => [TERM_X + 0.5, TERM_Y[i], 0.1];

const Flow3D: React.FC<{ frame: number; cam: Cam }> = ({ frame, cam }) => {
  const inCurves = useMemo(
    () =>
      TERM_Y.map((y, i) => {
        const a = termAnchor(i);
        return makeCurve([a, [a[0] + 1.3, y, 0.2], [-2.3, y * 0.22, 0.25], [-1.05, 0, 0.2]]);
      }),
    [],
  );
  const toKds = useMemo(
    () => makeCurve([[1.05, 0, 0.2], [2.3, 0.02, 0.25], [3.15, 1.05, 0.1], [KDS_POS[0] - 1.45, KDS_POS[1], -0.1]]),
    [],
  );
  const toPrn = useMemo(
    () => makeCurve([[1.05, 0, 0.2], [2.3, -0.02, 0.25], [3.3, -1.5, 0.4], [PRN_POS[0] - 0.25, PRN_POS[1] + 0.95, 0.55]]),
    [],
  );

  const flow = frame * 0.022;
  const hub = hubIntro(frame);
  const hubPulse = TRIPS.reduce((m, t) => {
    const d = frame - t.hub;
    return Math.max(m, d >= 0 ? Math.exp(-d / 6) : 0);
  }, 0);

  // Entrance of the surrounding devices
  const ent = (k: number) => spr(frame, cue('s4_in', 0.25) + k * 4, 18, 80);

  return (
    <>
      <CameraRig cam={cam} />
      <Studio {...LIGHT_STUDIO} />

      <Hub rotation={[hub.rotX, hub.rotY, 0]} scale={hub.scale * (1 + hubPulse * 0.07)} />
      <Glow position={[0, 0, -0.6]} size={6} color={BRAND} opacity={0.25 * prog(frame, cue('s4_in'), sec(1)) + hubPulse * 0.5} />

      {PLATFORM_LIST.map((p, i) => (
        <PlatformTerminal key={p.key} p={p} i={i} frame={frame} enter={ent(i)} />
      ))}

      {inCurves.map((c, i) => (
        <Stream
          key={i}
          curve={c}
          color={PLATFORM_LIST[i].color}
          progress={prog(frame, cue('streams') + i * 5, sec(0.8), easeInOut)}
          flow={flow}
          radius={0.055}
        />
      ))}
      <Stream curve={toKds} color={BRAND} progress={prog(frame, cue('merge'), sec(0.9), easeInOut)} flow={flow} radius={0.075} />
      <Stream curve={toPrn} color={BRAND} progress={prog(frame, cue('merge', 0.15), sec(0.9), easeInOut)} flow={flow} radius={0.075} />

      {TRIPS.map((t, k) => {
        const i = PLATFORM_LIST.indexOf(t.p);
        const a = prog(frame, t.depart, t.hub - t.depart, easeInOut);
        const b = prog(frame, t.hub + 2, t.arrive - t.hub - 2, easeInOut);
        return (
          <React.Fragment key={k}>
            {!t.shared && <Packet curve={inCurves[i]} t={a} color={t.p.color} />}
            <Packet curve={t.to === 'kds' ? toKds : toPrn} t={b} color={t.p.color} />
          </React.Fragment>
        );
      })}

      <KitchenScreen frame={frame} enter={ent(3)} />
      <Printer frame={frame} enter={ent(4)} />
      <BlobShadow position={[mix(PRN_POS[0] + 5, PRN_POS[0], ent(4)), PRN_POS[1] - 0.02, PRN_POS[2]]} size={2.6} opacity={0.35 * ent(4)} aspect={1.1} />
    </>
  );
};

const PlatformTerminal: React.FC<{ p: Platform; i: number; frame: number; enter: number }> = ({ p, i, frame, enter }) => {
  const isGlovo = p.key === 'glovo';
  const tap = isGlovo && frame >= cue('accept') ? prog(frame, cue('accept'), sec(0.5)) : -1;
  const accepted = isGlovo ? prog(frame, cue('accept', 0.1), sec(0.3)) : 0;
  const pulse = accepted < 1 ? (frame % 40) / 40 : 0;
  const screen = useCanvasTexture(
    TERMINAL_TEX.w,
    TERMINAL_TEX.h,
    (ctx) => drawTerminal(ctx, { platform: p, lit: 1, accepted, tap, badge: 1, pulse, orderNo: String(1042 + i) }),
    `${accepted.toFixed(3)}|${tap.toFixed(3)}|${frame % 40}`,
  );
  const receiptTex = useCanvasTexture(PLATFORM_RECEIPT_TEX.w, PLATFORM_RECEIPT_TEX.h, (ctx) => drawPlatformReceipt(ctx, p), p.key);
  const len = isGlovo ? TERM_RECEIPT_L * prog(frame, cue('accept', 0.3), sec(1.3), easeInOut) : 0;
  return (
    <group position={[mix(TERM_X - 5, TERM_X, enter), TERM_Y[i], 0]} rotation={[0, 0.32, 0]} scale={TERM_SCALE}>
      <Terminal
        screen={screen}
        receipt={{ tex: receiptTex, width: 1.1, maxLen: TERM_RECEIPT_L, len, curl: 0.08 }}
      />
    </group>
  );
};

const KitchenScreen: React.FC<{ frame: number; enter: number }> = ({ frame, enter }) => {
  const arrivals = [cue('kitchen'), cue('check1', 0.9), cue('check2', 0.8)];
  const tickets: KdsTicket[] = KDS_QUEUE.map((t, k) => {
    const at = arrivals[k];
    const appear = prog(frame, at, sec(0.45), easeOut);
    const fresh = frame >= at ? Math.max(0, 1 - (frame - at) / sec(2.2)) : 0;
    const secs = Math.max(0, Math.floor((frame - at) / 30));
    return { ...t, appear, fresh, age: `00:${String(secs).padStart(2, '0')}` };
  });
  const key = tickets.map((t) => `${t.appear.toFixed(3)}${t.fresh.toFixed(2)}${t.age}`).join('|');
  const tex = useCanvasTexture(MONITOR_TEX.w, MONITOR_TEX.h, (ctx) => drawKds(ctx, tickets, 1), key);
  return (
    <Monitor
      screen={tex}
      stand={false}
      position={[mix(KDS_POS[0] + 5, KDS_POS[0], enter), KDS_POS[1], KDS_POS[2]]}
      rotation={[0, -0.3, 0]}
      scale={KDS_SCALE}
    />
  );
};

const FISCAL_W = 1.15;
const FISCAL_L = FISCAL_W * (FISCAL_RECEIPT_TEX.h / FISCAL_RECEIPT_TEX.w);

const Printer: React.FC<{ frame: number; enter: number }> = ({ frame, enter }) => {
  const tex = useCanvasTexture(FISCAL_RECEIPT_TEX.w, FISCAL_RECEIPT_TEX.h, (ctx) => drawFiscalReceipt(ctx), 'fiscal');
  const len = FISCAL_L * prog(frame, cue('print2'), sec(1.6), (t) => t);
  const led = frame >= cue('print2') && frame < cue('print2', 1.6) ? (Math.floor(frame / 4) % 2) : 1;
  return (
    <FiscalPrinter
      position={[mix(PRN_POS[0] + 5, PRN_POS[0], enter), PRN_POS[1], PRN_POS[2]]}
      rotation={[0.1, -0.42, 0]}
      scale={PRN_SCALE}
      led={led}
      receipt={{ tex, width: FISCAL_W, maxLen: FISCAL_L, len, curl: 0.05 }}
    />
  );
};

const at = (p: V3, cam: Cam) => project(p, cam);

export const S4Flow: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const cam = camAt(frame);
  const exit = prog(frame, cue('s5_in', -0.1), sec(0.65), easeInOut);
  const chipsOut = cue('s5_in', -0.3);

  const labels = PLATFORM_LIST.map((p, i) => ({ p, ...at([TERM_X - 0.75, TERM_Y[i], 0], cam) }));
  const merge = at([2.45, 0.42, 0.25], cam);
  const kds = at([KDS_POS[0], KDS_POS[1] - 1.3, KDS_POS[2]], cam);
  const prn = at([PRN_POS[0] - 1.25, PRN_POS[1] + 0.45, PRN_POS[2]], cam);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit }}>
      <Scene3D>
        <Flow3D frame={frame} cam={cam} />
      </Scene3D>
      {labels.map(({ p, x, y }, i) => (
        <Chip key={p.key} frame={frame} at={cue('s4_in', 1.05) + i * 4} out={chipsOut} x={x} y={y} label={p.name} accent={p.color} anchor="right" size={28} />
      ))}
      <Chip frame={frame} at={cue('merge', 0.35)} out={chipsOut} x={merge.x} y={merge.y} label="Един поток" icon={<MergeIcon size={28} color={BRAND} />} size={28} />
      <Chip frame={frame} at={cue('kitchen', 0.1)} out={chipsOut} x={kds.x} y={kds.y} label="Кухненски екран" icon={<ChefIcon size={28} color={C.ink} />} size={28} />
      <Chip
        frame={frame}
        at={cue('print2', 0.35)}
        out={chipsOut}
        x={prn.x}
        y={prn.y}
        label="Касова бележка · автоматично"
        icon={<PrinterIcon size={28} color={C.ink} />}
        size={28}
        anchor="right"
      />
      <Chip frame={frame} at={cue('check1', -0.1)} out={chipsOut} x={790} y={985} label="Без преписване" icon={<CheckIcon size={36} color={C.green} />} size={40} />
      <Chip frame={frame} at={cue('check2', -0.1)} out={chipsOut} x={1180} y={985} label="Без чакане" icon={<CheckIcon size={36} color={C.green} />} size={40} />
    </AbsoluteFill>
  );
};
