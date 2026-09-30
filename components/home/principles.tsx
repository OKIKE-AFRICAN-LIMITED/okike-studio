import { SectionContainer } from "@/components/ui/section-container";

type Principle = {
  number: string;
  statement: string;
  explanation: string;
};

const principles = [
  {
    number: "01",
    statement: "Systems over surface.",
    explanation: "We connect the brand, product and technology so each decision supports the whole.",
  },
  {
    number: "02",
    statement: "Clarity over hype.",
    explanation: "We explain the choices, make priorities visible, and focus the work on the problem.",
  },
  {
    number: "03",
    statement: "Partnership over handoff.",
    explanation: "We work through decisions together and give your team the context to carry the work forward.",
  },
] as const satisfies readonly Principle[];

export function Principles() {
  return (
    <SectionContainer
      id="principles"
      labelledBy="principles-heading"
      className="bg-surface text-[#0e0e0e] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-8 lg:[--page-gutter:56px] lg:[--section-space:72px] lg:gap-12"
    >
      <p className="text-[12px]/[18px] font-medium">05 / PRINCIPLES</p>
      <h2 id="principles-heading" data-gsap="principles-heading" className="text-[40px]/[43px] font-extrabold tracking-[-1.5px] lg:text-[64px]/[68px] lg:tracking-[-2.5px]">How we work<br className="lg:hidden" /> with you.</h2>

      <div data-gsap="principles-grid" className="grid gap-7 lg:grid-cols-3 lg:gap-12">
        {principles.map((principle) => (
          <article key={principle.number} data-gsap="principle" className="flex min-w-0 flex-col gap-5 border-t border-[#c7c7bf] pt-6">
            <h3 className="flex flex-col text-[28px]/[34px] font-extrabold tracking-[-.8px] lg:text-[32px]/[38px]">
              <span className="text-[11px]/[34px] tracking-normal lg:text-[12px]/[38px]">{principle.number}</span>
              {principle.statement}
            </h3>
            <p className="text-[17px]/[25px] text-[#575757] lg:text-[18px]/[27px]">{principle.explanation}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  );
}
