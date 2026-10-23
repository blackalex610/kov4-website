import { photos } from "@/content/photos";
import { site } from "@/content/site";
import { ContactForm } from "./contact-form";
import { Container, PhotoFrame } from "./ui";

const bring = ["Платформите, през които продавате", "Вашата каса или основен софтуер", "Приблизителен дневен брой поръчки"];

const nextSteps = [
  { title: "Преглеждаме вашата настройка", body: "Четем какво ни изпращате и си записваме въпросите, преди да говорим." },
  { title: "Кратък разговор", body: "Около 30 минути, в които преминаваме през пътя на поръчките във вашия бизнес." },
  {
    title: "Писмено резюме",
    body: "Какво може да се свърже, какво не може и има ли смисъл от пилот.",
  },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 lg:py-32">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="type-h2">
            <span className="block">Разкажете ни</span>
            <span className="block">за вашия бизнес.</span>
          </h2>
          <p className="type-lede mt-6 max-w-md text-ink-soft">
            Няколко данни ни помагат да се подготвим. Ще ви отговорим по имейл, за да уговорим разговор.
          </p>

          <PhotoFrame
            photo={photos.packedOrder}
            sizes="(min-width: 1024px) 36vw, 100vw"
            position="50% 55%"
            className="mt-10 aspect-[3/2]"
          />

          <h3 className="mt-10 type-label">Какво следва</h3>
          <ol className="mt-4 space-y-5">
            {nextSteps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3.5">
                <span className="tabular flex size-8 items-center justify-center rounded-full bg-mist text-[0.8125rem] font-semibold">
                  {i + 1}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-[0.9375rem] text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t border-line pt-6">
            <h3 className="type-label">Добре е да имате подготвено</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {bring.map((b) => (
                <li key={b} className="rounded-full bg-mist px-3.5 py-1.5 text-[0.875rem]">
                  {b}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.875rem] text-ink-faint">Нямате всички отговори? Няма проблем.</p>
          </div>

          <p className="mt-8 text-[0.9375rem] text-ink-soft">
            Предпочитате имейл?{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              {site.contactEmail}
            </a>
          </p>
        </div>

        <div className="relative lg:col-span-7">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
