import { KDS_ORDERS, ORDER, OrderItem, Platform, PLATFORMS } from '../theme';
import { alpha, Ctx, font, rr, text } from './draw';

export const MONITOR_TEX = { w: 1600, h: 1000 };

// ---------------------------------------------------------------- POS (manual)

/** What the employee retypes by hand - note the typo in the first line (1× instead of 2×). */
export const POS_LINES = ['#1042', '1 × Бургер Класик', '1 × Картофки с пармезан', '2 × Домашна лимонада'];
export const POS_CHARS = POS_LINES.reduce((s, l) => s + l.length, 0);

export type PosState = {
  typed: number;
  cursorOn: boolean;
  error: number;
  lit: number;
};

export const drawPos = (ctx: Ctx, s: PosState) => {
  const { w, h } = MONITOR_TEX;
  ctx.fillStyle = '#0b0b0d';
  ctx.fillRect(0, 0, w, h);
  if (s.lit <= 0) return;
  ctx.save();
  ctx.globalAlpha = s.lit;

  ctx.fillStyle = '#f2f2f5';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#1d1d1f';
  ctx.fillRect(0, 0, w, 110);
  text(ctx, 'Каса · Бургер Бар', 48, 72, { size: 44, weight: 700, color: '#fff' });
  text(ctx, ORDER.time, w - 48, 72, { size: 42, weight: 600, color: '#fff', align: 'right' });

  // Category rail
  ['Бургери', 'Гарнитури', 'Напитки', 'Десерти', 'Сосове'].forEach((c, i) => {
    rr(ctx, 32, 146 + i * 132, 290, 108, 24);
    ctx.fillStyle = i === 0 ? '#1d1d1f' : '#ffffff';
    ctx.fill();
    text(ctx, c, 177, 214 + i * 132, { size: 38, weight: 600, color: i === 0 ? '#fff' : '#1d1d1f', align: 'center' });
  });

  const fx = 360;
  text(ctx, 'Ръчно въвеждане', fx, 204, { size: 60, weight: 800, color: '#1d1d1f', ls: -1 });

  let left = s.typed;
  const take = (line: string) => {
    const n = Math.max(0, Math.min(line.length, left));
    left -= line.length;
    return { str: line.slice(0, n), done: n === line.length };
  };
  let cursorPlaced = false;
  const cursor = (x: number, y: number, size: number) => {
    if (cursorPlaced) return;
    cursorPlaced = true;
    if (!s.cursorOn) return;
    ctx.fillStyle = '#e5732f';
    ctx.fillRect(x + 5, y - size * 0.82, 5, size * 1.05);
  };

  // Order number field
  rr(ctx, fx, 250, 560, 104, 20);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#d2d2d7';
  ctx.lineWidth = 3;
  ctx.stroke();
  const no = take(POS_LINES[0]);
  text(ctx, no.str || 'Номер', fx + 32, 320, { size: 48, weight: 600, color: no.str ? '#1d1d1f' : '#a1a1a6' });
  if (!no.done) cursor(fx + 32 + measure(ctx, no.str, 48, 600), 320, 48);

  rr(ctx, fx + 600, 250, 420, 104, 20);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.stroke();
  text(ctx, 'Glovo  ▾', fx + 632, 320, { size: 48, weight: 600, color: '#1d1d1f' });

  // Items
  POS_LINES.slice(1).forEach((line, i) => {
    const y = 390 + i * 132;
    const t = take(line);
    const isErr = i === 0 && s.error > 0;
    rr(ctx, fx, y, w - fx - 44, 112, 20);
    ctx.fillStyle = isErr ? mixHex('#ffffff', '#ffe5e3', s.error) : '#ffffff';
    ctx.fill();
    ctx.strokeStyle = isErr ? alpha('#ff3b30', s.error) : '#d2d2d7';
    ctx.lineWidth = isErr ? 6 : 3;
    ctx.stroke();
    text(ctx, t.str, fx + 32, y + 74, { size: 50, weight: 600, color: isErr ? mixHex('#1d1d1f', '#d70015', s.error) : '#1d1d1f' });
    if (!t.done) cursor(fx + 32 + measure(ctx, t.str, 50, 600), y + 74, 50);
    if (isErr) {
      text(ctx, 'на бележката: 2 ×', w - 80, y + 72, { size: 38, weight: 700, color: '#d70015', align: 'right', alpha: s.error });
    }
  });

  const done = s.typed >= POS_CHARS;
  rr(ctx, fx, h - 160, 600, 112, 56);
  ctx.fillStyle = done ? '#1d1d1f' : '#c7c7cc';
  ctx.fill();
  text(ctx, 'Изпрати в кухнята', fx + 300, h - 88, { size: 42, weight: 700, color: '#fff', align: 'center' });
  ctx.restore();
};

