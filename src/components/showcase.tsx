import { OrderFlow } from "./order-flow";
import { Reveal } from "./reveal";
import { Container } from "./ui";

export function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="on-dark bg-night py-24 text-on-dark lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="showcase-title" className="type-h2 text-white">
            <span className="block">Three apps.</span>
            <span className="block">Three spellings.</span>
            <span className="block">One ticket.</span>
          </h2>
          <p className="type-lede mx-auto mt-6 max-w-2xl text-on-dark-soft">
            Each marketplace describes the same dish its own way. A connected setup matches every version to the item on
            your menu, so the kitchen reads one format.
          </p>
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <OrderFlow />
        </Reveal>
      </Container>
    </section>
  );
}
