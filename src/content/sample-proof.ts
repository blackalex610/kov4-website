/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SAMPLE CONTENT: THESE ARE NOT REAL CLIENTS.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Every brand, case study and quote in this file is fictional. It exists only
 *  to preview how the site looks once there is real social proof.
 *
 *  It renders only when NEXT_PUBLIC_SHOW_SAMPLE_PROOF=true, which is set in
 *  .env.local for local previews and is OFF by default everywhere else.
 *
 *  Before launch: replace these entries with real clients who have agreed to be
 *  named, or leave the flag off. Publishing invented clients, results or quotes
 *  is a misleading commercial practice under EU and Bulgarian consumer law.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const showSampleProof = process.env.NEXT_PUBLIC_SHOW_SAMPLE_PROOF === "true";

export type ClientId = "kvartal" | "forno" | "oddbun" | "kora" | "wok";

export type Client = {
  id: ClientId;
  name: string;
  segment: string;
  city: string;
  locations: number;
};

export const clients: Client[] = [
  { id: "kvartal", name: "Kvartal Kitchen", segment: "Fast casual", city: "Sofia", locations: 3 },
  { id: "forno", name: "Forno Sette", segment: "Pizzeria", city: "Plovdiv", locations: 1 },
  { id: "oddbun", name: "Odd Bun", segment: "Burgers", city: "Sofia", locations: 2 },
  { id: "kora", name: "Kora Bakehouse", segment: "Bakery and café", city: "Varna", locations: 1 },
  { id: "wok", name: "Wok Theory", segment: "Asian kitchen", city: "Sofia", locations: 2 },
];

export type CaseStudy = {
  client: ClientId;
  channels: string[];
  system: string;
  before: string;
  after: string;
  quote?: { text: string; attribution: string };
};

export const featuredCase: CaseStudy = {
  client: "kvartal",
  channels: ["Glovo", "Wolt", "Bolt Food"],
  system: "Cloud POS at each location",
  before:
    "Three tablets on every counter. At lunch, one person did nothing but read marketplace orders and type them into the till, and sold-out dishes had to be paused on each app separately.",
  after:
    "Marketplace orders now arrive as POS tickets at the right location, with sizes, extras and notes matched item by item. Pausing a dish happens once and reaches every platform that supports it.",
  quote: {
    text: "We used to have someone at lunch doing nothing but typing tablet orders into the till. That job is gone, and the kitchen gets the same ticket whichever app the order came from.",
    attribution: "Operations manager, Kvartal Kitchen",
  },
};

export const compactCases: CaseStudy[] = [
  {
    client: "forno",
    channels: ["Glovo", "Wolt"],
    system: "POS and kitchen printer",
    before: "Half-and-half pizzas and extra toppings were keyed by hand and often reached the oven wrong.",
    after:
      "Sizes, halves and toppings are mapped to POS items, so the kitchen ticket matches what the customer ordered.",
  },
  {
    client: "wok",
    channels: ["Glovo", "Wolt", "Bolt Food"],
    system: "POS and accounting export",
    before: "Month-end meant reconciling three platform reports against two locations’ sales by hand.",
    after: "A daily file brings orders from all three platforms together, matched against POS sales for each location.",
  },
];

export function getClient(id: ClientId): Client {
  const client = clients.find((c) => c.id === id);
  if (!client) throw new Error(`Unknown sample client: ${id}`);
  return client;
}
