import { channels, site } from "@/content/site";
import { LogoMark } from "./logo";
import { ChannelDot, Container, SectionIntro } from "./ui";

/**
 * The hub: marketplaces on the left, the systems a merchant runs on the right,
 * kov4's middleware between them. Followed by what it handles, what it depends
 * on and what we won't do.
 */

const sources = [
  ...channels.map((c) => ({ name: c.name, color: c.color as string, note: "Поръчки, статуси, меню" })),
  { name: "Сходни платформи", color: "var(--color-line-strong)", note: "Където има разрешен достъп" },
];

const destinations = [
  { name: "Каса и кухненски екран", note: "Бележки, артикули, добавки" },
  { name: "ERP и склад", note: "Наличности навън, продажби навътре" },
  { name: "Управление на поръчки", note: "Насочване по обекти" },
  { name: "Счетоводство и собствени API", note: "В очаквания от тях формат" },
];

const steps = ["Приема всяка поръчка", "Съпоставя я с вашето меню", "Насочва я към правилната система", "Записва всяко събитие"];

const capabilities = [
  { title: "Събития по поръчките", body: "Нови поръчки и промени в статуса, както ги публикува платформата." },
  { title: "Съпоставяне на продукти", body: "Артикулите и добавките от платформите, свързани с вашите продуктови кодове." },
  { title: "Преобразуване на данни", body: "Форматът на всяка платформа се превръща в този, който очаква вашата система." },
  { title: "Насочване", body: "Всяка поръчка отива в правилния обект, система или опашка." },
  { title: "Повторни опити", body: "Неуспешните изпращания се повтарят, а поръчките се пазят, докато системата ви отговори." },
  { title: "Защита от дублиране", body: "Уникални ключове, за да не се обработи една поръчка два пъти, където е поддържано." },
];

const dependsOn = [
  "Достъп до API и одобрение от всяка платформа за вашия профил",
  "Разрешенията, които вие давате като търговец",
  "Условията и договорните изисквания на всяка платформа",
  "Какво може да приеме вашата каса или бизнес софтуер",
];

const wontDo = [
  "Да извличаме данни от приложенията или търговските панели на платформите",
  "Да заобикаляме контролите, ограниченията или одобренията на платформите",
  "Да прехващаме личния трафик на приложенията",
  "Да обещаваме интеграция, която платформата не позволява",
];

const ROWS = [12.5, 37.5, 62.5, 87.5];

function Connectors({ direction }: { direction: "merge" | "split" }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden className="hidden h-full w-full lg:block">
      {ROWS.map((y) => (
        <path
          key={y}
          d={direction === "merge" ? `M0 ${y} C55 ${y} 45 50 100 50` : `M0 50 C55 50 45 ${y} 100 ${y}`}
          fill="none"
          stroke="var(--color-night-line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

function DownArrow() {
  return (
    <div aria-hidden className="flex justify-center py-3 lg:hidden">
      <svg viewBox="0 0 16 32" className="h-8 w-4 text-night-line">
        <path d="M8 0v29M3 24l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Node({ name, note, color }: { name: string; note: string; color?: string }) {
  return (
    <div className="flex h-full items-center gap-3 rounded-2xl bg-night-raised px-4 py-3.5 ring-1 ring-night-line">
      {color ? <ChannelDot color={color} className="size-2.5" /> : null}
      <div className="min-w-0">
        <p className="leading-tight font-semibold tracking-[-0.014em] text-white">{name}</p>
        <p className="mt-0.5 text-[0.8125rem] text-on-dark-soft">{note}</p>
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <section
      id="integrations"
      aria-labelledby="integrations-title"
      className="on-dark bg-night py-24 text-on-dark lg:py-32"
    >
      <Container>
        <SectionIntro id="integrations-title" title="Свързва мястото, където продавате, със системите, с които работите." align="center" dark>
          <p>
            За оперативни и ИТ екипи: как се свързват интеграциите, които проектираме. Кои части се прилагат, зависи от
            API, разрешенията и условията на всяка платформа, както и от вашия софтуер.
          </p>
        </SectionIntro>

        <figure className="m-0 mt-16 lg:mt-24">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)_5rem_minmax(0,1fr)]">
            <div>
              <p className="mb-4 text-[0.875rem] font-medium text-on-dark-soft">Откъде идват поръчките</p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:h-[23rem] lg:grid-cols-1 lg:grid-rows-4 lg:gap-0">
                {sources.map((s) => (
                  <li key={s.name} className="lg:py-1.5">
                    <Node name={s.name} note={s.note} color={s.color} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden lg:block lg:pt-9">
              <div className="h-[23rem]">
                <Connectors direction="merge" />
              </div>
            </div>
            <DownArrow />

            <div className="lg:pt-9">
              <div className="flex h-full flex-col justify-center lg:h-[23rem]">
                <div className="rounded-[1.5rem] bg-night-deep p-6 ring-1 ring-sky/50 sm:p-7">
                  <div className="flex items-center gap-3">
                    <LogoMark className="size-8 rounded-[8px] ring-1 ring-night-line" />
                    <div>
                      <p className="leading-tight font-semibold text-white">Посредникът на {site.name}</p>
                      <p className="text-[0.8125rem] text-on-dark-soft">Между платформите и вашите системи</p>
                    </div>
                  </div>
                  <ol className="mt-6 space-y-2.5 border-t border-night-line pt-5">
                    {steps.map((s, i) => (
                      <li key={s} className="flex items-center gap-3 text-[0.9375rem]">
                        <span
                          aria-hidden
                          className="tabular flex size-6 shrink-0 items-center justify-center rounded-full bg-sky/15 text-[0.75rem] font-semibold text-sky-light"
                        >
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="hidden lg:block lg:pt-9">
              <div className="h-[23rem]">
                <Connectors direction="split" />
              </div>
            </div>
            <DownArrow />

            <div>
              <p className="mb-4 text-[0.875rem] font-medium text-on-dark-soft">Системите, с които работите</p>
              <ul className="grid gap-3 sm:grid-cols-2 lg:h-[23rem] lg:grid-cols-1 lg:grid-rows-4 lg:gap-0">
                {destinations.map((d) => (
                  <li key={d.name} className="lg:py-1.5">
                    <Node name={d.name} note={d.note} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <figcaption className="mt-10 text-center text-[0.875rem] text-on-dark-soft">
            Кои връзки са възможни, се уточнява за всяка платформа и всяка система при първоначалния разговор.
          </figcaption>
        </figure>

        <div className="mt-20 grid gap-12 border-t border-night-line pt-14 lg:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h3 className="type-h3 text-white">Какво поема посредникът</h3>
            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {capabilities.map((c) => (
                <div key={c.title}>
                  <dt className="font-semibold text-white">{c.title}</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-on-dark-soft">{c.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          <List title="От какво зависи" items={dependsOn} className="lg:col-span-3" />
          <List title="Какво не правим" items={wontDo} className="lg:col-span-3" negative />
        </div>
      </Container>
    </section>
  );
}

function List({
  title,
  items,
  className,
  negative = false,
}: {
  title: string;
  items: string[];
  className?: string;
  negative?: boolean;
}) {
  return (
    <div className={className}>
      <h3 className="type-h3 text-white">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((d) => (
          <li key={d} className="flex gap-3 text-[0.9375rem] leading-relaxed text-on-dark-soft">
            {negative ? (
              <svg viewBox="0 0 12 12" aria-hidden className="mt-[0.5em] size-3 shrink-0 text-signal">
                <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : (
              <span aria-hidden className="mt-[0.75em] h-px w-3 shrink-0 bg-sky" />
            )}
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
