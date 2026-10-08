import Image from "next/image";
import Link from "next/link";
import type { SelectedProject } from "@/lib/projects";

export function CaseStudy({ project }: { project: SelectedProject & { caseStudy: NonNullable<SelectedProject["caseStudy"]> } }) {
  const study = project.caseStudy;

  return (
    <article>
      <header data-gsap="case-study-header" className="bg-[#0e0e0e] text-[#f7f7f2]">
        <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-7 lg:px-14 lg:py-16">
          <Link href="/work" className="flex min-h-11 items-center text-[12px]/[18px] text-[#e8f22b] hover:underline focus-visible:outline-[#e8f22b]">
            ALL WORK&nbsp;&nbsp;/&nbsp;&nbsp;CASE STUDY {study.caseNumber}
          </Link>
          <h1 className="text-[52px]/[56px] font-extrabold tracking-[-2px] md:text-[76px]/[82px] md:tracking-[-3px] lg:text-[144px]/[180px] lg:tracking-[-6px]">
            {study.displayTitle}
          </h1>
          <div className="text-[18px]/[26px] lg:text-[24px]/[30px]">
            <p>{study.introduction[0]}</p>
            <p>{study.introduction[1]}</p>
          </div>
          <p className="text-[12px]/[18px] text-[#e8f22b] lg:leading-[15px]">{study.previewNotice}</p>
        </div>
      </header>

      <div data-project-image data-gsap="project-image" className="relative aspect-[390/300] w-full overflow-hidden md:aspect-[768/480] lg:aspect-[1440/700]">
        <Image src={project.image} alt={study.coverAlt} fill priority sizes="100vw" className="object-cover" />
      </div>

      <section data-gsap="case-study-section" className="bg-[#f7f7f2] text-[#0e0e0e]" aria-labelledby="brief-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-8 px-5 py-12 md:px-10 md:py-14 lg:flex-row lg:items-start lg:gap-24 lg:px-14 lg:py-20">
          <div className="flex flex-col gap-6 lg:w-80 lg:flex-none">
            <p className="text-[12px]/[15px]">01 / THE BRIEF</p>
            <dl className="grid gap-5 text-[16px]/[20px]">
              <div><dt>CLIENT</dt><dd>{study.facts.client}</dd></div>
              <div><dt>SECTOR</dt><dd>{study.facts.sector}</dd></div>
              <div><dt>SCOPE</dt><dd>{study.facts.scope}</dd></div>
              <div><dt>YEAR</dt><dd>{study.facts.year}</dd></div>
            </dl>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <h2 id="brief-heading" className="text-[36px]/[42px] font-extrabold lg:text-[56px]/[70px]">The question<br />behind the work.</h2>
            <div className="flex flex-col gap-[27px] text-[18px]/[27px] lg:gap-[25px] lg:text-[20px]/[25px]">
              <p>{study.question[0]}</p>
              <p>{study.question[1]}</p>
            </div>
          </div>
        </div>
      </section>

      <section data-gsap="case-study-section" className="bg-[#0e0e0e] text-[#f7f7f2]" aria-labelledby="direction-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 py-12 md:px-10 md:py-14 lg:gap-10 lg:px-14 lg:py-[72px]">
          <p className="text-[12px]/[15px] text-[#e8f22b]">02 / THE DESIGN DIRECTION</p>
          <h2 id="direction-heading" className="text-[36px]/[41px] font-extrabold lg:text-[64px]/[80px]">One idea.<br />A complete system.</h2>
          <p className="text-[18px]/[27px] lg:text-[20px]/[25px]">{study.designDirection}</p>
          <div className="flex flex-col gap-6 text-[#0e0e0e] md:flex-row">
            <div data-gsap="case-study-card" className="flex min-w-0 flex-1 flex-col gap-6 bg-[#e8f22b] px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
              <p className="text-[12px]/[15px]">IDENTITY STUDY / PLACEHOLDER</p>
              <p className="text-[64px]/[83px] font-extrabold lg:text-[104px]/[130px]">Aa<br />01—09</p>
            </div>
            <div data-gsap="case-study-card" className="flex min-w-0 flex-1 flex-col gap-6 bg-[#c4b0f0] px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
              <p className="text-[12px]/[15px]">APPLICATION STUDY / PLACEHOLDER</p>
              <p className="text-[36px]/[41px] font-extrabold lg:text-[64px]/[80px]">FORM.<br />FUNCTION.</p>
            </div>
          </div>
        </div>
      </section>

      <section data-gsap="case-study-section" className="bg-[#f7f7f2] text-[#0e0e0e]" aria-labelledby="experience-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 py-12 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:py-[72px]">
          <p className="text-[12px]/[15px]">03 / IN USE</p>
          <h2 id="experience-heading" className="text-[36px]/[43px] font-extrabold lg:text-[56px]/[70px]">Built for the<br />people using it.</h2>
          <p className="text-[18px]/[27px] lg:text-[20px]/[25px]">{study.experience}</p>
          <div className="bg-[#dbdbd4] p-3 md:p-8 lg:px-16 lg:py-14">
            <div className="flex flex-col gap-5 bg-[#f7f7f2] p-3 md:p-5">
              <p className="text-[12px]/[15px]">PROJECT WEBSITE / SCREEN PLACEHOLDER</p>
              <div className="flex flex-col gap-8 bg-[#0e0e0e] px-3 py-8 text-[#f7f7f2] md:p-10 lg:p-12">
                <p className="text-[30px]/[36px] font-extrabold md:text-[48px]/[60px] lg:text-[64px]/[80px]">A clear idea.<br />Made tangible.</p>
                <p className="text-[16px]/[20px] text-[#e8f22b]">Replace with an approved project screen.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-gsap="case-study-section" className="bg-[#f7f7f2] text-[#0e0e0e]" aria-labelledby="outcome-heading">
        <div className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 py-12 md:px-10 md:py-14 lg:flex-row lg:items-start lg:gap-24 lg:px-14 lg:py-20">
          <div className="flex flex-col gap-6 lg:w-[400px] lg:flex-none">
            <p className="text-[12px]/[15px]">04 / THE OUTCOME</p>
            <h2 id="outcome-heading" className="text-[36px]/[42px] font-extrabold lg:text-[56px]/[70px]">What changed.</h2>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-7 text-[18px]/[27px] lg:text-[22px]/[28px]">
            <p>{study.outcome[0]}</p>
            <p className="lg:text-[18px]/[23px]">{study.outcome[1]}</p>
          </div>
        </div>
      </section>

      <Link href="/work" className="block bg-[#e8f22b] text-[#0e0e0e] hover:underline focus-visible:outline-[#0e0e0e]">
        <span className="mx-auto flex w-full max-w-site flex-col gap-7 px-5 py-12 md:px-10 md:py-14 lg:gap-6 lg:p-14">
          <span className="text-[12px]/[15px]">CONTINUE EXPLORING</span>
          <span className="text-[36px]/[42px] font-extrabold lg:text-[56px]/[70px]">Back to selected work</span>
        </span>
      </Link>
    </article>
  );
}
