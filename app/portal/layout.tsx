import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortalLayoutShell } from "@/components/portal/portal-layout-shell";

export const metadata = {
  title: "Client Workspace | OKIKE Studio",
  description: "Private client workspace for project milestones, deliverables, and proposals.",
};

export default async function PortalLayout({ children }: { children: ReactNode }) {
  let userEmail = "";
  let companyName = "Client Workspace";
  let fullName = "Client Partner";
  let isAdmin = false;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/portal");
  }

  userEmail = user.email || "";

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name, full_name, role")
      .eq("id", user.id)
      .single();

    if (profile?.company_name) {
      companyName = profile.company_name;
    }
    if (profile?.full_name) {
      fullName = profile.full_name;
    }

    isAdmin =
      profile?.role === "admin" ||
      user.user_metadata?.role === "admin" ||
      (process.env.ENQUIRY_TO_EMAIL !== undefined && user.email === process.env.ENQUIRY_TO_EMAIL);
  } catch {
    // Non-fatal profile query fallback
  }

  return (
    <PortalLayoutShell
      userEmail={userEmail}
      companyName={companyName}
      fullName={fullName}
      isAdmin={isAdmin}
    >
      {children}
    </PortalLayoutShell>
  );
}
