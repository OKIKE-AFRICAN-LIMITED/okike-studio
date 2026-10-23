"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Inbox,
  Users,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/admin",
    label: "Pulse Overview",
    icon: LayoutDashboard,
    badge: "Live",
  },
  {
    href: "/admin/pages",
    label: "Pages CMS",
    icon: Globe,
    badge: "Public",
  },
  {
    href: "/admin/projects",
    label: "Portfolio CMS",
    icon: FolderGit2,
    badge: null,
  },
  {
    href: "/admin/enquiries",
    label: "Inquiries CRM",
    icon: Inbox,
    badge: null,
  },
  {
    href: "/admin/clients",
    label: "Client Spaces",
    icon: Users,
    badge: null,
  },
];

export function AdminSidebar({ userEmail, isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

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

      {/* Sidebar Container (White Theme) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-ink/10 bg-surface text-ink transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-ink/10 px-6 bg-surface">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink p-1.5 transition-colors group-hover:bg-black">
              <Image
                src="/footerlogo.png"
                alt="OKIKE Studio"
                width={28}
                height={28}
                className="h-6 w-6 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-sm text-ink group-hover:underline transition-all">
                OKIKE STUDIO
              </span>
              <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
                Studio Command
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/25 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink border border-lime">
            <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
            Admin
          </span>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted mb-3">
              Management
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                      isActive
                        ? "bg-ink text-white font-extrabold shadow-xs"
                        : "text-muted hover:bg-paper hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive
                            ? "text-action"
                            : "text-muted group-hover:text-ink"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 font-extrabold uppercase tracking-wider ${
                          isActive
                            ? "bg-lime text-ink"
                            : "bg-paper text-ink border border-ink/15"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Cross-Workspace Switcher */}
          <div>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted mb-3">
              Workspaces &amp; Live
            </p>
            <div className="space-y-1">
              <Link
                href="/portal"
                className="group flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-paper hover:text-ink transition-colors border border-transparent hover:border-ink/10"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-ink" />
                  <span>Client Workspace</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted group-hover:text-ink transition-colors" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="group flex items-center justify-between px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:bg-paper hover:text-ink transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-4 w-4 text-muted group-hover:text-ink transition-colors" />
                  <span>Public Site</span>
                </div>
                <span className="text-[10px] text-muted group-hover:text-ink">
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* User Card & Sign Out Footer */}
        <div className="border-t border-ink/10 bg-paper/70 p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-ink flex items-center justify-center text-xs font-extrabold text-action shrink-0">
                {userEmail ? userEmail.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-ink">
                  {userEmail || "Admin User"}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted font-bold">
                  Studio Lead
                </p>
              </div>
            </div>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-surface hover:bg-error/10 text-muted hover:text-error border border-ink/15 hover:border-error/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
