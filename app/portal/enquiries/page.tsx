import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FileText, ArrowRight, CheckCircle2, Clock, Plus, Inbox, Sparkles } from "lucide-react";

export const metadata = {
  title: "My Inquiries & Proposals | OKIKE Studio Client Workspace",
  description: "Track submitted project briefs, review proposals, and scope definitions.",
};

export default async function ClientEnquiriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let inquiries: Array<{
    id: string;
    services: string[];
    package_selected: string | null;
    scope_answers: Record<string, string>;
    budget_range: string | null;
    timeline: string | null;
    status: string;
    created_at: string;
    ai_summary?: string | null;
    ai_recommended_package?: string | null;
  }> = [];

  try {
    const { data } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      inquiries = data.map((item) => ({
        id: item.id,
        services: Array.isArray(item.services) ? (item.services as string[]) : [],
        package_selected: item.package_selected,
        scope_answers: (item.scope_answers || {}) as Record<string, string>,
        budget_range: item.budget_range,
        timeline: item.timeline,
        status: item.status,
        created_at: new Date(item.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        ai_summary: item.ai_summary,
        ai_recommended_package: item.ai_recommended_package,
      }));
    }
  } catch {
    // Clean slate fallback
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <p className="text-xs text-muted font-medium">
          Historical records of briefs submitted to OKIKE Studio, pricing scopes, and contract states.
        </p>
        {inquiries.length > 0 && (
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-action" />
            <span>Submit New Brief</span>
          </Link>
        )}
      </div>

      {/* Inquiries List OR Clean Slate Empty State */}
      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold font-mono">
                    Brief Ref: {inq.id.slice(0, 8)} · Submitted {inq.created_at}
                  </span>
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink mt-0.5">
                    {inq.package_selected
                      ? inq.package_selected.replace("-", " ")
                      : "Bespoke Digital Scope"}
                  </h2>
                </div>

                <span
                  className={`text-xs uppercase px-2.5 py-1 font-extrabold tracking-wider self-start sm:self-auto border ${
                    statusPills[inq.status] || "bg-neutral-200 text-neutral-800"
                  }`}
                >
                  Status: {inq.status.replace("_", " ")}
                </span>
              </div>

              {/* Inquiry Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                    Services
                  </span>
                  <span className="font-bold text-ink">
                    {inq.services.join(", ") || "Web / Brand"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                    Budget Bracket
                  </span>
                  <span className="font-bold text-ink">
                    {inq.budget_range || "To be confirmed"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                    Target Timeline
                  </span>
                  <span className="font-bold text-ink">
                    {inq.timeline || "Standard studio sprint"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider font-bold block">
                    Studio Lead
                  </span>
                  <span className="font-medium text-ink">
                    OKIKE Engineering
                  </span>
                </div>
              </div>

              {/* AI Triage Brief */}
              {inq.ai_summary && (
                <div className="border border-ink/10 bg-paper p-3 text-xs text-ink/90 flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-ink shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block mb-0.5">
                      Synthesized Brief Summary
                    </span>
                    <p className="font-medium">{inq.ai_summary}</p>
                  </div>
                </div>
              )}

              {/* Scope Answers */}
              {Object.keys(inq.scope_answers).length > 0 && (
                <div className="bg-paper/40 border border-ink/10 p-4 space-y-2 text-xs">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">
                    Submitted Scope Specification
                  </span>
                  {Object.entries(inq.scope_answers).map(([key, value]) => (
                    <div key={key} className="space-y-0.5">
                      <span className="text-[10px] font-bold text-muted uppercase">
                        {key}
                      </span>
                      <p className="text-ink text-xs">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* CLEAN SLATE EMPTY STATE */
        <div className="border-2 border-dashed border-ink/20 bg-surface p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 border border-ink/15 bg-paper flex items-center justify-center mx-auto text-muted">
            <Inbox className="h-6 w-6 text-ink/30" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              No Inquiries or Proposals Yet
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your inquiry history is clean. Once you submit a project brief through our intake flow, your scope, quotes, and contract status will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs uppercase tracking-wider font-extrabold transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-action" />
              <span>Submit Your First Brief</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
