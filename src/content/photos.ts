/**
 * Photography used on the site. All images are from Unsplash, used under the
 * Unsplash License (free for commercial use, no permission needed). Credits are
 * listed in the footer anyway, because it's the right thing to do.
 *
 * Before launch, consider replacing these with your own shoot: your counter,
 * your clients' kitchens (with permission), your team.
 */
import type { StaticImageData } from "next/image";
import florist from "@/assets/photos/florist.jpg";
import foodService from "@/assets/photos/food-service.jpg";
import grocery from "@/assets/photos/grocery.jpg";
import heroPass from "@/assets/photos/hero-pass.jpg";
import kitchenLine from "@/assets/photos/kitchen-line.jpg";
import multiLocation from "@/assets/photos/multi-location.jpg";
import packedOrder from "@/assets/photos/packed-order.jpg";
import pizza from "@/assets/photos/pizza.jpg";
import sofiaNight from "@/assets/photos/sofia-night.jpg";
import ticketRail from "@/assets/photos/ticket-rail.jpg";
import ticketsBw from "@/assets/photos/tickets-bw.jpg";
import wok from "@/assets/photos/wok.jpg";

export type Photo = {
  src: StaticImageData;
  alt: string;
  credit: { name: string; url: string };
  /** Only shown alongside the fictional sample content. */
  sample?: boolean;
};

export const photos = {
  heroPass: {
    src: heroPass,
    alt: "A chef seasons a row of plated dishes under copper heat lamps at the pass.",
    credit: { name: "Louis Hansel", url: "https://unsplash.com/photos/0sYLBZjgTTw" },
  },
  ticketsBw: {
    src: ticketsBw,
    alt: "Printed kitchen tickets clipped to the rail, listing courses and table numbers.",
    credit: { name: "Caroline Hernandez", url: "https://unsplash.com/photos/3-CbMmMiNYQ" },
  },
  ticketRail: {
    src: ticketRail,
    alt: "Torn order receipts hanging from a metal ticket rail in a dark kitchen.",
    credit: { name: "Mediha Ekici", url: "https://unsplash.com/photos/s26Waan4roY" },
  },
  foodService: {
    src: foodService,
    alt: "A cook finishes a row of asparagus dishes on the pass.",
    credit: { name: "John Fornander", url: "https://unsplash.com/photos/jJIb2e7Jkcs" },
  },
  grocery: {
    src: grocery,
    alt: "A narrow aisle in a local grocery shop, shelves stocked to the ceiling.",
    credit: { name: "Valeriano Escobar", url: "https://unsplash.com/photos/cghqmLvDvvQ" },
  },
  florist: {
    src: florist,
    alt: "A flower shop lit up at dusk, its plants spilling onto the pavement.",
    credit: { name: "Ayumi Kubo", url: "https://unsplash.com/photos/Pjt6N69Z8ds" },
  },
  multiLocation: {
    src: multiLocation,
    alt: "Two cooks packing orders side by side at a long kitchen counter.",
    credit: { name: "Melanie Lim", url: "https://unsplash.com/photos/5OR8rT1EqlA" },
  },
  sofiaNight: {
    src: sofiaNight,
    alt: "Sofia at night, with the Alexander Nevsky Cathedral lit at the centre of the city.",
    credit: { name: "Alexandr Bormotin", url: "https://unsplash.com/photos/UPoSvgmFKmo" },
  },
  packedOrder: {
    src: packedOrder,
    alt: "Hands closing a kraft takeaway box labelled with the order inside.",
    credit: { name: "Conor Brown", url: "https://unsplash.com/photos/FJ37gnt6g50" },
  },
  pizza: {
    src: pizza,
    alt: "A pizzaiolo stretches dough beside a stack of delivery boxes.",
    credit: { name: "Ceba Solutions", url: "https://unsplash.com/photos/3WTaEJ4_vGc" },
    sample: true,
  },
  wok: {
    src: wok,
    alt: "Fried rice tossed in a wok over a high flame.",
    credit: { name: "Zoshua Colah", url: "https://unsplash.com/photos/vnuAvsIE7sE" },
    sample: true,
  },
  kitchenLine: {
    src: kitchenLine,
    alt: "A chef plating at a busy open kitchen counter.",
    credit: { name: "Peter Muniz", url: "https://unsplash.com/photos/rtpikxSLbYQ" },
    sample: true,
  },
} satisfies Record<string, Photo>;
