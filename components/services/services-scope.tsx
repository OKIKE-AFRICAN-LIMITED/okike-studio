import Image from "next/image";
import { SectionContainer } from "@/components/ui/section-container";
import { studioServices, type StudioService } from "@/lib/services";

function ServiceRow({ service }: { service: StudioService }) {
  return (
    <article data-gsap="service-row" className="grid grid-cols-[minmax(0,1fr)_100px] items-center gap-5 border-t border-[#c7c7bf] py-7 lg:grid-cols-[56px_minmax(0,1fr)_240px] lg:gap-10 lg:py-8">
      <p className="hidden text-[12px]/[18px] font-medium lg:block" aria-hidden="true">{service.number}</p>
      <div className="flex min-w-0 flex-col gap-[18px]">
        <h3 className="text-[34px]/[37px] font-extrabold tracking-[-1.2px] md:text-[45.9px]/[1.05] lg:text-[64px]/[66px] lg:tracking-[-2.5px]">{service.title}</h3>
        <p className="max-w-[620px] text-[16px]/[23px] lg:text-[20px]/[28px]">{service.description}</p>
        <div className="text-[10px]/[16px] font-medium lg:text-[11px]/[18px]">
          <p>{service.deliverables}</p>
          <p>{service.scopeNote}</p>
        </div>
      </div>
      <picture data-gsap="service-artwork" className="block w-[100px] lg:w-[240px] [&_img]:block [&_img]:h-auto [&_img]:w-full">
        <source media="(max-width: 63.999rem)" srcSet={`/capabilities/${service.id}-mobile.svg`} width={100} height={84} />
        <Image src={`/capabilities/${service.id}.svg`} alt="" width={240} height={200} />
      </picture>
    </article>
  );
}

export function ServicesScope() {
  return (
    <SectionContainer
      labelledBy="services-scope-heading"
      className="bg-[#f5f5f1] text-black"
      contentClassName="flex flex-col gap-8 pb-8 md:pb-14 lg:[--page-gutter:56px] lg:[--section-space:72px] lg:gap-12"
    >
      <div className="grid gap-6 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-14">
        <p className="text-[12px] leading-normal font-medium">02 / CAPABILITIES</p>
        <h2 id="services-scope-heading" className="text-[38px]/[41px] font-extrabold tracking-[-1.5px] md:text-[51.3px]/[1.05] lg:text-[64px]/[66px] lg:tracking-[-2.5px]">
          The work behind<br />the launch.
        </h2>
      </div>
      <div>{studioServices.map((service) => <ServiceRow key={service.id} service={service} />)}</div>
    </SectionContainer>
  );
}
