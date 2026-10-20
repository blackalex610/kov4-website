import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import type { Photo } from "@/content/photos";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("mx-auto w-full max-w-page px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "dark" | "inverse" | "ghost-dark";

const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[1rem] font-medium tracking-[-0.014em] whitespace-nowrap transition-colors duration-150";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-[0_10px_30px_-10px_rgb(229_115_47/0.65)] hover:bg-brand-hover",
  secondary: "border border-line-strong text-ink hover:border-ink-faint hover:bg-mist",
  dark: "border border-brand text-ink hover:bg-brand hover:text-white",
  inverse: "bg-ink text-night hover:bg-sky-light",
  "ghost-dark": "border border-night-line text-on-dark hover:border-on-dark-soft hover:text-white",
};

export function buttonClass(variant: ButtonVariant = "primary", className?: string) {
  return cx(buttonBase, buttonVariants[variant], className);
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return <Link className={buttonClass(variant, className)} {...props} />;
}

/** Secondary action set as a text link with a chevron, beside a primary button. */
export function ChevronLink({
  className,
  children,
  dark = false,
  ...props
}: ComponentProps<typeof Link> & { dark?: boolean }) {
  return (
    <Link
      className={cx(
        "group inline-flex h-12 items-center gap-1.5 rounded-full px-1 text-[1rem] font-medium tracking-[-0.014em] whitespace-nowrap",
        dark ? "text-sky-light hover:text-white" : "text-brand hover:text-brand-hover",
        className,
      )}
      {...props}
    >
      <span className="underline-offset-4 group-hover:underline">{children}</span>
      <svg viewBox="0 0 8 12" aria-hidden className="h-2.5 w-2 transition-transform group-hover:translate-x-0.5">
        <path
          d="M1.5 1.5 6 6l-4.5 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

export function SectionIntro({
  title,
  children,
  id,
  className,
  dark = false,
  align = "start",
}: {
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
  align?: "start" | "center";
}) {
  const center = align === "center";
  return (
    <div className={cx(center ? "mx-auto max-w-4xl text-center" : "max-w-4xl", className)}>
      <h2 id={id} className={cx("type-h2", dark && "text-white")}>
        {title}
      </h2>
      {children ? (
        <div
          className={cx("type-lede mt-6 max-w-2xl", center && "mx-auto", dark ? "text-on-dark-soft" : "text-ink-soft")}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** Headline on the left, supporting copy on the right, aligned to the headline's last line. */
export function SplitIntro({
  title,
  children,
  id,
  className,
  dark = false,
}: {
  title: ReactNode;
  children: ReactNode;
  id?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cx("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
      <h2 id={id} className={cx("type-h2 lg:col-span-7", dark && "text-white")}>
        {title}
      </h2>
      <div className={cx("type-lede max-w-xl lg:col-span-5 lg:pb-1.5", dark ? "text-on-dark-soft" : "text-ink-soft")}>
        {children}
      </div>
    </div>
  );
}

/** A right arrow for calls to action. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cx("size-4 shrink-0", className)}>
      <path
        d="M2.5 8h10.5M9 3.5 13.5 8 9 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChannelDot({ color, className }: { color: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("inline-block size-2 shrink-0 rounded-full", className)}
      style={{ backgroundColor: color }}
    />
  );
}

/**
 * A photograph cropped by its frame. The frame sets the shape (aspect ratio or
 * height); `position` chooses which part of the picture stays in view.
 */
export function PhotoFrame({
  photo,
  sizes,
  className,
  position = "50% 50%",
  eager = false,
  quality,
  style,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  position?: string;
  /** For the above-the-fold image: load immediately at high priority. */
  eager?: boolean;
  quality?: 75 | 85;
  style?: CSSProperties;
}) {
  return (
    <div className={cx("photo-frame", className)} style={style}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        placeholder="blur"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager ? "high" : undefined}
        quality={quality}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
