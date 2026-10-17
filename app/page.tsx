import { Hero } from "@/components/home/hero";
import { SystemsFirst } from "@/components/home/systems-first";
import { Capabilities } from "@/components/home/capabilities";
import { SelectedWork } from "@/components/home/selected-work";
import { Process } from "@/components/home/process";
import { Principles } from "@/components/home/principles";
import { WhoWeWorkWith } from "@/components/home/who-we-work-with";
import { Pricing } from "@/components/home/pricing";
import { ClosingCta } from "@/components/home/closing-cta";
import { getHomePageContent, getStudioProjects } from "@/lib/cms";

export default async function Home() {
  const [homeContent, projects] = await Promise.all([
    getHomePageContent(),
    getStudioProjects(),
  ]);

  return (
    <>
      <Hero content={homeContent.hero} />
      <SystemsFirst content={homeContent.systemsFirst} />
      <Capabilities />
      <SelectedWork projects={projects} />
      <Process />
      <Principles />
      <WhoWeWorkWith />
      <Pricing />
      <ClosingCta content={homeContent.closingCta} />
    </>
  );
}
