import { clients, showSampleProof } from "@/content/sample-proof";
import { channels } from "@/content/site";
import { ClientLogo } from "./client-logos";
import { ChannelDot, ChevronLink, Container } from "./ui";

const systems = ["POS", "Kitchen display", "ERP", "Inventory", "Accounting"];

/** Where orders come from, and where they can go: the whole business in one line. */
export function Platforms() {
  return (
    <section aria-label="Platforms and systems" className="border-y border-line">
      <Container className="grid gap-6 py-10 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-end lg:gap-12 lg:py-12">
        <div>
          <p className="type-label text-ink-faint">Orders from</p>
          <ul className="mt-3 flex flex-wrap items-center gap-x-7 gap-y-1 text-[1.5rem] font-[650] tracking-[-0.032em] lg:text-[1.75rem]">
            {channels.map((c) => (
              <li key={c.id} className="inline-flex items-center gap-2.5">
                <ChannelDot color={c.color} className="size-3" />
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        <svg viewBox="0 0 56 16" aria-hidden className="hidden h-4 w-14 text-line-strong lg:mb-3 lg:block">
          <path
            d="M1 8h52M46 2l7 6-7 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div>
          <p className="type-label text-ink-faint">Into the systems you already run</p>
          <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[1.5rem] font-[650] tracking-[-0.032em] lg:text-[1.75rem]">
            {systems.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-line">
        {showSampleProof ? (
          <Container className="grid gap-6 py-8 lg:grid-cols-[14rem_1fr] lg:items-center lg:gap-10">
            <p className="max-w-[16rem] text-[0.9375rem] leading-snug text-ink-soft">
              Delivery orders already running through kov4
            </p>
            <ul className="flex flex-wrap items-center gap-x-10 gap-y-6 text-ink/80 lg:justify-between">
              {clients.map((c) => (
                <li key={c.id}>
                  <ClientLogo id={c.id} />
                </li>
              ))}
            </ul>
          </Container>
        ) : (
          <Container className="flex flex-col gap-1 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium tracking-[-0.014em]">
              Now taking on a small number of pilot partners in Bulgaria.
            </p>
            <ChevronLink href="#contact" className="h-auto px-0">
              Talk to us about a pilot
            </ChevronLink>
          </Container>
        )}
      </div>
    </section>
  );
}
