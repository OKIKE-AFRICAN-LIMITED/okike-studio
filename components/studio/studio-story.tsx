const disciplines = [
  ["STRATEGY", "A clear direction."],
  ["IDENTITY", "A recognisable expression."],
  ["TECHNOLOGY", "A working experience."],
] as const;

export function StudioStory() {
  return (
    <section className="bg-[#e8f22b] text-ink" aria-labelledby="studio-story-heading">
      <div className="mx-auto grid w-full max-w-site gap-8 px-5 py-12 md:px-10 md:py-14 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-24 lg:px-14 lg:py-20">
        <div className="flex flex-col gap-6">
          <p className="text-[12px]/[15px]">01 / OUR POINT OF VIEW</p>
          <dl className="flex flex-col gap-5 text-[16px]/[20px]">
            {disciplines.map(([term, description]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-6">
          <h2 id="studio-story-heading" className="text-[36px]/[42px] font-extrabold md:text-[48.6px]/[1.05] lg:text-[56px]/[70px]">Structure<br />before scale.</h2>
          <div className="flex max-w-[840px] flex-col gap-5 text-[18px]/[25px] lg:text-[20px]">
            <p>A brand, a website and a product should support the same idea. We bring those decisions together, from what a business stands for to how people experience it.</p>
            <p>Our approach starts with the problem, makes the priorities clear and builds from there.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
