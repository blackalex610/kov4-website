export const W = 1920;
export const H = 1080;

export const C = {
  ink: '#1c1511',
  inkSoft: '#6e6e73',
  inkFaint: '#a1a1a6',
  light: '#f5f5f7',
  white: '#ffffff',
  dark: '#050507',
  graphite: '#2b2b30',
  ember: '#c9561f',
  brand: '#e5732f',
  gold: '#f2a14a',
  warmInk: '#1c1511',
  red: '#ff453a',
  amber: '#ff9f0a',
  green: '#30d158',
  paper: '#fbfaf6',
};

export const BRAND_GRADIENT = `linear-gradient(120deg, ${C.ember} 0%, ${C.brand} 55%, ${C.gold} 100%)`;

export type PlatformKey = 'glovo' | 'wolt' | 'bolt';

export type Platform = {
  key: PlatformKey;
  name: string;
  color: string;
  ink: string;
  ordersPrefix: string;
};

export const PLATFORMS: Record<PlatformKey, Platform> = {
  glovo: { key: 'glovo', name: 'Glovo', color: '#ffc244', ink: '#1d1d1f', ordersPrefix: 'G' },
  wolt: { key: 'wolt', name: 'Wolt', color: '#00a3e0', ink: '#ffffff', ordersPrefix: 'W' },
  bolt: { key: 'bolt', name: 'Bolt Food', color: '#34d186', ink: '#08301c', ordersPrefix: 'B' },
};

export const PLATFORM_LIST: Platform[] = [PLATFORMS.glovo, PLATFORMS.wolt, PLATFORMS.bolt];

export type OrderItem = { q: number; n: string; p: number };

export const ORDER = {
  no: '1042',
  time: '19:32',
  date: '16.10.2026',
  items: [
    { q: 2, n: 'Бургер Класик', p: 7.9 },
    { q: 1, n: 'Картофки с пармезан', p: 3.5 },
    { q: 2, n: 'Домашна лимонада', p: 2.9 },
  ] as OrderItem[],
};

export const ORDER_TOTAL = ORDER.items.reduce((s, i) => s + i.q * i.p, 0);

export const money = (v: number) => `${v.toFixed(2).replace('.', ',')} €`;

export const KDS_ORDERS = [
  {
    no: '1043',
    platform: PLATFORMS.wolt,
    items: [
      { q: 1, n: 'Пица Маргарита', p: 9.4 },
      { q: 1, n: 'Салата Цезар', p: 7.2 },
    ],
  },
  {
    no: '1044',
    platform: PLATFORMS.bolt,
    items: [
      { q: 3, n: 'Дюнер с пиле', p: 5.9 },
      { q: 2, n: 'Айрян', p: 1.8 },
    ],
  },
];

export const LIGHT_BG = 'radial-gradient(90% 80% at 50% 38%, #fffdf9 0%, #f8f3ec 55%, #ede4d8 100%)';
