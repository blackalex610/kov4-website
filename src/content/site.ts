/**
 * Brand and contact settings. Override any of these with environment variables
 * (see .env.example) instead of editing components.
 */
export const site = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "KOV4",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@kov4.com",
  tagline: "Glovo, Wolt и Bolt Food — на един екран.",
  description:
    "Поръчките от Glovo, Wolt и Bolt Food влизат директно в касата и в кухнята. Без преписване. За ресторанти и кафенета в София.",
};

export const navigation = [
  { href: "/", label: "Начало" },
  { href: "/#how-it-works", label: "Как работи" },
  { href: "/#what-it-does", label: "Възможности" },
  { href: "/#solutions", label: "За ресторанти" },
  { href: "/#integrations", label: "Интеграции" },
  { href: "/#contact", label: "Контакт" },
];

export const channels = [
  { id: "glovo", name: "Glovo", color: "var(--color-glovo)" },
  { id: "wolt", name: "Wolt", color: "var(--color-wolt)" },
  { id: "bolt", name: "Bolt Food", color: "var(--color-bolt)" },
] as const;
