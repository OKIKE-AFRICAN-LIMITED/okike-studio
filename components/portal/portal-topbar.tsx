"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Globe, Send, ShieldCheck, ArrowRight } from "lucide-react";

interface PortalTopbarProps {
  userEmail?: string;
  companyName?: string;
  isAdmin?: boolean;
  onOpenSidebar: () => void;
}

export function PortalTopbar({
  userEmail,
  companyName = "Client Workspace",
  isAdmin = false,
  onOpenSidebar,
}: PortalTopbarProps) {
  const pathname = usePathname();

  let pageTitle = "Project Pulse";
  if (pathname.includes("/enquiries")) pageTitle = "My Inquiries & Proposals";
  else if (pathname.includes("/milestones")) pageTitle = "Milestones & Sprints";
  else if (pathname.includes("/deliverables")) pageTitle = "Deliverables & Vault";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink/10 bg-surface/95 px-4 sm:px-8 backdrop-blur-md">
      {/* Left: Mobile Toggle + Breadcrumb */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open Workspace Navigation"
          className="flex h-10 w-10 items-center justify-center border border-ink/15 bg-paper text-ink hover:bg-ink hover:text-white transition-colors lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              {companyName}
            </span>
            <span className="text-muted/40 font-mono text-xs">/</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-ink">
              {pageTitle}
            </span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-ink hidden sm:block">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden md:inline-flex items-center gap-1.5 bg-ink text-white hover:bg-lime hover:text-ink px-3 py-1.5 text-xs uppercase font-extrabold tracking-wider transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-lime" />
            <span>Admin Command</span>
          </Link>
        )}

        <a
          href="mailto:studio@okikestudio.com?subject=Project Inquiry"
          className="inline-flex items-center gap-1.5 border border-ink/15 bg-paper hover:bg-ink hover:text-white px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Message Studio</span>
          <span className="sm:hidden">Message</span>
        </a>

        <Link
          href="/"
          target="_blank"
          title="View Public Site"
          className="flex h-9 w-9 items-center justify-center border border-ink/15 bg-paper hover:bg-ink hover:text-white transition-colors text-muted"
        >
          <Globe className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
