import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { selectedProjects } from "@/lib/projects";
import {
  Inbox,
  FolderGit2,
  Users,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
  Clock,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage() {
  let enquiriesCount: number = 3;
  let activeProjectsCount: number = 2;
  let caseStudiesCount: number = selectedProjects.length;

  let enquiries: Array<{
    id: string;
    client_name: string;
    client_company: string | null;
    client_email: string;
    services: string[];
    budget_range: string | null;
    status: string;
    created_at: string;
  }> = [
    {
      id: "demo-1",
      client_name: "Alexander Wright",
      client_company: "Aether Dynamics",
      client_email: "alexander@aether.io",
      services: ["Brand identity", "Website"],
      budget_range: "$15k - $30k",
      status: "new",
      created_at: "Today, 10:45 AM",
    },
    {
      id: "demo-2",
      client_name: "Elena Rostova",
      client_company: "Vanguard Studio",
      client_email: "elena@vanguard.design",
      services: ["Custom software"],
      budget_range: "$30k - $60k",
      status: "reviewed",
      created_at: "Yesterday",
    },
    {
      id: "demo-3",
      client_name: "Marcus Cole",
      client_company: "Helix Health",
      client_email: "marcus@helix.health",
      services: ["Brand identity", "Website", "Custom software"],
      budget_range: "$60k+",
      status: "proposal_sent",
      created_at: "3 days ago",
    },
  ];

  try {
    const supabase = await createClient();

    const { count: realEnquiriesCount } = await supabase
      .from("enquiries")
      .select("*", { count: "exact", head: true });
    if (typeof realEnquiriesCount === "number" && realEnquiriesCount > 0) {
      enquiriesCount = realEnquiriesCount;
    }

    const { count: realProjectsCount } = await supabase
      .from("client_projects")
      .select("*", { count: "exact", head: true });
    if (typeof realProjectsCount === "number") {
      activeProjectsCount = realProjectsCount;
    }

    const { count: realCmsCount } = await supabase
      .from("studio_projects")
      .select("*", { count: "exact", head: true });
    if (typeof realCmsCount === "number") {
      caseStudiesCount = realCmsCount;
    }

    const { data: latestEnquiries } = await supabase
      .from("enquiries")
      .select("id, client_name, client_company, client_email, services, budget_range, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (latestEnquiries && latestEnquiries.length > 0) {
      enquiries = latestEnquiries.map((e) => ({
        id: e.id,
        client_name: e.client_name,
        client_company: e.client_company,
        client_email: e.client_email,
        services: Array.isArray(e.services) ? (e.services as string[]) : [],
        budget_range: e.budget_range,
        status: e.status,
        created_at: new Date(e.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
    }
  } catch {
    // Development fallback
  }

  const statusStyles: Record<string, string> = {
    new: "bg-lime text-ink font-extrabold border border-lime",
    reviewed: "bg-paper text-ink border border-ink/15 font-semibold",
    discovery_scheduled: "bg-purple-100 text-purple-900 border border-purple-300 font-bold",
    proposal_sent: "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
    won: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Studio Operations &amp; Pipeline
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            Studio Pulse Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 bg-paper hover:bg-surface text-ink border border-ink/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Manage Portfolio
          </Link>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-2 bg-ink hover:bg-lime hover:text-ink text-white px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors shadow-xs"
          >
            <Inbox className="h-3.5 w-3.5 text-action" />
            View Leads ({enquiriesCount})
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-ink/15 bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Inquiry Queue</span>
            <Inbox className="h-4 w-4 text-ink" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              {enquiriesCount}
            </div>
            <p className="text-xs text-muted mt-1 font-medium">Total leads captured</p>
          </div>
        </div>

        <div className="border border-ink/15 bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Active Engagements</span>
            <Users className="h-4 w-4 text-ink" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              {activeProjectsCount}
            </div>
            <p className="text-xs text-muted mt-1 font-medium">In active delivery phases</p>
          </div>
        </div>

        <div className="border border-ink/15 bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Live Case Studies</span>
            <FolderGit2 className="h-4 w-4 text-ink" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              {caseStudiesCount}
            </div>
            <p className="text-xs text-muted mt-1 font-medium">Published to /work</p>
          </div>
        </div>

        <div className="border border-ink/15 bg-surface p-5 sm:p-6 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-muted">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Momentum</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              High
            </div>
            <p className="text-xs text-muted mt-1 font-medium">Discovery calls in progress</p>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Leads */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ink" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-ink">
                Inbound Inquiries &amp; Proposals
              </h2>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink flex items-center gap-1 transition-colors"
            >
              <span>Full Pipeline</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-ink/10 border border-ink/15 bg-surface shadow-xs">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="p-5 hover:bg-paper/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ink text-sm">
                      {enquiry.client_name}
                    </span>
                    {enquiry.client_company && (
                      <span className="text-xs text-muted font-medium">
                        / {enquiry.client_company}
                      </span>
                    )}
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 tracking-wider font-extrabold ${
                        statusStyles[enquiry.status] || "bg-paper text-ink border border-ink/10"
                      }`}
                    >
                      {enquiry.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-muted font-medium">
                    {enquiry.client_email} · Budget:{" "}
                    <span className="text-ink font-bold">
                      {enquiry.budget_range || "Flexible"}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {enquiry.services.map((svc) => (
                      <span
                        key={svc}
                        className="bg-paper px-2 py-0.5 text-[10px] uppercase text-muted border border-ink/10 font-bold"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                  <span className="text-[11px] text-muted font-medium">
                    {enquiry.created_at}
                  </span>
                  <Link
                    href={`/admin/enquiries?id=${enquiry.id}`}
                    className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-ink hover:text-lime-700 transition-colors"
                  >
                    Review Scope <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active Client Spaces & Quick Actions */}
        <div className="space-y-6">
          <div className="border border-ink/15 bg-surface p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                Active Client Projects
              </h2>
              <Link
                href="/admin/clients"
                className="text-xs font-bold uppercase tracking-wider text-muted hover:text-ink"
              >
                All
              </Link>
            </div>

            <div className="space-y-4">
              <div className="border border-ink/10 p-4 space-y-3 bg-paper/40">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-ink">
                      Aether Dynamics
                    </h3>
                    <p className="text-[11px] text-muted font-medium">
                      Brand System &amp; Next.js Experience
                    </p>
                  </div>
                  <span className="text-[9px] bg-lime text-ink px-2 py-0.5 font-extrabold uppercase tracking-wider border border-lime">
                    Phase 2 / 4
                  </span>
                </div>

                <div className="w-full bg-ink/10 h-1.5 overflow-hidden">
                  <div className="bg-ink h-full w-1/2" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due Oct 28
                  </span>
                  <Link
                    href="/portal"
                    target="_blank"
                    className="text-ink hover:underline flex items-center gap-1 font-bold"
                  >
                    View Portal <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>

              <div className="border border-ink/10 p-4 space-y-3 bg-paper/40">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-xs uppercase text-ink">
                      Vanguard Studio
                    </h3>
                    <p className="text-[11px] text-muted font-medium">
                      Custom Application Architecture
                    </p>
                  </div>
                  <span className="text-[9px] bg-paper text-muted border border-ink/15 px-2 py-0.5 font-bold uppercase tracking-wider">
                    Phase 1 / 4
                  </span>
                </div>

                <div className="w-full bg-ink/10 h-1.5 overflow-hidden">
                  <div className="bg-ink h-full w-1/4" />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Due Nov 12
                  </span>
                  <Link
                    href="/portal"
                    target="_blank"
                    className="text-ink hover:underline flex items-center gap-1 font-bold"
                  >
                    View Portal <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CMS Action Card */}
          <div className="border border-ink/15 bg-ink text-white p-5 sm:p-6 space-y-4 shadow-sm">
            <span className="text-[10px] uppercase tracking-widest text-action font-extrabold">
              PORTFOLIO CMS
            </span>
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-white">
              Publishing Case Studies
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-normal">
              Update imagery, design directions, and client outcomes displayed on the public `/work` showcase.
            </p>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-2 bg-lime text-ink hover:bg-white text-xs font-extrabold uppercase tracking-wider px-4 py-2.5 transition-colors"
            >
              Open Portfolio Editor
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
