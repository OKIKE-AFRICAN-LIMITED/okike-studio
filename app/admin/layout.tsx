import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutShell } from "@/components/admin/admin-layout-shell";

export const metadata = {
  title: "Studio Admin | OKIKE Studio",
  description: "Internal content management and lead pipeline command center.",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  let userEmail = "admin@okikestudio.com";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.email) {
      userEmail = user.email;
    }
  } catch {
    // Development fallback
  }

  return (
    <AdminLayoutShell userEmail={userEmail}>
      {children}
    </AdminLayoutShell>
  );
}
