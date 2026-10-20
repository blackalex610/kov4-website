import Image from "next/image";
import emblem from "@/assets/brand/kov4-emblem.png";
import mark from "@/assets/brand/kov4-mark.png";
import wordmark from "@/assets/brand/kov4-wordmark.png";
import { site } from "@/content/site";
import { cx } from "./ui";

// width/height are the display size, so the optimizer only makes 1x and 2x copies.

/** The vortex on a dark tile: the brand at icon size. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-night-ink", className)}
    >
      <Image src={mark} alt="" width={28} height={28} className="size-[82%]" />
    </span>
  );
}

/** Vortex and KOV4 lettering side by side, for the header. Reads on light and dark backgrounds. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <Image
        src={mark}
        alt=""
        width={44}
        height={44}
        loading="eager"
        className="size-11 drop-shadow-[0_0_14px_rgb(229_115_47/0.45)]"
      />
      <Image src={wordmark} alt={site.name} width={94} height={40} loading="eager" className="h-10 w-[94px]" />
    </span>
  );
}

/** The full stacked emblem: KOV4 lettering over the vortex. */
export function LogoEmblem({ className }: { className?: string }) {
  return (
    <Image src={emblem} alt={site.name} width={132} height={160} className={cx("h-40 w-[132px]", className)} />
  );
}
