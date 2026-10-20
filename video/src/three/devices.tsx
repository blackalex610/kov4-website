import React, { useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { drawBlob, drawGlow, drawIconFace, ICON_TEX, SHADOW_TEX } from '../screens/misc';
import { roundedRect, roundedRectGeometry, useCanvasTexture, useGraphite, V3 } from './core';

type Placement = {
  position?: V3;
  rotation?: V3;
  scale?: number;
};

const P = (p?: V3) => (p ?? [0, 0, 0]) as [number, number, number];

// ------------------------------------------------------------------ receipt paper

export type ReceiptProps = Placement & {
  tex: THREE.Texture;
  width: number;
  maxLen: number;
  /** visible length out of the printer (0..maxLen) */
  len: number;
  /** how much the paper bends backwards as it grows */
  curl?: number;
};

/**
 * Thermal paper strip that grows out of a printer slot. The texture is mapped so
 * the first printed line (the receipt header) is always at the free end.
 */
export const Receipt: React.FC<ReceiptProps> = ({ tex, width, maxLen, len, curl = 0.06, position, rotation, scale = 1 }) => {
  const SEG = 48;
  const geo = useMemo(() => new THREE.PlaneGeometry(width, 1, 1, SEG), [width]);
  const back = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f3f1ea', roughness: 0.95, side: THREE.BackSide }), []);

  useLayoutEffect(() => {
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const L = Math.max(0.0001, len);
    for (let i = 0; i < pos.count; i++) {
      // PlaneGeometry rows go top (v=1) to bottom (v=0), two vertices per row
      const v = 1 - Math.floor(i / 2) / SEG;
      const y = v * L;
      pos.setY(i, y);
      pos.setZ(i, -curl * y * y);
      uv.setY(i, 1 - L / maxLen + (v * L) / maxLen);
    }
    pos.needsUpdate = true;
    uv.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
  }, [geo, len, maxLen, curl]);

  if (len <= 0.001) return null;
  return (
    <group position={P(position)} rotation={P(rotation) as unknown as THREE.Euler} scale={scale}>
      <mesh geometry={geo}>
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={geo} material={back} />
    </group>
  );
};

// ------------------------------------------------------------------ handheld delivery terminal

export const TERMINAL = { w: 1.6, h: 3.1, d: 0.22, screenW: 1.42, screenH: 1.95, screenY: -0.4 };
/** Where paper leaves the printer, in terminal-local space. */
export const TERMINAL_SLOT: [number, number, number] = [0, TERMINAL.h / 2 + 0.005, -0.06];

export type TerminalProps = Placement & {
  screen: THREE.Texture;
  receipt?: Omit<ReceiptProps, 'position' | 'rotation'>;
  children?: React.ReactNode;
};

/**
 * The phone-like order terminal the platforms hand out: Android handheld with a
 * thermal printer built into the top.
 */
export const Terminal: React.FC<TerminalProps> = ({ screen, receipt, position, rotation, scale = 1, children }) => {
  const body = useMemo(() => new RoundedBoxGeometry(TERMINAL.w, TERMINAL.h, TERMINAL.d, 6, 0.1), []);
  const hump = useMemo(() => new RoundedBoxGeometry(TERMINAL.w, 0.9, 0.52, 6, 0.12), []);
  const screenGeo = useMemo(() => roundedRectGeometry(TERMINAL.screenW, TERMINAL.screenH, 0.08), []);
  const mat = useGraphite('#232327', 0.34);
  const humpMat = useGraphite('#2d2d32', 0.5);

  return (
    <group position={P(position)} rotation={P(rotation) as unknown as THREE.Euler} scale={scale}>
      <mesh geometry={body} material={mat} />
      <mesh geometry={hump} material={humpMat} position={[0, TERMINAL.h / 2 - 0.45, -0.17]} />
      {/* paper slot */}
      <mesh position={[0, TERMINAL.h / 2 + 0.002, -0.06]}>
        <boxGeometry args={[1.2, 0.012, 0.07]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      {/* printer door seam, tear bar and status LED */}
      <mesh position={[0, 0.8, TERMINAL.d / 2 + 0.001]}>
        <planeGeometry args={[1.36, 0.014]} />
        <meshBasicMaterial color="#3a3a40" />
      </mesh>
      <mesh position={[0, TERMINAL.h / 2 - 0.05, TERMINAL.d / 2 + 0.001]}>
        <planeGeometry args={[1.2, 0.035]} />
        <meshStandardMaterial color="#8e8e93" metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[0.56, 1.1, TERMINAL.d / 2 + 0.002]}>
        <circleGeometry args={[0.028, 16]} />
        <meshBasicMaterial color="#30d158" toneMapped={false} />
      </mesh>
      <mesh geometry={screenGeo} position={[0, TERMINAL.screenY, TERMINAL.d / 2 + 0.002]}>
        <meshBasicMaterial map={screen} toneMapped={false} transparent />
      </mesh>
      {receipt && <Receipt {...receipt} position={TERMINAL_SLOT} rotation={[-0.18, 0, 0]} />}
      {children}
    </group>
  );
};

// ------------------------------------------------------------------ monitor (POS / kitchen display)

export const MONITOR = { w: 4.4, h: 2.84, screenW: 4.24, screenH: 2.65 };

export const Monitor: React.FC<Placement & { screen: THREE.Texture; stand?: boolean }> = ({
  screen,
  position,
  rotation,
  scale = 1,
  stand = true,
}) => {
  const frame = useMemo(() => new RoundedBoxGeometry(MONITOR.w, MONITOR.h, 0.14, 4, 0.06), []);
  const neck = useMemo(() => new RoundedBoxGeometry(0.5, 1.3, 0.1, 3, 0.04), []);
  const base = useMemo(() => new RoundedBoxGeometry(1.9, 0.07, 1.0, 3, 0.03), []);
  const screenGeo = useMemo(() => roundedRectGeometry(MONITOR.screenW, MONITOR.screenH, 0.03), []);
  const mat = useGraphite('#202024', 0.3);
  const standMat = useGraphite('#3a3a40', 0.45);
  return (
    <group position={P(position)} rotation={P(rotation) as unknown as THREE.Euler} scale={scale}>
      <mesh geometry={frame} material={mat} />
      <mesh geometry={screenGeo} position={[0, 0, 0.071]}>
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      {stand && (
        <>
          <mesh geometry={neck} material={standMat} position={[0, -1.75, -0.2]} />
          <mesh geometry={base} material={standMat} position={[0, -2.4, -0.05]} />
        </>
      )}
    </group>
  );
};

// ------------------------------------------------------------------ fiscal printer

export const PRINTER_SLOT: [number, number, number] = [0, 1.06, 0.3];

export const FiscalPrinter: React.FC<
  Placement & { receipt?: Omit<ReceiptProps, 'position' | 'rotation'>; led?: number }
> = ({ position, rotation, scale = 1, receipt, led = 1 }) => {
  const body = useMemo(() => new RoundedBoxGeometry(1.6, 0.95, 1.8, 5, 0.16), []);
  const lid = useMemo(() => new RoundedBoxGeometry(1.52, 0.22, 1.05, 5, 0.1), []);
  const mat = useGraphite('#2a2a2f', 0.42);
  const lidMat = useGraphite('#36363c', 0.32);
  return (
    <group position={P(position)} rotation={P(rotation) as unknown as THREE.Euler} scale={scale}>
      <mesh geometry={body} material={mat} position={[0, 0.475, 0]} />
      <mesh geometry={lid} material={lidMat} position={[0, 0.96, -0.3]} />
      <mesh position={[0, 0.955, 0.3]}>
        <boxGeometry args={[1.2, 0.02, 0.06]} />
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh position={[0.56, 0.55, 0.905]}>
        <circleGeometry args={[0.035, 20]} />
        <meshBasicMaterial color={new THREE.Color('#30d158').multiplyScalar(0.4 + led * 0.9)} toneMapped={false} />
      </mesh>
      <mesh position={[-0.45, 0.55, 0.903]}>
        <planeGeometry args={[0.36, 0.06]} />
        <meshBasicMaterial color="#141416" />
      </mesh>
      {receipt && <Receipt {...receipt} position={PRINTER_SLOT} rotation={[0.22, 0, 0]} curl={-(receipt.curl ?? 0.05)} />}
    </group>
  );
};

// ------------------------------------------------------------------ kov4 hub / app icon

export const HUB_SIZE = 2.2;

export const Hub: React.FC<Placement & { glow?: number }> = ({ position, rotation, scale = 1 }) => {
  const face = useCanvasTexture(ICON_TEX, ICON_TEX, (ctx) => drawIconFace(ctx), 'icon');
  const body = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(HUB_SIZE, HUB_SIZE, HUB_SIZE * 0.225), {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelSegments: 8,
      curveSegments: 32,
    });
    g.translate(0, 0, -0.26 - 0.08);
    return g;
  }, []);
  const faceGeo = useMemo(() => roundedRectGeometry(HUB_SIZE, HUB_SIZE, HUB_SIZE * 0.225), []);
  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#7d4220',
        metalness: 0.15,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      }),
    [],
  );
  return (
    <group position={P(position)} rotation={P(rotation) as unknown as THREE.Euler} scale={scale}>
      <mesh geometry={body} material={bodyMat} />
      <mesh geometry={faceGeo} position={[0, 0, 0.081]}>
        <meshPhysicalMaterial
          map={face}
          emissiveMap={face}
          emissive="#ffffff"
          emissiveIntensity={0.3}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.05}
          transparent
        />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------------ soft shadow + glow

export const BlobShadow: React.FC<{ position: V3; size: number; opacity?: number; aspect?: number }> = ({
  position,
  size,
  opacity = 0.5,
  aspect = 1,
}) => {
  const tex = useCanvasTexture(SHADOW_TEX, SHADOW_TEX, (ctx) => drawBlob(ctx), 'blob');
  return (
    <mesh position={P(position)} rotation={[-Math.PI / 2, 0, 0]} scale={[size * aspect, size, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};

export const Glow: React.FC<{ position: V3; size: number; color: string; opacity?: number }> = ({
  position,
  size,
  color,
  opacity = 1,
}) => {
  const c = new THREE.Color(color);
  const rgba = `rgba(${Math.round(c.r * 255)}, ${Math.round(c.g * 255)}, ${Math.round(c.b * 255)}, 1)`;
  const tex = useCanvasTexture(SHADOW_TEX, SHADOW_TEX, (ctx) => drawGlow(ctx, rgba), rgba);
  if (opacity <= 0.001) return null;
  return (
    <sprite position={P(position)} scale={[size, size, 1]}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
    </sprite>
  );
};
