"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, CheckCircle2, FolderDown, LogOut, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/portal", label: "Project Pulse", icon: LayoutDashboard },
  { href: "/portal/enquiries", label: "My Inquiries", icon: FileText },
  { href: "/portal/milestones", label: "Milestones", icon: CheckCircle2 },
  { href: "/portal/deliverables", label: "Deliverables & Vault", icon: FolderDown },
];

export function PortalNav({
  userEmail,
  companyName,
  isAdmin = false,
}: {
  userEmail?: string;
  companyName?: string;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-6">
          <Link href="/portal" className="flex items-center gap-2 group">
            <span className="bg-ink px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-action transition-colors group-hover:bg-lime group-hover:text-ink">
              OKIKE
            </span>
            <span className="text-xs uppercase tracking-widest text-muted font-bold">
              Client Workspace
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 border-l border-ink/10 pl-6">
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
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-ink text-white font-extrabold"
                      : "text-muted hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-1.5 bg-lime text-ink px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider hover:bg-ink hover:text-white transition-colors"
              title="Switch to Admin Command"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Command</span>
            </Link>
          )}

          <div className="hidden sm:flex flex-col text-right">
            {companyName && (
              <span className="text-xs font-bold text-ink leading-tight">
                {companyName}
              </span>
            )}
            {userEmail && (
              <span className="text-[11px] text-muted leading-tight font-medium">
                {userEmail}
              </span>
            )}
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-error transition-colors px-2.5 py-1.5 hover:bg-error/10 cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden border-t border-ink/10 overflow-x-auto px-4 py-2 gap-2 bg-paper/50">
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
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                isActive
                  ? "bg-ink text-white font-extrabold"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
