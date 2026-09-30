import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const socialLabels = ["Instagram", "LinkedIn", "X"] as const;

export function Footer() {
  return (
    <footer id="site-footer" data-gsap="footer" className="bg-[#0e0e0e] text-[#f5f5f0]">
      <div className="mx-auto w-full max-w-site px-5 pt-10 pb-6 md:px-10 md:py-14 lg:px-14 lg:pt-14 lg:pb-7">
        <div className="flex flex-col gap-7 lg:flex-row lg:gap-16">
          <div className="min-h-11 lg:w-18 lg:flex-none">
            <Image src="/footerlogo.png" alt="OKIKE Studio" width={88} height={88} className="size-11" />
          </div>
          <div data-gsap="footer-contact" className="flex flex-col gap-4 lg:flex-1">
            <p className="text-[11px]/[16px] font-medium uppercase text-[#a8a8a3]">Start a conversation</p>
            <a className="w-fit max-w-full text-[22px]/[30px] [overflow-wrap:anywhere] hover:text-lime lg:text-[24px]/[30px]" href="mailto:studio@okike.com?subject=OKIKE%20Studio%20project%20enquiry">
              {site.email}
            </a>
            <ul className="flex flex-wrap gap-x-7 text-[14px]/[44px] text-lime" aria-label="Social profiles coming soon">
              {socialLabels.map((label) => <li key={label}>{label}</li>)}
            </ul>
          </div>
          <nav aria-label="Footer" className="lg:w-70 lg:flex-none">
            <ul className="grid grid-cols-[repeat(2,minmax(0,8.25rem))] gap-x-4 gap-y-1">
              {site.navigation.map((item) => (
                <li key={item.href}><Link className="flex min-h-11 items-center text-[16px]/[24px] hover:text-lime" href={item.href}>{item.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <p data-gsap="footer-wordmark" className="mt-7 flex flex-col overflow-hidden whitespace-nowrap text-[clamp(5.75rem,25vw,8rem)]/[.92] font-extrabold tracking-[-.03em] md:block md:text-[92px]/[.96] lg:mt-12 lg:text-[clamp(9.75rem,13.7vw,12.5rem)]/[1]" aria-label="OKIKE Studio">
          <span>OKIKE</span> <span>STUDIO</span>
        </p>
        <div className="mt-7 flex flex-col gap-3 border-t border-[#404040] pt-5 text-[10px]/[16px] lg:mt-12 lg:grid lg:grid-cols-[16.25rem_1fr_8rem] lg:items-center lg:[&_p:nth-child(2)]:text-center">
          <p>© 2026 OKIKE STUDIO</p>
          <p>INDEPENDENT / WORKING ACROSS TIME ZONES</p>
          <Link href="/#top" className="flex min-h-11 items-center text-[12px]/[18px] text-lime hover:text-white lg:justify-end">Back to top</Link>
        </div>
      </div>
    </footer>
  );
}
