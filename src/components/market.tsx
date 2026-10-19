import Image from "next/image";
import { photos } from "@/content/photos";
import { site } from "@/content/site";
import { ButtonLink, Container } from "./ui";

/** Full-bleed photograph of Sofia: where the work starts. */
export function Market() {
  return (
    <section
      aria-labelledby="market-title"
      className="on-dark relative isolate overflow-hidden bg-night-deep text-on-dark"
    >
      <Image
        src={photos.sofiaNight.src}
        alt={photos.sofiaNight.alt}
        fill
        sizes="100vw"
        placeholder="blur"
        className="-z-10 object-cover object-[50%_45%]"
      />
      {/* Legibility scrim along the bottom, under the text; the cathedral stays clear above it. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(34_38_45/0.92),rgb(34_38_45/0.35)_55%,transparent)] lg:bg-[linear-gradient(to_top,rgb(34_38_45/0.9),rgb(34_38_45/0.25)_50%,transparent_75%)]"
      />
      <Container className="flex min-h-[38rem] items-end py-16 lg:min-h-[48rem] lg:py-20">
        <div className="max-w-xl">
          <h2 id="market-title" className="type-h2 text-white">
            Starting in {site.market}.
          </h2>
          <p className="type-lede mt-6 text-on-dark">
            We work with businesses in {site.market} first, in {site.languages}, and talk to merchants elsewhere who use
            comparable platforms.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#contact" variant="inverse">
              Book a free assessment
            </ButtonLink>
            <ButtonLink href={`mailto:${site.contactEmail}`} variant="ghost-dark" className="max-sm:hidden">
              Email {site.contactEmail}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
