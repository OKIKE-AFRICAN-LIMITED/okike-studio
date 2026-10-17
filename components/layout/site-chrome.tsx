"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isExcluded =
    pathname === "/enquiry" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return isExcluded ? null : children;
}
