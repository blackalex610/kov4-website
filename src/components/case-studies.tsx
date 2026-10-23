/**
 * Renders the FICTIONAL sample case studies from src/content/sample-proof.ts.
 * Hidden unless NEXT_PUBLIC_SHOW_SAMPLE_PROOF=true.
 */
import { photos, type Photo } from "@/content/photos";
import {
  compactCases,
  featuredCase,
  getClient,
  showSampleProof,
  type CaseStudy,
  type ClientId,
} from "@/content/sample-proof";
import { ClientLogo } from "./client-logos";
import { Container, PhotoFrame, SectionIntro } from "./ui";

function Facts({ study }: { study: CaseStudy }) {
  const client = getClient(study.client);
  const facts = [
    { label: "Бизнес", value: client.segment },
    { label: "Обекти", value: `${client.locations} в ${client.city}` },
    { label: "Канали", value: study.channels.join(", ") },
    { label: "Свързано с", value: study.system },
  ];
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[0.875rem] sm:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-ink-faint">{f.label}</dt>
          <dd className="mt-0.5 font-medium">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const casePhotos: Partial<Record<ClientId, { photo: Photo; position: string }>> = {
  kvartal: { photo: photos.kitchenLine, position: "50% 50%" },
  forno: { photo: photos.pizza, position: "50% 38%" },
  wok: { photo: photos.wok, position: "50% 55%" },
};

export function CaseStudies() {
  if (!showSampleProof) return null;

  const featuredPhoto = casePhotos[featuredCase.client];

  return (
    <section id="work" aria-labelledby="work-title" className="py-24 lg:py-32">
      <Container>
        <SectionIntro id="work-title" title="Кухни, които вече работят с един поток от поръчки.">
          <p>Няколко от операторите, чиито поръчки от платформите вече стигат до собствените им системи без преписване.</p>
        </SectionIntro>

        <article className="mt-14 grid overflow-hidden rounded-[1.75rem] bg-mist lg:mt-20 lg:grid-cols-12">
          {featuredPhoto ? (
            <PhotoFrame
              photo={featuredPhoto.photo}
              position={featuredPhoto.position}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[3/2] rounded-none lg:col-span-5 lg:aspect-auto lg:min-h-full"
            />
          ) : null}
          <div className="flex flex-col p-7 sm:p-10 lg:col-span-7 lg:p-12">
            <ClientLogo id={featuredCase.client} size="lg" />
            <div className="mt-8">
              <Facts study={featuredCase} />
            </div>
            <div className="mt-8 grid gap-6 border-t border-line-strong/60 pt-8 sm:grid-cols-2">
              <div>
                <h3 className="type-label text-ink-faint">Преди</h3>
                <p className="mt-2 text-ink-soft">{featuredCase.before}</p>
              </div>
              <div>
                <h3 className="type-label text-brand">След</h3>
                <p className="mt-2">{featuredCase.after}</p>
              </div>
            </div>
            {featuredCase.quote ? (
              <blockquote className="mt-auto pt-10">
                <p className="text-[1.375rem] leading-[1.32] font-medium tracking-[-0.022em] text-balance sm:text-[1.625rem]">
                  &ldquo;{featuredCase.quote.text}&rdquo;
                </p>
                <footer className="mt-4 text-[0.9375rem] text-ink-soft">{featuredCase.quote.attribution}</footer>
              </blockquote>
            ) : null}
          </div>
        </article>

        <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2">
          {compactCases.map((study) => {
            const pic = casePhotos[study.client];
            return (
              <article key={study.client}>
                {pic ? (
                  <PhotoFrame
                    photo={pic.photo}
                    position={pic.position}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="aspect-[16/10]"
                  />
                ) : null}
                <div className="mt-8">
                  <ClientLogo id={study.client} size="lg" />
                  <p className="mt-5 text-ink-soft">{study.before}</p>
                  <p className="mt-3">{study.after}</p>
                  <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[0.875rem]">
                    <div>
                      <dt className="text-ink-faint">Канали</dt>
                      <dd className="mt-0.5 font-medium">{study.channels.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-faint">Свързано с</dt>
                      <dd className="mt-0.5 font-medium">{study.system}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
