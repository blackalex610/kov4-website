/**
 * Lead form definition and validation, shared by the browser form and the
 * /api/contact route so both enforce exactly the same rules.
 */

export const BUSINESS_TYPES = [
  { value: "restaurant", label: "Ресторант, кафене или бързо хранене" },
  { value: "grocery", label: "Хранителен магазин или супермаркет" },
  { value: "convenience", label: "Квартален магазин или минимаркет" },
  { value: "retail", label: "Търговия на дребно или специализиран магазин" },
  { value: "chain", label: "Верига или оператор с няколко марки" },
  { value: "other", label: "Друго" },
] as const;

export const LOCATION_RANGES = [
  { value: "1", label: "1" },
  { value: "2-5", label: "2–5" },
  { value: "6-20", label: "6–20" },
  { value: "21+", label: "21+" },
] as const;

export const PLATFORMS = [
  { value: "glovo", label: "Glovo" },
  { value: "wolt", label: "Wolt" },
  { value: "bolt-food", label: "Bolt Food" },
  { value: "other", label: "Други" },
] as const;

export const CHALLENGES = [
  { value: "manual-entry", label: "Ръчно преписване на поръчки" },
  { value: "too-many-apps", label: "Твърде много таблети и приложения за следене" },
  { value: "availability", label: "Синхронизиране на менюта и наличности" },
  { value: "locations", label: "Координиране на няколко обекта" },
  { value: "reconciliation", label: "Съгласуване на поръчки и продажби" },
  { value: "other", label: "Нещо друго" },
] as const;

type ValueOf<T extends readonly { value: string }[]> = T[number]["value"];

export type Lead = {
  name: string;
  businessName: string;
  businessType: ValueOf<typeof BUSINESS_TYPES>;
  email: string;
  locations: ValueOf<typeof LOCATION_RANGES>;
  platforms: ValueOf<typeof PLATFORMS>[];
  otherPlatforms: string;
  software: string;
  challenge: ValueOf<typeof CHALLENGES>;
  details: string;
};

export type LeadField = keyof Lead;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const EMPTY_LEAD: Record<LeadField, string | string[]> = {
  name: "",
  businessName: "",
  businessType: "",
  email: "",
  locations: "",
  platforms: [],
  otherPlatforms: "",
  software: "",
  challenge: "",
  details: "",
};

/** Visual field order, used to focus the first invalid field. */
export const FIELD_ORDER: LeadField[] = [
  "name",
  "email",
  "businessName",
  "businessType",
  "locations",
  "platforms",
  "otherPlatforms",
  "software",
  "challenge",
  "details",
];

const LIMITS = {
  name: 100,
  businessName: 120,
  email: 200,
  otherPlatforms: 200,
  software: 200,
  details: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function oneOf<T extends readonly { value: string }[]>(options: T, value: string): value is ValueOf<T> {
  return options.some((o) => o.value === value);
}

export function labelFor(options: readonly { value: string; label: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function validateLead(raw: unknown): { ok: true; lead: Lead } | { ok: false; errors: LeadErrors } {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: LeadErrors = {};

  const name = str(input.name);
  if (!name) errors.name = "Въведете името си.";
  else if (name.length > LIMITS.name) errors.name = `Името трябва да е до ${LIMITS.name} знака.`;

  const businessName = str(input.businessName);
  if (!businessName) errors.businessName = "Въведете името на бизнеса.";
  else if (businessName.length > LIMITS.businessName)
    errors.businessName = `Името на бизнеса трябва да е до ${LIMITS.businessName} знака.`;

  const businessType = str(input.businessType);
  if (!oneOf(BUSINESS_TYPES, businessType)) errors.businessType = "Изберете вида на бизнеса.";

  const email = str(input.email);
  if (!email) errors.email = "Въведете имейл адрес.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "Въведете имейл адрес във вида име@фирма.bg.";

  const locations = str(input.locations);
  if (!oneOf(LOCATION_RANGES, locations)) errors.locations = "Изберете колко обекта имате.";

  const platformsRaw = Array.isArray(input.platforms) ? input.platforms : [];
  const platforms = [...new Set(platformsRaw.map(str))].filter((p) => oneOf(PLATFORMS, p)) as Lead["platforms"];
  if (platforms.length === 0) errors.platforms = "Изберете поне една платформа, през която продавате.";

  const otherPlatforms = str(input.otherPlatforms);
  if (platforms.includes("other") && !otherPlatforms) errors.otherPlatforms = "Напишете кои други платформи ползвате.";
  else if (otherPlatforms.length > LIMITS.otherPlatforms)
    errors.otherPlatforms = `Текстът трябва да е до ${LIMITS.otherPlatforms} знака.`;

  const software = str(input.software);
  if (software.length > LIMITS.software) errors.software = `Текстът трябва да е до ${LIMITS.software} знака.`;

  const challenge = str(input.challenge);
  if (!oneOf(CHALLENGES, challenge)) errors.challenge = "Изберете проблема, който ви засяга най-много.";

  const details = str(input.details);
  if (details.length > LIMITS.details) errors.details = `Текстът трябва да е до ${LIMITS.details} знака.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      businessName,
      businessType: businessType as Lead["businessType"],
      email,
      locations: locations as Lead["locations"],
      platforms,
      otherPlatforms: platforms.includes("other") ? otherPlatforms : "",
      software,
      challenge: challenge as Lead["challenge"],
      details,
    },
  };
}

/** Plain-text summary, used for email delivery and the mailto fallback. */
export function summarizeLead(lead: Record<LeadField, string | string[]>) {
  const platforms = (Array.isArray(lead.platforms) ? lead.platforms : [])
    .map((p) => (p === "other" ? `Други (${lead.otherPlatforms || "не е посочено"})` : labelFor(PLATFORMS, p)))
    .join(", ");
  return [
    `Име: ${lead.name}`,
    `Бизнес: ${lead.businessName}`,
    `Вид бизнес: ${labelFor(BUSINESS_TYPES, String(lead.businessType))}`,
    `Имейл: ${lead.email}`,
    `Обекти: ${labelFor(LOCATION_RANGES, String(lead.locations))}`,
    `Платформи за доставка: ${platforms || "не е посочено"}`,
    `Каса / бизнес софтуер: ${lead.software || "не е посочено"}`,
    `Основен проблем: ${labelFor(CHALLENGES, String(lead.challenge))}`,
    "",
    `Допълнителна информация:`,
    String(lead.details || "няма"),
  ].join("\n");
}
