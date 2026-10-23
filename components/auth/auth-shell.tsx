import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { ArrowLeft, ShieldCheck, Lock, Sparkles } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
  footerLink?: {
    prompt: string;
    label: string;
    href: string;
  };
}

export function AuthShell({
  title,
  subtitle,
  badge = "Client & Partner Workspace",
  children,
  footerLink,
}: AuthShellProps) {
  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-[#0e0e0e] text-[#f5f5f0] flex flex-col lg:flex-row">
      {/* Left Column: Brand & Editorial Architecture Showcase */}
      <div className="relative hidden lg:flex lg:w-1/2 h-full flex-col justify-between border-r border-[#262626] bg-[#090909] p-8 xl:p-12 overflow-hidden">
        {/* Top: Brand Monogram */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink border border-white/10 p-2 transition-transform group-hover:scale-105">
              <Image
                src="/footerlogo.png"
                alt="OKIKE Studio"
                width={32}
                height={32}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-lime transition-colors">
                OKIKE STUDIO
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#888880] font-semibold">
                Brand · Product · Venture
              </span>
            </div>
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#70706b] flex items-center gap-1.5 border border-[#262626] px-2.5 py-1 bg-[#141414]">
            <Lock className="h-3 w-3 text-lime" />
            Confidential
          </span>
        </div>

        {/* Middle: Signature Typography & Statement */}
        <div className="relative z-10 my-auto py-6 space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#2a2a2a] bg-[#141414] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-lime">
            <Sparkles className="h-3 w-3 text-lime" />
            {badge}
          </span>
          <h2 className="text-[clamp(2.25rem,3.8vw,3.75rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white">
            STRUCTURE.<br />
            BEFORE<br />
            <span className="text-lime">SCALE.</span>
          </h2>
          <p className="max-w-md text-sm text-[#a8a8a3] leading-relaxed">
            The workspace for OKIKE Studio client engagements. Monitor milestone sprint delivery, review project briefs, and approve staging deliverables.
          </p>
        </div>

        {/* Bottom: Security & System Status */}
        <div className="relative z-10 border-t border-[#262626] pt-4 flex items-center justify-between text-xs text-[#70706b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-[#a8a8a3]">
              Supabase Verified Access
            </span>
          </div>
          <span className="font-medium text-[11px]">© 2026 OKIKE STUDIO</span>
        </div>
      </div>

      {/* Right Column: Interactive Auth Form Card */}
      <div className="flex-1 h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 xl:p-12 bg-[#0e0e0e] overflow-hidden">
        {/* Top Bar on Mobile & Desktop */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a8a8a3] hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to OKIKE Studio</span>
          </Link>

          <Link href="/" className="lg:hidden flex items-center gap-2">
            <Image
              src="/footerlogo.png"
              alt="OKIKE Studio"
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
            <span className="font-extrabold text-xs uppercase text-white">
              OKIKE
            </span>
          </Link>
        </div>

        {/* Center Content Form Shell */}
        <div className="mx-auto w-full max-w-md my-auto py-2">
          <div className="mb-5">
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#a8a8a3] leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="border border-[#262626] bg-[#141414] p-5 sm:p-6 shadow-2xl">
            {children}
          </div>

          {footerLink && (
            <p className="mt-4 text-center text-xs uppercase tracking-wider text-[#888880]">
              {footerLink.prompt}{" "}
              <Link
                href={footerLink.href}
                className="font-bold text-lime hover:underline underline-offset-4"
              >
                {footerLink.label}
              </Link>
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t border-[#262626] pt-3 text-center lg:text-left text-[11px] uppercase tracking-wider text-[#555]">
          OKIKE Studio · Enterprise Security &amp; Confidential Workspace
        </div>
      </div>
    </div>
  );
}
