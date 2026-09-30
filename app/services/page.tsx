import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { Pricing } from "@/components/home/pricing";
import { BeforeWeBegin } from "@/components/services/before-we-begin";
import { ServicesIntro } from "@/components/services/services-intro";
import { ServicesScope } from "@/components/services/services-scope";

export const metadata: Metadata = {
  title: "Services | OKIKE Studio",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesIntro />
      <ServicesScope />
      <Pricing description="Website and software starting points. Brand design, added functionality and ongoing support are scoped separately. We confirm the final quote before work begins." />
      <BeforeWeBegin />
      <ClosingCta />
    </>
  );
}
