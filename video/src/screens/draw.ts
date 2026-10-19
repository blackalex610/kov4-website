import { FONT, MONO } from '../fonts';

export type Ctx = CanvasRenderingContext2D;

export const font = (weight: number, size: number, family = FONT) => `${weight} ${size}px ${family}`;

export const rr = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number | number[]) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

type TextOpts = {
  size: number;
  weight?: number;
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  mono?: boolean;
  ls?: number;
  alpha?: number;
  maxWidth?: number;
};

export const text = (ctx: Ctx, s: string, x: number, y: number, o: TextOpts) => {
  ctx.save();
  ctx.font = font(o.weight ?? 500, o.size, o.mono ? MONO : FONT);
  ctx.fillStyle = o.color ?? '#000';
  ctx.textAlign = o.align ?? 'left';
  ctx.textBaseline = o.baseline ?? 'alphabetic';
  ctx.globalAlpha *= o.alpha ?? 1;
  ctx.letterSpacing = `${o.ls ?? 0}px`;
  ctx.fillText(s, x, y, o.maxWidth);
  ctx.restore();
};

export const dashedLine = (ctx: Ctx, x1: number, x2: number, y: number, color = '#000') => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  ctx.restore();
};

export const check = (ctx: Ctx, cx: number, cy: number, s: number, color: string, width = s * 0.14) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.32, cy + s * 0.02);
  ctx.lineTo(cx - s * 0.08, cy + s * 0.26);
  ctx.lineTo(cx + s * 0.36, cy - s * 0.24);
  ctx.stroke();
  ctx.restore();
};

/** Hex colour with alpha, e.g. alpha('#ffc244', 0.4). */
export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
