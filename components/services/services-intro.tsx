export function ServicesIntro() {
  return (
    <section className="bg-ink text-[#f5f5f0]" aria-labelledby="services-heading">
      <div className="mx-auto flex w-full max-w-site flex-col gap-6 px-5 py-10 md:px-10 md:py-14 lg:gap-8 lg:px-14 lg:pt-[72px] lg:pb-16">
        <p className="text-[12px] leading-normal text-lime">THE STUDIO / SERVICES</p>
        <h1 id="services-heading" data-gsap="services-heading" className="text-[48px]/[50px] font-extrabold tracking-[-2px] md:text-[64px]/[1.05] lg:text-[112px]/[112px] lg:tracking-[-5px]">
          FROM IDEA<br />TO LAUNCH.
        </h1>
        <div className="text-[18px]/[26px] lg:text-[24px] lg:leading-normal">
          <p>Design the identity. Build the experience. Prepare for launch.</p>
          <p>Start with the part your business needs now.</p>
        </div>
      </div>
    </section>
  );
}
