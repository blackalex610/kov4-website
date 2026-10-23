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
    alt: "Готвач овкусява наредени ястия под медни лампи на пас.",
    credit: { name: "Louis Hansel", url: "https://unsplash.com/photos/0sYLBZjgTTw" },
  },
  ticketsBw: {
    src: ticketsBw,
    alt: "Отпечатани кухненски бележки, закачени на релса, с ястия и номера на маси.",
    credit: { name: "Caroline Hernandez", url: "https://unsplash.com/photos/3-CbMmMiNYQ" },
  },
  ticketRail: {
    src: ticketRail,
    alt: "Откъснати бележки за поръчки, висящи от метална релса в тъмна кухня.",
    credit: { name: "Mediha Ekici", url: "https://unsplash.com/photos/s26Waan4roY" },
  },
  foodService: {
    src: foodService,
    alt: "Готвач довършва ред ястия със зелени аспержи на пас.",
    credit: { name: "John Fornander", url: "https://unsplash.com/photos/jJIb2e7Jkcs" },
  },
  grocery: {
    src: grocery,
    alt: "Тясна пътека в квартален магазин с рафтове, пълни до тавана.",
    credit: { name: "Valeriano Escobar", url: "https://unsplash.com/photos/cghqmLvDvvQ" },
  },
  florist: {
    src: florist,
    alt: "Осветена цветарница в здрача, с растения, излизащи на тротоара.",
    credit: { name: "Ayumi Kubo", url: "https://unsplash.com/photos/Pjt6N69Z8ds" },
  },
  multiLocation: {
    src: multiLocation,
    alt: "Двама готвачи опаковат поръчки един до друг на дълъг кухненски плот.",
    credit: { name: "Melanie Lim", url: "https://unsplash.com/photos/5OR8rT1EqlA" },
  },
  sofiaNight: {
    src: sofiaNight,
    alt: "София нощем, с осветения катедрален храм „Александър Невски“ в центъра на града.",
    credit: { name: "Alexandr Bormotin", url: "https://unsplash.com/photos/UPoSvgmFKmo" },
  },
  packedOrder: {
    src: packedOrder,
    alt: "Ръце затварят крафт кутия за вкъщи с етикет на поръчката.",
    credit: { name: "Conor Brown", url: "https://unsplash.com/photos/FJ37gnt6g50" },
  },
  pizza: {
    src: pizza,
    alt: "Пицар разточва тесто до купчина кутии за доставка.",
    credit: { name: "Ceba Solutions", url: "https://unsplash.com/photos/3WTaEJ4_vGc" },
    sample: true,
  },
  wok: {
    src: wok,
    alt: "Пържен ориз, разбъркван в уок на силен огън.",
    credit: { name: "Zoshua Colah", url: "https://unsplash.com/photos/vnuAvsIE7sE" },
    sample: true,
  },
  kitchenLine: {
    src: kitchenLine,
    alt: "Готвач подрежда ястие на натоварен плот в отворена кухня.",
    credit: { name: "Peter Muniz", url: "https://unsplash.com/photos/rtpikxSLbYQ" },
    sample: true,
  },
} satisfies Record<string, Photo>;
