import { SectionContainer } from "@/components/ui/section-container";

const startingPoints = [
  {
    title: "An idea to shape",
    description: "You need to define the offer and give it a clear identity.",
  },
  {
    title: "An offer to untangle",
    description: "Your brand or product needs a more coherent direction.",
  },
  {
    title: "A next stage to prepare for",
    description: "You need stronger foundations before moving forward.",
  },
] as const;

export function WhoWeWorkWith() {
  return (
    <SectionContainer
      id="who-we-work-with"
      labelledBy="who-we-work-with-heading"
      className="bg-[#f1ecfa] text-[#0e0e0e] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:items-start lg:gap-20 lg:[--page-gutter:56px] lg:[--section-space:64px]"
    >
      <div data-gsap="audience-intro" className="flex min-w-0 flex-col gap-6">
        <p className="text-[12px]/[18px] font-medium">06 / WHO WE WORK WITH</p>
        <h2 id="who-we-work-with-heading" className="text-[40px]/[43px] font-extrabold tracking-[-1.5px] lg:text-[56px]/[58px] lg:tracking-[-2px]">
          Founders.<br />Small teams.<br />Shared ambition.
        </h2>
        <p className="text-[17px]/[25px] text-[#575757] lg:text-[19px]/[28px]">
          For people with a meaningful idea and the willingness to make decisions together.
        </p>
      </div>

      <div data-gsap="audience-points" className="flex min-w-0 flex-col gap-7">
        <p className="text-[12px]/[18px] font-medium text-[#5c1fab]">WHERE ARE YOU NOW?</p>
        {startingPoints.map((point) => (
          <article key={point.title} data-gsap="audience-point" className="flex min-w-0 flex-col gap-[10px] border-t border-[#bfb5d1] pt-[18px]">
            <h3 className="text-[24px]/[29px] font-extrabold">{point.title}</h3>
            <p className="text-[17px]/[25px] text-[#575757]">{point.description}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
