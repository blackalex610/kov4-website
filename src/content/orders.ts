/**
 * Example orders for the animated illustrations (hero scene and intro).
 * Everything here is invented: dishes, prices, names and order numbers are random.
 */

export type PlatformId = "glovo" | "wolt" | "bolt";

export const platforms: Record<
  PlatformId,
  { name: string; short: string; color: string; ink: string; prefix: string }
> = {
  glovo: { name: "Glovo", short: "Glovo", color: "#ffc244", ink: "#3b2a05", prefix: "GL" },
  wolt: { name: "Wolt", short: "Wolt", color: "#00a3e0", ink: "#ffffff", prefix: "WT" },
  bolt: { name: "Bolt Food", short: "Bolt", color: "#2ad17f", ink: "#05301b", prefix: "BF" },
};

export const platformOrder: PlatformId[] = ["glovo", "wolt", "bolt"];

export type OrderLine = { qty: number; name: string; price: number; mod?: string };

export type Order = {
  /** Unique, increasing: also used as the React key. */
  seq: number;
  platform: PlatformId;
  /** The marketplace's own reference, as printed on the receipt. */
  ref: string;
  lines: OrderLine[];
  total: number;
  time: string;
  customer: string;
  note?: string;
};

const menu: { name: string; price: number; mods?: string[] }[] = [
  { name: "Classic burger", price: 12.9, mods: ["+ Extra cheddar", "- No onion", "Medium rare"] },
  { name: "Shopska salad", price: 7.5, mods: ["- No onion", "+ Extra sirene"] },
  { name: "Margherita pizza", price: 11.4, mods: ["+ Buffalo mozzarella", "Thin crust"] },
  { name: "Chicken doner", price: 8.9, mods: ["+ Garlic sauce", "+ Spicy"] },
  { name: "Kebapcheta x3", price: 9.2, mods: ["+ Lyutenitsa"] },
  { name: "Banitsa with sirene", price: 3.8 },
  { name: "Tarator", price: 4.6 },
  { name: "Sweet potato fries", price: 4.9, mods: ["+ Truffle mayo"] },
  { name: "Pad thai", price: 13.5, mods: ["+ Spicy", "- No peanuts"] },
  { name: "Salmon poke bowl", price: 14.2, mods: ["+ Avocado"] },
  { name: "Halloumi wrap", price: 9.8 },
  { name: "Sushi set (12 pcs)", price: 18.9, mods: ["+ Extra ginger"] },
  { name: "Tiramisu", price: 6.5 },
  { name: "Ayran", price: 2.2 },
  { name: "Cola 0.5 L", price: 2.9 },
  { name: "Lemonade", price: 3.5 },
];

const customers = ["Maria", "Georgi", "Ivana", "Nikolay", "Elena", "Dimitar", "Petya", "Alex", "Sofia", "Viktor", "Desi", "Kalin"];

const notes = ["No cutlery, please", "Ring the bell", "Extra napkins", "Leave at the door", "Call on arrival"];

type Rand = () => number;

const pick = <T,>(arr: readonly T[], rand: Rand) => arr[Math.floor(rand() * arr.length)];

/** A small seeded generator, so the server and the first client render agree. */
export function seeded(seed: number): Rand {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clock(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function makeOrder(seq: number, time: string, rand: Rand = Math.random, platform?: PlatformId): Order {
  const p = platform ?? pick(platformOrder, rand);
  const count = 1 + Math.floor(rand() * 3);
  const used = new Set<string>();
  const lines: OrderLine[] = [];
  while (lines.length < count) {
    const item = pick(menu, rand);
    if (used.has(item.name)) continue;
    used.add(item.name);
    const qty = rand() < 0.7 ? 1 : 2;
    const mod = item.mods && rand() < 0.55 ? pick(item.mods, rand) : undefined;
    lines.push({ qty, name: item.name, price: item.price, mod });
  }
  const total = Math.round(lines.reduce((sum, l) => sum + l.qty * l.price, 0) * 100) / 100;
  const digits = String(Math.floor(10000 + rand() * 89999));
  return {
    seq,
    platform: p,
    ref: `${platforms[p].prefix}-${digits}`,
    lines,
    total,
    time,
    customer: pick(customers, rand),
    note: rand() < 0.35 ? pick(notes, rand) : undefined,
  };
}

export const money = (n: number) => `€${n.toFixed(2)}`;

export const itemCount = (o: Order) => o.lines.reduce((n, l) => n + l.qty, 0);
