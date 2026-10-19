import { photos } from "@/content/photos";
import { channels } from "@/content/site";
import { PosConsole } from "./pos-console";
import { ButtonLink, ChannelDot, ChevronLink, Container, PhotoFrame } from "./ui";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-14 pb-16 sm:pt-20 lg:pt-24 lg:pb-24">
      <Container className="text-center">
        <p className="inline-flex items-center gap-3 type-label text-ink-soft">
          <span className="inline-flex -space-x-0.5" aria-hidden>
            {channels.map((c) => (
              <ChannelDot key={c.id} color={c.color} className="size-2.5 ring-2 ring-paper" />
            ))}
          </span>
          Delivery platform integration
        </p>

        <h1 id="hero-title" className="type-display mx-auto mt-6 max-w-[14ch] sm:max-w-none">
          <span className="block">Your delivery channels.</span>
          <span className="block text-ink-mute">One connected operation.</span>
        </h1>

        <p className="type-lede mx-auto mt-7 max-w-2xl text-ink-soft">
          We help merchants connect Glovo, Wolt and Bolt Food orders to the POS and systems they already run, starting
          with a free look at how orders move today.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <ButtonLink href="#contact">Assess my workflow</ButtonLink>
          <ChevronLink href="#how-it-works">See how it works</ChevronLink>
        </div>
      </Container>

      <Container className="mt-14 lg:mt-20">
        <div className="relative">
          <PhotoFrame
            photo={photos.heroPass}
            eager
            quality={85}
            sizes="(min-width: 1280px) 1200px, 100vw"
            position="50% 80%"
            className="aspect-[4/5] rounded-[2rem] sm:aspect-[16/10]"
          />
          {/* The order queue sits on the photograph like a screen at the pass, clear of the chef's hand. */}
          <div className="relative z-10 -mt-40 px-3 sm:absolute sm:bottom-6 sm:left-6 sm:mt-0 sm:w-[24rem] sm:px-0 lg:bottom-10 lg:left-10 lg:w-[27rem]">
            <PosConsole />
          </div>
        </div>
      </Container>
    </section>
  );
}
