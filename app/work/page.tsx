import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { WorkInteractiveGallery } from "@/components/work/work-interactive-gallery";
import { getStudioProjects } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Selected Work & Case Studies | OKIKE Studio",
  description:
    "Explore case studies and flagship digital experiences crafted by OKIKE Studio across brand strategy, web design, and bespoke technology.",
};

export default async function WorkPage() {
  const projects = await getStudioProjects();

  return (
    <>
      <section className="bg-[#0e0e0e] text-[#f5f5f0]" aria-labelledby="work-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:pt-[72px] lg:pb-16">
          <p data-gsap="work-page-eyebrow" className="text-[12px] font-medium tracking-[0.5px] text-[#e3ed33]">
            THE STUDIO / SELECTED WORK
          </p>
          <h1
            id="work-heading"
            data-gsap="work-page-heading"
            className="origin-left text-[96px]/[96px] font-extrabold tracking-[-5px] will-change-transform lg:text-[240px]/[.92] lg:tracking-[-9.6px]"
          >
            WORK.
          </h1>
          <div
            data-gsap="work-page-subheading"
            className="text-[18px]/[26px] text-[#a3a39e] lg:text-[24px] lg:leading-normal"
          >
            <p>Identity. Experience. Engineering.</p>
            <p>A closer look at what we make.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f0] text-[#0e0e0e]" aria-label="Selected project gallery">
        <div className="mx-auto flex w-full max-w-site flex-col gap-9 px-5 py-12 md:px-10 md:py-14 lg:gap-12 lg:px-14 lg:pt-14 lg:pb-20">
          <WorkInteractiveGallery projects={projects} />
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
