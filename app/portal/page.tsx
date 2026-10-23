import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  FolderDown,
  FileText,
  Sparkles,
  Send,
  Plus,
  Layers,
  Inbox,
  ShieldCheck,
} from "lucide-react";
import { HandoverRiskBadge, PortalWeeklySummary } from "@/components/portal/portal-ai-insights";

export default async function ClientPortalPage() {
  let clientCompany = "Client Workspace";
  let clientName = "Client Partner";
  let userEmail = "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    userEmail = user.email || "";
    clientName = user.email?.split("@")[0] || "Client Partner";

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, company_name")
        .eq("id", user.id)
        .single();

      if (profile?.company_name) clientCompany = profile.company_name;
      if (profile?.full_name) clientName = profile.full_name;
    } catch {
      // Non-fatal
    }
  }

  // 1. Fetch real active projects for this client from Supabase
  let activeProject = null;
  let phases: Array<{
    index: string;
    title: string;
    status: string;
    description: string;
  }> = [];
  let recentDeliverables: Array<{
    id: string;
    title: string;
    type: string;
    url: string;
    updated: string;
  }> = [];

  try {
    const { data: projects } = await supabase
      .from("client_projects")
      .select("id, name, current_phase, status, start_date, target_completion_date")
      .order("created_at", { ascending: false })
      .limit(1);

    if (projects && projects.length > 0) {
      const p = projects[0];
      activeProject = p;

      const { data: milestonesData } = await supabase
        .from("milestones")
        .select("id, title, description, order_index, status")
        .eq("project_id", p.id)
        .order("order_index", { ascending: true });

      if (milestonesData && milestonesData.length > 0) {
        phases = milestonesData.map((m, idx) => ({
          index: String(idx + 1).padStart(2, "0"),
          title: m.title,
          status: m.status,
          description: m.description || "Milestone specification sign-off and implementation.",
        }));
      }

      const { data: deliverablesData } = await supabase
        .from("deliverables")
        .select("id, title, category, file_url, external_url, created_at")
        .eq("project_id", p.id)
        .order("created_at", { ascending: false })
        .limit(4);

      if (deliverablesData && deliverablesData.length > 0) {
        recentDeliverables = deliverablesData.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.category.toUpperCase(),
          url: d.external_url || d.file_url || "#",
          updated: new Date(d.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }));
      }
    }
  } catch {
    // Database empty clean slate
  }

  // 2. Fetch user's real submitted enquiries from Supabase
  let userEnquiries: Array<{
    id: string;
    services: string[];
    package_selected: string | null;
    budget_range: string | null;
    status: string;
    created_at: string;
    ai_summary?: string | null;
  }> = [];

  try {
    const { data: enquiriesData } = await supabase
      .from("enquiries")
      .select("id, services, package_selected, budget_range, status, created_at, ai_summary")
      .order("created_at", { ascending: false })
      .limit(3);

    if (enquiriesData) {
      userEnquiries = enquiriesData.map((e) => ({
        id: e.id,
        services: Array.isArray(e.services) ? (e.services as string[]) : [],
        package_selected: e.package_selected,
        budget_range: e.budget_range,
        status: e.status,
        created_at: new Date(e.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        ai_summary: e.ai_summary,
      }));
    }
  } catch {
    // Empty enquiries
  }

  const statusPills: Record<string, string> = {
    new: "bg-lime text-ink font-extrabold border border-lime",
    reviewed: "bg-paper text-ink border border-ink/15 font-semibold",
    discovery_scheduled: "bg-purple-100 text-purple-900 border border-purple-300 font-bold",
    proposal_sent: "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
    won: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Active Project View OR Clean Slate Onboarding Hub */}
      {activeProject ? (
        <>
          {/* Active Project Highlight Banner */}
          <div className="border-2 border-ink bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-lime text-ink text-xs font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    {activeProject.current_phase || "Active Phase"}
                  </span>
                  <span className="text-xs text-muted font-bold uppercase tracking-wider">
                    Status: {activeProject.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink mt-2">
                  {activeProject.name}
                </h2>
                <p className="text-xs text-muted mt-1 font-medium">
                  Led by OKIKE Creative &amp; Engineering Team
                  {activeProject.target_completion_date &&
                    ` · Target Handover: ${activeProject.target_completion_date}`}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                <HandoverRiskBadge
                  targetDate={activeProject.target_completion_date || "To be scheduled"}
                  currentSprint={1}
                  totalSprints={phases.length || 4}
                  progressPercent={phases.filter((p) => p.status === "completed").length > 0 ? 50 : 25}
                />
              </div>
            </div>

            {/* Phases Milestone Stepper */}
            {phases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {phases.map((phase) => {
                  const isCompleted = phase.status === "completed";
                  const isInProgress = phase.status === "in_progress";

                  return (
                    <div
                      key={phase.index}
                      className={`p-4 border transition-colors ${
                        isInProgress
                          ? "border-ink bg-paper shadow-sm"
                          : isCompleted
                          ? "border-ink/20 bg-surface opacity-90"
                          : "border-dashed border-ink/15 bg-paper/30 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-muted">
                          {phase.index}
                        </span>
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        ) : isInProgress ? (
                          <span className="flex items-center gap-1 text-[10px] text-ink font-extrabold uppercase tracking-wider bg-lime px-1.5 py-0.5">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-xs uppercase text-ink mb-1.5 tracking-tight">
                        {phase.title}
                      </h3>
                      <p className="text-[11px] text-muted leading-relaxed font-normal">
                        {phase.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Progress Synthesis */}
          <PortalWeeklySummary
            projectName={activeProject.name}
            clientCompany={clientCompany}
            activePhase={activeProject.current_phase || "Active Sprint"}
            sprint="Current Active Sprint"
            progressPercent={50}
            phases={phases}
            deliverables={recentDeliverables}
          />
        </>
      ) : (
        /* CLEAN SLATE ONBOARDING HUB */
        <div className="border-2 border-ink bg-surface p-6 sm:p-10 space-y-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-lime text-ink text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                  Clean Slate Workspace
                </span>
                <span className="text-xs text-muted font-bold uppercase tracking-wider">
                  Ready For Engagement
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
                Welcome to your Private Studio Portal, {clientName}
              </h2>
              <p className="text-xs text-muted font-medium max-w-xl">
                Your client environment is configured and ready. Once you submit a brief or approve a proposal, your live sprint trackers, milestone deliveries, and deliverables vault will activate here.
              </p>
            </div>

            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-5 py-3 text-xs uppercase tracking-wider font-extrabold transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 text-action" />
              <span>Submit Project Brief</span>
            </Link>
          </div>

          {/* Clean Slate Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-ink/15 bg-paper p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 bg-ink flex items-center justify-center text-action">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  1. Scope Your Project
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Use our intelligent scoping assistant to explore options between Starter (₦150k), Business Pro (₦450k), or Custom Software with indicative naira estimates.
                </p>
              </div>
              <Link
                href="/enquiry"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink hover:text-lime-700 pt-2 transition-colors"
              >
                <span>Launch Assistant</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="border border-ink/15 bg-paper p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 bg-ink flex items-center justify-center text-action">
                  <Layers className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  2. Review Studio Offers
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Explore our design systems, high-fidelity GSAP motion implementations, Next.js engineering architecture, and transparent scope boundaries.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink hover:text-lime-700 pt-2 transition-colors"
              >
                <span>Browse Services</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="border border-ink/15 bg-paper p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-9 w-9 bg-ink flex items-center justify-center text-action">
                  <Send className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  3. Direct Studio Advisory
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Have an existing brand deck or Figma file? Email our engineering and design leads directly to schedule a technical alignment call.
                </p>
              </div>
              <a
                href="mailto:studio@okikestudio.com?subject=Strategic Project Consultation"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-ink hover:text-lime-700 pt-2 transition-colors"
              >
                <span>Email Studio Lead</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Deliverables & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shared Deliverables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <div className="flex items-center gap-2">
              <FolderDown className="h-4 w-4 text-ink" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                Deliverables &amp; Shared Assets
              </h2>
            </div>
            <Link
              href="/portal/deliverables"
              className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink flex items-center gap-1 transition-colors"
            >
              <span>View Asset Vault</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recentDeliverables.length > 0 ? (
            <div className="divide-y divide-ink/10 border border-ink/15 bg-surface">
              {recentDeliverables.map((item) => (
                <div
                  key={item.id}
                  className="p-5 hover:bg-paper/50 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold bg-paper border border-ink/15 px-2 py-0.5 text-muted">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-muted font-medium">
                      Updated {item.updated}
                    </p>
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold text-ink hover:text-action transition-colors shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-ink/15 bg-surface p-8 text-center space-y-2 shadow-xs">
              <FolderDown className="h-8 w-8 mx-auto text-ink/20" />
              <p className="font-extrabold text-xs uppercase tracking-wider text-ink">
                No Deliverables Deposited Yet
              </p>
              <p className="text-xs text-muted max-w-sm mx-auto">
                As OKIKE Studio engineers design systems, Figma prototypes, and staging preview URLs, they will be archived here in your vault.
              </p>
            </div>
          )}
        </div>

        {/* Right 1 Col: Proposal & Inquiry History */}
        <div className="space-y-6">
          <div className="border border-ink/15 bg-surface p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-ink" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Recent Inquiries
                </h2>
              </div>
              <Link
                href="/portal/enquiries"
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink"
              >
                View All
              </Link>
            </div>

            {userEnquiries.length > 0 ? (
              <div className="space-y-3">
                {userEnquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 bg-paper border border-ink/10 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-ink uppercase text-[11px]">
                        {inq.package_selected || "Bespoke Scope"}
                      </span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 tracking-wider ${
                          statusPills[inq.status] || "bg-neutral-200 text-neutral-800"
                        }`}
                      >
                        {inq.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted">
                      {inq.services.join(", ") || "Web & Digital Product"} · Submitted {inq.created_at}
                    </p>
                    {inq.ai_summary && (
                      <p className="text-[10px] text-ink/80 italic line-clamp-2 pt-0.5">
                        &quot;{inq.ai_summary}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2 text-muted">
                <Inbox className="h-6 w-6 mx-auto text-ink/20" />
                <p className="text-xs font-bold text-ink uppercase tracking-wider">
                  No Inbound Inquiries
                </p>
                <p className="text-[11px]">
                  Submit your first project brief to begin scoping.
                </p>
              </div>
            )}

            <div className="pt-2">
              <Link
                href="/enquiry"
                className="block text-center border border-ink/20 py-2.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink hover:bg-paper transition-colors"
              >
                Submit New Scope / Add-on +
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
