import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { StudioIntro } from "@/components/studio/studio-intro";
import { StudioPrinciples } from "@/components/studio/studio-principles";
import { StudioStory } from "@/components/studio/studio-story";
import { StudioTeam } from "@/components/studio/studio-team";

export const metadata: Metadata = {
  title: "Studio | OKIKE Studio",
};

export default function StudioPage() {
  return (
    <>
      <StudioIntro />
      <StudioStory />
      <StudioPrinciples />
      <StudioTeam />
      <ClosingCta />
    </>
  );
}
