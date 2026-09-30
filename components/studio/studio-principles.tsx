type Principle = { number: string; title: string; description: string };

const principles = [
  { number: "01", title: "Systems over surface.", description: "We connect the brand, product and technology so each decision supports the whole." },
  { number: "02", title: "Clarity over hype.", description: "We explain the choices, make priorities visible, and focus the work on the problem." },
  { number: "03", title: "Partnership over handoff.", description: "We work through decisions together and give your team the context to carry the work forward." },
] as const satisfies readonly Principle[];

function PrincipleCard({ principle }: { principle: Principle }) {
  return (
    <article className="flex flex-col gap-5 border-t border-[#c7c7bf] pt-6">
      <div className="font-extrabold tracking-[-.8px]">
        <p className="text-[11px]/[34px] lg:text-[12px]/[38px]">{principle.number}</p>
        <h3 className="text-[28px]/[34px] lg:text-[32px]/[38px]">{principle.title}</h3>
      </div>
      <p className="text-[17px]/[25px] text-[#575757] lg:text-[18px]/[27px]">{principle.description}</p>
    </article>
  );
}

export function StudioPrinciples() {
  return (
    <section className="bg-white text-ink" aria-labelledby="studio-principles-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-8 px-5 py-12 md:px-10 md:py-14 lg:gap-12 lg:px-14 lg:py-[72px]">
        <p className="text-[12px]/[18px] font-medium">02 / PRINCIPLES</p>
        <h2 id="studio-principles-heading" className="text-[40px]/[43px] font-extrabold tracking-[-1.5px] md:text-[54px]/[1.05] lg:text-[64px]/[68px] lg:tracking-[-2.5px]">How we work<br className="lg:hidden" /> with you.</h2>
        <div className="grid gap-7 lg:grid-cols-3 lg:gap-12">
          {principles.map((principle) => <PrincipleCard key={principle.number} principle={principle} />)}
        </div>
      </div>
    </section>
  );
}
