import { ChevronLink, Container, SplitIntro } from "./ui";

const steps = [
  {
    no: "01",
    title: "Understand",
    body: "We map how orders move through your business today: the delivery channels you use, the software you run and who handles each step.",
    output: "A written map of your current order workflow.",
  },
  {
    no: "02",
    title: "Identify",
    body: "We pinpoint the manual steps, delays and error points, and judge whether integration would solve a problem worth solving.",
    output: "A shortlist of bottlenecks, ranked by impact.",
  },
  {
    no: "03",
    title: "Validate",
    body: "We check the technical side: the access each platform offers, what its API supports, what your software can receive and any contractual limits.",
    output: "A feasibility summary, including what isn’t possible.",
  },
  {
    no: "04",
    title: "Pilot",
    body: "If the business case and the technical access are both there, we scope a limited pilot with measurable success criteria.",
    output: "A pilot scope, timeline and agreed measures of success.",
    conditional: true,
  },
];

export function Process() {
  return (
    <section id="how-it-works" aria-labelledby="process-title" className="py-24 lg:py-32">
      <Container>
        <SplitIntro id="process-title" title="We start with your workflow, not with software.">
          <p>Every engagement begins with an assessment. Code comes later, and only if it&rsquo;s worth building.</p>
        </SplitIntro>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-[1.75rem] bg-line ring-1 ring-line md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {steps.map((step) => (
            <li key={step.no} className="flex flex-col bg-paper p-7 sm:p-8 lg:min-h-[27rem]">
              <div className="flex items-center justify-between gap-3">
                <span className="tabular text-[2.5rem] leading-none font-[650] tracking-[-0.05em] text-ink-mute">
                  {step.no}
                </span>
                {step.conditional ? (
                  <span className="rounded-full bg-signal/10 px-3 py-1 text-[0.8125rem] font-medium text-signal">
                    Only if 02 and 03 say yes
                  </span>
                ) : null}
              </div>
              <h3 className="type-tile mt-12 lg:mt-16">
                <span className="sr-only">Step {step.no}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{step.body}</p>
              <p className="mt-auto pt-8 text-[0.9375rem]">
                <span className="block border-t border-line pt-4">
                  <span className="font-semibold">You get: </span>
                  <span className="text-ink-soft">{step.output}</span>
                </span>
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-col gap-4 rounded-[1.75rem] bg-mist px-7 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <p className="max-w-2xl text-[1.125rem] leading-snug tracking-[-0.016em]">
            Steps 01 to 03 are free and carry no obligation. If an integration isn&rsquo;t feasible or isn&rsquo;t worth
            it, we&rsquo;ll say so, and you keep the workflow map.
          </p>
          <ChevronLink href="#contact" className="shrink-0">
            Book an assessment
          </ChevronLink>
        </div>
      </Container>
    </section>
  );
}
