import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FolderDown, Plus } from "lucide-react";
import { VaultQaWidget } from "@/components/portal/portal-ai-insights";
import {
  DeliverablesVaultViewer,
  type DeliverableItem,
} from "@/components/portal/deliverables-vault-viewer";

export const metadata = {
  title: "Deliverables & Asset Vault | OKIKE Studio Client Workspace",
  description: "Direct access to design links, staging environments, and brand archives.",
};

export default async function ClientDeliverablesPage() {
  const supabase = await createClient();

  let deliverables: DeliverableItem[] = [];
  let projectName = "Client Workspace Project Vault";
  let projectId: string | undefined;

  try {
    const { data: projectData } = await supabase
      .from("client_projects")
      .select("id, name")
      .order("created_at", { ascending: false })
      .limit(1);

    if (projectData && projectData.length > 0) {
      projectName = projectData[0].name;
      projectId = projectData[0].id;
    }

    const { data } = await supabase
      .from("deliverables")
      .select("id, title, category, file_url, external_url, notes, is_final, created_at")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      deliverables = data.map((d) => ({
        id: d.id,
        title: d.title,
        category: d.category.toUpperCase(),
        description: d.notes || "Production deliverable sign-off document.",
        type: d.external_url ? "External Link" : "File Asset",
        url: d.external_url || d.file_url || "#",
        updated: new Date(d.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        isPrimary: Boolean(d.is_final),
      }));
    }
  } catch {
    // Clean slate fallback
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-ink">
            Deliverables &amp; Asset Vault
          </h1>
          <p className="text-xs text-muted font-medium mt-0.5">
            Verified brand assets, Figma canvases, design tokens, and private staging links delivered by OKIKE Studio.
          </p>
        </div>

        {deliverables.length > 0 && (
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5 text-action" />
            <span>Request New Asset</span>
          </Link>
        )}
      </div>

      {deliverables.length > 0 ? (
        <>
          {/* Semantic Vault AI Assistant */}
          <VaultQaWidget projectName={projectName} deliverables={deliverables} />

          {/* Interactive Vault Viewer (Filters, Search, Staging Health, Feedback Modal) */}
          <DeliverablesVaultViewer
            deliverables={deliverables}
            projectName={projectName}
            projectId={projectId}
          />
        </>
      ) : (
        /* Clean Slate Empty State */
        <div className="border-2 border-dashed border-ink/20 bg-surface p-12 text-center space-y-4 shadow-xs">
          <div className="h-12 w-12 border border-ink/15 bg-paper flex items-center justify-center mx-auto text-muted">
            <FolderDown className="h-6 w-6 text-ink/30" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              Your Deliverables Vault is Clean
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              As OKIKE Studio engineers design tokens, vector brand packages, interactive prototypes, and production deployments, they will be archived here for instant client access.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/enquiry"
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs uppercase tracking-wider font-extrabold transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5 text-action" />
              <span>Initiate Project Scope</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
