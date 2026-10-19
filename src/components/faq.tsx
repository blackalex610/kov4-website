import { site } from "@/content/site";
import { Container } from "./ui";

const faqs = [
  {
    q: "Are you an official partner of Glovo, Wolt or Bolt Food?",
    a: "No. kov4 is independent and isn’t affiliated with or endorsed by any delivery platform. We work only through the access each platform makes available to merchants and integration partners, and we’ll tell you plainly what that access allows for your account.",
  },
  {
    q: "Is there a ready-made product we can sign up for?",
    a: "Not off the shelf. Setups differ too much between businesses, so we start with an assessment of your workflow and systems. Where it makes sense we reuse proven integration components, but the scope is always agreed with you.",
  },
  {
    q: "Which POS and business systems do you work with?",
    a: "We assess compatibility case by case. What matters is whether your software can receive data, through an API, an import or another supported mechanism, and whether the delivery platform provides authorized access for your account.",
  },
  {
    q: "What does the assessment cost?",
    a: "Nothing. The workflow assessment is free and carries no obligation. If a pilot makes sense, you’ll get a written scope and price before any work starts.",
  },
  {
    q: "How long does it take?",
    a: "The assessment usually takes one call and a written follow-up. Pilot timelines depend on platform approval and on your systems, so we give you an estimate once feasibility is confirmed rather than guessing upfront.",
  },
  {
    q: "Will this replace our POS or affect fiscal receipts?",
    a: "No. The aim is to connect the systems you already use, not replace them. Fiscal receipts stay with your registered POS or cash register; an integration passes order data to it.",
  },
  {
    q: "Do you scrape the platforms or use unofficial workarounds?",
    a: "No. We don’t scrape apps or dashboards, bypass platform controls or intercept app traffic. If authorized access isn’t available for what you need, we’ll tell you that instead.",
  },
  {
    q: "What happens if an order fails to come through?",
    a: "Integrations we scope are designed with retries, logging and alerts, so a failed order is visible rather than silently lost. The exact behaviour depends on the platform and your systems, and is agreed during the pilot.",
  },
  {
    q: "How do you handle our data?",
    a: "We only access the data an integration needs, under a written agreement with you. Personal data is processed in line with the GDPR, and data-handling terms are agreed before a pilot begins.",
  },
  {
    q: `Do you work outside ${site.market}?`,
    a: `We’re starting with businesses in ${site.market}. If you operate elsewhere and use comparable platforms, get in touch and we can talk it through.`,
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-mist py-24 lg:py-32">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-title" className="type-h2">
              <span className="block">Questions,</span>
              <span className="block text-ink-mute">answered plainly.</span>
            </h2>
            <p className="mt-6 max-w-sm text-ink-soft">
              Something not covered here? Write to{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                {site.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          {faqs.map((item) => (
            <details key={item.q} className="disclosure border-b border-line-strong/70 first:border-t">
              <summary className="flex cursor-pointer items-center justify-between gap-6 rounded-md py-6 text-[1.0625rem] font-semibold tracking-[-0.02em] sm:text-[1.25rem]">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="disclosure-icon inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-paper"
                >
                  <svg viewBox="0 0 16 16" className="size-3">
                    <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
