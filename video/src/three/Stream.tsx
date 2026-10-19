import React, { useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useCanvasTexture, V3 } from './core';

export const makeCurve = (pts: V3[]) =>
  new THREE.CatmullRomCurve3(
    pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])),
    false,
    'centripetal',
  );

const TUBE_SEG = 180;
const RADIAL = 14;

/** Moving bright pulses along the tube. */
const drawFlow = (ctx: CanvasRenderingContext2D) => {
  const g = ctx.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.42, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, 'rgba(255,255,255,1)');
  g.addColorStop(0.58, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 8);
};

export type StreamProps = {
  curve: THREE.CatmullRomCurve3;
  color: string;
  /** 0..1 how much of the path is drawn */
  progress: number;
  /** flow phase, increases with time */
  flow: number;
  radius?: number;
  opacity?: number;
  pulses?: number;
};

export const Stream: React.FC<StreamProps> = ({ curve, color, progress, flow, radius = 0.05, opacity = 1, pulses = 3 }) => {
  const geo = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEG, radius, RADIAL, false), [curve, radius]);
  const halo = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEG, radius * 2.6, RADIAL, false), [curve, radius]);
  const flowTex = useCanvasTexture(512, 8, drawFlow, 'flow');
  const pulseTex = useMemo(() => {
    const t = flowTex.clone();
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(pulses, 1);
    t.needsUpdate = true;
    return t;
  }, [flowTex, pulses]);

  useLayoutEffect(() => {
    const per = RADIAL * 6;
    const n = Math.floor(TUBE_SEG * Math.min(1, Math.max(0, progress))) * per;
    geo.setDrawRange(0, n);
    halo.setDrawRange(0, n);
    pulseTex.offset.x = -flow;
  }, [geo, halo, progress, flow, pulseTex]);

  if (progress <= 0.001 || opacity <= 0.001) return null;
  const head = curve.getPointAt(Math.min(1, progress));
  return (
    <group>
      <mesh geometry={geo}>
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={opacity} />
      </mesh>
      <mesh geometry={geo} scale={1}>
        <meshBasicMaterial
          map={pulseTex}
          color="#ffffff"
          transparent
          opacity={0.85 * opacity}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh geometry={halo}>
        <meshBasicMaterial color={color} transparent opacity={0.16 * opacity} depthWrite={false} toneMapped={false} />
      </mesh>
      {progress < 0.999 && (
        <mesh position={head}>
          <sphereGeometry args={[radius * 1.9, 20, 20]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={opacity} />
        </mesh>
      )}
    </group>
  );
};

/** A small glowing order "packet" travelling along a stream. */
export const Packet: React.FC<{ curve: THREE.CatmullRomCurve3; t: number; color: string; size?: number }> = ({
  curve,
  t,
  color,
  size = 1,
}) => {
  if (t <= 0 || t >= 1) return null;
  const p = curve.getPointAt(t);
  const tan = curve.getTangentAt(t);
  const ang = Math.atan2(tan.y, tan.x);
  const fade = Math.min(1, t * 8, (1 - t) * 8);
  return (
    <group position={p} rotation={[0, 0, ang]} scale={size * (0.6 + 0.4 * fade)}>
      <mesh>
        <boxGeometry args={[0.46, 0.3, 0.06]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.3, 0.05]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[-0.04, -0.08, 0.031]}>
        <planeGeometry args={[0.22, 0.04]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};
