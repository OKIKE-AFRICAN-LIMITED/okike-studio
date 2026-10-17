import { defaultStudioPageContent, type StudioPageContent } from "@/lib/cms-defaults";

export function StudioIntro({ content }: { content?: StudioPageContent["intro"] }) {
  const data = content || defaultStudioPageContent.intro;

  return (
    <section className="bg-[#f5f5f0] text-ink" aria-labelledby="studio-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:pt-[72px] lg:pb-16">
        <p className="text-[12px] leading-normal">{data.eyebrow}</p>
        <h1 id="studio-heading" data-gsap="studio-heading" className="text-[48px]/[50px] font-extrabold tracking-[-2px] md:text-[64px]/[1.05] lg:text-[100px]/[104px] lg:tracking-[-5px]">
          <span className="block">{data.headingLine1}</span>
          <span className="block lg:inline">{data.headingLine2}</span>
        </h1>
        <div className="max-w-[1120px] text-[18px]/[26px] lg:text-[24px] lg:leading-normal">
          <p>{data.paragraph1}</p>
          <p>{data.paragraph2}</p>
        </div>
      </div>
    </section>
  );
}
