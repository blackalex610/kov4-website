"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Marks its children as in view the first time they scroll into the viewport,
 * which starts any `.seq-rise` / `.seq-draw` sequence inside (see globals.css).
 * Plays once. Reduced-motion users and no-JS visitors see the final state.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      // Start once the top of the block is a quarter of the way up the screen,
      // however tall the block is (it stacks to several screens on phones).
      { rootMargin: "0px 0px -25% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" data-inview={inView ? "" : undefined} className={className}>
      {children}
    </div>
  );
}
