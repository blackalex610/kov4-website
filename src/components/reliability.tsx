import { Container, SplitIntro } from "./ui";

const points = [
  "Таблетите на платформите остават включени през пилота. Ако нещо спре, поръчките пак идват.",
  "SMS или обаждане до мениджъра, ако поръчка остане неприета 3 минути.",
  "Получаваме сигнал автоматично, ако връзката с платформа прекъсне.",
  "Всяко събитие по поръчка се записва, а неуспешните изпращания се повтарят.",
];

/** The owner's biggest fear, answered on the homepage: what happens when it breaks on a busy night. */
export function Reliability() {
  return (
    <section id="reliability" aria-labelledby="reliability-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="reliability-title" title="Ами ако спре в петък вечер?">
          <p>Ако нещо спре, поръчките пак идват на таблета. И ние разбираме първи.</p>
        </SplitIntro>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] bg-line ring-1 ring-line sm:grid-cols-2 lg:mt-20">
          {points.map((text, i) => (
            <li key={text} className="flex gap-5 bg-paper p-7 sm:p-8">
              <span className="tabular text-[1.5rem] leading-none font-[650] tracking-[-0.04em] text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[1.0625rem] leading-snug tracking-[-0.012em]">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
