import { photos, type Photo } from "@/content/photos";
import { Rail } from "./rail";
import { Container, PhotoFrame, SplitIntro } from "./ui";

type Industry = {
  id: string;
  label: string;
  who: string;
  friction: string;
  could: string[];
  systems: string;
  photo: Photo;
  position: string;
};

const industries: Industry[] = [
  {
    id: "food",
    label: "Food service",
    who: "Restaurants, cafés and fast food",
    friction:
      "Orders re-typed from tablets into the POS during the rush, with sizes, extras and notes like “no onion” lost on the way to the kitchen.",
    could: [
      "Send marketplace orders to the POS or kitchen display as tickets, with modifiers mapped.",
      "Use your own menu as the reference for availability, where platforms allow updates.",
      "Return preparation status to the platform, if it supports status updates.",
    ],
    systems: "POS, kitchen printer or display, menu management",
    photo: photos.foodService,
    position: "55% 50%",
  },
  {
    id: "grocery",
    label: "Grocery and convenience",
    who: "Supermarkets, local shops and minimarkets",
    friction:
      "Large catalogues where stock changes faster than listings, so out-of-stock items turn up during picking and get sorted out by phone.",
    could: [
      "Pass stock levels from your inventory system to marketplace catalogues where supported.",
      "Record marketplace sales against inventory as orders arrive.",
      "Flag unavailable items before picking starts.",
    ],
    systems: "inventory or ERP, POS, catalogue management",
    photo: photos.grocery,
    position: "50% 50%",
  },
  {
    id: "retail",
    label: "Retail and specialty",
    who: "Eligible retailers, flower shops and gift stores",
    friction:
      "Delivery windows and card messages copied by hand between screens, and sales split between your webshop and the marketplaces.",
    could: [
      "Carry delivery windows and gift notes straight into your order system.",
      "Map marketplace listings to products in your webshop or POS.",
      "Bring channel sales together into one daily view of orders.",
    ],
    systems: "e-commerce platform, order management, POS",
    photo: photos.florist,
    position: "38% 60%",
  },
  {
    id: "multi",
    label: "Multi-location operators",
    who: "Chains, franchises and multi-brand kitchens",
    friction:
      "Each outlet runs its own devices and procedures for marketplace orders, and head office has no consolidated view by channel and location.",
    could: [
      "Route every order to the systems of the location that fulfils it.",
      "Apply one product mapping and one set of rules across all outlets.",
      "Consolidate order data across locations and platforms for reporting.",
    ],
    systems: "POS per location, central ERP, reporting or BI",
    photo: photos.multiLocation,
    position: "50% 45%",
  },
];

function PlusIcon() {
  return (
    <span
      aria-hidden
      className="disclosure-icon inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-mist-deep"
    >
      <svg viewBox="0 0 16 16" className="size-3">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Solutions() {
  return (
    <section id="solutions" aria-labelledby="solutions-title" className="overflow-hidden bg-mist py-24 lg:py-32">
      <Container>
        <SplitIntro id="solutions-title" title="Not only for restaurants.">
          <p>
            Any merchant that sells through delivery marketplaces and runs its own systems can end up with the same
            gaps. The details differ by trade.
          </p>
        </SplitIntro>
      </Container>

      <div className="mt-14 lg:mt-20">
        <Rail
          label="Industries"
          aside={
            <p className="max-w-xl text-[0.875rem] text-ink-faint">
              Which product categories a marketplace accepts varies by platform and country. We check what&rsquo;s
              available for your type of business.
            </p>
          }
        >
          {industries.map((ind) => (
            <li key={ind.id} className="w-[82vw] max-w-[25rem] shrink-0 sm:w-[23rem] lg:w-[26rem]">
              <article aria-labelledby={`industry-${ind.id}`}>
                <div className="relative">
                  <PhotoFrame
                    photo={ind.photo}
                    position={ind.position}
                    sizes="(min-width: 1024px) 26rem, 82vw"
                    className="aspect-[4/5]"
                  />
                  <div className="absolute inset-x-0 top-0 rounded-t-[1.75rem] bg-[linear-gradient(to_bottom,rgb(27_30_36/0.62),rgb(27_30_36/0.25)_60%,transparent)] px-6 pt-6 pb-20 text-white">
                    <p className="text-[0.9375rem] font-medium text-white/85">{ind.who}</p>
                    <h3 id={`industry-${ind.id}`} className="type-tile mt-1">
                      {ind.label}
                    </h3>
                  </div>
                </div>
                <p className="mt-6 text-ink-soft">{ind.friction}</p>
                <details className="disclosure mt-5 border-t border-line-strong/70">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 rounded-md py-4 font-medium tracking-[-0.014em]">
                    What an integration could do
                    <PlusIcon />
                  </summary>
                  <ul className="space-y-2.5 pb-2">
                    {ind.could.map((c) => (
                      <li key={c} className="flex gap-3 text-[0.9375rem]">
                        <span aria-hidden className="mt-[0.72em] h-px w-3 shrink-0 bg-brand" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 pb-2 text-[0.875rem] text-ink-faint">Usually involves {ind.systems}.</p>
                </details>
              </article>
            </li>
          ))}
        </Rail>
      </div>
    </section>
  );
}
