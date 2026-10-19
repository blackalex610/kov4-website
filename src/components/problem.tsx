import { photos } from "@/content/photos";
import { Container, PhotoFrame, SplitIntro } from "./ui";

const situations = [
  {
    title: "Re-entering orders",
    body: "Each marketplace order is read off a tablet and typed into the POS, line by line, at the busiest time of day.",
  },
  {
    title: "Switching between apps",
    body: "Staff watch a separate tablet for every platform, each with its own alerts and order screen.",
  },
  {
    title: "Keeping availability in step",
    body: "When a dish sells out, it has to be paused on every platform, one app at a time.",
  },
  {
    title: "Running several locations",
    body: "Each outlet has its own devices, menus and habits, and head office sees little of it.",
  },
  {
    title: "Consolidating order data",
    body: "Daily and monthly totals are pieced together from separate platform exports.",
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="problem-title" title="Every new app adds another tablet to the counter.">
          <p>
            Each marketplace brings its own menu and order format. When those don&rsquo;t connect to the rest of your
            business, people fill the gap by hand.
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
              Not every business has these problems. Some already run well-connected setups, and if that&rsquo;s you,
              we&rsquo;ll tell you.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
