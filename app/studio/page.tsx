import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { StudioIntro } from "@/components/studio/studio-intro";
import { StudioPrinciples } from "@/components/studio/studio-principles";
import { StudioStory } from "@/components/studio/studio-story";
import { StudioTeam } from "@/components/studio/studio-team";
import { getStudioPageContent, getHomePageContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Studio | OKIKE Studio",
};

export default async function StudioPage() {
  const [studioContent, homeContent] = await Promise.all([
    getStudioPageContent(),
    getHomePageContent(),
  ]);

  return (
    <>
      <StudioIntro content={studioContent.intro} />
      <StudioStory content={studioContent.story} />
      <StudioPrinciples />
      <StudioTeam />
      <ClosingCta content={homeContent.closingCta} />
    </>
  );
}
