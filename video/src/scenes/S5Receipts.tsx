import React, { useMemo } from 'react';
import { AbsoluteFill } from 'remotion';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as THREE from 'three';
import { FONT } from '../fonts';
import { easeInOut, easeOut, mix, mix3, prog, spr } from '../lib/anim';
import { drawFiscalReceipt, drawPlatformReceipt, FISCAL_RECEIPT_TEX, PLATFORM_RECEIPT_TEX } from '../screens/receipts';
import { C, PLATFORMS } from '../theme';
import { beat, cue, scene, sec } from '../timeline';
import { Cam, CameraRig, project, Scene3D, Studio, useCanvasTexture } from '../three/core';
import { BlobShadow, Receipt } from '../three/devices';
import { CheckIcon } from '../ui/icons';
import { Chip, useAbsFrame } from '../ui/Type';
import { LIGHT_STUDIO } from './S3Reveal';

const S = scene('s5');
const V14 = beat('v14');

const RW = 1.75;
const PL = RW * (PLATFORM_RECEIPT_TEX.h / PLATFORM_RECEIPT_TEX.w);
const FL = RW * (FISCAL_RECEIPT_TEX.h / FISCAL_RECEIPT_TEX.w);
const CAM: Cam = { pos: [0, 0.25, 11], target: [0, 0, 0], fov: 30 };

const BAG = { w: 2.3, h: 2.9, d: 1.3, x: -2.55, y: -2.45 + 1.45, z: -0.45 };
const BAG_YAW = 0.28;

/** World position of a point on the bag's (rotated) front face. */
const onBag = (lx: number, y: number, lift: number): [number, number, number] => {
  const lz = BAG.d / 2 + lift;
  return [
    BAG.x + lx * Math.cos(BAG_YAW) + lz * Math.sin(BAG_YAW),
    y,
    BAG.z - lx * Math.sin(BAG_YAW) + lz * Math.cos(BAG_YAW),
  ];
};

const Bag: React.FC<{ y: number }> = ({ y }) => {
  const body = useMemo(() => new RoundedBoxGeometry(BAG.w, BAG.h, BAG.d, 3, 0.03), []);
  const fold = useMemo(() => new RoundedBoxGeometry(BAG.w + 0.02, 0.42, BAG.d * 0.55, 3, 0.03), []);
  const kraft = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b39776', roughness: 0.92 }), []);
  const kraftDark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9f8263', roughness: 0.95 }), []);
  return (
    <group position={[BAG.x, y, BAG.z]} rotation={[0, BAG_YAW, 0]}>
      <mesh geometry={body} material={kraft} />
      <mesh geometry={fold} material={kraftDark} position={[0, BAG.h / 2 + 0.05, -0.12]} rotation={[-0.25, 0, 0]} />
    </group>
  );
};

