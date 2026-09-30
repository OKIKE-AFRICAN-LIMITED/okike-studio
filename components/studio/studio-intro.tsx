export function StudioIntro() {
  return (
    <section className="bg-[#f5f5f0] text-ink" aria-labelledby="studio-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:pt-[72px] lg:pb-16">
        <p className="text-[12px] leading-normal">OKIKE STUDIO / WHO WE ARE</p>
        <h1 id="studio-heading" data-gsap="studio-heading" className="text-[48px]/[50px] font-extrabold tracking-[-2px] md:text-[64px]/[1.05] lg:text-[100px]/[104px] lg:tracking-[-5px]">
          <span className="block">GOOD WORK.</span>
          <span className="block lg:inline">SHARED</span>{" "}<span>PURPOSE.</span>
        </h1>
        <div className="max-w-[1120px] text-[18px]/[26px] lg:text-[24px] lg:leading-normal">
          <p>An independent studio connecting strategy, identity and technology.</p>
          <p>We help founders and small teams turn an idea into something ready to use.</p>
        </div>
      </div>
    </section>
  );
}
