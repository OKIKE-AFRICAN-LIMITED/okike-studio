import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FolderDown,
  ExternalLink,
  FileCode,
  Palette,
  FileText,
  Download,
  Layers,
  Plus,
} from "lucide-react";
import { VaultQaWidget } from "@/components/portal/portal-ai-insights";

export const metadata = {
  title: "Deliverables & Asset Vault | OKIKE Studio Client Workspace",
  description: "Direct access to design links, staging environments, and brand archives.",
};

export default async function ClientDeliverablesPage() {
  const supabase = await createClient();

  let deliverables: Array<{
    id: string;
    title: string;
    category: string;
    description: string;
    type: string;
    url: string;
    updated: string;
    isPrimary: boolean;
  }> = [];

  try {
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
        <p className="text-xs text-muted font-medium">
          Verified brand assets, Figma canvases, design tokens, and private staging links delivered by OKIKE Studio.
        </p>
        {deliverables.length > 0 && (
          <Link
            href="/enquiry"
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5 text-action" />
            <span>Request New Asset</span>
          </Link>
        )}
      </div>

      {/* Semantic Vault AI Assistant (Only if deliverables exist) */}
      {deliverables.length > 0 && (
        <VaultQaWidget
          projectName="Client Workspace Project Vault"
          deliverables={deliverables}
        />
      )}

      {/* Grid of Deliverables OR Clean Slate Empty State */}
      {deliverables.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliverables.map((item) => (
            <div
              key={item.id}
              className={`border p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-surface transition-colors shadow-xs ${
                item.isPrimary ? "border-ink hover:border-lime" : "border-ink/15 hover:border-ink"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-paper border border-ink/15 px-2 py-0.5 text-muted tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-muted font-medium">
                    Updated {item.updated}
                  </span>
                </div>

                <div className="pt-1">
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                    {item.title}
                  </h2>
                  <p className="text-xs text-muted leading-relaxed font-normal mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-ink/10">
                <span className="text-[10px] uppercase font-bold text-muted tracking-wider">
                  {item.type}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold text-ink hover:text-action transition-colors"
                >
                  <span>Open Deliverable</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* CLEAN SLATE EMPTY STATE */
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
