"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { platformOrder, platforms } from "@/content/orders";
import { BRAND, BURST_CENTER, BURST_WIDTH, K4_INSET, WORDMARK_BOX, paths } from "./brand-paths";

/**
 * The welcome sequence on the homepage:
 *
 *   Glovo, Wolt and Bolt Food each send an order to the small K4 mark → K4 turns and lights up →
 *   it passes the orders on to the laptop and the POS terminal → K4 rises to the top of the page
 *   and turns into the KOV4 wordmark: the K and the 4 step out of the sunburst, the sunburst
 *   opens into the O, and the V slides in between them.
 *
 * Whether it plays is decided before first paint by the script in the root layout (it adds
 * `intro` to <html>): once per tab session, never with reduced motion, never without JS.
 * All timing lives in globals.css under "Intro"; DURATION must match --intro-delay there.
 *
 * The wordmark is drawn from the same artwork, at the same place, as the hero's own
 * (#hero-wordmark, measured when the intro mounts), so the overlay fades away without the logo moving.
 */

const DURATION = 10800;

const v = (vars: Record<string, string | number>) => vars as CSSProperties;
const px = (n: number) => `${Math.round(n * 100) / 100}px`;

type Layout = { tx: number; ty: number; u: number; mx: number; my: number; ms: number };

/** Where the wordmark finally sits, and where the small K4 starts, both in the wordmark's own units. */
function measure(hub: HTMLElement): Layout {
  const target = document.getElementById("hero-wordmark")?.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const found = target !== undefined && target.width > 0;
  const width = found ? target.width : Math.min(vw * 0.8, 560);
  const left = found ? target.left : (vw - width) / 2;
  const top = found ? target.top : vh * 0.18;
  const u = width / WORDMARK_BOX.w;
  const tx = left - WORDMARK_BOX.x * u;
  const ty = top - WORDMARK_BOX.y * u;

  const h = hub.getBoundingClientRect();
  const ms = h.width / (BURST_WIDTH * u);
  const hx = (h.left + h.width / 2 - tx) / u;
  const hy = (h.top + h.height / 2 - ty) / u;
  return { tx, ty, u, mx: hx - ms * BURST_CENTER.x, my: hy - ms * BURST_CENTER.y, ms };
}

// The V starts small, behind the sunburst, and slides out to its place.
const V_CENTER = { x: 840.1, y: 304.75 };
const V_START = 0.3;

