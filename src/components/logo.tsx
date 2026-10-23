import { cx } from "./ui";
import { K4Mark, Wordmark } from "./wordmark";

/** The K4 mark at icon size, for small badges inside illustrations. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-night-ink", className)}
    >
      <K4Mark className="size-[78%]" />
    </span>
  );
}

/** The KOV4 wordmark for the header. */
export function Logo({ className }: { className?: string }) {
  return <Wordmark className={cx("h-7 w-auto sm:h-8", className)} />;
}

/** The wordmark at footer size. */
export function LogoEmblem({ className }: { className?: string }) {
  return <Wordmark className={cx("h-auto w-full max-w-[22rem]", className)} />;
}
