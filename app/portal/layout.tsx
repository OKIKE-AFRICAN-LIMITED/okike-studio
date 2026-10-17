import { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PortalNav } from "@/components/portal/portal-nav";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Client Workspace | OKIKE Studio",
  description: "Private client workspace for project milestones, deliverables, and proposals.",
};

export default async function PortalLayout({ children }: { children: ReactNode }) {
  let userEmail = "";
  let companyName = "Client Workspace";
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      userEmail = user.email;
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name, full_name, role")
        .eq("id", user.id)
        .single();

      if (profile?.company_name) {
        companyName = profile.company_name;
      }

      isAdmin =
        profile?.role === "admin" ||
        user.user_metadata?.role === "admin" ||
        (process.env.ENQUIRY_TO_EMAIL !== undefined && user.email === process.env.ENQUIRY_TO_EMAIL);
    }
  } catch {
    // Development fallback
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans">
      {isAdmin && (
        <aside aria-label="Administrator mode notice" className="bg-ink text-white border-b border-lime/40 py-2.5 px-4 text-xs font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-lime text-ink font-extrabold px-2 py-0.5 text-[10px] uppercase flex items-center gap-1 tracking-wider">
                <ShieldCheck className="h-3 w-3" />
                ADMIN MODE
              </span>
              <span className="text-neutral-300 font-medium">
                You are viewing the Client Workspace as an Administrator. You have full access to both dashboards.
              </span>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-lime hover:underline font-extrabold text-xs shrink-0 uppercase tracking-wider"
            >
              <span>Return to Studio Command</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      )}

      <PortalNav userEmail={userEmail} companyName={companyName} isAdmin={isAdmin} />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-ink/10 py-6 text-center text-xs uppercase tracking-wider text-muted font-medium">
        OKIKE Studio · Private Client Portal
      </footer>
    </div>
  );
}
