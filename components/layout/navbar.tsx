import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NavigationLink } from "@/components/layout/navigation-link";

function StudioLogo({ menu = false }: { menu?: boolean }) {
  return (
    <Link href="/" aria-label="OKIKE Studio home" className="flex min-h-11 shrink-0 items-center">
      <picture className="[&_img]:h-auto [&_img]:w-[114px] lg:[&_img]:w-[132px]">
        <source media="(max-width: 63.999rem)" srcSet={menu ? "/navigation/okike-logo-menu.png" : "/navigation/okike-logo-compact.png"} width={menu ? 115 : 114} height={36} />
        <Image src="/navigation/okike-logo.png" alt="OKIKE Studio" width={132} height={42} priority />
      </picture>
    </Link>
  );
}

function NavigationLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <ul className={mobile ? "m-0 list-none px-5 pt-9 pb-7" : "m-0 hidden list-none p-0 lg:flex lg:[&_li:nth-child(2)_a]:w-[162px]"}>
      {site.navigation.map((item, index) => (
        <li key={item.href}>
          <NavigationLink className={mobile ? "flex items-baseline gap-[18px] border-b border-[rgb(31_33_8_/_30%)] py-[11.5px] text-[36px]/[44px] font-extrabold tracking-[-1.2px] [&_span:last-child]:hover:underline [&_span:last-child]:hover:underline-offset-4 aria-[current=page]:border-black" : "flex h-14 w-[130px] flex-col justify-center border-l border-[#d9d9d4] px-5 text-[16px]/[22px] font-medium [&_span:last-child]:hover:underline [&_span:last-child]:hover:underline-offset-4 aria-[current=page]:bg-[#f5f5f0]"} href={item.href}>
            <span aria-hidden="true" className={mobile ? "text-[12px] leading-normal" : "text-[10px]"}>{String(index + 1).padStart(2, "0")}</span>
            <span>{item.label}</span>
          </NavigationLink>
        </li>
      ))}
    </ul>
  );
}

function ProjectLink() {
  return (
    <Button href={site.enquiryHref} className="h-14 w-full shrink-0 justify-between gap-6 px-4 text-[15px] font-semibold leading-normal hover:bg-action hover:text-primary hover:[&_span]:underline hover:[&_span]:underline-offset-4 lg:w-[204px]">
      <span>Start a project</span>
      <Image src="/navigation/arrow.svg" alt="" width={20} height={20} />
    </Button>
  );
}

export function Navbar() {
  return (
    <header data-gsap="navbar" className="sticky top-0 z-50 border-b border-[#d9d9d4] bg-surface">
      <div className="flex h-[83px] items-center justify-between px-5 md:px-10 lg:h-[103px] lg:gap-12 lg:px-14">
        <StudioLogo />
        <nav aria-label="Primary" className="hidden flex-1 items-center justify-end gap-12 lg:flex">
          <NavigationLinks />
          <ProjectLink />
        </nav>
        <MobileMenu logo={<StudioLogo menu />}>
          <nav aria-label="Mobile">
            <NavigationLinks mobile />
            <div className="flex flex-col gap-6 px-5 pt-6 pb-8 [&_a]:bg-surface [&_a]:px-[18px] [&_a:hover]:bg-surface [&_p]:text-[11px]/[17px] [&_p]:font-medium">
              <ProjectLink />
              <p>INDEPENDENT STUDIO.<br />BRAND, PRODUCT &amp; TECHNOLOGY.</p>
            </div>
          </nav>
        </MobileMenu>
      </div>
    </header>
  );
}
