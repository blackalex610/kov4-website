import { channels } from "@/content/site";
import { ChannelDot, cx } from "./ui";

/**
 * A merchant's POS order queue with marketplace orders already itemised.
 * Illustrative only: not a kov4 product screen and not live data.
 */

type Status = "new" | "kitchen" | "ready";

const orders: {
  channel: (typeof channels)[number]["id"];
  ref: string;
  time: string;
  item: string;
  detail: string;
  status: Status;
}[] = [
  {
    channel: "bolt",
    ref: "77120",
    time: "12:34",
    item: "1 × Classic burger",
    detail: "Extra cheddar, Cola 0.5 L",
    status: "new",
  },
  {
    channel: "wolt",
    ref: "118-302",
    time: "12:33",
    item: "1 × Classic burger",
    detail: "Extra cheddar",
    status: "kitchen",
  },
  {
    channel: "glovo",
    ref: "4F7K2",
    time: "12:31",
    item: "2 × Classic burger",
    detail: "Extra cheddar, no onion",
    status: "kitchen",
  },
  {
    channel: "glovo",
    ref: "4F6X8",
    time: "12:26",
    item: "1 × Halloumi wrap",
    detail: "Sweet potato fries",
    status: "ready",
  },
];

const statusStyle: Record<Status, { label: string; className: string }> = {
  new: { label: "New", className: "bg-signal text-white" },
  kitchen: { label: "In kitchen", className: "bg-sky-tint text-[#2f6f79]" },
  ready: { label: "Ready", className: "bg-brand-tint text-brand" },
};

const channelById = Object.fromEntries(channels.map((c) => [c.id, c]));

export function PosConsole({ className }: { className?: string }) {
  return (
    <figure
      className={cx(
        "m-0 overflow-hidden rounded-[1.25rem] bg-paper text-left text-ink shadow-[0_40px_80px_-30px_rgba(20,22,26,0.55),0_0_0_1px_rgba(20,22,26,0.06)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <p className="text-[0.75rem] text-ink-faint">Your POS</p>
          <p className="text-[1.0625rem] leading-tight font-semibold tracking-[-0.02em]">Incoming orders</p>
        </div>
        <ul className="flex items-center gap-1.5" aria-label="Connected channels">
          {channels.map((c) => (
            <li
              key={c.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-mist px-2.5 py-1 text-[0.75rem] font-medium"
            >
              <ChannelDot color={c.color} />
              <span className="max-sm:sr-only">{c.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="divide-y divide-line">
        {orders.map((o) => {
          const channel = channelById[o.channel];
          const status = statusStyle[o.status];
          return (
            <li key={o.ref} className="grid grid-cols-[3px_minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-3.5">
              <span aria-hidden className="h-full min-h-10 rounded-full" style={{ backgroundColor: channel.color }} />
              <div className="min-w-0">
                <p className="tabular text-[0.75rem] text-ink-faint">
                  {channel.name} <span className="ml-1">#{o.ref}</span>
                </p>
                <p className="truncate text-[0.9375rem] leading-snug font-medium">{o.item}</p>
                <p className="truncate text-[0.8125rem] text-ink-soft">{o.detail}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={cx("rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium", status.className)}>
                  {status.label}
                </span>
                <span className="tabular text-[0.75rem] text-ink-faint">{o.time}</span>
              </div>
            </li>
          );
        })}
      </ul>

      <figcaption className="flex items-center justify-between gap-4 border-t border-line bg-mist/60 px-5 py-3 text-[0.75rem] text-ink-faint">
        <span>Matched to your menu, item by item</span>
        <span>Illustration</span>
      </figcaption>
    </figure>
  );
}
