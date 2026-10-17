import { createClient } from "@/lib/supabase/server";
import { EnquiriesManager, type EnquiryItem } from "@/components/admin/enquiries-manager";

export const metadata = {
  title: "Inquiries CRM | Studio Admin | OKIKE Studio",
  description: "Lead triage, proposals, and project onboarding pipeline.",
};

export default async function AdminEnquiriesPage() {
  let leads: EnquiryItem[] = [];

  try {
    const supabase = await createClient();
    const { data: dbLeads } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbLeads && dbLeads.length > 0) {
      leads = dbLeads.map((row) => ({
        id: row.id,
        client_name: row.client_name,
        client_email: row.client_email,
        client_company: row.client_company,
        services: Array.isArray(row.services) ? (row.services as string[]) : [],
        package_selected: row.package_selected,
        scope_answers: (row.scope_answers as Record<string, string>) || {},
        budget_range: row.budget_range,
        timeline: row.timeline,
        status: row.status as EnquiryItem["status"],
        admin_notes: row.admin_notes,
        created_at: new Date(row.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    }
  } catch {
    // Graceful fallback to clean empty list
  }

  return <EnquiriesManager initialEnquiries={leads} />;
}
