"use client";

import { ReactNode, useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export function AdminLayoutShell({
  userEmail,
  children,
}: {
  userEmail?: string;
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink flex font-sans">
      {/* Dedicated Admin Sidebar (White Theme) */}
      <AdminSidebar
        userEmail={userEmail}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Area: Top Bar + Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <AdminTopbar
          userEmail={userEmail}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {children}
        </main>

        <footer className="border-t border-ink/10 bg-surface/60 py-5 px-6 sm:px-8 text-center text-xs uppercase tracking-wider text-muted font-medium">
          OKIKE Studio Management Platform · Confidential Internal System
        </footer>
      </div>
    </div>
  );
}
