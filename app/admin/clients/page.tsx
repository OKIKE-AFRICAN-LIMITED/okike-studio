import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  FolderDown,
  Layers,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Client Spaces | Studio Admin | OKIKE Studio",
  description: "Manage client accounts, project spaces, phases, and assets.",
};

export default async function AdminClientsPage() {
  const activeClients = [
    {
      id: "client-01",
      name: "Alexander Wright",
      company: "Aether Dynamics",
      email: "alexander@aether.io",
      project: "Aether Venture Brand & Web Experience",
      phase: "Phase 2: Identity & Interface Architecture",
      phaseIndex: 2,
      totalPhases: 4,
      startDate: "Oct 01, 2026",
      targetDate: "Nov 15, 2026",
      deliverablesCount: 4,
      status: "active",
    },
    {
      id: "client-02",
      name: "Elena Rostova",
      company: "Vanguard Studio",
      email: "elena@vanguard.design",
      project: "Proprietary Asset Collaboration Platform",
      phase: "Phase 1: Discovery & Strategic Blueprint",
      phaseIndex: 1,
      totalPhases: 4,
      startDate: "Oct 10, 2026",
      targetDate: "Dec 05, 2026",
      deliverablesCount: 2,
      status: "active",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Client Portfolio &amp; Workspaces
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            Client Spaces
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Oversee active client engagements, project milestones, and client portal access.
          </p>
        </div>

        <Link
          href="/portal"
          target="_blank"
          className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Preview Client Portal
        </Link>
      </div>

      {/* Client Engagements List */}
      <div className="grid grid-cols-1 gap-6">
        {activeClients.map((client) => (
          <div
            key={client.id}
            className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink">
                    {client.company}
                  </h2>
                  <span className="text-[10px] uppercase bg-lime text-ink px-2.5 py-0.5 font-extrabold tracking-wider border border-lime">
                    Active Engagement
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 font-medium">
                  Primary Contact:{" "}
                  <span className="text-ink font-bold">
                    {client.name}
                  </span>{" "}
                  ({client.email})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/portal"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold text-ink hover:text-action transition-colors"
                >
                  <span>Open Client Portal</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-paper/40 border border-ink/10 p-4 text-xs">
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Project Name
                </span>
                <span className="font-extrabold text-ink">{client.project}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Current Studio Phase
                </span>
                <span className="font-bold text-ink">{client.phase}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Engagement Window
                </span>
                <span className="text-ink font-medium">
                  {client.startDate} → {client.targetDate}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Published Deliverables
                </span>
                <span className="font-extrabold text-ink">
                  {client.deliverablesCount} Assets Available
                </span>
              </div>
            </div>

            {/* Phase Progression */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase text-muted font-bold tracking-wider">
                  Progression ({client.phaseIndex} of {client.totalPhases} Phases)
                </span>
                <span className="font-extrabold text-ink">
                  {Math.round((client.phaseIndex / client.totalPhases) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-ink/10 h-2 overflow-hidden">
                <div
                  className="bg-ink h-full transition-all duration-500"
                  style={{
                    width: `${(client.phaseIndex / client.totalPhases) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
