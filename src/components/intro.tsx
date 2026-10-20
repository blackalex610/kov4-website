"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import flame from "@/assets/brand/kov4-flame.png";
import { platformOrder, platforms } from "@/content/orders";

/**
 * The welcome sequence on the homepage. Glovo, Wolt and Bolt Food each send an order into the
 * kov4 flame, which passes them straight on to three restaurants' POS terminals, and each
 * terminal prints a receipt. Then it opens onto the hero.
 *
 * Whether it plays is decided before first paint by the script in the root layout (it adds
 * `intro` to <html>): once per tab session, never with reduced motion, never without JS.
 * The timing lives in globals.css under "Intro".
 */

const DURATION = 2900; // when the overlay starts fading out (matches --intro-delay in CSS)

const restaurants = [
  { name: "Burger bar", dish: "2x Burger" },
  { name: "Pizzeria", dish: "1x Margherita" },
  { name: "Sushi place", dish: "1x Sushi set" },
];

const v = (vars: Record<string, string | number>) => vars as CSSProperties;

export function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("intro")) return;

    let ended = false;
    const end = () => {
      if (ended) return;
      ended = true;
      html.classList.add("intro-done");
      html.style.removeProperty("overflow");
      window.dispatchEvent(new Event("kov4:intro-end"));
    };
    html.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    const skip = () => {
      html.classList.add("intro-skip");
      end();
      window.setTimeout(() => setGone(true), 400);
    };

    const t1 = window.setTimeout(end, DURATION);
    const t2 = window.setTimeout(() => setGone(true), DURATION + 700);
    window.addEventListener("keydown", onKey);
    const overlay = document.getElementById("intro-overlay");
    overlay?.addEventListener("click", skip);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("keydown", onKey);
      overlay?.removeEventListener("click", skip);
      html.style.removeProperty("overflow");
    };
  }, []);

  if (gone) return null;

  return (
    <div id="intro-overlay" className="intro-overlay" aria-hidden>
      <div className="intro-glow" />
      <div className="intro-box">
        {/* Connection lines: one set per orientation, drawn in the box's own coordinates. */}
        <svg className="intro-lines intro-lines--wide" viewBox="0 0 160 90" preserveAspectRatio="none">
          {[22, 50, 78].map((y, i) => (
            <path key={`in${y}`} d={`M17.6 ${y * 0.9} L80 ${44 * 0.9}`} pathLength={1} style={v({ "--i": i })} className="in" />
          ))}
          {[22, 50, 78].map((y, i) => (
            <path key={`out${y}`} d={`M80 ${44 * 0.9} L142.4 ${y * 0.9}`} pathLength={1} style={v({ "--i": i })} className="out" />
          ))}
        </svg>
        <svg className="intro-lines intro-lines--tall" viewBox="0 0 90 150" preserveAspectRatio="none">
          {[18, 50, 82].map((x, i) => (
            <path key={`in${x}`} d={`M${x * 0.9} 13.5 L45 60`} pathLength={1} style={v({ "--i": i })} className="in" />
          ))}
          {[18, 50, 82].map((x, i) => (
            <path key={`out${x}`} d={`M45 60 L${x * 0.9} 129`} pathLength={1} style={v({ "--i": i })} className="out" />
          ))}
        </svg>

        {platformOrder.map((id, i) => {
          const p = platforms[id];
          return (
            <div key={id} className="intro-tile" style={v({ "--i": i, "--x": `var(--p${i}x)`, "--y": `var(--p${i}y)`, background: p.color, color: p.ink })}>
              {p.name}
            </div>
          );
        })}

        {platformOrder.map((id, i) => (
          <span key={`in-${id}`} className="intro-dot intro-dot--in"
            style={v({
              "--i": i,
              "--c": platforms[id].color,
              "--x1": `var(--p${i}x)`,
              "--y1": `var(--p${i}y)`,
              "--x2": "var(--vx)",
              "--y2": "var(--vy)",
            })} />
        ))}
        {[0, 1, 2].map((i) => (
          <span key={`out-${i}`} className="intro-dot intro-dot--out"
            style={v({
              "--i": i,
              "--c": "#ffb27a",
              "--x1": "var(--vx)",
              "--y1": "var(--vy)",
              "--x2": `var(--t${i}x)`,
              "--y2": `var(--t${i}y)`,
            })} />
        ))}

        <div className="intro-vortex">
          <span className="intro-ripple" style={v({ "--i": 0 })} />
          <span className="intro-ripple" style={v({ "--i": 1 })} />
          <span className="intro-ripple" style={v({ "--i": 2 })} />
          <Image src={flame} alt="" width={320} height={320} preload className="intro-mark" />
        </div>

        <div className="intro-word">
          <p>Every order. Every terminal. Instantly.</p>
        </div>

        {restaurants.map((r, i) => (
          <div key={r.name} className="intro-pos" style={v({ "--i": i, "--x": `var(--t${i}x)`, "--y": `var(--t${i}y)` })}>
            <div className="intro-paper-clip">
              <div className="intro-paper">
                <span className="intro-paper-line">{r.dish}</span>
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
            <span className="intro-pos-name">{r.name}</span>
          </div>
        ))}
      </div>
      <span className="intro-skip-hint">Click or press Esc to skip</span>
    </div>
  );
}
