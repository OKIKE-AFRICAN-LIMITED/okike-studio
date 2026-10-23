import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { Pricing } from "@/components/home/pricing";
import { BeforeWeBegin } from "@/components/services/before-we-begin";
import { ServicesIntro } from "@/components/services/services-intro";
import { ServicesScope } from "@/components/services/services-scope";
import { getServicesPageContent, getHomePageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Services & Sprints | OKIKE Studio",
  description:
    "Design, Build, and Deploy sprints for brand identity, custom web platforms, and digital software. Transparent pricing in Naira with human confirmation.",
};

export default async function ServicesPage() {
  const [servicesContent, homeContent] = await Promise.all([
    getServicesPageContent(),
    getHomePageContent(),
  ]);

  return (
    <>
      <ServicesIntro content={servicesContent.intro} />
      <ServicesScope />
      <Pricing description="Website and software starting points. Brand design, added functionality and ongoing support are scoped separately. We confirm the final quote before work begins." />
      <BeforeWeBegin />
      <ClosingCta content={homeContent.closingCta} />
    </>
  );
}
