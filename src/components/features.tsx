import type { ReactNode } from "react";
import { photos } from "@/content/photos";
import { channels } from "@/content/site";
import { Ticket, type TicketData } from "./ticket";
import { ChannelDot, Container, PhotoFrame, SectionIntro, cx } from "./ui";

/**
 * What a connected setup can do, as a grid of tiles. Every visual is an
 * illustration with example data, not a product screen.
 */

function Tile({
  title,
  body,
  className,
  tone = "mist",
  children,
}: {
  title: string;
  body: string;
  className?: string;
  tone?: "mist" | "dark" | "outline";
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <article
      className={cx(
        "flex flex-col overflow-hidden rounded-[1.75rem] p-7 sm:p-9",
        tone === "dark" && "on-dark bg-night text-on-dark",
        tone === "mist" && "bg-mist",
        tone === "outline" && "bg-paper ring-1 ring-line",
        className,
      )}
    >
      <h3 className={cx("type-tile max-w-[18ch]", dark && "text-white")}>{title}</h3>
      <p className={cx("mt-3 max-w-md text-[1rem] leading-relaxed", dark ? "text-on-dark-soft" : "text-ink-soft")}>
        {body}
      </p>
      {children ? <div className="mt-8 flex flex-1 flex-col justify-end">{children}</div> : null}
    </article>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-2xl bg-paper p-4 shadow-[0_1px_2px_rgba(43,48,58,0.06),0_8px_24px_-12px_rgba(43,48,58,0.18)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cx("size-4 shrink-0", className)}>
      <circle cx="8" cy="8" r="8" fill="currentColor" />
      <path
        d="M4.8 8.2 7 10.3l4.2-4.6"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tickets: TicketData[] = [
  {
    no: "0412",
    time: "12:31",
    channel: "Glovo",
    items: [{ qty: 2, name: "Classic burger", mods: ["+ Extra cheddar", "– No onion"] }],
  },
  {
    no: "0413",
    time: "12:33",
    channel: "Wolt",
    items: [
      { qty: 1, name: "Halloumi wrap", mods: ["+ Chilli mayo"] },
      { qty: 1, name: "Sweet potato fries", mods: [] },
    ],
  },
  {
    no: "0414",
    time: "12:34",
    channel: "Bolt Food",
    items: [
      { qty: 1, name: "Classic burger", mods: ["+ Extra cheddar"] },
      { qty: 1, name: "Cola 0.5 L", mods: [] },
    ],
  },
];

/** Tickets hang from the bottom edge of the tile at different lengths, like a rail at the pass. */
const ticketLengths = ["pb-24 sm:pb-28", "pb-14 sm:pb-16", "pb-20 sm:pb-24"];

function TicketsVisual() {
  return (
    <div className="-mx-2 -mb-9 grid grid-cols-2 items-end gap-3 sm:-mb-11 sm:grid-cols-3 sm:gap-4">
      {tickets.map((t, i) => (
        <Ticket
          key={t.no}
          ticket={t}
          className={cx("sm:text-[0.8125rem]", ticketLengths[i], i === 2 && "max-sm:hidden")}
        />
      ))}
    </div>
  );
}

function MenuVisual() {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
        <p className="font-semibold tracking-[-0.016em]">Classic burger</p>
        <p className="tabular text-[0.9375rem] font-medium">€7.90</p>
      </div>
      <ul className="mt-2 space-y-2 text-[0.875rem]">
        {channels.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <ChannelDot color={c.color} />
              {c.name}
            </span>
            <span className="inline-flex items-center gap-2 text-ink-soft">
              <span className="tabular">€7.90</span>
              <Check className="text-brand" />
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AvailabilityVisual() {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
        <div>
          <p className="font-semibold tracking-[-0.016em]">Pistachio croissant</p>
          <p className="text-[0.8125rem] text-signal">Sold out</p>
        </div>
        {/* Switch, off */}
        <span aria-hidden className="relative h-6 w-10 shrink-0 rounded-full bg-line-strong">
          <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-paper shadow-sm" />
        </span>
      </div>
      <ul className="mt-2 space-y-2 text-[0.875rem]">
        {channels.map((c) => (
          <li key={c.id} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2">
              <ChannelDot color={c.color} />
              {c.name}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                <path d="M4 2.5v7M8 2.5v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Paused
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const locations = [
  { name: "Sofia Centre", counts: [18, 12, 7] },
  { name: "Lozenets", counts: [11, 9, 6] },
  { name: "Plovdiv", counts: [8, 5, 4] },
];
const maxTotal = Math.max(...locations.map((l) => l.counts.reduce((a, b) => a + b, 0)));

function LocationsVisual() {
  return (
    <Card>
      <p className="flex items-baseline justify-between text-[0.8125rem] text-ink-faint">
        <span>Orders today by location</span>
        <span>Example</span>
      </p>
      <ul className="mt-3 space-y-3">
        {locations.map((l) => {
          const total = l.counts.reduce((a, b) => a + b, 0);
          return (
            <li key={l.name}>
              <p className="flex justify-between text-[0.875rem]">
                <span className="font-medium">{l.name}</span>
                <span className="tabular text-ink-soft">{total}</span>
              </p>
              <div
                className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-mist"
                style={{ width: `${(total / maxTotal) * 100}%` }}
              >
                {l.counts.map((n, i) => (
                  <span key={channels[i].id} style={{ flexGrow: n, backgroundColor: channels[i].color }} />
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

const events = [
  { time: "12:31:04", text: "Glovo #4F7K2 received", state: "ok" },
  { time: "12:31:05", text: "Sent to POS, Sofia Centre", state: "ok" },
  { time: "12:33:12", text: "POS not responding, retrying", state: "warn" },
  { time: "12:33:20", text: "Sent to POS on retry", state: "ok" },
  { time: "12:34:02", text: "Bolt Food #77120 received", state: "ok" },
] as const;

function LogVisual() {
  return (
    <div className="overflow-hidden rounded-2xl bg-night-deep px-4 py-4 font-mono text-[0.78rem] leading-[1.9] text-on-dark">
      {events.map((e) => (
        <p key={e.time} className="flex gap-3 whitespace-nowrap">
          <span className="tabular text-on-dark-soft">{e.time}</span>
          <span
            aria-hidden
            className={cx("mt-[0.72em] size-1.5 shrink-0 rounded-full", e.state === "ok" ? "bg-bolt" : "bg-signal")}
          />
          <span className="truncate">{e.text}</span>
        </p>
      ))}
    </div>
  );
}

const totals = [
  { channel: channels[0], orders: 42, gross: "1,104.60" },
  { channel: channels[1], orders: 31, gross: "806.20" },
  { channel: channels[2], orders: 18, gross: "462.90" },
];

function TotalsVisual() {
  return (
    <Card className="px-0 py-0">
      <table className="w-full text-left text-[0.875rem]">
        <caption className="px-4 pt-4 pb-2 text-left text-[0.8125rem] text-ink-faint">
          <span className="flex justify-between">
            <span>Daily close, all channels</span>
            <span>Example</span>
          </span>
        </caption>
        <thead className="text-[0.8125rem] text-ink-faint">
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2 font-normal">
              Channel
            </th>
            <th scope="col" className="px-4 py-2 text-right font-normal">
              Orders
            </th>
            <th scope="col" className="px-4 py-2 text-right font-normal">
              Gross
            </th>
          </tr>
        </thead>
        <tbody className="tabular">
          {totals.map((t) => (
            <tr key={t.channel.id} className="border-b border-line">
              <th scope="row" className="px-4 py-2 font-normal whitespace-nowrap">
                <span className="inline-flex items-center gap-2">
                  <ChannelDot color={t.channel.color} />
                  {t.channel.name}
                </span>
              </th>
              <td className="px-4 py-2 text-right">{t.orders}</td>
              <td className="px-4 py-2 text-right">€{t.gross}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="tabular font-semibold">
          <tr>
            <th scope="row" className="px-4 py-3 font-semibold">
              Total
            </th>
            <td className="px-4 py-3 text-right">91</td>
            <td className="px-4 py-3 text-right">€2,373.70</td>
          </tr>
        </tfoot>
      </table>
    </Card>
  );
}

export function Features() {
  return (
    <section id="what-it-does" aria-labelledby="features-title" className="py-24 lg:py-32">
      <Container>
        <SectionIntro id="features-title" title="What a connected setup can do." align="center">
          <p>
            Depending on each platform&rsquo;s access and on what your software can receive, an integration takes over
            the steps people do by hand today.
          </p>
        </SectionIntro>

        <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-6">
          <Tile
            tone="dark"
            className="lg:col-span-4 lg:min-h-[32rem]"
            title="Orders arrive in your POS as tickets."
            body="Items, sizes and extras matched to your own menu, whichever app the order came from."
          >
            <TicketsVisual />
          </Tile>

          <Tile
            className="lg:col-span-2"
            title="One menu for every app."
            body="Change a price or a dish once and pass it to each platform that accepts menu updates."
          >
            <MenuVisual />
          </Tile>

          <Tile
            className="lg:col-span-2"
            title="Sold out once. Paused everywhere."
            body="One change reaches every channel that supports availability updates."
          >
            <AvailabilityVisual />
          </Tile>

          <article className="relative isolate flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-[1.75rem] p-7 text-white sm:p-9 lg:col-span-2">
            <PhotoFrame
              photo={photos.ticketRail}
              sizes="(min-width: 1024px) 30vw, 100vw"
              position="50% 40%"
              className="absolute inset-0 -z-10 rounded-none"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(27_30_36/0.9),rgb(27_30_36/0.2)_60%,transparent)]"
            />
            <h3 className="type-tile max-w-[14ch]">Your kitchen reads one format.</h3>
            <p className="mt-3 max-w-xs text-[1rem] leading-relaxed text-on-dark">
              The same ticket layout for every platform, printed where your team already looks.
            </p>
          </article>

          <Tile
            className="lg:col-span-2"
            title="Every order to the right location."
            body="Orders reach the outlet they were placed with, and head office sees them all."
          >
            <LocationsVisual />
          </Tile>

          <Tile
            tone="outline"
            className="lg:col-span-3"
            title="Nothing goes missing quietly."
            body="Every order event is logged. Failed deliveries are retried and raise an alert, so a lost order is visible, not silent."
          >
            <LogVisual />
          </Tile>

          <Tile
            className="lg:col-span-3"
            title="Totals that reconcile."
            body="Orders from every channel brought together in one place, ready for the daily close."
          >
            <TotalsVisual />
          </Tile>
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[0.875rem] leading-relaxed text-ink-faint">
          Illustrations with example data. Which of these apply depends on each platform&rsquo;s API, permissions and
          terms, and on your systems.
        </p>
      </Container>
    </section>
  );
}
