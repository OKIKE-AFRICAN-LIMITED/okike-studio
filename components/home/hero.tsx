import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <SectionContainer labelledBy="hero-heading" contentClassName="flex flex-col gap-7 bg-surface !py-7 [font-optical-sizing:auto] [font-variation-settings:'wdth'_100] lg:gap-9 lg:!py-[44px_32px] lg:[--page-gutter:56px]">
      <p data-gsap="hero-eyebrow" className="text-[10px]/[15px] font-medium tracking-[.7px] lg:text-[12px]/[16px] lg:tracking-[1px]">
        <span className="block lg:inline">INDEPENDENT STUDIO</span>
        <span className="hidden whitespace-pre lg:inline" aria-hidden="true"> / </span>
        <span className="block lg:inline">BRAND, PRODUCT &amp; TECHNOLOGY</span>
      </p>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,752fr)_minmax(0,536fr)] lg:items-center lg:gap-10">
        <div data-gsap="hero-copy" className="flex min-w-0 flex-col items-start gap-6 lg:gap-7">
          <h1 id="hero-heading" className="text-[clamp(48px,14.36vw,56px)]/[.910714] font-extrabold tracking-[-2.5px] md:text-[72px] md:tracking-[-3px] lg:text-[clamp(72px,7.7778vw,112px)] lg:tracking-[-5px]">
            STRUCTURE.<br />BEFORE<br />SCALE.
          </h1>
          <p className="max-w-[505px] text-[17px]/[25px] lg:text-[20px]/[28px]">
            We turn ambitious ideas into distinct brands, useful digital products and ventures built to grow.
          </p>
          <div className="flex w-full flex-col gap-[10px] md:w-auto md:flex-row">
            <Button href={site.enquiryHref} className="min-h-[52px] w-full gap-2 rounded-t-[5px] hover:bg-action hover:text-primary hover:underline hover:underline-offset-4 md:w-auto md:rounded-[5px_0_0_5px]">
              Start a project
              <Image src="/hero/arrow.svg" alt="" width={18} height={18} />
            </Button>
            <Button href="/work" variant="ghost" className="min-h-[52px] w-full gap-2 border-t border-border-focus hover:bg-surface hover:text-primary hover:underline hover:underline-offset-4 md:w-auto md:border-t-0 md:border-l">
              View selected work
              <Image src="/hero/arrow.svg" alt="" width={18} height={18} />
            </Button>
          </div>
        </div>
        <picture data-gsap="hero-artwork" className="block w-full md:max-w-[536px] md:justify-self-center [&_img]:block [&_img]:h-auto [&_img]:w-full">
          <source media="(max-width: 47.999rem)" srcSet="/hero/architecture-mobile.png" width={350} height={353} />
          <Image src="/hero/architecture-desktop.svg" alt="" width={536} height={540} loading="eager" />
        </picture>
      </div>
      <div data-gsap="hero-rail" className="text-[10px]/[16px] font-medium lg:flex lg:justify-between lg:gap-6 lg:border-t lg:border-[#d1d1cc] lg:pt-[22px] lg:text-[12px]/[18px]">
        <p><span className="hidden lg:inline">01 </span>STRATEGY<span className="px-[6px] lg:px-[18px]"> / </span><span className="hidden lg:inline">02 </span>DESIGN<span className="px-[6px] lg:px-[18px]"> / </span><span className="hidden lg:inline">03 </span>DEVELOPMENT</p>
        <p className="hidden lg:inline">EXPLORE THE STUDIO ↓</p>
      </div>
    </SectionContainer>
  );
}
