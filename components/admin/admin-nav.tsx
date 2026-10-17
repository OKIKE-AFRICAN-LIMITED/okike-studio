"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderGit2, Inbox, Users, ExternalLink, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Pulse", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Portfolio CMS", icon: FolderGit2 },
  { href: "/admin/enquiries", label: "Inquiries CRM", icon: Inbox },
  { href: "/admin/clients", label: "Client Spaces", icon: Users },
];

export function AdminNav({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="bg-ink px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider text-action">
              OKIKE
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Studio Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 border-l border-ink/10 pl-6">
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
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-ink text-white font-semibold"
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

        <div className="flex items-center gap-3">
          <Link
            href="/portal"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase bg-paper border border-ink/20 px-2.5 py-1 text-ink hover:bg-ink hover:text-white transition-colors"
            title="Open Client Portal Dashboard"
          >
            <span>Client Portal</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-muted hover:text-ink transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3 w-3" />
          </Link>


          {userEmail && (
            <span className="hidden lg:inline text-xs font-mono text-muted border-l border-ink/10 pl-4">
              {userEmail}
            </span>
          )}

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-1.5 text-xs font-mono uppercase text-muted hover:text-error transition-colors px-2.5 py-1 hover:bg-error/10"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex md:hidden border-t border-ink/10 overflow-x-auto px-4 py-2 gap-2 bg-paper/50">
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
              className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-mono uppercase tracking-wider ${
                isActive
                  ? "bg-ink text-white font-semibold"
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
