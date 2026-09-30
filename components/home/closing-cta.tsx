import Image from "next/image";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function ClosingCta() {
  return (
    <section id="closing-cta" data-gsap="closing-cta" className="bg-lime text-ink" aria-labelledby="closing-cta-heading">
      <div className="mx-auto w-full max-w-site px-5 pt-8 pb-10 md:px-10 md:py-14 lg:px-14 lg:pt-12 lg:pb-14">
        <div data-gsap="cta-masthead" className="flex items-start justify-between">
          <p className="w-[min(25rem,70%)] text-[10px]/[18px] font-medium uppercase lg:text-[12px]/[18px]">Have something in mind?</p>
          <Image src="/footerlogo.png" alt="" width={88} height={88} className="size-12 invert" />
        </div>
        <h2 id="closing-cta-heading" data-gsap="cta-heading" className="mt-8 flex max-w-[470px] flex-col text-[clamp(3.25rem,13.33vw,5rem)]/[.98] font-extrabold tracking-[-.04em] md:text-[64px]/[1.05] md:tracking-[-2px] lg:mt-10 lg:max-w-none lg:text-[6.25rem]/[1] lg:tracking-[-.04em]">
          <span>Let&apos;s build</span>
          <span>what comes next.</span>
        </h2>
        <div data-gsap="cta-action" className="mt-8 flex flex-col gap-6 border-t border-[rgb(26_26_8_/_25%)] pt-7 lg:mt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-[42.5rem] text-[17px]/[25px] lg:text-[20px]/[28px]">Tell us what you&apos;re building, where you are now, and what you need help with.</p>
          <Button href={site.enquiryHref} variant="secondary" className="w-full justify-between px-6 lg:w-84 lg:flex-none [&_img]:invert hover:[&_img]:invert-0">
            <span>Tell us about your project</span>
            <Image src="/hero/arrow.svg" alt="" width={18} height={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