export const S5Receipts: React.FC = () => {
  const frame = useAbsFrame(S.from);
  const platformTex = useCanvasTexture(PLATFORM_RECEIPT_TEX.w, PLATFORM_RECEIPT_TEX.h, (ctx) => drawPlatformReceipt(ctx, PLATFORMS.glovo), 'p');
  const fiscalTex = useCanvasTexture(FISCAL_RECEIPT_TEX.w, FISCAL_RECEIPT_TEX.h, (ctx) => drawFiscalReceipt(ctx), 'f');

  const inL = spr(frame, cue('s5_in', 0.1), 17, 70);
  const inR = spr(frame, cue('s5_in', 0.25), 17, 70);
  const popL = spr(frame, cue('rec_platform', -0.1), 12, 140) * (1 - prog(frame, cue('rec_fiscal', -0.1), sec(0.3)));
  const popR = spr(frame, cue('rec_fiscal', -0.1), 12, 140) * (1 - prog(frame, cue('stack', -0.1), sec(0.3)));
  const stack = prog(frame, cue('stack', -0.15), sec(0.9), easeInOut);
  const bagIn = spr(frame, cue('stack', -0.35), 18, 80);
  const exit = prog(frame, S.to - sec(0.55), sec(0.55), easeInOut);
  const wob = (k: number) => Math.sin((frame + k * 30) / 28) * 0.05;
  // Free paper bows slightly back; once stapled it lifts gently off the bag instead of sinking into it.
  const curl = mix(0.015, -0.012, stack);

  // Free-floating pose -> stapled to the bag
  const left = {
    pos: mix3([-1.25, -PL / 2 + 0.05 + mix(-7, 0, inL), popL * 0.6], onBag(-0.45, -1.86, 0.02), stack),
    rot: mix3([mix(1.1, 0, inL), 0.16 + wob(0), -0.04], [0, BAG_YAW, 0.09], stack),
    scale: mix(1 + popL * 0.05, 0.5, stack),
  };
  const right = {
    pos: mix3([1.25, -FL / 2 + 0.05 + mix(-7, 0, inR), popR * 0.6], onBag(0.4, -2.18, 0.05), stack),
    rot: mix3([mix(1.1, 0, inR), -0.16 + wob(1), 0.04], [0, BAG_YAW, -0.07], stack),
    scale: mix(1 + popR * 0.05, 0.5, stack),
  };

  const lTop = project([left.pos[0], left.pos[1] + PL * left.scale + 0.35, left.pos[2]], CAM);
  const rTop = project([right.pos[0], right.pos[1] + FL * right.scale + 0.35, right.pos[2]], CAM);
  const textIn = prog(frame, cue('stack', 0.45), sec(0.8), easeOut);
  const subIn = prog(frame, cue('zero', -0.2), sec(0.7), easeOut);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined }}>
      <Scene3D>
        <CameraRig cam={CAM} />
        <Studio {...LIGHT_STUDIO} />
        <Bag y={mix(-8, BAG.y, bagIn)} />
        <BlobShadow position={[BAG.x, -2.47, BAG.z]} size={3.4} opacity={0.4 * bagIn} aspect={1.2} />
        <Receipt tex={platformTex} width={RW} maxLen={PL} len={PL} curl={curl} position={left.pos} rotation={left.rot} scale={left.scale} />
        <Receipt tex={fiscalTex} width={RW} maxLen={FL} len={FL} curl={curl} position={right.pos} rotation={right.rot} scale={right.scale} />
        {stack > 0.95 && (
          <mesh position={onBag(-0.02, -1.86 + PL * 0.5 - 0.1, 0.08)} rotation={[0, BAG_YAW, 0.02]}>
            <boxGeometry args={[0.32, 0.035, 0.02]} />
            <meshStandardMaterial color="#c7c7cc" metalness={1} roughness={0.25} />
          </mesh>
        )}
      </Scene3D>

      <Chip frame={frame} at={cue('rec_platform', -0.15)} out={cue('stack', -0.2)} x={lTop.x} y={lTop.y} label="Бележка от платформата" accent={PLATFORMS.glovo.color} size={30} />
      <Chip frame={frame} at={cue('rec_fiscal', -0.15)} out={cue('stack', -0.2)} x={rTop.x} y={rTop.y} label="Касова бележка" accent={C.indigo} size={30} />

      <div
        style={{
          position: 'absolute',
          left: 1000,
          top: 400,
          fontFamily: FONT,
          opacity: textIn,
          transform: `translateY(${(1 - textIn) * 36}px)`,
          filter: textIn < 1 ? `blur(${(1 - textIn) * 12}px)` : undefined,
        }}
      >
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: '-0.035em', color: C.ink, lineHeight: 1.05 }}>
          Готово
          <br />
          за куриера.
        </div>
        <div
          style={{
            marginTop: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 40,
            fontWeight: 500,
            color: C.inkSoft,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: 99,
              background: C.green,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckIcon size={32} color="#fff" />
          </span>
          Без нито едно ръчно действие
        </div>
      </div>
    </AbsoluteFill>
  );
};
