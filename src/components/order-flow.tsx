import type { CSSProperties, ReactNode } from "react";
import { site } from "@/content/site";
import { LogoMark } from "./logo";
import { Ticket, type TicketData } from "./ticket";
import { ChannelDot, cx } from "./ui";

/**
 * One dish, listed three different ways on three marketplaces, matched to a
 * single menu item and printed as identical tickets. Drawn for a dark section.
 * Purely illustrative. It is not live data and not a product screenshot.
 */

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const incoming = [
  {
    channel: "Glovo",
    color: "var(--color-glovo)",
    ref: "4F7K2",
    time: "12:31",
    lines: ["2 × Класически бургер + чедър екстра"],
    note: "Без лук",
  },
  {
    channel: "Wolt",
    color: "var(--color-wolt)",
    ref: "118-302",
    time: "12:33",
    lines: ["1 × Бургер Класик (екстра кашкавал)"],
  },
  {
    channel: "Bolt Food",
    color: "var(--color-bolt)",
    ref: "77120",
    time: "12:34",
    lines: ["1 × КЛАСИЧЕСКИ БУРГЕР / добави сирене", "1 × Кола 0,5"],
  },
];

const mappings = [
  {
    variants: ["Класически бургер", "Бургер Класик", "КЛАСИЧЕСКИ БУРГЕР"],
    code: "BRG-01",
    name: "Класически бургер",
  },
  {
    variants: ["Чедър екстра", "екстра кашкавал", "добави сирене"],
    code: "MOD-12",
    name: "Допълнително чедър",
  },
];

const tickets: TicketData[] = [
  {
    no: "0412",
    time: "12:31",
    channel: "Glovo",
    items: [{ qty: 2, name: "Класически бургер", mods: ["+ Допълнително чедър", "– Без лук"] }],
  },
  {
    no: "0413",
    time: "12:33",
    channel: "Wolt",
    items: [{ qty: 1, name: "Класически бургер", mods: ["+ Допълнително чедър"] }],
  },
  {
    no: "0414",
    time: "12:34",
    channel: "Bolt Food",
    items: [
      { qty: 1, name: "Класически бургер", mods: ["+ Допълнително чедър"] },
      { qty: 1, name: "Кола 0,5 л", mods: [] },
    ],
  },
];

function ColumnLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("mb-4 text-[0.875rem] font-medium text-on-dark-soft", className)}>{children}</p>;
}

function Connector({ variant, d }: { variant: "merge" | "split"; d: number }) {
  const paths =
    variant === "merge"
      ? ["M0 52 C26 52 22 150 48 150", "M0 150 L48 150", "M0 248 C26 248 22 150 48 150"]
      : ["M0 150 C26 150 22 52 48 52", "M0 150 L48 150", "M0 150 C26 150 22 248 48 248"];
  return (
    <>
      <svg
        viewBox="0 0 48 300"
        preserveAspectRatio="none"
        aria-hidden
        className="seq-draw hidden h-full w-full lg:block"
        style={delay(d)}
      >
        {paths.map((p) => (
          <path
            key={p}
            d={p}
            pathLength={1}
            fill="none"
            stroke="var(--color-sky)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div aria-hidden className="flex justify-center py-2 lg:hidden">
        <svg viewBox="0 0 16 40" className="seq-draw h-10 w-4" style={delay(d)}>
          <path d="M8 0v37M3 32l5 5 5-5" pathLength={1} fill="none" stroke="var(--color-sky)" strokeWidth="1.5" />
        </svg>
      </div>
    </>
  );
}

export function OrderFlow() {
  return (
    <figure className="m-0">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_3.5rem_minmax(0,1.1fr)_3.5rem_minmax(0,1fr)] lg:grid-rows-[auto_1fr]">
        {/* Column labels (desktop) */}
        <ColumnLabel className="hidden lg:block">Както е поръчано във всяка платформа</ColumnLabel>
        <span className="hidden lg:block" />
        <ColumnLabel className="hidden lg:block">Съпоставено с вашето меню</ColumnLabel>
        <span className="hidden lg:block" />
        <ColumnLabel className="hidden lg:block">Отпечатано в касата</ColumnLabel>

        {/* A: incoming */}
        <div>
          <ColumnLabel className="lg:hidden">Както е поръчано във всяка платформа</ColumnLabel>
          <ul className="grid gap-3 md:grid-cols-3 lg:h-full lg:grid-cols-1 lg:content-between">
            {incoming.map((order, i) => (
              <li
                key={order.channel}
                className="seq-rise rounded-2xl border border-night-line bg-night-raised px-4 py-3.5"
                style={delay(0.1 + i * 0.14)}
              >
                <div className="flex items-center justify-between gap-3 text-[0.8125rem]">
                  <span className="inline-flex items-center gap-2 font-semibold text-white">
                    <ChannelDot color={order.color} className="size-2.5" />
                    {order.channel}
                  </span>
                  <span className="tabular text-on-dark-soft">
                    №{order.ref} <span className="ml-1">{order.time}</span>
                  </span>
                </div>
                <ul className="mt-2 space-y-0.5 text-[0.9375rem] leading-snug text-on-dark">
                  {order.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {order.note ? <p className="mt-1 text-[0.8125rem] text-on-dark-soft">Бележка: {order.note}</p> : null}
              </li>
            ))}
          </ul>
        </div>

        <Connector variant="merge" d={0.6} />

        {/* B: matching */}
        <div>
          <ColumnLabel className="lg:hidden">Съпоставено с вашето меню</ColumnLabel>
          <div
            className="seq-rise flex h-full flex-col rounded-2xl bg-night-deep p-5 ring-1 ring-sky/45 sm:p-6"
            style={delay(0.85)}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white">
                <LogoMark className="size-6 rounded-[6px] ring-1 ring-night-line" />
                {site.name}
              </span>
              <span className="text-[0.75rem] text-on-dark-soft">3 получени поръчки</span>
            </div>

            <div className="my-6 space-y-4 lg:my-auto lg:py-6">
              {mappings.map((m, i) => (
                <div
                  key={m.code}
                  className="seq-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"
                  style={delay(1.05 + i * 0.18)}
                >
                  <ul className="border-r border-night-line pr-3 font-mono text-[0.75rem] leading-[1.75] text-on-dark-soft">
                    {m.variants.map((v) => (
                      <li key={v} className="truncate">
                        {v}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-lg border border-sky/60 bg-night-raised px-3 py-2">
                    <p className="font-mono text-[0.6875rem] text-sky-light">{m.code}</p>
                    <p className="text-[0.875rem] leading-tight font-medium whitespace-nowrap text-white">{m.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="border-t border-night-line pt-4 text-[0.8125rem] leading-relaxed text-on-dark-soft">
              Записани, без дубликати и изпратени към касата в правилния обект.
            </p>
          </div>
        </div>

        <Connector variant="split" d={1.45} />

        {/* C: tickets */}
        <div>
          <ColumnLabel className="lg:hidden">Отпечатано в касата</ColumnLabel>
          <div className="grid h-full gap-3 md:grid-cols-3 lg:grid-cols-1 lg:content-between">
            {tickets.map((t, i) => (
              <Ticket key={t.no} ticket={t} className="seq-rise" style={delay(1.65 + i * 0.14)} />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-12 max-w-2xl text-center text-[0.875rem] leading-relaxed text-on-dark-soft">
        Илюстрация: едно и също ястие, записано по три различни начина в три платформи, стига до касата ви като един
        артикул от менюто. Какво може да се свърже, зависи от достъпа на всяка платформа и от вашите системи.
      </figcaption>
    </figure>
  );
}
