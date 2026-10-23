import Link from "next/link";
import { photos, type Photo } from "@/content/photos";
import { showSampleProof } from "@/content/sample-proof";
import { navigation, site } from "@/content/site";
import { LogoEmblem } from "./logo";
import { Container } from "./ui";

const credits = (Object.values(photos) as Photo[]).filter((p) => showSampleProof || !p.sample);

const linkClass = "text-on-dark transition-colors hover:text-white";

export function SiteFooter() {
  const year = 2026;
  return (
    <footer className="on-dark bg-night-ink text-on-dark">
      <Container className="pt-20 pb-10 lg:pt-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <p className="type-h2 text-white lg:col-span-8">
            <span className="block">По-малко таблети.</span>
            <span className="block text-brand">Един поток от поръчки.</span>
          </p>
          <div className="lg:col-span-4 lg:justify-self-end lg:pb-2">
            <LogoEmblem />
          </div>
        </div>

        <div className="mt-16 grid gap-10 border-t border-night-line pt-10 sm:grid-cols-3 lg:mt-24">
          <nav aria-label="Долна навигация">
            <p className="text-[0.875rem] text-on-dark-soft">Навигация</p>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-[0.875rem] text-on-dark-soft">Връзка с нас</p>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              <li>
                <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                  {site.contactEmail}
                </a>
              </li>
              <li>
                <Link href="/#contact" className={linkClass}>
                  Заявете безплатен пилот
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[0.875rem] text-on-dark-soft">За нас</p>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              <li>
                Работим в България, на български и английски
              </li>
              <li>
                <Link href="/privacy" className={linkClass}>
                  Политика за поверителност
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 space-y-3 border-t border-night-line pt-6 text-[0.8125rem] leading-relaxed text-on-dark-soft">
          <div className="flex flex-col gap-3 md:flex-row md:justify-between">
            <p>
              &copy; {year} {site.name}
            </p>
            <p className="max-w-2xl md:text-right">
              Glovo, Wolt и Bolt Food са търговски марки на съответните си собственици. {site.name} е независима и не е
              свързана с тях, нито е одобрена от тях.
            </p>
          </div>
          <p>
            Снимки от Unsplash от{" "}
            {credits.map((p, i) => (
              <span key={p.credit.url}>
                <a href={p.credit.url} className="underline decoration-night-line underline-offset-2 hover:text-white">
                  {p.credit.name}
                </a>
                {i < credits.length - 2 ? ", " : i === credits.length - 2 ? " и " : ""}
              </span>
            ))}
            .
          </p>
        </div>
      </Container>
    </footer>
  );
}
