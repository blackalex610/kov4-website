import { site } from "@/content/site";
import { cx } from "./ui";

/** Three incoming lines merging into one: the brand mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className={cx("size-7 shrink-0", className)}>
      <rect width="28" height="28" rx="7.5" fill="var(--color-night)" />
      <g fill="none" strokeLinecap="round" strokeWidth="2.2">
        <path d="M6.5 8.5c4.6 0 5.4 5.5 9.3 5.5" stroke="#fff" />
        <path d="M6.5 14h9.3" stroke="#fff" />
        <path d="M6.5 19.5c4.6 0 5.4-5.5 9.3-5.5" stroke="#fff" />
        <path d="M15.8 14h5.7" stroke="var(--color-signal)" />
      </g>
    </svg>
  );
}

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={inverse ? "rounded-[7.5px] ring-1 ring-night-line" : undefined} />
      <span
        className={cx(
          "text-[1.3125rem] leading-none font-[680] tracking-[-0.045em]",
          inverse ? "text-white" : "text-ink",
        )}
      >
        {site.name}
      </span>
    </span>
  );
}
