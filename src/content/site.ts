/**
 * Brand and contact settings. Override any of these with environment variables
 * (see .env.example) instead of editing components.
 */
export const site = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "kov4",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@kov4.com",
  market: "Bulgaria",
  languages: "Bulgarian and English",
  tagline: "Connect your delivery channels to the systems that run your business.",
  description:
    "We connect orders from delivery marketplaces such as Glovo, Wolt and Bolt Food to the POS, inventory and order systems merchants already use. Start with a free workflow assessment.",
};

export const navigation = [
  { href: "/#what-it-does", label: "What it does" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#integrations", label: "Integrations" },
  { href: "/#faq", label: "FAQ" },
];

export const channels = [
  { id: "glovo", name: "Glovo", color: "var(--color-glovo)" },
  { id: "wolt", name: "Wolt", color: "var(--color-wolt)" },
  { id: "bolt", name: "Bolt Food", color: "var(--color-bolt)" },
] as const;
