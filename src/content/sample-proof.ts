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
  { id: "kvartal", name: "Kvartal Kitchen", segment: "Бързо хранене", city: "София", locations: 3 },
  { id: "forno", name: "Forno Sette", segment: "Пицария", city: "Пловдив", locations: 1 },
  { id: "oddbun", name: "Odd Bun", segment: "Бургери", city: "София", locations: 2 },
  { id: "kora", name: "Kora Bakehouse", segment: "Пекарна и кафене", city: "Варна", locations: 1 },
  { id: "wok", name: "Wok Theory", segment: "Азиатска кухня", city: "София", locations: 2 },
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
  system: "Облачна каса във всеки обект",
  before:
    "Три таблета на всеки тезгях. По обяд един човек само четеше поръчките от платформите и ги въвеждаше в касата, а изчерпаните ястия трябваше да се спират поотделно във всяко приложение.",
  after:
    "Поръчките от платформите вече стигат като бележки в касата на правилния обект, със съпоставени размери, добавки и бележки. Ястие се спира веднъж и промяната стига до всяка платформа, която я поддържа.",
  quote: {
    text: "По обяд имахме човек, който само пренаписваше поръчките от таблетите в касата. Тази работа вече я няма, а кухнята получава една и съща бележка, от което и приложение да идва поръчката.",
    attribution: "Оперативен мениджър, Kvartal Kitchen",
  },
};

export const compactCases: CaseStudy[] = [
  {
    client: "forno",
    channels: ["Glovo", "Wolt"],
    system: "Каса и кухненски принтер",
    before: "Пици „половин на половин“ и допълнителни продукти се въвеждаха на ръка и често стигаха до пещта грешно.",
    after:
      "Размерите, половинките и добавките са съпоставени с артикулите в касата, така че бележката в кухнята съвпада с поръчаното от клиента.",
  },
  {
    client: "wok",
    channels: ["Glovo", "Wolt", "Bolt Food"],
    system: "Каса и експорт за счетоводство",
    before: "В края на месеца се налагаше на ръка да се сверяват три отчета от платформите с продажбите на два обекта.",
    after: "Дневен файл събира поръчките от трите платформи и ги съпоставя с продажбите в касата на всеки обект.",
  },
];

export function getClient(id: ClientId): Client {
  const client = clients.find((c) => c.id === id);
  if (!client) throw new Error(`Unknown sample client: ${id}`);
  return client;
}
