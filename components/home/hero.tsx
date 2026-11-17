import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { site } from "@/lib/site";
import { defaultHomePageContent, type HomePageContent } from "@/lib/cms-defaults";
import { HeroParticleCanvas } from "./hero-particle-canvas";

export function Hero({ content }: { content?: HomePageContent["hero"] }) {
  const data = content || defaultHomePageContent.hero;

  return (
    <SectionContainer
      labelledBy="hero-heading"
      className="relative overflow-hidden bg-surface"
      contentClassName="relative flex flex-col gap-7 bg-transparent py-7! [font-optical-sizing:auto] [font-variation-settings:'wdth'_100] lg:gap-9 lg:py-[44px_32px]! lg:[--page-gutter:56px]"
    >
      <HeroParticleCanvas />

      <div className="relative z-10 grid gap-7 lg:grid-cols-[minmax(0,752fr)_minmax(0,536fr)] lg:items-center lg:gap-10">
        <div data-gsap="hero-copy" className="flex min-w-0 flex-col items-start gap-6 lg:gap-7">
          <h1 id="hero-heading" className="text-[clamp(48px,14.36vw,56px)]/[.910714] font-extrabold tracking-[-2.5px] md:text-[72px] md:tracking-[-3px] lg:text-[clamp(72px,7.7778vw,112px)] lg:tracking-[-5px]">
            {data.headingLine1}<br />{data.headingLine2}<br />{data.headingLine3}
          </h1>
          <p className="max-w-126.25 text-[17px]/[25px] lg:text-[20px]/[28px]">
            {data.description}
          </p>
          <div className="flex w-full flex-col gap-2.5 md:w-auto md:flex-row">
            <Button href={data.primaryCtaHref || site.enquiryHref} className="min-h-control w-full gap-2 rounded-t-[5px] hover:bg-action hover:underline hover:underline-offset-4 md:w-auto md:rounded-[5px_0_0_5px] hover:[&_img]:invert">
              {data.primaryCtaText}
              <Image src="/hero/arrow.svg" alt="" width={18} height={18} />
            </Button>
            <Button href={data.secondaryCtaHref || "/work"} variant="ghost" className="min-h-control w-full gap-2 border-t border-border-focus hover:bg-surface hover:text-ink! hover:underline hover:underline-offset-4 md:w-auto md:border-t-0 md:border-l">
              {data.secondaryCtaText}
              <Image src="/hero/arrow.svg" alt="" width={18} height={18} />
            </Button>
          </div>
        </div>
        <div className="h-[290px] w-full lg:h-[480px]" aria-hidden="true" />
      </div>

      <div data-gsap="hero-rail" className="relative z-10 text-[10px]/[16px] font-medium lg:flex lg:justify-between lg:gap-6 lg:border-t lg:border-[#d1d1cc] lg:pt-5.5 lg:text-eyebrow">
        <p>{data.railDisciplines}</p>
        <p className="hidden lg:inline">EXPLORE THE STUDIO ↓</p>
      </div>
    </SectionContainer>
  );
}
