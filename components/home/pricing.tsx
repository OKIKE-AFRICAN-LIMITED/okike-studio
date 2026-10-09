import { pricingPackages, type PricingPackage } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/ui/section-container";

function PricingCard({ package: pricingPackage }: { package: PricingPackage }) {
  return (
    <article data-gsap="pricing-card" className={`flex min-w-0 flex-col items-start gap-7 p-6 py-7 lg:p-7 ${pricingPackage.highlighted ? "bg-[#e3ed33]" : "bg-surface"}`}>
      <p className="text-[12px] font-medium leading-normal">{pricingPackage.index} / {pricingPackage.stage}</p>
      <h3 className="text-[28px] font-extrabold leading-normal">{pricingPackage.name}</h3>
      <p className="text-[36px] font-extrabold leading-normal lg:text-[42px]">{pricingPackage.price}</p>
      <p className="min-h-[75px] text-[17px]/[25px]">{pricingPackage.description}</p>
      <p className="text-[16px] font-medium leading-normal">{pricingPackage.scope}</p>
      <Button href={pricingPackage.href} variant="secondary" className="mt-auto w-full focus-visible:outline-[3px] focus-visible:outline-[#0e0e0e] focus-visible:outline-offset-4">
        {pricingPackage.buttonLabel}
      </Button>
    </article>
  );
}

export function Pricing({ description = "Choose the closest fit. We’ll confirm scope, timeline and your final quote before work begins." }: { description?: string }) {
  return (
    <SectionContainer
      id="pricing"
      labelledBy="pricing-heading"
      className="bg-[#f5f5f0] text-[#0e0e0e] [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-7 pb-14 [--section-space:64px] lg:gap-12 lg:pb-20 lg:[--page-gutter:56px] lg:[--section-space:96px]"
    >
      <p className="text-[12px] leading-normal">PROJECT PRICING / NGN</p>
      <h2 id="pricing-heading" data-gsap="pricing-heading" className="text-[42px]/[.96] font-extrabold tracking-[-1.26px] md:text-[56.7px]/[1.05] md:tracking-[-1.701px] lg:text-[72px]/[.96] lg:tracking-[-2.16px]">A starting point.<br />Built around your ambition.</h2>
      <p className="text-[18px] leading-normal">{description}</p>

      <div data-gsap="pricing-packages" className="grid gap-4 lg:grid-cols-3">
        {pricingPackages.map((pricingPackage) => (
          <PricingCard key={pricingPackage.id} package={pricingPackage} />
        ))}
      </div>

      <p className="text-[14px] leading-normal">
        Starting prices in Nigerian naira. Final pricing depends on scope, functionality and any additional services.
      </p>
    </SectionContainer>
  );
}
