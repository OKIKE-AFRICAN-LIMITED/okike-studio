import { createClient } from "@/lib/supabase/server";
import { EnquiriesManager, type EnquiryItem } from "@/components/admin/enquiries-manager";

export const metadata = {
  title: "Inquiries CRM | Studio Admin | OKIKE Studio",
  description: "Lead triage, proposals, and project onboarding pipeline.",
};

const defaultLeads: EnquiryItem[] = [
  {
    id: "lead-01",
    client_name: "Alexander Wright",
    client_email: "alexander@aether.io",
    client_company: "Aether Dynamics",
    services: ["Brand identity", "Website"],
    package_selected: "Business Pro",
    scope_answers: {
      "Project Goal": "Create a distinctive venture identity and flagship high-conversion marketing site ahead of Series A.",
      "Brand Deliverables": "Logo system, comprehensive design tokens, editorial typography guidelines, and digital brand deck.",
      "Website Requirements": "Next.js App Router, dynamic CMS for case studies and whitepapers, fluid GSAP animations.",
    },
    budget_range: "$15k - $30k",
    timeline: "6 - 8 weeks",
    status: "new",
    admin_notes: "Introduced via investor network. Ready to kick off immediately upon proposal review.",
    created_at: "Today, 10:45 AM",
  },
  {
    id: "lead-02",
    client_name: "Elena Rostova",
    client_email: "elena@vanguard.design",
    client_company: "Vanguard Studio",
    services: ["Custom software"],
    package_selected: "Custom Software",
    scope_answers: {
      "Project Goal": "Build a proprietary project staging and design asset review portal for creative agencies.",
      "Tech Architecture": "TypeScript, Next.js, Supabase, Tailwind, real-time collaboration canvas.",
      "Target Launch": "Private beta in Q4.",
    },
    budget_range: "$30k - $60k",
    timeline: "10 - 12 weeks",
    status: "discovery_scheduled",
    admin_notes: "Discovery call booked for Thursday 2pm GMT.",
    created_at: "Yesterday",
  },
  {
    id: "lead-03",
    client_name: "Marcus Cole",
    client_email: "marcus@helix.health",
    client_company: "Helix Health",
    services: ["Brand identity", "Website", "Custom software"],
    package_selected: "Combine Services",
    scope_answers: {
      "Project Goal": "End-to-end digital repositioning of a clinical genomics healthtech platform.",
      "Deliverables": "Visual identity overhaul, patient portal UI, doctor console, marketing web app.",
    },
    budget_range: "$60k+",
    timeline: "16 weeks",
    status: "proposal_sent",
    admin_notes: "Comprehensive scope deck sent. Waiting for board sign-off.",
    created_at: "Oct 11, 2026",
  },
];

export default async function AdminEnquiriesPage() {
  let leads = defaultLeads;

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
    // Graceful fallback
  }

  return <EnquiriesManager initialEnquiries={leads} />;
}
