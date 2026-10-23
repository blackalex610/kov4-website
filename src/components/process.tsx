import { ChevronLink, Container, SplitIntro } from "./ui";

const steps = [
  {
    no: "01",
    title: "Свързваме приложенията.",
    body: "Вие ни давате достъп като търговец, ние свързваме Glovo, Wolt и Bolt Food през официалните им API.",
  },
  {
    no: "02",
    title: "Настройваме менюто и принтера.",
    body: "Сверяваме продуктите и добавките с вашата каса. Идваме на място в София.",
  },
  {
    no: "03",
    title: "Приемате. Готово.",
    body: "Поръчките идват на един екран и се печатат сами. Таблетите остават включени като резерва през пилота.",
  },
];

export function Process() {
  return (
    <section id="how-it-works" aria-labelledby="process-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="process-title" title="Как работи: три стъпки.">
          <p>Първо свързваме един обект, защото платформите изискват това. Таблетите работят успоредно.</p>
        </SplitIntro>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] bg-line ring-1 ring-line md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {steps.map((step) => (
            <li key={step.no} className="flex flex-col bg-paper p-7 sm:p-8 lg:min-h-[21rem]">
              <div className="flex items-center justify-between gap-3">
                <span className="tabular text-[2.5rem] leading-none font-[650] tracking-[-0.05em] text-ink-mute">
                  {step.no}
                </span>
              </div>
              <h3 className="type-tile mt-12 lg:mt-16">
                <span className="sr-only">Стъпка {step.no}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-4 rounded-[1.75rem] bg-mist px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <p className="max-w-2xl text-[1.125rem] leading-snug tracking-[-0.016em]">
            Първи месец безплатно. Без договор. Таблетите остават като резерва. Ако интеграцията не си струва за вас,
            ще ви го кажем.
          </p>
          <ChevronLink href="#contact" className="shrink-0">
            Заявете безплатен пилот
          </ChevronLink>
        </div>
      </Container>
    </section>
  );
}
