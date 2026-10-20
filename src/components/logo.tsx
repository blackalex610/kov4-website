import Image from "next/image";
import flame from "@/assets/brand/kov4-flame.png";
import { site } from "@/content/site";
import { cx } from "./ui";

// width/height are the display size, so the optimizer only makes 1x and 2x copies.

const alt = `${site.name} logo`;

/** The flame emblem on a dark tile: the brand at icon size. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-night-ink", className)}
    >
      <Image src={flame} alt="" width={28} height={28} className="size-[88%]" />
    </span>
  );
}

/** The flame emblem for the header. It carries the KOV4 lettering itself, so it stands alone. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center", className)}>
      <Image
        src={flame}
        alt={alt}
        width={56}
        height={56}
        loading="eager"
        className="size-12 drop-shadow-[0_0_14px_rgb(229_115_47/0.4)] sm:size-14"
      />
    </span>
  );
}

/** The emblem at footer size. */
export function LogoEmblem({ className }: { className?: string }) {
  return <Image src={flame} alt={alt} width={144} height={144} className={cx("size-36", className)} />;
}
