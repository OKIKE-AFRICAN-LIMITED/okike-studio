import Link from "next/link";
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
  badge = "Studio & Client Workspace",
  children,
  footerLink,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#f5f5f0] flex flex-col lg:flex-row">
      {/* Left Column: Brand & Editorial Architecture Showcase */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-[#262626] bg-[#090909] p-12 xl:p-16 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-lime/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#792dff]/10 blur-[140px]" />

        {/* Top: Brand Monogram */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center bg-lime text-[#0e0e0e] font-extrabold text-base tracking-wider transition-transform group-hover:scale-105">
              OK
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-lime transition-colors">
                OKIKE STUDIO
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#888880] font-semibold">
                Brand · Product · Venture
              </span>
            </div>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#70706b] flex items-center gap-1.5 border border-[#262626] px-3 py-1 bg-[#141414]">
            <Lock className="h-3 w-3 text-lime" />
            Confidential
          </span>
        </div>

        {/* Middle: Signature Typography & Statement */}
        <div className="relative z-10 my-12 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-lime">
            <Sparkles className="h-3 w-3 text-lime" />
            {badge}
          </span>
          <h2 className="text-[clamp(2.75rem,4.5vw,4.5rem)] font-extrabold tracking-[-0.04em] leading-[0.95] text-white">
            STRUCTURE.<br />
            BEFORE<br />
            <span className="text-lime">SCALE.</span>
          </h2>
          <p className="max-w-md text-base text-[#a8a8a3] leading-relaxed">
            The unified portal for OKIKE Studio clients and engineering leads. Track sprint progression, inspect design tokens, review proposals, and download staging builds.
          </p>
        </div>

        {/* Bottom: Security & System Status */}
        <div className="relative z-10 border-t border-[#262626] pt-6 flex items-center justify-between text-xs text-[#70706b]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold uppercase tracking-wider text-[#a8a8a3]">
              Supabase Verified Access
            </span>
          </div>
          <span className="font-medium">© 2026 OKIKE STUDIO</span>
        </div>
      </div>

      {/* Right Column: Interactive Auth Form Card */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 bg-[#0e0e0e] min-h-screen lg:min-h-0">
        {/* Top Bar on Mobile & Desktop */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a8a8a3] hover:text-white transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to OKIKE Studio</span>
          </Link>

          <Link href="/" className="lg:hidden flex items-center gap-2">
            <span className="bg-lime px-2 py-0.5 text-xs font-extrabold text-[#0e0e0e]">
              OK
            </span>
            <span className="font-extrabold text-xs uppercase text-white">
              OKIKE
            </span>
          </Link>
        </div>

        {/* Center Content Form Shell */}
        <div className="mx-auto w-full max-w-md py-6 sm:py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#a8a8a3] leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="border border-[#262626] bg-[#141414] p-6 sm:p-8 shadow-2xl">
            {children}
          </div>

          {footerLink && (
            <p className="mt-6 text-center text-xs uppercase tracking-wider text-[#888880]">
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
        <div className="border-t border-[#262626] pt-6 text-center lg:text-left text-xs uppercase tracking-wider text-[#555]">
          OKIKE Studio · Enterprise Security &amp; Confidential Workspace
        </div>
      </div>
    </div>
  );
}
