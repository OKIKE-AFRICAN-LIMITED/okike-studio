import { SectionContainer } from "@/components/ui/section-container";

const disciplines = [
  {
    title: "01 / STRATEGY",
    description: "Define who it is for, what it needs to do, and what makes it different.",
  },
  {
    title: "02 / IDENTITY",
    description: "Turn that direction into a visual language and an experience people recognise.",
  },
  {
    title: "03 / TECHNOLOGY",
    description: "Build the experience on a technical foundation your team can maintain and extend.",
  },
] as const;

export function SystemsFirst() {
  return (
    <SectionContainer
      id="systems-first"
      labelledBy="systems-first-heading"
      className="bg-surface-inverse text-[#f5f5f0] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-7 lg:[--page-gutter:56px] lg:[--section-space:72px] lg:gap-14"
    >
      <div data-gsap="systems-intro" className="grid gap-7 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-14">
        <div className="lg:flex lg:flex-col lg:gap-5">
          <p className="text-eyebrow/[18px] font-medium text-lime">01 / SYSTEMS FIRST</p>
          <p className="hidden text-[10px]/[16px] font-medium text-[#b2b2ab] lg:block">HOW WE THINK</p>
        </div>
        <div className="flex min-w-0 flex-col gap-7">
          <h2 id="systems-first-heading" data-gsap="systems-heading" className="text-[clamp(36px,10.2564vw,40px)]/[1.075] font-extrabold tracking-[-1.6px] [&_span]:block [&_span:last-child]:text-lime md:text-heading-lg/[1.05] md:tracking-[-2px] lg:text-[76px]/[78px] lg:tracking-[-3px]">
            <span>Good ideas need</span>{" "}
            <span>a working system.</span>
          </h2>
          <p className="max-w-[760px] text-[17px]/[25px] text-[#b2b2ab] lg:text-[20px]/[29px]">
            We connect strategy, identity and technology from the start. Your positioning shapes the experience. The experience guides what we build.
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
