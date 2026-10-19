import { CaseStudies } from "@/components/case-studies";
import { Contact } from "@/components/contact";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Integrations } from "@/components/integrations";
import { Market } from "@/components/market";
import { Platforms } from "@/components/platforms";
import { Principles } from "@/components/principles";
import { Problem } from "@/components/problem";
import { Process } from "@/components/process";
import { Showcase } from "@/components/showcase";
import { Solutions } from "@/components/solutions";

export default function Home() {
  return (
    <>
      <Hero />
      <Platforms />
      <Problem />
      <Showcase />
      <Features />
      <Solutions />
      <Process />
      <Integrations />
      <CaseStudies />
      <Principles />
      <Market />
      <Faq />
      <Contact />
    </>
  );
}
