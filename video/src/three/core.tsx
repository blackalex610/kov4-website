import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import React, { useEffect, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { H, W } from '../theme';

export type V3 = readonly [number, number, number] | readonly number[];

// ------------------------------------------------------------------ canvas

/** A CanvasTexture that is redrawn whenever `key` changes. */
export const useCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, key: unknown) => {
  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return { canvas, tex };
  }, [w, h]);

  useLayoutEffect(() => {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, w, h);
    draw(ctx);
    tex.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, canvas, tex]);

  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
};

// ------------------------------------------------------------------ geometry

/** Flat rounded rectangle centred on the origin with 0..1 UVs. */
export const roundedRect = (w: number, h: number, r: number, seg = 12) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

export const roundedRectGeometry = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
  }
  return g;
};

// ------------------------------------------------------------------ canvas wrapper

export const Scene3D: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <ThreeCanvas
    width={W}
    height={H}
    style={{ position: 'absolute', inset: 0, ...style }}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    dpr={1}
    camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 200 }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.NeutralToneMapping;
      gl.toneMappingExposure = 1;
      gl.setClearColor(0x000000, 0);
    }}
  >
    {children}
  </ThreeCanvas>
);

// ------------------------------------------------------------------ lighting

export const Studio: React.FC<{
  env?: number;
  keyLight?: number;
  rim?: number;
  ambient?: number;
}> = ({ env = 1, keyLight = 2.2, rim = 1.6, ambient = 0.15 }) => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const envTex = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const t = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    pm.dispose();
    return t;
  }, [gl]);

  useLayoutEffect(() => {
    scene.environment = envTex;
    scene.environmentIntensity = env;
  }, [envTex, env, scene]);

  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight position={[4, 7, 9]} intensity={keyLight} />
      <directionalLight position={[-9, 3, -6]} intensity={rim} color="#c9d4ff" />
      <directionalLight position={[9, -1, -6]} intensity={rim * 0.7} color="#ffe6d2" />
    </>
  );
};

// ------------------------------------------------------------------ camera

export type Cam = { pos: V3; target: V3; fov: number; roll?: number };

const applyCam = (camera: THREE.PerspectiveCamera, cam: Cam) => {
  camera.fov = cam.fov;
  camera.aspect = W / H;
  camera.near = 0.1;
  camera.far = 200;
  camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
  const r = cam.roll ?? 0;
  camera.up.set(Math.sin(r), Math.cos(r), 0);
  camera.lookAt(cam.target[0], cam.target[1], cam.target[2]);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
};

export const CameraRig: React.FC<{ cam: Cam }> = ({ cam }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    applyCam(camera, cam);
  });
  return null;
};

const projCam = new THREE.PerspectiveCamera();
const tmp = new THREE.Vector3();

/** Screen-space pixel position of a world point, for pinning DOM labels to 3D objects. */
export const project = (p: V3, cam: Cam) => {
  applyCam(projCam, cam);
  tmp.set(p[0], p[1], p[2]).project(projCam);
  return { x: ((tmp.x + 1) / 2) * W, y: ((1 - tmp.y) / 2) * H };
};

// ------------------------------------------------------------------ materials

export const graphite = (color = '#26262b', roughness = 0.36) =>
  new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.45,
    roughness,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
  });

export const useGraphite = (color?: string, roughness?: number) =>
  useMemo(() => graphite(color, roughness), [color, roughness]);
