"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "./ui";

/**
 * A horizontally scrolling row of cards that bleeds off the right edge of the
 * page, with previous/next buttons. Scrolling, swiping and keyboard focus all
 * work natively; the buttons are a convenience on top.
 */
export function Rail({ children, label, aside }: { children: ReactNode; label: string; aside?: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft <= 4,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const width = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const smooth = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    el.scrollBy({ left: dir * width, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <div>
      <ul
        ref={ref}
        aria-label={label}
        className="rail flex gap-4 overflow-x-auto px-5 pb-2 scroll-px-5 sm:gap-5 sm:px-8 sm:scroll-px-8 lg:px-[max(2.5rem,calc((100%-80rem)/2+2.5rem))] lg:scroll-px-[max(2.5rem,calc((100%-80rem)/2+2.5rem))]"
      >
        {children}
      </ul>
      <div className="mx-auto mt-8 flex max-w-page items-start justify-between gap-8 px-5 sm:px-8 lg:px-10">
        <div className="min-w-0">{aside}</div>
        <div className="flex shrink-0 gap-3">
          {([-1, 1] as const).map((dir) => {
            const disabled = dir === -1 ? edges.start : edges.end;
            return (
              <button
                key={dir}
                type="button"
                onClick={() => step(dir)}
                disabled={disabled}
                aria-label={dir === -1 ? "Назад" : "Напред"}
                className={cx(
                  "inline-flex size-11 items-center justify-center rounded-full bg-mist-deep text-ink transition-colors",
                  disabled ? "opacity-40" : "hover:bg-line-strong",
                )}
              >
                <svg viewBox="0 0 8 12" aria-hidden className={cx("h-3 w-2", dir === -1 && "rotate-180")}>
                  <path
                    d="M1.5 1.5 6 6l-4.5 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
