/**
 * Wordmarks for the FICTIONAL sample clients in src/content/sample-proof.ts.
 * Drawn in currentColor so they sit together as a single-tone strip.
 */
import { getClient, type ClientId } from "@/content/sample-proof";
import { cx } from "./ui";

type Size = "sm" | "lg";

function KvartalKitchen({ size }: { size: Size }) {
  return (
    <span className={cx("inline-flex items-center gap-2", size === "lg" ? "text-[1.6rem]" : "text-[1.05rem]")}>
      <svg viewBox="0 0 20 20" aria-hidden className="size-[1.05em]">
        <rect x="1" y="1" width="8" height="8" fill="currentColor" />
        <rect x="11" y="1" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="1" y="11" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="11" width="8" height="8" fill="currentColor" />
      </svg>
      <span className="leading-none font-[800] tracking-[0.06em] uppercase">
        Kvartal<span className="ml-1.5 font-[350] tracking-[0.02em]">Kitchen</span>
      </span>
    </span>
  );
}

function FornoSette({ size }: { size: Size }) {
  return (
    <span
      className={cx(
        "font-serif leading-none italic tracking-[-0.01em]",
        size === "lg" ? "text-[2.1rem]" : "text-[1.45rem]",
      )}
    >
      Forno<span className="not-italic"> Sette</span>
      <sup className="ml-0.5 align-super font-sans text-[0.42em] font-semibold not-italic">VII</sup>
    </span>
  );
}

function OddBun({ size }: { size: Size }) {
  return (
    <span
      className={cx(
        "inline-flex items-end gap-1 leading-none font-[900] tracking-[-0.06em] lowercase",
        size === "lg" ? "text-[1.9rem]" : "text-[1.3rem]",
      )}
    >
      <svg viewBox="0 0 24 16" aria-hidden className="mb-[0.08em] h-[0.72em] w-auto">
        <path d="M2 12C2 5.5 6.5 1.5 12 1.5S22 5.5 22 12Z" fill="currentColor" />
        <rect x="2" y="13.4" width="20" height="2.6" rx="1.3" fill="currentColor" />
      </svg>
      odd bun
    </span>
  );
}

function KoraBakehouse({ size }: { size: Size }) {
  return (
    <span className="inline-flex flex-col items-start leading-none">
      <span className={cx("font-serif tracking-[0.22em] uppercase", size === "lg" ? "text-[1.9rem]" : "text-[1.3rem]")}>
        Kora
      </span>
      <span
        className={cx(
          "mt-1 font-sans font-medium tracking-[0.34em] uppercase",
          size === "lg" ? "text-[0.6rem]" : "text-[0.5rem]",
        )}
      >
        Bakehouse
      </span>
    </span>
  );
}

function WokTheory({ size }: { size: Size }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 font-mono leading-none font-bold tracking-[-0.04em]",
        size === "lg" ? "text-[1.5rem]" : "text-[1.02rem]",
      )}
    >
      <svg viewBox="0 0 20 20" aria-hidden className="size-[1.1em]">
        <circle cx="10" cy="10" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M4 10.5h12a6 6 0 0 1-12 0Z" fill="currentColor" />
      </svg>
      wok/theory
    </span>
  );
}

const marks: Record<ClientId, (props: { size: Size }) => React.JSX.Element> = {
  kvartal: KvartalKitchen,
  forno: FornoSette,
  oddbun: OddBun,
  kora: KoraBakehouse,
  wok: WokTheory,
};

export function ClientLogo({ id, size = "sm", className }: { id: ClientId; size?: Size; className?: string }) {
  const Mark = marks[id];
  return (
    <span role="img" aria-label={getClient(id).name} className={cx("inline-flex items-center", className)}>
      <Mark size={size} />
    </span>
  );
}
