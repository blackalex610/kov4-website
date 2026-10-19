import { rand } from '../lib/anim';
import { ORDER, ORDER_TOTAL, money, Platform } from '../theme';
import { Ctx, dashedLine, text } from './draw';

const INK = '#1a1a1a';
const PAPER = '#fbfaf6';

export const PLATFORM_RECEIPT_TEX = { w: 560, h: 1180 };
export const FISCAL_RECEIPT_TEX = { w: 560, h: 1320 };

const paper = (ctx: Ctx, w: number, h: number) => {
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  // Very faint thermal-paper grain so it doesn't read as flat CG white.
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(0,0,0,${0.012 + rand(i) * 0.02})`;
    ctx.fillRect(rand(i * 3.1) * w, rand(i * 7.7) * h, 2, 2);
  }
};

const itemRows = (ctx: Ctx, y0: number, w: number) => {
  ORDER.items.forEach((it, i) => {
    const y = y0 + i * 62;
    text(ctx, `${it.q} x ${it.n}`, 40, y, { size: 26, mono: true, color: INK, maxWidth: w - 190 });
    text(ctx, money(it.q * it.p).replace(' €', ''), w - 40, y, { size: 26, mono: true, color: INK, align: 'right' });
  });
  return y0 + ORDER.items.length * 62;
};

export const drawPlatformReceipt = (ctx: Ctx, p: Platform) => {
  const { w, h } = PLATFORM_RECEIPT_TEX;
  paper(ctx, w, h);
  text(ctx, p.name.toUpperCase(), w / 2, 120, { size: 64, weight: 800, color: INK, align: 'center', ls: 6 });
  text(ctx, 'ПОРЪЧКА ЗА ДОСТАВКА', w / 2, 172, { size: 24, mono: true, color: INK, align: 'center', ls: 2 });
  dashedLine(ctx, 30, w - 30, 214, INK);
  text(ctx, `#${ORDER.no}`, w / 2, 316, { size: 96, weight: 800, color: INK, align: 'center', ls: -2 });
  text(ctx, `Приета ${ORDER.time} · ${ORDER.date}`, w / 2, 368, { size: 24, mono: true, color: INK, align: 'center' });
  dashedLine(ctx, 30, w - 30, 410, INK);
  const y = itemRows(ctx, 472, w);
  dashedLine(ctx, 30, w - 30, y + 2, INK);
  text(ctx, 'ОБЩО', 40, y + 70, { size: 34, weight: 800, color: INK });
  text(ctx, money(ORDER_TOTAL), w - 40, y + 70, { size: 34, weight: 800, color: INK, align: 'right' });
  text(ctx, 'Платено онлайн', 40, y + 118, { size: 24, mono: true, color: INK });
  text(ctx, 'Куриер: пристига 19:40', 40, y + 160, { size: 24, mono: true, color: INK });
  // Barcode
  let x = 70;
  for (let i = 0; x < w - 70; i++) {
    const bw = 2 + Math.floor(rand(i + 40) * 3) * 2;
    if (rand(i + 90) > 0.35) {
      ctx.fillStyle = INK;
      ctx.fillRect(x, h - 230, bw, 120);
    }
    x += bw + 3;
  }
  text(ctx, `*${p.ordersPrefix}${ORDER.no}*`, w / 2, h - 70, { size: 24, mono: true, color: INK, align: 'center', ls: 4 });
};

export const drawFiscalReceipt = (ctx: Ctx) => {
  const { w, h } = FISCAL_RECEIPT_TEX;
  paper(ctx, w, h);
  text(ctx, 'БУРГЕР БАР', w / 2, 96, { size: 46, weight: 800, color: INK, align: 'center', ls: 2 });
  text(ctx, 'гр. София, ул. Примерна 12', w / 2, 140, { size: 22, mono: true, color: INK, align: 'center' });
  text(ctx, 'ЕИК 000000000', w / 2, 174, { size: 22, mono: true, color: INK, align: 'center' });
  dashedLine(ctx, 30, w - 30, 214, INK);
  text(ctx, 'КАСОВА БЕЛЕЖКА', w / 2, 286, { size: 44, weight: 800, color: INK, align: 'center', ls: 1 });
  text(ctx, `Поръчка #${ORDER.no} · Доставка`, w / 2, 330, { size: 22, mono: true, color: INK, align: 'center' });
  dashedLine(ctx, 30, w - 30, 372, INK);
  const y = itemRows(ctx, 434, w);
  dashedLine(ctx, 30, w - 30, y + 2, INK);
  text(ctx, 'ОБЩА СУМА', 40, y + 72, { size: 34, weight: 800, color: INK });
  text(ctx, money(ORDER_TOTAL), w - 40, y + 72, { size: 34, weight: 800, color: INK, align: 'right' });
  text(ctx, 'ПЛАЩАНЕ: ОНЛАЙН', 40, y + 120, { size: 22, mono: true, color: INK });
  text(ctx, `${ORDER.date}  ${ORDER.time}`, 40, y + 156, { size: 22, mono: true, color: INK });
  text(ctx, '№ 0004521', w - 40, y + 156, { size: 22, mono: true, color: INK, align: 'right' });
  // QR-style code
  const q = 9;
  const n = 25;
  const qx = (w - n * q) / 2;
  const qy = h - 360;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const finder = (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
      const on = finder
        ? (() => {
            const rr0 = r >= n - 7 ? r - (n - 7) : r;
            const cc0 = c >= n - 7 ? c - (n - 7) : c;
            return rr0 === 0 || rr0 === 6 || cc0 === 0 || cc0 === 6 || (rr0 >= 2 && rr0 <= 4 && cc0 >= 2 && cc0 <= 4);
          })()
        : rand(r * 31 + c * 7) > 0.52;
      if (on) {
        ctx.fillStyle = INK;
        ctx.fillRect(qx + c * q, qy + r * q, q, q);
      }
    }
  }
  text(ctx, 'ФИСКАЛЕН БОН', w / 2, h - 70, { size: 30, weight: 800, color: INK, align: 'center', ls: 3 });
};
