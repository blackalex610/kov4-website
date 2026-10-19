import type { CSSProperties } from "react";
import { cx } from "./ui";

export type TicketData = {
  no: string;
  time: string;
  channel: string;
  items: { qty: number; name: string; mods: string[] }[];
};

/** A printed kitchen ticket on thermal paper, with a torn bottom edge. */
export function Ticket({
  ticket,
  className,
  style,
}: {
  ticket: TicketData;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cx(
        "ticket bg-[#fbfbf8] px-4 pt-3 font-mono text-[0.78rem] leading-[1.55] text-ink shadow-[0_18px_30px_-22px_rgba(0,0,0,0.9)]",
        className,
      )}
      style={style}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span>
          <span className="font-semibold">#{ticket.no}</span>
          <span className="ml-2 text-ink-faint">{ticket.channel}</span>
        </span>
        <span className="tabular text-ink-soft">{ticket.time}</span>
      </div>
      <div className="my-1.5 border-t border-dashed border-line-strong" />
      {ticket.items.map((item) => (
        <div key={item.name}>
          <p>
            <span className="inline-block w-5 font-semibold">{item.qty}</span>
            {item.name}
          </p>
          {item.mods.map((mod) => (
            <p key={mod} className="pl-5 text-ink-soft">
              {mod}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
