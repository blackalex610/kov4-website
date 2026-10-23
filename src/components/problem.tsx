import { photos } from "@/content/photos";
import { Container, PhotoFrame, SplitIntro } from "./ui";

const situations = [
  {
    title: "Трима таблета на бара",
    body: "Всяка платформа има свой таблет, свой звук и свой екран, които персоналът следи едновременно.",
  },
  {
    title: "Преписване на поръчки в касата в най-натовареното време",
    body: "Поръчката се чете от таблета и се въвежда ред по ред в касата, тъкмо когато кухнята е най-заета.",
  },
  {
    title: "Спиране на изчерпан продукт в три приложения",
    body: "Когато нещо свърши, трябва да се спре отделно във всяко приложение.",
  },
  {
    title: "Пропусната поръчка, защото таблетът е заглушен",
    body: "Една неприета поръчка е недоволен клиент и загубен приход.",
  },
  {
    title: "Отчети от три различни места",
    body: "Дневните и месечните суми се събират на ръка от отделни справки.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="problem-title" title="Всяко ново приложение добавя още един таблет на плота.">
          <p>
            Всяка платформа има свое меню и свой формат на поръчките. Когато не са свързани с останалото във вашия
            бизнес, хората запълват празнината на ръка.
          </p>
        </SplitIntro>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <PhotoFrame
            photo={photos.ticketsBw}
            sizes="(min-width: 1024px) 56vw, 100vw"
            position="50% 40%"
            className="aspect-[4/3] lg:col-span-7 lg:aspect-auto lg:min-h-[36rem]"
          />

          <div className="flex flex-col lg:col-span-5">
            <ul className="divide-y divide-line border-y border-line">
              {situations.map((s) => (
                <li key={s.title} className="py-5">
                  <h3 className="text-[1.1875rem] font-semibold tracking-[-0.02em]">{s.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft lg:mt-auto lg:pt-8">
              <span className="font-semibold text-ink">Пример:</span> 80 поръчки на ден × 1 минута преписване = 40
              часа на месец. Ориентировъчно, за илюстрация.
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              Не всеки бизнес има тези проблеми. Ако при вас всичко вече е свързано, ще ви го кажем.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
