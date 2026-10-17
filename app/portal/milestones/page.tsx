import { CheckCircle2, Clock, Calendar, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Milestones & Progress | OKIKE Studio Client Workspace",
  description: "Track project sprints, deliverables, and upcoming milestones.",
};

export default function ClientMilestonesPage() {
  const phases = [
    {
      id: "phase-1",
      number: "01",
      name: "Discovery & Strategic Blueprint",
      timeframe: "Weeks 1 – 2 · Completed",
      status: "completed",
      milestones: [
        { title: "Stakeholder alignment & goals workshop", done: true },
        { title: "Audience archetypes and competitive positioning map", done: true },
        { title: "Technical architecture & content model specification", done: true },
      ],
    },
    {
      id: "phase-2",
      number: "02",
      name: "Identity & Interface Architecture",
      timeframe: "Weeks 3 – 5 · Active Sprint",
      status: "in_progress",
      milestones: [
        { title: "Brandmark explorations & typography pairings", done: true },
        { title: "High-fidelity Figma responsive system (Desktop & Mobile)", done: true },
        { title: "Interactive navigation & micro-motion directions", done: false },
        { title: "Client milestone review & feedback consolidation", done: false },
      ],
    },
    {
      id: "phase-3",
      number: "03",
      name: "High-Fidelity Build & Motion Engineering",
      timeframe: "Weeks 6 – 8 · Scheduled",
      status: "upcoming",
      milestones: [
        { title: "Next.js App Router codebase scaffold & tokens", done: false },
        { title: "GSAP scroll triggers & Lenis smooth animation layer", done: false },
        { title: "Supabase dynamic CMS integration", done: false },
        { title: "Private staging deployment for client review", done: false },
      ],
    },
    {
      id: "phase-4",
      number: "04",
      name: "Quality Assurance, Performance & Launch",
      timeframe: "Weeks 9 – 10 · Scheduled",
      status: "upcoming",
      milestones: [
        { title: "Lighthouse performance, SEO & accessibility audit", done: false },
        { title: "Custom domain DNS hookup and production verification", done: false },
        { title: "Final vector brand kit & CMS editor documentation handover", done: false },
      ],
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="border-b border-ink/15 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-muted">
          Sprint Roadmap &amp; Timeline
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
          Project Milestones
        </h1>
        <p className="text-xs text-muted mt-1 font-medium">
          Complete breakdown of deliverables and sprint phases for Aether Venture Brand &amp; Web.
        </p>
      </div>

      {/* Timeline Phases */}
      <div className="space-y-6">
        {phases.map((phase) => {
          const isCompleted = phase.status === "completed";
          const isInProgress = phase.status === "in_progress";

          return (
            <div
              key={phase.id}
              className={`border p-6 sm:p-8 space-y-5 transition-colors shadow-xs ${
                isInProgress
                  ? "border-2 border-ink bg-surface shadow-md"
                  : isCompleted
                  ? "border-ink/20 bg-surface opacity-95"
                  : "border-dashed border-ink/20 bg-paper/40 opacity-70"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-ink text-white text-xs font-extrabold uppercase tracking-wider px-2 py-0.5">
                    PHASE {phase.number}
                  </span>
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink">
                    {phase.name}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted font-medium flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {phase.timeframe}
                  </span>

                  {isCompleted ? (
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 border border-emerald-300">
                      Completed
                    </span>
                  ) : isInProgress ? (
                    <span className="bg-lime text-ink text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 border border-lime">
                      In Delivery
                    </span>
                  ) : (
                    <span className="bg-paper text-muted text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 border border-ink/10">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              {/* Milestones list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {phase.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 text-xs border ${
                      milestone.done
                        ? "bg-paper/50 border-ink/10 text-ink"
                        : "bg-surface border-ink/10 text-muted"
                    }`}
                  >
                    {milestone.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Clock className="h-4 w-4 text-neutral-400 shrink-0 mt-0.5" />
                    )}
                    <span className={milestone.done ? "font-bold text-ink" : "font-normal"}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
