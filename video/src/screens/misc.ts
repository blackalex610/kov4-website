import { C, Platform } from '../theme';
import { Ctx, rr, text } from './draw';

export const ORDER_CARD_TEX = { w: 560, h: 200 };

/** Floating "new order" notification used in the opening rain of orders. */
export const drawOrderCard = (ctx: Ctx, p: Platform, no: string) => {
  const { w, h } = ORDER_CARD_TEX;
  rr(ctx, 4, 4, w - 8, h - 8, 44);
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.fill();
  ctx.fillStyle = p.color;
  rr(ctx, 30, 40, 120, 120, 30);
  ctx.fill();
  text(ctx, p.name[0], 90, 124, { size: 64, weight: 800, color: p.ink, align: 'center' });
  text(ctx, 'Нова поръчка', 180, 92, { size: 44, weight: 700, color: C.ink, ls: -0.5 });
  text(ctx, `${p.name} · #${no}`, 180, 146, { size: 32, weight: 500, color: C.inkSoft });
};

export const ICON_TEX = 1024;

/**
 * kov4 app icon: three incoming lines (the platforms) merging into one stream.
 * Drawn on a transparent canvas so the rounded-square silhouette stays crisp.
 */
export const drawIconFace = (ctx: Ctx, s = ICON_TEX) => {
  const g = ctx.createLinearGradient(0, 0, s, s);
  g.addColorStop(0, C.indigo);
  g.addColorStop(0.55, C.purple);
  g.addColorStop(1, C.violet);
  rr(ctx, 0, 0, s, s, s * 0.225);
  ctx.fillStyle = g;
  ctx.fill();

  // Soft top highlight
  const hl = ctx.createLinearGradient(0, 0, 0, s * 0.6);
  hl.addColorStop(0, 'rgba(255,255,255,0.28)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = hl;
  rr(ctx, 0, 0, s, s, s * 0.225);
  ctx.fill();

  drawGlyph(ctx, s, '#ffffff');
};

export const drawGlyph = (ctx: Ctx, s: number, color: string) => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = s * 0.072;
  const x0 = s * 0.22;
  const xm = s * 0.56;
  const x1 = s * 0.8;
  const ym = s * 0.5;
  [0.3, 0.5, 0.7].forEach((fy) => {
    ctx.beginPath();
    ctx.moveTo(x0, s * fy);
    ctx.bezierCurveTo(s * 0.42, s * fy, s * 0.44, ym, xm, ym);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.moveTo(xm, ym);
  ctx.lineTo(x1 - s * 0.03, ym);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x1, ym, s * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export const SHADOW_TEX = 256;

export const drawBlob = (ctx: Ctx, s = SHADOW_TEX) => {
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.45, 'rgba(0,0,0,0.22)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
};

export const drawGlow = (ctx: Ctx, color: string, s = SHADOW_TEX) => {
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, color);
  g.addColorStop(0.35, color.replace(/[\d.]+\)$/, '0.35)'));
  g.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
};
