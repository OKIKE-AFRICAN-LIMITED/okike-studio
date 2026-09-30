import type { Metadata } from "next";
import { ClosingCta } from "@/components/home/closing-cta";
import { WorkProjectCard } from "@/components/work/work-project-card";
import { selectedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work | OKIKE Studio",
};

const [featuredProject, ...pairedProjects] = selectedProjects;

export default function WorkPage() {
  return (
    <>
      <section className="bg-[#0e0e0e] text-[#f5f5f0]" aria-labelledby="work-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:pt-[72px] lg:pb-16">
          <p className="text-[12px] leading-normal text-[#e3ed33]">THE STUDIO / SELECTED WORK</p>
          <h1 id="work-heading" className="text-[96px]/[96px] font-extrabold tracking-[-5px] lg:text-[240px]/[.92] lg:tracking-[-9.6px]">WORK.</h1>
          <div className="text-[18px]/[26px] lg:text-[24px] lg:leading-normal">
            <p>Identity. Experience. Engineering.</p>
            <p>A closer look at what we make.</p>
          </div>
        </div>
      </section>

      <section className="bg-white text-black" aria-label="Selected project gallery">
        <div className="mx-auto flex w-full max-w-site flex-col gap-9 px-5 py-12 md:px-10 md:py-14 lg:gap-16 lg:px-14 lg:pt-14 lg:pb-20">
          <div className="hidden items-start justify-between border-b border-[#ccccc7] pb-6 text-[12px] leading-normal lg:flex">
            <p>PROJECT INDEX / 01–03</p>
            <p>BRAND / DIGITAL / PRODUCT</p>
          </div>

          <WorkProjectCard project={featuredProject} displayTitle="Project 01" variant="featured" />

          <div className="flex flex-col gap-9 md:flex-row md:items-start md:gap-6 lg:gap-10">
            <WorkProjectCard project={pairedProjects[0]} displayTitle="Project 02" variant="paired" position="first" />
            <WorkProjectCard project={pairedProjects[1]} displayTitle="Project 03" variant="paired" position="second" />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