export function Intro() {
  const [gone, setGone] = useState(false);
  const [layout, setLayout] = useState<Layout | null>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;

    const place = () => {
      if (hubRef.current) setLayout(measure(hubRef.current));
    };
    place();
    window.addEventListener("resize", place);

    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      html.classList.add("intro-done");
      html.style.removeProperty("overflow");
      window.dispatchEvent(new Event("kov4:intro-end"));
    };
    html.style.overflow = "hidden";

    const skip = () => {
      html.classList.add("intro-skip");
      end();
      window.setTimeout(() => setGone(true), 400);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };

    // The sequence runs from first paint, so count from page load rather than from this effect.
    const left = Math.max(DURATION - performance.now(), 0);
    const t1 = window.setTimeout(end, left);
    const t2 = window.setTimeout(() => setGone(true), left + 700);
    window.addEventListener("keydown", onKey);
    const overlay = document.getElementById("intro-overlay");
    overlay?.addEventListener("click", skip);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", place);
      window.removeEventListener("keydown", onKey);
      overlay?.removeEventListener("click", skip);
      html.style.removeProperty("overflow");
    };
  }, []);

  if (gone) return null;

  const frame = layout ? `translate(${layout.tx} ${layout.ty}) scale(${layout.u})` : undefined;
  const { x: cx, y: cy } = BURST_CENTER;

  return (
    <div id="intro-overlay" className="intro-overlay" aria-hidden>
      <div className="intro-glow" />

      <div className="intro-box">
        {/* Connection lines: one set per orientation, drawn in the box's own coordinates. */}
        <svg className="intro-lines intro-lines--wide" viewBox="0 0 160 90" preserveAspectRatio="none">
          {[22, 50, 78].map((y, i) => (
            <path key={`in${y}`} d={`M17.6 ${y * 0.9} L80 ${44 * 0.9}`} pathLength={1} style={v({ "--i": i })} className="in" />
          ))}
          {[30, 66].map((y, i) => (
            <path key={`out${y}`} d={`M80 ${44 * 0.9} L142.4 ${y * 0.9}`} pathLength={1} style={v({ "--i": i })} className="out" />
          ))}
        </svg>
        <svg className="intro-lines intro-lines--tall" viewBox="0 0 90 150" preserveAspectRatio="none">
          {[18, 50, 82].map((x, i) => (
            <path key={`in${x}`} d={`M${x * 0.9} 13.5 L45 60`} pathLength={1} style={v({ "--i": i })} className="in" />
          ))}
          {[27, 73].map((x, i) => (
            <path key={`out${x}`} d={`M45 60 L${x * 0.9} 129`} pathLength={1} style={v({ "--i": i })} className="out" />
          ))}
        </svg>

        {platformOrder.map((id, i) => {
          const p = platforms[id];
          return (
            <div
              key={id}
              className="intro-tile"
              style={v({ "--i": i, "--x": `var(--p${i}x)`, "--y": `var(--p${i}y)`, background: p.color, color: p.ink })}
            >
              {p.name}
            </div>
          );
        })}

        {/* Orders travelling from each platform to K4. */}
        {platformOrder.map((id, i) => (
          <span
            key={`in-${id}`}
            className="intro-dot intro-dot--in"
            style={v({
              "--i": i,
              "--c": platforms[id].color,
              "--x1": `var(--p${i}x)`,
              "--y1": `var(--p${i}y)`,
              "--x2": "var(--vx)",
              "--y2": "var(--vy)",
            })}
          />
        ))}
        {/* ...and from K4 on to the laptop and the POS terminal, two each. */}
        {[0, 1, 2, 3].map((n) => (
          <span
            key={`out-${n}`}
            className="intro-dot intro-dot--out"
            style={v({
              "--n": n,
              "--c": "#ffb27a",
              "--x1": "var(--vx)",
              "--y1": "var(--vy)",
              "--x2": `var(--d${n % 2}x)`,
              "--y2": `var(--d${n % 2}y)`,
            })}
          />
        ))}

        {/* Marks where the small K4 sits; the K4 itself is drawn in the SVG layer above. */}
        <div ref={hubRef} className="intro-hub">
          <span className="intro-hub-glow" />
          <span className="intro-ripple" style={v({ "--i": 0 })} />
          <span className="intro-ripple" style={v({ "--i": 1 })} />
          <span className="intro-ripple" style={v({ "--i": 2 })} />
        </div>

        <div className="intro-word">
          <p>Една система. Всички поръчки.</p>
        </div>

        <div className="intro-dev intro-laptop" style={v({ "--x": "var(--d0x)", "--y": "var(--d0y)" })}>
          <div className="intro-lid">
            <span className="intro-screen-bar" />
            <span className="intro-screen-row" />
            <span className="intro-screen-row short" />
            <span className="intro-screen-row new" />
          </div>
          <div className="intro-lap-base" />
          <span className="intro-dev-name">Лаптоп</span>
        </div>

        <div className="intro-dev intro-pos" style={v({ "--x": "var(--d1x)", "--y": "var(--d1y)" })}>
          <div className="intro-paper-clip">
            <div className="intro-paper">
              <span className="intro-paper-line">2× Бургер</span>
              <svg viewBox="0 0 24 24" className="intro-smile" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9.5" />
                <circle cx="8.6" cy="9.8" r="1.1" fill="currentColor" stroke="none" />
                <circle cx="15.4" cy="9.8" r="1.1" fill="currentColor" stroke="none" />
                <path d="M7.6 14.2c1.2 2 2.7 3 4.4 3s3.2-1 4.4-3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div className="intro-screen">
            <span className="intro-screen-bar" />
            <span className="intro-screen-row" />
            <span className="intro-screen-row short" />
          </div>
          <span className="intro-dev-name">POS терминал</span>
        </div>
      </div>

      {/* The K4 mark and the wordmark it turns into, in one SVG laid over the whole screen. */}
      <svg
        className="intro-brand"
        focusable="false"
        style={v({
          "--wm-orange": BRAND.orange,
          "--wm-cream": BRAND.cream,
          "--wm-dark": BRAND.dark,
          visibility: layout ? "visible" : "hidden",
        })}
      >
        {layout ? (
          <g transform={frame}>
            <g className="wm-hub">
              <g
                className="wm-move"
                style={v({ "--mx": px(layout.mx), "--my": px(layout.my), "--ms": layout.ms })}
              >
                <path
                  className="wm-v"
                  d={paths.V}
                  style={v({
                    "--vx": px(BURST_CENTER.x - V_START * V_CENTER.x),
                    "--vy": px(BURST_CENTER.y - V_START * V_CENTER.y),
                    "--vs": V_START,
                  })}
                />
                <g transform={`translate(${cx} ${cy})`}>
                  <g className="wm-spin">
                    <g transform={`translate(${-cx} ${-cy})`}>
                      <path className="wm-burst" d={paths.burst} />
                      <g transform={`translate(${cx} ${cy})`}>
                        <g className="wm-oval">
                          <path transform={`translate(${-cx} ${-cy})`} d={paths.oval} fillRule="evenodd" />
                        </g>
                      </g>
                      <path
                        className="wm-k"
                        d={paths.K}
                        style={v({ "--kx": px(K4_INSET.K.x), "--ky": px(K4_INSET.K.y), "--ks": K4_INSET.scale })}
                      />
                      <path
                        className="wm-four"
                        d={paths.four}
                        fillRule="evenodd"
                        style={v({ "--fx": px(K4_INSET.four.x), "--fy": px(K4_INSET.four.y), "--fs": K4_INSET.scale })}
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </g>
        ) : null}
      </svg>

      <span className="intro-skip-hint">Натиснете или Esc, за да пропуснете</span>
    </div>
  );
}
