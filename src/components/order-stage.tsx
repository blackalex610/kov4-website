"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import mark from "@/assets/brand/kov4-mark.png";
import wordmark from "@/assets/brand/kov4-wordmark.png";
import {
  itemCount,
  makeOrder,
  money,
  platformOrder,
  platforms,
  seeded,
  type Order,
  type PlatformId,
} from "@/content/orders";
import { cx } from "./ui";

/**
 * The hero scene: orders leave Glovo, Wolt and Bolt Food, pass through the kov4 hub,
 * land on the restaurant's POS terminal and print as a receipt. A new random order
 * arrives every few seconds.
 *
 * Drawn on a fixed 1000 × 800 canvas and scaled to fit, so the wires, the moving dots
 * and the boxes they connect always line up. Illustrative only: not live data.
 */

const W = 1000;
const H = 800;

const TILE = { x: 892, w: 104, h: 80 };
const tileTop: Record<PlatformId, number> = { glovo: 10, wolt: 110, bolt: 210 };
const HUB = { x: 735, y: 150, r: 54 };
const TERMINAL = { x: 6, y: 96, w: 594, h: 462 };
const PRINTER = { x: 640, y: 596, w: 312, h: 146 };
const RECEIPT = { x: 670, w: 216, top: 206 };

const wires: Record<PlatformId | "pos" | "printer", string> = {
  glovo: `M${TILE.x} 50 C845 50 830 150 ${HUB.x + HUB.r} 150`,
  wolt: `M${TILE.x} 150 L${HUB.x + HUB.r} 150`,
  bolt: `M${TILE.x} 250 C845 250 830 150 ${HUB.x + HUB.r} 150`,
  pos: `M${HUB.x - HUB.r} 150 C640 150 646 250 ${TERMINAL.x + TERMINAL.w} 250`,
  printer: `M${TERMINAL.x + TERMINAL.w} 470 C634 470 612 668 ${PRINTER.x + 2} 668`,
};

/** Milliseconds from the start of each order's journey. */
const T = {
  leg1: 260,
  leg1Dur: 560,
  hub: 820,
  leg2: 860,
  leg2Dur: 420,
  row: 1280,
  leg3: 1380,
  leg3Dur: 420,
  print: 1800,
  cycle: 4600,
};

const ms = (n: number) => `${n}ms`;

// A fixed lunch-rush starting point, so the server render and the first client render match.
const START_MINUTES = 12 * 60 + 32;
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const SEED: Order[] = (() => {
  const rand = seeded(11);
  const mix: PlatformId[] = ["glovo", "bolt", "glovo", "wolt", "bolt"];
  const offsets = [0, 1, 4, 6, 8];
  return mix.map((p, i) => makeOrder(1256 - i, hhmm(START_MINUTES - offsets[i]), rand, p));
})();

const SEED_COUNTS: Record<PlatformId, number> = { glovo: 5, wolt: 4, bolt: 3 };

type Status = "new" | "preparing" | "ready";

const statusFor = (i: number): Status => (i === 0 ? "new" : i < 3 ? "preparing" : "ready");

const statusStyle: Record<Status, { label: string; className: string }> = {
  new: { label: "New", className: "bg-[#e5732f] text-white" },
  preparing: { label: "Preparing", className: "bg-[#3a2819] text-[#ffc69b]" },
  ready: { label: "Ready", className: "bg-[#18291f] text-[#86dfaa]" },
};

