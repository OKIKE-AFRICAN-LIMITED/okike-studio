"use client";

import { ReactNode, useState } from "react";
import { PortalSidebar } from "./portal-sidebar";
import { PortalTopbar } from "./portal-topbar";

export function PortalLayoutShell({
  userEmail,
  companyName,
  fullName,
  isAdmin = false,
  children,
}: {
  userEmail?: string;
  companyName?: string;
  fullName?: string;
  isAdmin?: boolean;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink flex font-sans">
      {/* Client Workspace Sidebar */}
      <PortalSidebar
        userEmail={userEmail}
        companyName={companyName}
        fullName={fullName}
        isAdmin={isAdmin}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area: Topbar + Page View */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <PortalTopbar
          userEmail={userEmail}
          companyName={companyName}
          isAdmin={isAdmin}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {children}
        </main>

        <footer className="border-t border-ink/10 bg-surface/60 py-5 px-6 sm:px-8 text-center text-xs uppercase tracking-wider text-muted font-medium">
          OKIKE Studio · Private Client Workspace
        </footer>
      </div>
    </div>
  );
}
