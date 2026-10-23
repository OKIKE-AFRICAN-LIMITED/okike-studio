import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Clock, Calendar, Layers, Plus } from "lucide-react";

export const metadata = {
  title: "Milestones & Progress | OKIKE Studio Client Workspace",
  description: "Track project sprints, deliverables, and upcoming milestones.",
};

export default async function ClientMilestonesPage() {
  const supabase = await createClient();

  let activeProject: { name: string; current_phase: string } | null = null;
  let milestones: Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
    order_index: number;
  }> = [];

  try {
    const { data: projects } = await supabase
      .from("client_projects")
      .select("id, name, current_phase")
      .order("created_at", { ascending: false })
      .limit(1);

    if (projects && projects.length > 0) {
      const p = projects[0];
      activeProject = {
        name: p.name,
        current_phase: p.current_phase,
      };

      const { data: milestonesData } = await supabase
        .from("milestones")
        .select("id, title, description, status, due_date, order_index")
        .eq("project_id", p.id)
        .order("order_index", { ascending: true });

      if (milestonesData) {
        milestones = milestonesData;
      }
    }
  } catch {
    // Clean slate fallback
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <p className="text-xs text-muted font-medium">
          {activeProject
            ? `Delivery phases and verification tickets for ${activeProject.name}`
            : "Sequential sprint breakdown and technical deliverables for your workspace."}
        </p>
        {milestones.length > 0 && (
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-action" />
            <span>Scope Expansion</span>
          </Link>
        )}
      </div>

      {/* Real Milestones OR Clean Slate State */}
      {milestones.length > 0 ? (
        <div className="space-y-6">
          <div className="divide-y divide-ink/10 border border-ink/15 bg-surface">
            {milestones.map((m, idx) => {
              const isCompleted = m.status === "completed";
              const isInProgress = m.status === "in_progress";

              return (
                <div
                  key={m.id}
                  className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-paper/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold font-mono text-muted">
                        Phase {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-sm font-extrabold uppercase text-ink">
                        {m.title}
                      </h2>
                    </div>
                    {m.description && (
                      <p className="text-xs text-muted max-w-xl font-normal">
                        {m.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {m.due_date && (
                      <span className="text-[11px] text-muted flex items-center gap-1 font-medium">
                        <Calendar className="h-3 w-3" /> Due {m.due_date}
                      </span>
                    )}

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                        <CheckCircle2 className="h-3 w-3" /> Done
                      </span>
                    ) : isInProgress ? (
                      <span className="inline-flex items-center gap-1 bg-lime text-ink border border-lime text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                        <Clock className="h-3 w-3" /> In Sprint
                      </span>
                    ) : (
                      <span className="bg-paper border border-ink/15 text-muted text-[10px] font-bold uppercase px-2 py-0.5 tracking-wider">
                        Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CLEAN SLATE EMPTY STATE */
        <div className="border-2 border-dashed border-ink/20 bg-surface p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 border border-ink/15 bg-paper flex items-center justify-center mx-auto text-muted">
            <Layers className="h-6 w-6 text-ink/30" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              No Active Milestones Scheduled
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your milestone delivery schedule will be generated automatically when a project proposal is accepted and initiated by the studio team.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs uppercase tracking-wider font-extrabold transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-action" />
              <span>Submit Project Scope</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