export function OrderStage({ className }: { className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [rows, setRows] = useState<Order[]>(SEED);
  const [counts, setCounts] = useState(SEED_COUNTS);
  const [active, setActive] = useState<Order | null>(null);
  const [receipt, setReceipt] = useState<{ current: Order; prev: Order | null }>({ current: SEED[0], prev: null });

  // Fit the fixed canvas to the available width.
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The order loop. Waits for the intro to finish, and pauses while off screen or in a background tab.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = outer.current;
    if (!el) return;

    const html = document.documentElement;
    let ready = !(html.classList.contains("intro") && !html.classList.contains("intro-done"));
    let visible = true;
    let running = false;
    let seq = 1257;
    let minutes = START_MINUTES;
    const timers = new Set<number>();
    const later = (delay: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, delay);
      timers.add(id);
    };

    const cycle = () => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      minutes += Math.random() < 0.5 ? 1 : 2;
      const order = makeOrder(seq++, hhmm(minutes));
      setActive(order);
      later(T.row, () => {
        setRows((rs) => [order, ...rs].slice(0, 6));
        setCounts((c) => ({ ...c, [order.platform]: c[order.platform] + 1 }));
      });
      later(T.print, () => setReceipt((r) => ({ current: order, prev: r.current })));
      later(T.cycle, cycle);
    };

    const maybeStart = () => {
      if (running || !ready || !visible || document.hidden) return;
      running = true;
      cycle();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      maybeStart();
    });
    io.observe(el);

    const onVisibility = () => maybeStart();
    document.addEventListener("visibilitychange", onVisibility);

    const onIntroEnd = () => {
      ready = true;
      later(350, maybeStart);
    };
    if (ready) later(700, maybeStart);
    else window.addEventListener("kov4:intro-end", onIntroEnd, { once: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("kov4:intro-end", onIntroEnd);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const total = counts.glovo + counts.wolt + counts.bolt;

  return (
    <div
      ref={outer}
      role="img"
      aria-label="Animated illustration: orders from Glovo, Wolt and Bolt Food pass through kov4 straight to a restaurant's POS terminal, which prints a receipt for each one."
      className={cx("relative aspect-[1000/800] w-full", className)}
    >
      <div
        aria-hidden
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: W, height: H, transform: `scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {/* Warm light pooling on the counter */}
        <div className="pointer-events-none absolute -inset-x-10 bottom-0 h-[86px] rounded-[50%] bg-[radial-gradient(60%_100%_at_50%_0%,rgb(229_115_47/0.16),transparent_70%)]" />
        <div className="pointer-events-none absolute -inset-x-10 bottom-[56px] h-px bg-[linear-gradient(90deg,transparent,rgb(255_200_160/0.16)_25%,rgb(255_200_160/0.16)_75%,transparent)]" />

        {/* Wires */}
        <svg className="absolute inset-0 overflow-visible" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
          <defs>
            <linearGradient id="os-wire" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#e5732f" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffb27a" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {Object.entries(wires).map(([k, d]) => (
            <g key={k}>
              <path d={d} stroke="#e5732f" strokeOpacity="0.18" strokeWidth="10" strokeLinecap="round" />
              <path d={d} stroke="url(#os-wire)" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          {active ? (
            <g key={active.seq}>
              <Flash d={wires[active.platform]} color={platforms[active.platform].color} delay={T.leg1} dur={T.leg1Dur} />
              <Flash d={wires.pos} color="#ffb27a" delay={T.leg2} dur={T.leg2Dur} />
              <Flash d={wires.printer} color="#ffb27a" delay={T.leg3} dur={T.leg3Dur} />
            </g>
          ) : null}
        </svg>

        {/* Dots travelling the wires */}
        {active ? (
          <Fragment key={active.seq}>
            <Dot d={wires[active.platform]} color={platforms[active.platform].color} delay={T.leg1} dur={T.leg1Dur} />
            <Dot d={wires.pos} color="#ffb27a" delay={T.leg2} dur={T.leg2Dur} />
            <Dot d={wires.printer} color="#ffb27a" delay={T.leg3} dur={T.leg3Dur} />
          </Fragment>
        ) : null}

        <Terminal rows={rows} counts={counts} total={total} />
        <Hub hit={active?.seq ?? null} />
        {platformOrder.map((p) => (
          <PlatformTile key={p} id={p} ping={active?.platform === p ? active.seq : null} />
        ))}
        <Printer receipt={receipt} />
      </div>
    </div>
  );
}

function Flash({ d, color, delay, dur }: { d: string; color: string; delay: number; dur: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      className="os-flash"
      stroke={color}
      strokeWidth="5"
      strokeLinecap="round"
      style={{ animationDelay: ms(delay), animationDuration: ms(dur), color }}
    />
  );
}

function Dot({ d, color, delay, dur }: { d: string; color: string; delay: number; dur: number }) {
  return (
    <span
      className="os-dot"
      style={
        {
          offsetPath: `path("${d}")`,
          animationDelay: ms(delay),
          animationDuration: ms(dur),
          "--c": color,
        } as CSSProperties
      }
    />
  );
}

function PlatformTile({ id, ping }: { id: PlatformId; ping: number | null }) {
  const p = platforms[id];
  return (
    <div className="absolute" style={{ left: TILE.x, top: tileTop[id], width: TILE.w, height: TILE.h }}>
      <div
        key={ping ?? "idle"}
        className={cx(
          "relative flex size-full items-center justify-center rounded-[20px] text-center leading-[0.92] font-[800] tracking-[-0.04em]",
          ping !== null && "os-bump",
        )}
        style={{
          background: `linear-gradient(160deg, color-mix(in oklab, ${p.color} 82%, white), ${p.color} 55%, color-mix(in oklab, ${p.color} 80%, black))`,
          color: p.ink,
          boxShadow: `0 18px 40px -16px ${p.color}aa, inset 0 1px 0 rgb(255 255 255 / 0.35), inset 0 -2px 0 rgb(0 0 0 / 0.15)`,
          fontSize: id === "bolt" ? 25 : 27,
        }}
      >
        {id === "bolt" ? (
          <span>
            Bolt
            <br />
            Food
          </span>
        ) : (
          p.name
        )}
        {ping !== null ? (
          <>
            <span className="os-ring absolute inset-0 rounded-[20px]" style={{ color: p.color }} />
            <span className="os-badge absolute -top-3 -right-3 flex h-7 min-w-7 items-center justify-center rounded-full bg-[#ff4d2e] px-2 text-[14px] font-bold tracking-normal text-white shadow-[0_6px_14px_-4px_rgb(255_77_46/0.8)]">
              +1
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Hub({ hit }: { hit: number | null }) {
  const size = HUB.r * 2;
  return (
    <div className="absolute" style={{ left: HUB.x - HUB.r, top: HUB.y - HUB.r, width: size, height: size }}>
      <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgb(229_115_47/0.32),transparent_68%)]" />
      <div className="absolute inset-0 rounded-full bg-[#0b0908] shadow-[0_0_0_1px_rgb(229_115_47/0.45),0_0_40px_-6px_rgb(229_115_47/0.6),inset_0_0_20px_rgb(229_115_47/0.18)]" />
      <Image
        src={mark}
        alt=""
        width={92}
        height={92}
        className="os-spin absolute inset-[8px] size-[calc(100%-16px)]"
      />
      {hit !== null ? (
        <Fragment key={hit}>
          <span className="os-ripple absolute inset-0 rounded-full" style={{ animationDelay: ms(T.hub) }} />
          <span
            className="os-hub-bump absolute inset-0 rounded-full"
            style={{ animationDelay: ms(T.hub) }}
          />
        </Fragment>
      ) : null}
      <span className="absolute bottom-full left-1/2 mb-4 -translate-x-1/2 rounded-full border border-[#e5732f]/35 bg-[#120e0b]/90 px-3 py-1 text-[13px] font-semibold tracking-[0.14em] whitespace-nowrap text-[#ffb27a] uppercase">
        kov4 hub
      </span>
    </div>
  );
}

function Terminal({ rows, counts, total }: { rows: Order[]; counts: Record<PlatformId, number>; total: number }) {
  const latest = rows[0];
  return (
    <div
      className="absolute"
      style={{
        left: TERMINAL.x,
        top: TERMINAL.y,
        width: TERMINAL.w,
        height: TERMINAL.h,
        transform: "perspective(2200px) rotateY(-7deg)",
        transformOrigin: "100% 50%",
      }}
    >
      {/* Stand */}
      <div className="absolute top-full left-1/2 h-[118px] w-[96px] -translate-x-1/2 bg-[linear-gradient(90deg,#0d0b0a,#2a2420_45%,#0f0d0b)] [clip-path:polygon(18%_0,82%_0,100%_100%,0_100%)]" />
      <div className="absolute top-[calc(100%+110px)] left-1/2 h-[30px] w-[300px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#2c2622,#0e0c0a)] shadow-[0_16px_30px_-8px_rgb(0_0_0/0.9)]" />

      {/* Bezel */}
      <div className="absolute inset-0 rounded-[26px] bg-[linear-gradient(160deg,#2b2521,#0d0b0a_40%,#151210)] p-[14px] pb-[46px] shadow-[0_50px_90px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_235_215/0.08),0_0_120px_-40px_rgb(229_115_47/0.45)]">
        {/* Screen */}
        <div className="relative flex size-full flex-col overflow-hidden rounded-[12px] bg-[linear-gradient(180deg,#1a1512,#110e0c)] text-[#efe6dd]">
          <div className="flex h-[42px] shrink-0 items-center justify-between border-b border-white/[0.06] px-5 text-[14px]">
            <span className="flex items-center gap-2 font-semibold tracking-[-0.01em]">
              <Image src={mark} alt="" width={20} height={20} className="size-5" />
              Restaurant POS
            </span>
            <span className="flex items-center gap-2 text-[#ab9e92]">
              <span className="relative flex size-2">
                <span className="os-live absolute inset-0 rounded-full bg-[#3ddc84]" />
                <span className="relative size-2 rounded-full bg-[#3ddc84]" />
              </span>
              Live
              <span className="tabular ml-2 text-[#efe6dd]">{latest.time}</span>
            </span>
          </div>

          <div className="flex h-[48px] shrink-0 items-center gap-6 border-b border-white/[0.06] px-5 text-[16px] text-[#ab9e92]">
            <span className="flex items-center gap-2 font-semibold text-[#efe6dd]">
              All orders
              <span
                key={total}
                className="os-count tabular rounded-[7px] bg-[#e5732f] px-2 py-0.5 text-[14px] font-bold text-white"
              >
                {total}
              </span>
            </span>
            {platformOrder.map((p) => (
              <span key={p} className="flex items-center gap-1.5">
                {platforms[p].short}
                <span key={counts[p]} className="os-count tabular font-semibold text-[#efe6dd]">
                  {counts[p]}
                </span>
              </span>
            ))}
          </div>

          <ul className="relative min-h-0 flex-1 overflow-hidden">
            {rows.map((o, i) => {
              const p = platforms[o.platform];
              const status = statusStyle[statusFor(i)];
              return (
                <li
                  key={o.seq}
                  className={cx(
                    "grid h-[61px] grid-cols-[66px_150px_74px_54px_1fr] items-center gap-x-3 border-b border-white/[0.05] px-5 text-[15px]",
                    o.seq > SEED[0].seq && i === 0 && "os-row-in",
                  )}
                >
                  <span className="tabular text-[#ab9e92]">#{o.seq}</span>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] text-[14px] font-[800]"
                      style={{ background: p.color, color: p.ink }}
                    >
                      {p.short[0]}
                    </span>
                    <span className="truncate">{p.name}</span>
                  </span>
                  <span className="text-[#c4b8ad]">
                    {itemCount(o)} {itemCount(o) === 1 ? "item" : "items"}
                  </span>
                  <span className="tabular text-[#c4b8ad]">{o.time}</span>
                  <span className="justify-self-end">
                    <span
                      className={cx(
                        "inline-flex h-[28px] items-center rounded-[8px] px-3 text-[13px] font-semibold transition-colors duration-500",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Lettering on the bezel */}
        <div className="absolute inset-x-0 bottom-[9px] flex justify-center">
          <Image src={wordmark} alt="" width={66} height={28} className="h-[28px] w-[66px] opacity-90" />
        </div>
      </div>
    </div>
  );
}

function Printer({ receipt }: { receipt: { current: Order; prev: Order | null } }) {
  const printing = receipt.prev !== null;
  return (
    <>
      {/* Paper coming out of the slot; clipped at the slot so it looks fed from inside. */}
      <div
        className="absolute overflow-hidden"
        style={{ left: RECEIPT.x, top: RECEIPT.top, width: RECEIPT.w, height: PRINTER.y + 10 - RECEIPT.top }}
      >
        {receipt.prev ? <Receipt key={receipt.prev.seq} order={receipt.prev} className="os-tear" /> : null}
        <Receipt key={receipt.current.seq} order={receipt.current} className={printing ? "os-print" : undefined} />
      </div>

      <div className="absolute" style={{ left: PRINTER.x, top: PRINTER.y, width: PRINTER.w, height: PRINTER.h }}>
        {/* Lid with the paper slot */}
        <div className="absolute inset-x-0 top-0 h-[46px] rounded-t-[22px] rounded-b-[6px] bg-[linear-gradient(180deg,#36302b,#1b1714)] shadow-[inset_0_1px_0_rgb(255_235_215/0.12)]">
          <div className="absolute inset-x-[22px] top-[10px] h-[6px] rounded-full bg-[#050403] shadow-[inset_0_2px_3px_rgb(0_0_0/0.9)]" />
        </div>
        {/* Body */}
        <div className="absolute inset-x-0 top-[40px] bottom-0 rounded-b-[20px] bg-[linear-gradient(180deg,#1d1916,#0c0a09)] shadow-[0_30px_50px_-20px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_235_215/0.06)]">
          <div className="absolute top-[30px] left-[24px] flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-[#6f655c] uppercase">
            <span
              key={receipt.current.seq}
              className={cx("size-[9px] rounded-full bg-[#3ddc84] shadow-[0_0_8px_#3ddc84]", printing && "os-led")}
            />
            Printer
          </div>
          <div className="absolute right-[24px] bottom-[26px] flex gap-[6px]">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="h-[30px] w-[4px] rounded-full bg-[#060504]" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Smiley() {
  return (
    <svg viewBox="0 0 40 40" className="mx-auto size-[38px]" fill="none" stroke="#211c18" strokeWidth="2.4">
      <circle cx="20" cy="20" r="17" />
      <circle cx="14" cy="16" r="1.6" fill="#211c18" stroke="none" />
      <circle cx="26" cy="16" r="1.6" fill="#211c18" stroke="none" />
      <path d="M12.5 23.5c2 3.6 4.6 5.3 7.5 5.3s5.5-1.7 7.5-5.3" strokeLinecap="round" />
    </svg>
  );
}

function Receipt({ order, className }: { order: Order; className?: string }) {
  const p = platforms[order.platform];
  return (
    <div className={cx("absolute inset-x-0 bottom-0", className)}>
      <div className="receipt-paper bg-[#fbf8f3] px-[15px] pt-[20px] pb-[14px] font-mono text-[13px] leading-[1.4] text-[#211c18] shadow-[0_-10px_30px_-12px_rgb(0_0_0/0.6)]">
        <p className="text-center text-[15px] font-semibold tracking-[0.04em]">ORDER #{order.seq}</p>
        <p className="text-center text-[#5b524b]">
          {p.name} · {order.ref}
        </p>
        <p className="text-center text-[#5b524b]">{order.time} · Delivery</p>
        <div className="my-[7px] border-t border-dashed border-[#b9b0a6]" />
        {order.lines.map((l) => (
          <div key={l.name}>
            <p className="flex justify-between gap-2">
              <span>
                {l.qty}x {l.name}
              </span>
              <span className="tabular shrink-0">{(l.qty * l.price).toFixed(2)}</span>
            </p>
            {l.mod ? <p className="pl-[18px] text-[#5b524b]">{l.mod}</p> : null}
          </div>
        ))}
        <div className="my-[7px] border-t border-dashed border-[#b9b0a6]" />
        <p className="flex justify-between text-[14px] font-semibold">
          <span>TOTAL</span>
          <span className="tabular">{money(order.total)}</span>
        </p>
        {order.note ? <p className="mt-[2px] text-[#5b524b] italic">Note: {order.note}</p> : null}
        <div className="my-[8px] border-t border-dashed border-[#b9b0a6]" />
        <Smiley />
        <p className="mt-[5px] text-center font-semibold">Thank you, {order.customer}!</p>
        <p className="text-center text-[#5b524b]">Enjoy your meal</p>
      </div>
    </div>
  );
}
