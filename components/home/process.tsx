import { SectionContainer } from "@/components/ui/section-container";

type ProcessStage = {
  number: string;
  title: string;
  explanation: string;
  output: string;
};

const stages = [
  {
    number: "01",
    title: "Understand",
    explanation: "We explore your audience, goals and constraints.",
    output: "A shared project brief.",
  },
  {
    number: "02",
    title: "Structure",
    explanation: "We define priorities, scope and the order of work.",
    output: "A focused plan for delivery.",
  },
  {
    number: "03",
    title: "Design",
    explanation: "We develop the identity and experience for review.",
    output: "A design direction to build from.",
  },
  {
    number: "04",
    title: "Develop",
    explanation: "We build and test the agreed experience.",
    output: "A working version to review.",
  },
  {
    number: "05",
    title: "Deploy",
    explanation: "We prepare the launch, hand over the work and identify next steps.",
    output: "A launch and handover plan.",
  },
] as const satisfies readonly ProcessStage[];

export function Process() {
  return (
    <SectionContainer
      id="process"
      labelledBy="process-heading"
      className="bg-[#0e0e0e] text-[#f5f5f0] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-9 lg:grid lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start lg:gap-18 lg:[--page-gutter:56px] lg:[--section-space:72px]"
    >
      <div data-gsap="process-intro" className="flex min-w-0 flex-col gap-7">
        <p className="text-[12px]/[18px] font-medium text-lime">04 / PROCESS</p>
        <h2 id="process-heading" className="text-[42px]/[44px] font-extrabold tracking-[-1.5px] lg:text-[60px]/[62px] lg:tracking-[-2px]">A clear path.<br />At every step.</h2>
        <p className="text-[17px]/[25px] text-[#b2b2ab] lg:text-[19px]/[28px]">
          From understanding the problem to putting the work into the world.
        </p>
        <p className="text-[13px]/[20px] text-[#b2b2ab]">The scope and pace are shaped around your project.</p>
      </div>

      <ol data-gsap="process-stages" className="m-0 flex min-w-0 list-none flex-col p-0">
        {stages.map((stage) => (
          <li key={stage.number} data-gsap="process-stage" className="flex min-w-0 flex-col gap-[14px] border-t border-[#4d4d47] py-6 pb-7">
            <h3 className="grid grid-cols-[26px_minmax(0,1fr)] items-baseline text-[28px]/[34px] font-extrabold lg:grid-cols-[28px_minmax(0,1fr)] lg:text-[34px]/[40px]">
              <span className="text-[12px]/[34px] font-medium text-lime lg:text-[13px]/[40px]">{stage.number}</span>
              <span>{stage.title}</span>
            </h3>
            <p className="text-[16px]/[24px] text-[#b8b8b0] lg:text-[18px]/[26px]">{stage.explanation}</p>
            <p className="text-[12px]/[18px] font-medium text-lime">OUTPUT&nbsp;&nbsp;/&nbsp;&nbsp;{stage.output}</p>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