const measure = (ctx: Ctx, s: string, size: number, weight: number) => {
  ctx.save();
  ctx.font = font(weight, size);
  const m = ctx.measureText(s).width;
  ctx.restore();
  return m;
};

const mixHex = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (sh: number) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
};

// ---------------------------------------------------------------- KDS (kitchen)

export type KdsTicket = {
  no: string;
  platform: Platform;
  items: OrderItem[];
  /** 0..1 slide-in */
  appear: number;
  /** 0..1 highlight for freshly arrived ticket */
  fresh: number;
  age: string;
};

export const KDS_QUEUE: Omit<KdsTicket, 'appear' | 'fresh' | 'age'>[] = [
  { no: ORDER.no, platform: PLATFORMS.glovo, items: ORDER.items },
  ...KDS_ORDERS,
];

export const drawKds = (ctx: Ctx, tickets: KdsTicket[], lit = 1) => {
  const { w, h } = MONITOR_TEX;
  ctx.fillStyle = '#060608';
  ctx.fillRect(0, 0, w, h);
  if (lit <= 0) return;
  ctx.save();
  ctx.globalAlpha = lit;
  ctx.fillStyle = '#111114';
  ctx.fillRect(0, 0, w, h);
  text(ctx, 'Кухня', 56, 92, { size: 56, weight: 800, color: '#fff', ls: -1 });
  const active = tickets.filter((t) => t.appear > 0.5).length;
  text(ctx, `Активни поръчки: ${active}`, 260, 90, { size: 32, weight: 500, color: '#8e8e93' });
  text(ctx, ORDER.time, w - 56, 90, { size: 40, weight: 600, color: '#fff', align: 'right' });
  ctx.fillStyle = '#2c2c2e';
  ctx.fillRect(56, 128, w - 112, 3);

  const cw = 470;
  const gap = 36;
  tickets.forEach((t, i) => {
    if (t.appear <= 0) return;
    const x = 56 + i * (cw + gap);
    const y = 170 - (1 - t.appear) * 120;
    ctx.save();
    ctx.globalAlpha = lit * t.appear;
    if (t.fresh > 0) {
      ctx.shadowColor = alpha(t.platform.color, 0.9 * t.fresh);
      ctx.shadowBlur = 60 * t.fresh;
    }
    rr(ctx, x, y, cw, 760, 30);
    ctx.fillStyle = '#1c1c1e';
    ctx.fill();
    ctx.shadowBlur = 0;
    if (t.fresh > 0) {
      ctx.strokeStyle = alpha('#ffffff', t.fresh);
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.save();
    rr(ctx, x, y, cw, 128, [30, 30, 0, 0]);
    ctx.clip();
    ctx.fillStyle = t.platform.color;
    ctx.fillRect(x, y, cw, 128);
    ctx.restore();
    text(ctx, t.platform.name, x + 30, y + 58, { size: 32, weight: 700, color: t.platform.ink });
    text(ctx, `#${t.no}`, x + 30, y + 104, { size: 36, weight: 800, color: t.platform.ink });
    text(ctx, t.age, x + cw - 30, y + 104, { size: 32, weight: 600, color: t.platform.ink, align: 'right' });
    t.items.forEach((it, j) => {
      const iy = y + 210 + j * 96;
      text(ctx, `${it.q}×`, x + 30, iy, { size: 44, weight: 800, color: '#fff' });
      text(ctx, it.n, x + 104, iy, { size: 36, weight: 600, color: '#f2f2f7', maxWidth: cw - 130 });
    });
    if (t.fresh > 0.05) {
      rr(ctx, x + 30, y + 650, 150, 60, 30);
      ctx.fillStyle = alpha('#30d158', t.fresh);
      ctx.fill();
      text(ctx, 'НОВА', x + 105, y + 692, { size: 28, weight: 800, color: '#fff', align: 'center', alpha: t.fresh });
    }
    ctx.restore();
  });
  ctx.restore();
};
