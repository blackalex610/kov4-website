import { OrderFlow } from "./order-flow";
import { Reveal } from "./reveal";
import { Container } from "./ui";

export function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="on-dark bg-night py-24 text-on-dark lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="showcase-title" className="type-h2 text-white">
            <span className="block">Три приложения.</span>
            <span className="block">Три изписвания.</span>
            <span className="block">Едно решение.</span>
          </h2>
          <p className="type-lede mx-auto mt-6 max-w-2xl text-on-dark-soft">
            Всяка платформа описва едно и също ястие по свой начин. Свързаната система съпоставя всеки вариант с
            артикула от вашето меню, така че кухнята чете един формат.
          </p>
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <OrderFlow />
        </Reveal>
      </Container>
    </section>
  );
}
