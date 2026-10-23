import type { CSSProperties } from "react";
import { BRAND, K4_INSET, WORDMARK_BOX, paths } from "./brand-paths";

const box = `${WORDMARK_BOX.x} ${WORDMARK_BOX.y} ${WORDMARK_BOX.w} ${WORDMARK_BOX.h}`;

/**
 * The complete KOV4 wordmark: K, the sunburst that doubles as the O, V and the orange 4.
 * The intro animation (intro.tsx) builds this same artwork piece by piece, so both use brand-paths.ts.
 */
export function Wordmark({
  id,
  className,
  style,
  label = "KOV4",
}: {
  id?: string;
  className?: string;
  style?: CSSProperties;
  label?: string | null;
}) {
  return (
    <svg
      id={id}
      viewBox={box}
      className={className}
      style={style}
      role={label ? "img" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={paths.K} fill={BRAND.cream} />
      {/* The oval is a real cut-out, so the page shows through the O. */}
      <path d={`${paths.burst}${paths.oval}`} fill={BRAND.orange} fillRule="evenodd" />
      <path d={paths.V} fill={BRAND.cream} />
      <path d={paths.four} fill={BRAND.orange} fillRule="evenodd" />
    </svg>
  );
}

/** The small K4 mark: the sunburst with K and 4 set inside it. Used at icon size and as the intro's hub. */
export function K4Mark({ className, label = null }: { className?: string; label?: string | null }) {
  return (
    <svg
      viewBox="350 140 332 320"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={paths.burst} fill={BRAND.orange} />
      <path d={paths.K} fill={BRAND.dark} transform={`translate(${K4_INSET.K.x} ${K4_INSET.K.y}) scale(${K4_INSET.scale})`} />
      <path
        d={paths.four}
        fill={BRAND.dark}
        fillRule="evenodd"
        transform={`translate(${K4_INSET.four.x} ${K4_INSET.four.y}) scale(${K4_INSET.scale})`}
      />
    </svg>
  );
}
