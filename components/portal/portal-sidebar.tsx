"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CheckCircle2,
  FolderDown,
  LogOut,
  ShieldCheck,
  Plus,
  ExternalLink,
  ChevronRight,
  Headphones,
  Sparkles,
} from "lucide-react";

interface PortalSidebarProps {
  userEmail?: string;
  companyName?: string;
  fullName?: string;
  isAdmin?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/portal",
    label: "Project Pulse",
    icon: LayoutDashboard,
    description: "Engagement overview & metrics",
  },
  {
    href: "/portal/enquiries",
    label: "My Inquiries & Quotes",
    icon: FileText,
    description: "Submitted briefs & pricing",
  },
  {
    href: "/portal/milestones",
    label: "Milestones & Sprints",
    icon: CheckCircle2,
    description: "Active phases & schedule",
  },
  {
    href: "/portal/deliverables",
    label: "Deliverables & Vault",
    icon: FolderDown,
    description: "Design links & staging files",
  },
];

export function PortalSidebar({
  userEmail = "client@workspace.com",
  companyName = "Client Workspace",
  fullName,
  isAdmin = false,
  isOpen = false,
  onClose,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const displayName = fullName || (userEmail ? userEmail.split("@")[0] : "Client Partner");

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-ink/10 bg-surface text-ink transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-ink/10 px-6 bg-surface">
          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center bg-ink text-action font-extrabold text-sm tracking-wider group-hover:bg-lime group-hover:text-ink transition-colors">
              OK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm uppercase tracking-tight text-ink">
                  OKIKE
                </span>
                <span className="bg-lime text-ink text-[9px] font-extrabold uppercase px-1.5 py-0.2 tracking-wider">
                  Client
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block truncate max-w-[140px]">
                {companyName}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-4 py-3 overflow-y-auto">
          <div className="px-3 pb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              Workspace Navigation
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-ink text-white shadow-xs font-extrabold"
                    : "text-muted hover:text-ink hover:bg-paper"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? "text-lime" : "text-muted group-hover:text-ink"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={`h-3 w-3 transition-transform ${
                    isActive
                      ? "text-lime translate-x-0.5"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 text-muted"
                  }`}
                />
              </Link>
            );
          })}

          {/* Direct Support Section */}
          <div className="pt-4 px-3 pb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">
              Studio Assistance
            </span>
          </div>

          <a
            href="mailto:studio@okikestudio.com?subject=Client Support Request"
            className="group flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <Headphones className="h-4 w-4 text-muted group-hover:text-ink" />
            <span>Direct Studio Help</span>
          </a>

          <Link
            href="/services"
            className="group flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <Sparkles className="h-4 w-4 text-muted group-hover:text-ink" />
            <span>Studio Offerings</span>
          </Link>
        </nav>

        {/* Admin Switcher (If Admin) */}
        {isAdmin && (
          <div className="px-4 py-2 border-t border-ink/10 bg-paper/60">
            <Link
              href="/admin"
              className="flex items-center justify-between p-2.5 bg-ink text-white text-[11px] font-extrabold uppercase tracking-wider hover:bg-lime hover:text-ink transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-lime" />
                <span>Studio Admin View</span>
              </div>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        )}

        {/* User Identity & Logout Footer */}
        <div className="border-t border-ink/10 p-4 bg-surface">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-paper border border-ink/15 flex items-center justify-center font-extrabold text-xs text-ink shrink-0 uppercase">
                {displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase text-ink truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-muted truncate font-medium">
                  {userEmail}
                </p>
              </div>
            </div>

            <Link
              href="/auth/signout"
              title="Sign Out"
              className="h-8 w-8 flex items-center justify-center border border-ink/15 bg-paper hover:bg-ink hover:text-white transition-colors text-muted shrink-0 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
