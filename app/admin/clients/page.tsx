import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
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
  let activeClients: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    project: string;
    phase: string;
    phaseIndex: number;
    totalPhases: number;
    startDate: string;
    targetDate: string;
    deliverablesCount: number;
    status: string;
  }> = [];

  try {
    const supabase = await createClient();
    const { data: projects } = await supabase
      .from("client_projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (projects && projects.length > 0) {
      activeClients = projects.map((p) => ({
        id: p.id,
        name: "Client Partner",
        company: p.name || "Company",
        email: "client@workspace.com",
        project: p.name || "Studio Project",
        phase: p.current_phase || "Phase 1: Discovery & Strategic Blueprint",
        phaseIndex: 1,
        totalPhases: 4,
        startDate: p.start_date
          ? new Date(p.start_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : new Date(p.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
        targetDate: p.target_completion_date
          ? new Date(p.target_completion_date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "TBD",
        deliverablesCount: 0,
        status: p.status || "active",
      }));
    }
  } catch {
    // Graceful clean slate fallback
  }

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

      {/* Client Engagements List / Clean State */}
      {activeClients.length === 0 ? (
        <div className="border border-ink/15 bg-surface p-12 text-center space-y-4 shadow-xs">
          <div className="mx-auto w-12 h-12 border border-ink/10 flex items-center justify-center bg-paper text-muted">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              No Active Client Spaces
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto">
              Your client database is currently empty. When an inquiry is accepted or a project is assigned to a client, their private workspace will appear here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-2 bg-paper hover:bg-ink hover:text-white border border-ink/20 px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors shadow-xs"
            >
              View Inbound Pipeline
            </Link>
          </div>
        </div>
      ) : (
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
                    <span className="text-ink font-bold">{client.name}</span>{" "}
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
      )}
    </div>
  );
}
