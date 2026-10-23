import { photos, type Photo } from "@/content/photos";
import { Rail } from "./rail";
import { Container, PhotoFrame, SplitIntro } from "./ui";

type Industry = {
  id: string;
  label: string;
  who: string;
  friction: string;
  could: string[];
  systems: string;
  photo: Photo;
  position: string;
};

const industries: Industry[] = [
  {
    id: "food",
    label: "Хранене и кетъринг",
    who: "Ресторанти, кафенета и бързо хранене",
    friction:
      "Поръчки, преписвани от таблетите в касата в най-натоварения момент, при което размери, добавки и бележки като „без лук“ се губят по пътя към кухнята.",
    could: [
      "Изпращане на поръчките от платформите към касата или кухненския екран като бележки, със съпоставени добавки.",
      "Вашето меню като основа за наличността, където платформите позволяват обновяване.",
      "Връщане на статуса на приготвяне към платформата, ако тя поддържа това.",
    ],
    systems: "каса, кухненски принтер или екран и управление на менюто",
    photo: photos.foodService,
    position: "55% 50%",
  },
  {
    id: "grocery",
    label: "Хранителни и магазини за бързо пазаруване",
    who: "Супермаркети, квартални магазини и минимаркети",
    friction:
      "Големи каталози, в които наличностите се променят по-бързо от обявите, затова липсващите артикули излизат наяве чак при комплектоването и се уреждат по телефона.",
    could: [
      "Предаване на наличностите от вашата складова система към каталозите на платформите, където е поддържано.",
      "Отчитане на продажбите от платформите спрямо склада в момента на постъпване на поръчките.",
      "Отбелязване на липсващите артикули, преди да започне комплектоването.",
    ],
    systems: "складова система или ERP, каса и управление на каталога",
    photo: photos.grocery,
    position: "50% 50%",
  },
  {
    id: "retail",
    label: "Търговия на дребно и специализирани магазини",
    who: "Търговци, цветарници и магазини за подаръци",
    friction:
      "Часове за доставка и текстове към картички, преписвани на ръка между екрани, и продажби, разделени между онлайн магазина и платформите.",
    could: [
      "Пренасяне на часовете за доставка и бележките към подаръците директно във вашата система за поръчки.",
      "Съпоставяне на обявите в платформите с продуктите във вашия онлайн магазин или каса.",
      "Събиране на продажбите по канали в един дневен преглед на поръчките.",
    ],
    systems: "платформа за онлайн търговия, управление на поръчки и каса",
    photo: photos.florist,
    position: "38% 60%",
  },
  {
    id: "multi",
    label: "Вериги с повече обекти",
    who: "Вериги, франчайзи и кухни с няколко марки",
    friction:
      "Всеки обект работи със свои устройства и процедури за поръчките от платформите, а централата няма общ поглед по канал и по обект.",
    could: [
      "Насочване на всяка поръчка към системите на обекта, който я изпълнява.",
      "Едно съпоставяне на продуктите и един набор от правила за всички обекти.",
      "Обединяване на данните за поръчките от всички обекти и платформи за отчети.",
    ],
    systems: "каса във всеки обект, централен ERP и отчети",
    photo: photos.multiLocation,
    position: "50% 45%",
  },
];

function PlusIcon() {
  return (
    <span
      aria-hidden
      className="disclosure-icon inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-mist-deep"
    >
      <svg viewBox="0 0 16 16" className="size-3">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="overflow-hidden bg-mist py-24 lg:py-32">
      <Container>
        <SplitIntro id="solutions-title" title="Не само за ресторанти.">
          <p>
            Всеки търговец, който продава през платформи за доставка и работи със собствени системи, може да се сблъска
            със същите пропуски. Подробностите се различават според вида бизнес.
          </p>
        </SplitIntro>
      </Container>

      <div className="mt-14 lg:mt-20">
        <Rail
          label="Видове бизнес"
          aside={
            <p className="max-w-xl text-[0.875rem] text-ink-faint">
              Кои категории продукти приема една платформа, зависи от платформата и от държавата. Проверяваме какво е
              възможно за вашия вид бизнес.
            </p>
          }
        >
          {industries.map((ind) => (
            <li key={ind.id} className="w-[82vw] max-w-[25rem] shrink-0 sm:w-[23rem] lg:w-[26rem]">
              <article aria-labelledby={`industry-${ind.id}`}>
                <div className="relative">
                  <PhotoFrame
                    photo={ind.photo}
                    position={ind.position}
                    sizes="(min-width: 1024px) 26rem, 82vw"
                    className="aspect-[4/5]"
                  />
                  <div className="absolute inset-x-0 top-0 rounded-t-[1.75rem] bg-[linear-gradient(to_bottom,rgb(27_30_36/0.62),rgb(27_30_36/0.25)_60%,transparent)] px-6 pt-6 pb-20 text-white">
                    <p className="text-[0.9375rem] font-medium text-white/85">{ind.who}</p>
                    <h3 id={`industry-${ind.id}`} className="type-tile mt-1">
                      {ind.label}
                    </h3>
                  </div>
                </div>
                <p className="mt-6 text-ink-soft">{ind.friction}</p>
                <details className="disclosure mt-5 border-t border-line-strong/70">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-md py-4 font-medium tracking-[-0.014em]">
                    Какво може да направи интеграцията
                    <PlusIcon />
                  </summary>
                  <ul className="space-y-2.5 pb-2">
                    {ind.could.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.9375rem]">
                        <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-brand" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 pb-2 text-[0.875rem] text-ink-faint">Обикновено включва: {ind.systems}.</p>
                </details>
              </article>
            </li>
          ))}
        </Rail>
      </div>
    </section>
  );
}
