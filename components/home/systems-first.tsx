import { SectionContainer } from "@/components/ui/section-container";
import { defaultHomePageContent, type HomePageContent } from "@/lib/cms-defaults";

export function SystemsFirst({ content }: { content?: HomePageContent["systemsFirst"] }) {
  const data = content || defaultHomePageContent.systemsFirst;

  const disciplines = [
    {
      title: data.discipline1Title,
      description: data.discipline1Desc,
    },
    {
      title: data.discipline2Title,
      description: data.discipline2Desc,
    },
    {
      title: data.discipline3Title,
      description: data.discipline3Desc,
    },
  ];

  return (
    <SectionContainer
      id="systems-first"
      labelledBy="systems-first-heading"
      className="bg-surface-inverse text-[#f5f5f0] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-7 lg:[--page-gutter:56px] lg:[--section-space:72px] lg:gap-14"
    >
      <div data-gsap="systems-intro" className="grid gap-7 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-14">
        <div className="lg:flex lg:flex-col lg:gap-5">
          <p className="text-eyebrow/[18px] font-medium text-lime">{data.eyebrow}</p>
          <p className="hidden text-[10px]/[16px] font-medium text-[#b2b2ab] lg:block">{data.subEyebrow}</p>
        </div>
        <div className="flex min-w-0 flex-col gap-7">
          <h2 id="systems-first-heading" data-gsap="systems-heading" className="text-[clamp(36px,10.2564vw,40px)]/[1.075] font-extrabold tracking-[-1.6px] [&_span]:block [&_span:last-child]:text-lime md:text-heading-lg/[1.05] md:tracking-[-2px] lg:text-[76px]/[78px] lg:tracking-[-3px]">
            <span>{data.headingLine1}</span>{" "}
            <span>{data.headingLine2}</span>
          </h2>
          <p className="max-w-[760px] text-[17px]/[25px] text-[#b2b2ab] lg:text-[20px]/[29px]">
            {data.description}
          </p>
        </div>
      </div>
      <div data-gsap="systems-disciplines" className="grid gap-6 lg:grid-cols-3 lg:gap-10">
        {disciplines.map(({ title, description }) => (
          <div key={title} data-gsap="systems-discipline" className="flex min-w-0 flex-col gap-3 border-t border-[#4d4d47] pt-[19px] lg:gap-[18px] lg:pt-[23px]">
            <h3 className="text-[11px]/[18px] font-medium text-lime lg:text-eyebrow">{title}</h3>
            <p className="text-body lg:text-[18px]/[26px]">{description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
