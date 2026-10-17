"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  ShieldCheck,
  ExternalLink,
  Plus,
} from "lucide-react";

interface AdminTopbarProps {
  userEmail?: string;
  onOpenSidebar: () => void;
}

export function AdminTopbar({ userEmail, onOpenSidebar }: AdminTopbarProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Pulse Overview";
    if (pathname.startsWith("/admin/pages")) return "Pages CMS";
    if (pathname.startsWith("/admin/projects")) return "Portfolio CMS";
    if (pathname.startsWith("/admin/enquiries")) return "Inquiries CRM";
    if (pathname.startsWith("/admin/clients")) return "Client Spaces";
    return "Studio Command";
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ink/10 bg-surface/90 px-4 sm:px-8 backdrop-blur-md text-ink">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-10 w-10 items-center justify-center border border-ink/15 bg-paper text-ink hover:border-ink lg:hidden transition-colors cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider text-muted">
            Studio Admin
          </span>
          <span className="hidden sm:inline text-xs text-ink/30">/</span>
          <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-tight text-ink">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: Status Pill & Quick Action Links */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Environment / Live Indicator */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-ink/10 bg-paper px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Engine Live
          </span>
        </div>

        {/* Client Portal Link */}
        <Link
          href="/portal"
          className="hidden sm:inline-flex items-center gap-1.5 border border-ink/15 bg-paper px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white transition-colors"
          title="Switch to Client Portal view"
        >
          <ShieldCheck className="h-3.5 w-3.5 text-ink" />
          <span>Client View</span>
        </Link>

        {/* Public Site Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        {/* Action Button */}
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 bg-ink px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-lime hover:text-ink transition-colors shadow-xs"
        >
          <Plus className="h-3.5 w-3.5 text-action" />
          <span className="hidden sm:inline">Manage Projects</span>
          <span className="sm:hidden">CMS</span>
        </Link>
      </div>
    </header>
  );
}
