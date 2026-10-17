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
  Layers,
  Send,
} from "lucide-react";

export default async function ClientPortalPage() {
  let clientCompany = "Aether Dynamics";
  let clientName = "Alexander Wright";

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, company_name")
        .eq("id", user.id)
        .single();

      if (profile?.company_name) clientCompany = profile.company_name;
      if (profile?.full_name) clientName = profile.full_name;
    }
  } catch {
    // Development fallback
  }

  const phases = [
    {
      index: "01",
      title: "Discovery & Strategic Blueprint",
      status: "completed",
      description: "Audience research, positioning architecture, and technical requirements sign-off.",
    },
    {
      index: "02",
      title: "Identity & Interface Architecture",
      status: "in_progress",
      description: "Design systems, typography pairings, wireframes, and high-fidelity screen explorations.",
    },
    {
      index: "03",
      title: "High-Fidelity Build & Motion",
      status: "upcoming",
      description: "Next.js App Router engineering, GSAP animations, responsive polish, and CMS integration.",
    },
    {
      index: "04",
      title: "Quality, Performance & Launch",
      status: "upcoming",
      description: "Cross-device verification, lighthouse performance audits, SEO checks, and production deployment.",
    },
  ];

  const recentDeliverables = [
    {
      id: "deliv-1",
      title: "Figma Interactive Design Canvas",
      type: "Figma Link",
      url: "https://figma.com",
      updated: "Yesterday",
    },
    {
      id: "deliv-2",
      title: "Brand Strategy & Positioning Deck (v1.2)",
      type: "PDF Document",
      url: "#",
      updated: "Oct 12, 2026",
    },
    {
      id: "deliv-3",
      title: "Staging Preview Environment",
      type: "Vercel Preview",
      url: "https://okikestudio.com",
      updated: "Oct 10, 2026",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Client Workspace · {clientCompany}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            Project Pulse
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Active engagement tracking, milestone delivery, and shared assets for {clientName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/deliverables"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-action hover:text-ink px-4 py-2.5 text-xs uppercase tracking-wider font-extrabold transition-colors"
          >
            <FolderDown className="h-3.5 w-3.5" />
            Asset Vault
          </Link>
          <a
            href="mailto:studio@okikestudio.com?subject=Project Check-in"
            className="inline-flex items-center gap-2 bg-paper border border-ink/20 hover:bg-ink hover:text-white px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Contact Studio
          </a>
        </div>
      </div>

      {/* Active Project Highlight Banner */}
      <div className="border-2 border-ink bg-surface p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-lime text-ink text-xs font-extrabold px-2 py-0.5 uppercase tracking-wider">
                Phase 2 In Progress
              </span>
              <span className="text-xs text-muted font-bold uppercase tracking-wider">
                Sprint 3 of 6
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink mt-2">
              Venture Identity &amp; Digital Flagship Experience
            </h2>
            <p className="text-xs text-muted mt-1 font-medium">
              Led by OKIKE Creative &amp; Engineering Team · Target Handover: Nov 15, 2026
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted font-bold uppercase tracking-wider">
              Sprint Progress:
            </span>
            <span className="text-xl font-extrabold text-ink">50%</span>
          </div>
        </div>

        {/* 4 Phases Milestone Stepper */}
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
      </div>

      {/* Two Column Layout: Deliverables & Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shared Deliverables */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-ink/15 pb-3">
            <div className="flex items-center gap-2">
              <FolderDown className="h-4 w-4 text-ink" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                Latest Deliverables &amp; Shared Links
              </h2>
            </div>
            <Link
              href="/portal/deliverables"
              className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink flex items-center gap-1 transition-colors"
            >
              <span>View All Files</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

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
        </div>

        {/* Right 1 Col: Proposal & Inquiry History */}
        <div className="space-y-6">
          <div className="border border-ink/15 bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink">
                Contracted Scope
              </h2>
              <Link
                href="/portal/enquiries"
                className="text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink"
              >
                Inquiries
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                  Agreed Package
                </span>
                <span className="font-bold text-ink text-sm">
                  Business Pro + Custom Motion
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                  Contract Status
                </span>
                <span className="text-emerald-700 font-extrabold uppercase">
                  ✓ Signed &amp; Active
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                  Studio Lead
                </span>
                <span className="text-ink font-medium">Kenechukwu &amp; Team</span>
              </div>
            </div>

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
