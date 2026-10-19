import React from 'react';

type P = { size?: number; color?: string };

const S: React.FC<P & { children: React.ReactNode }> = ({ size = 30, color = 'currentColor', children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const ClockIcon: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </S>
);

export const AlertIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M12 3 2.5 20h19L12 3z" />
    <path d="M12 10v4" />
    <path d="M12 17.2v.1" />
  </S>
);

export const XIcon: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" />
  </S>
);

export const ScooterIcon: React.FC<P> = (p) => (
  <S {...p}>
    <circle cx="6" cy="17" r="2.6" />
    <circle cx="18" cy="17" r="2.6" />
    <path d="M8.6 17h6.8l2.2-7h-3" />
    <path d="M14 7h3.5" />
    <path d="M3 12h6l2 5" />
  </S>
);

export const CheckIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </S>
);

export const KeyboardIcon: React.FC<P> = (p) => (
  <S {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
  </S>
);

export const PrinterIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M7 9V3.5h10V9" />
    <rect x="3" y="9" width="18" height="8" rx="2" />
    <path d="M7 14h10v6.5H7z" />
  </S>
);

export const MergeIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M3 6c5 0 6 6 10 6" />
    <path d="M3 12h10" />
    <path d="M3 18c5 0 6-6 10-6" />
    <path d="M13 12h7" />
    <path d="m17 9 3 3-3 3" />
  </S>
);

export const ChefIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M7 14.5V20h10v-5.5" />
    <path d="M7 14.5a4 4 0 0 1-1.2-7.6A5 5 0 0 1 12 3.5a5 5 0 0 1 6.2 3.4A4 4 0 0 1 17 14.5z" />
    <path d="M7 17h10" />
  </S>
);
