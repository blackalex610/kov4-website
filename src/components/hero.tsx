import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { photos } from "@/content/photos";
import { OrderStage } from "./order-stage";
import { Wordmark } from "./wordmark";
import { Arrow, ButtonLink, Container, cx } from "./ui";

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

const icon = {
  sync: <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />,
  printer: (
    <>
      <path d="M7 9V3.5h10V9" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14.5h10V21H7z" />
    </>
  ),
  bars: (
    <>
      <path d="M5 20v-6M10 20V10M15 20v-8M20 20V5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </>
  ),
};

const benefits: { icon: keyof typeof icon; title: ReactNode }[] = [
  { icon: "sync", title: <>Автоматичен синхрон на поръчките</> },
  { icon: "printer", title: <>Директно в касата и принтера</> },
  { icon: "bars", title: <>По-малко грешки, по-бързо обслужване</> },
  { icon: "clock", title: <>Повече време за бизнеса</> },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
      {/* Backdrop: the pass under copper heat lamps, dimmed and softened into warm light. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={photos.heroPass.src}
          alt=""
          fill
          sizes="100vw"
          quality={75}
          placeholder="blur"
          className="scale-110 object-cover opacity-[0.22] blur-[5px]"
          style={{ objectPosition: "60% 25%" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--color-paper)_5%,rgb(12_10_9/0.82)_42%,rgb(12_10_9/0.45))]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_74%_48%,rgb(229_115_47/0.16),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
      </div>

      <Container className="grid gap-x-8 gap-y-14 pt-14 pb-20 sm:pt-20 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:pt-24 lg:pb-24">
        <div className="lg:col-span-5 lg:row-start-1 lg:self-center">
          {/* The intro animation ends exactly here (intro.tsx measures this element). */}
          <Wordmark id="hero-wordmark" className="hero-wordmark mb-10 h-auto w-full max-w-[30rem]" />
          <p className="hero-in text-[0.8125rem] font-semibold tracking-[0.32em] text-brand uppercase">
            Една система. Всички поръчки.
          </p>

          <h1
            id="hero-title"
            className="hero-in type-display mt-6 text-[clamp(2.75rem,1.9rem+2.6vw,4.375rem)] text-white"
            style={delay(0.08)}
          >
            Glovo, Wolt и Bolt Food — <span className="text-brand">на един екран.</span>
          </h1>

          <p className="hero-in type-lede mt-7 max-w-xl text-ink-soft" style={delay(0.16)}>
            Поръчките влизат директно в касата и в кухнята. Без преписване.
          </p>
          <p className="hero-in mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft" style={delay(0.2)}>
            Изчерпан продукт спирате веднъж — и трите приложения се обновяват. За ресторанти и кафенета в София.
          </p>

          <div className="hero-in mt-10 flex flex-wrap items-center gap-x-8 gap-y-4" style={delay(0.24)}>
            <ButtonLink href="#contact" className="group h-14 px-8 text-[1.0625rem]">
              Заявете безплатен пилот
              <Arrow className="transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <Link
              href="#how-it-works"
              className="group inline-flex h-14 items-center gap-3 rounded-full pr-2 text-[1rem] font-medium text-brand transition-colors hover:text-brand-hover"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-brand text-white shadow-[0_0_24px_-4px_rgb(229_115_47/0.8)] transition-transform group-hover:scale-105">
                <svg viewBox="0 0 12 12" aria-hidden className="ml-0.5 size-3">
                  <path d="M2.5 1.5v9l8-4.5-8-4.5Z" fill="currentColor" />
                </svg>
              </span>
              Вижте как работи
            </Link>
          </div>
          <p className="hero-in mt-6 max-w-xl text-[0.9375rem] text-ink-faint" style={delay(0.28)}>
            Първи месец безплатно · Без договор · Таблетите остават като резерва.
          </p>
        </div>

        <div
          className="hero-in lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:-mr-4 lg:self-center xl:-mr-16"
          style={delay(0.3)}
        >
          <OrderStage />
        </div>

        <ul
          className="hero-in grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:col-span-5 lg:row-start-2 lg:self-end"
          style={delay(0.4)}
        >
          {benefits.map((b, i) => (
            <li
              key={b.icon}
              className={cx(
                "flex flex-col gap-3 pr-3 text-[0.875rem] leading-snug text-ink-soft",
                i > 0 && "sm:border-l sm:border-line-strong sm:pl-4",
                i === 2 && "max-sm:border-0 max-sm:pl-0",
                i % 2 === 1 && "max-sm:border-l max-sm:border-line-strong max-sm:pl-5",
              )}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden
                className="size-7 text-brand"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {icon[b.icon]}
              </svg>
              <span className="max-w-[10rem]">{b.title}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
