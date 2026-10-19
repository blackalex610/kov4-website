import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy notice",
  description: `How ${site.name} handles the details you send through the contact form.`,
};

/*
 * Starting-point privacy notice for the contact form. Have it reviewed and add
 * your registered company name, address and company ID (ЕИК) before launch.
 */
const sections = [
  {
    title: "Who we are",
    body: `${site.name} helps merchants connect delivery marketplaces to their existing systems. For anything about your personal data, contact ${site.contactEmail}.`,
  },
  {
    title: "What we collect",
    body: "When you use the contact form, we receive your name, work email, business name and type, number of locations, the delivery platforms and software you use, your main operational challenge and anything else you choose to tell us.",
  },
  {
    title: "Why we use it",
    body: "Only to reply to your enquiry, prepare for a workflow assessment and, if you go ahead, to take the steps needed before an agreement. The legal basis is taking steps at your request before entering into a contract, and our legitimate interest in responding to business enquiries.",
  },
  {
    title: "Who receives it",
    body: "Submissions are delivered to our inbox through an email or form-delivery service acting on our behalf. We don’t sell your data or share it for marketing.",
  },
  {
    title: "How long we keep it",
    body: "Up to 12 months after our last contact, unless we start working together, in which case our agreement sets the retention period.",
  },
  {
    title: "Your rights",
    body: "You can ask to access, correct or delete your data, or object to how we use it, by emailing us. You can also complain to the Bulgarian Commission for Personal Data Protection (КЗЛД) or the data protection authority where you live.",
  },
];

export default function PrivacyPage() {
  return (
    <Container className="py-16 lg:py-24">
      <div className="max-w-2xl">
        <h1 className="type-h2">Privacy notice</h1>
        <p className="type-lede mt-5 text-ink-soft">
          This notice explains what happens to the details you send us through the contact form on this site.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="type-h3">{s.title}</h2>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-12 border-t border-line pt-6 text-[0.875rem] text-ink-faint">Last updated October 2026.</p>
      </div>
    </Container>
  );
}
