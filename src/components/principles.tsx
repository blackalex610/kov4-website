import { Container, SplitIntro, cx } from "./ui";

const principles = [
  {
    title: "Your workflow comes first",
    body: "We map how orders actually move through your business before we suggest any software.",
  },
  {
    title: "Compatibility before promises",
    body: "We confirm what each platform and system allows before we commit to a scope.",
  },
  {
    title: "Your systems stay",
    body: "Wherever it’s feasible, we connect to the POS and tools your team already knows.",
  },
  {
    title: "The smallest useful pilot",
    body: "One location, one channel or one workflow first, so you see the result before you scale it.",
  },
  {
    title: "Success defined upfront",
    body: "Before a pilot starts, we agree on what it should change and how we’ll measure it.",
  },
  {
    title: "Open about limits",
    body: "If something can’t be done properly through authorized access, we say so instead of working around it.",
  },
];

export function Principles() {
  return (
    <section aria-labelledby="principles-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="principles-title" title="Careful about what we promise.">
          <p>We would rather tell you an integration isn&rsquo;t worth it than sell you one that isn&rsquo;t.</p>
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
