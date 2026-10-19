import { ORDER, Platform } from '../theme';
import { alpha, check, Ctx, rr, text } from './draw';

export const TERMINAL_TEX = { w: 720, h: 990 };

export type TerminalState = {
  platform: Platform;
  /** 0 = screen off, 1 = fully lit incoming order */
  lit: number;
  /** 0..1 progress of the accept transition (button turns green) */
  accepted: number;
  /** tap ripple progress, <0 = none */
  tap: number;
  badge: number;
  /** ring pulse phase 0..1 around the "new order" card */
  pulse: number;
  orderNo?: string;
};

export const drawTerminal = (ctx: Ctx, s: TerminalState) => {
  const { w, h } = TERMINAL_TEX;
  const p = s.platform;

  // Off state: glassy black with a faint diagonal sheen.
  const off = ctx.createLinearGradient(0, 0, w, h);
  off.addColorStop(0, '#16161a');
  off.addColorStop(0.5, '#0a0a0c');
  off.addColorStop(1, '#111114');
  rr(ctx, 0, 0, w, h, 46);
  ctx.fillStyle = off;
  ctx.fill();

  if (s.lit <= 0) return;
  ctx.save();
  ctx.globalAlpha = s.lit;
  rr(ctx, 0, 0, w, h, 46);
  ctx.clip();

  // Background: platform colour, slightly deeper toward the bottom.
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, p.color);
  bg.addColorStop(1, shade(p.color, -0.12));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Status bar
  text(ctx, ORDER.time, 44, 64, { size: 30, weight: 600, color: p.ink });
  ctx.fillStyle = p.ink;
  ctx.globalAlpha = s.lit * 0.85;
  for (let i = 0; i < 4; i++) ctx.fillRect(w - 150 + i * 14, 56 - i * 7, 9, 8 + i * 7);
  rr(ctx, w - 82, 40, 44, 22, 6);
  ctx.fill();
  ctx.globalAlpha = s.lit;

  // Platform name
  text(ctx, p.name, 44, 168, { size: 64, weight: 800, color: p.ink, ls: -1.5 });

  // Badge
  if (s.badge > 0) {
    ctx.fillStyle = '#ff3b30';
    ctx.beginPath();
    ctx.arc(w - 78, 146, 38, 0, Math.PI * 2);
    ctx.fill();
    text(ctx, String(s.badge), w - 78, 160, { size: 38, weight: 700, color: '#fff', align: 'center' });
  }

  // Order card
  const cx = 34;
  const cy = 230;
  const cw = w - 68;
  const ch = 470;
  if (s.pulse > 0 && s.accepted < 1) {
    const pr = s.pulse;
    ctx.save();
    ctx.strokeStyle = alpha('#ffffff', 0.7 * (1 - pr));
    ctx.lineWidth = 6;
    rr(ctx, cx - pr * 26, cy - pr * 26, cw + pr * 52, ch + pr * 52, 40 + pr * 20);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  rr(ctx, cx, cy, cw, ch, 36);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  text(ctx, 'Нова поръчка', cx + 40, cy + 80, { size: 44, weight: 700, color: '#1d1d1f', ls: -0.5 });
  text(ctx, `#${s.orderNo ?? ORDER.no}`, cx + cw - 40, cy + 80, {
    size: 40,
    weight: 600,
    color: '#86868b',
    align: 'right',
  });
  ctx.fillStyle = '#ececf0';
  ctx.fillRect(cx + 40, cy + 116, cw - 80, 3);
  ORDER.items.forEach((it, i) => {
    const y = cy + 186 + i * 74;
    text(ctx, `${it.q}×`, cx + 40, y, { size: 36, weight: 700, color: '#1d1d1f' });
    text(ctx, it.n, cx + 110, y, { size: 36, weight: 500, color: '#1d1d1f', maxWidth: cw - 160 });
  });
  text(ctx, 'Доставка · 25 мин', cx + 40, cy + ch - 38, { size: 30, weight: 500, color: '#86868b' });

  // Accept button
  const bx = 34;
  const by = h - 220;
  const bw = w - 68;
  const bh = 150;
  rr(ctx, bx, by, bw, bh, 75);
  ctx.fillStyle = '#1d1d1f';
  ctx.fill();
  if (s.accepted > 0) {
    ctx.save();
    ctx.globalAlpha = s.lit * s.accepted;
    rr(ctx, bx, by, bw, bh, 75);
    ctx.fillStyle = '#30d158';
    ctx.fill();
    ctx.restore();
  }
  if (s.accepted < 0.5) {
    text(ctx, 'Приеми', w / 2, by + 97, { size: 56, weight: 700, color: '#fff', align: 'center', alpha: 1 - s.accepted * 2 });
  } else {
    ctx.save();
    ctx.globalAlpha = s.lit * (s.accepted - 0.5) * 2;
    check(ctx, w / 2 - 120, by + 76, 70, '#fff');
    text(ctx, 'Приета', w / 2 + 34, by + 97, { size: 56, weight: 700, color: '#fff', align: 'center' });
    ctx.restore();
  }

  // Tap ripple
  if (s.tap >= 0 && s.tap < 1) {
    ctx.save();
    rr(ctx, bx, by, bw, bh, 75);
    ctx.clip();
    ctx.fillStyle = alpha('#ffffff', 0.45 * (1 - s.tap));
    ctx.beginPath();
    ctx.arc(w / 2, by + bh / 2, 40 + s.tap * 420, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = alpha('#ffffff', 0.55 * (1 - s.tap));
    ctx.beginPath();
    ctx.arc(w / 2, by + bh / 2, 46 * (1 - s.tap * 0.4), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

/** Lighten (amt>0) or darken (amt<0) a hex colour. */
export const shade = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(Math.min(255, Math.max(0, amt < 0 ? c * (1 + amt) : c + (255 - c) * amt)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};
