import { Hero } from "@/components/home/hero";
import { SystemsFirst } from "@/components/home/systems-first";
import { Capabilities } from "@/components/home/capabilities";
import { SelectedWork } from "@/components/home/selected-work";
import { Process } from "@/components/home/process";
import { Principles } from "@/components/home/principles";
import { WhoWeWorkWith } from "@/components/home/who-we-work-with";
import { Pricing } from "@/components/home/pricing";
import { ClosingCta } from "@/components/home/closing-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <SystemsFirst />
      <Capabilities />
      <SelectedWork />
      <Process />
      <Principles />
      <WhoWeWorkWith />
      <Pricing />
      <ClosingCta />
    </>
  );
}
