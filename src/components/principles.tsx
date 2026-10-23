import { Container, SplitIntro, cx } from "./ui";

const principles = [
  {
    title: "Първо вашият начин на работа",
    body: "Първо разглеждаме как поръчките реално минават през вашия бизнес и чак тогава предлагаме софтуер.",
  },
  {
    title: "Съвместимост преди обещания",
    body: "Уточняваме какво позволява всяка платформа и система, преди да се ангажираме с обхват.",
  },
  {
    title: "Вашите системи остават",
    body: "Където е възможно, се свързваме с касата и инструментите, които екипът ви вече познава.",
  },
  {
    title: "Най-малкият полезен пилот",
    body: "Първо един обект, един канал или един процес, за да видите резултата, преди да го разширите.",
  },
  {
    title: "Успехът се определя предварително",
    body: "Преди да започне пилотът, се договаряме какво трябва да промени и как ще го измерваме.",
  },
  {
    title: "Открити сме за ограниченията",
    body: "Ако нещо не може да се направи коректно чрез разрешен достъп, го казваме, вместо да го заобикаляме.",
  },
];

export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="principles-title" title="Внимателни сме какво обещаваме.">
          <p>По-скоро ще ви кажем, че една интеграция не си струва, отколкото да ви продадем такава.</p>
        </SplitIntro>

        <ul className="mt-14 grid border-b border-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className={cx(
                "border-t border-line py-8 lg:py-10 lg:pr-8",
                // A hairline between columns: two per row on tablets, three on desktop.
                i % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:pr-8",
                i % 3 === 0 ? "lg:border-l-0 lg:pl-0" : "lg:border-l lg:pl-8",
              )}
            >
              <h3 className="type-h3">{p.title}</h3>
              <p className="mt-2.5 max-w-sm text-ink-soft">{p.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
