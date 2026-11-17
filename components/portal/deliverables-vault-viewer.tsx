"use client";

import { useState, useMemo } from "react";
import {
  FolderDown,
  ExternalLink,
  Search,
  X,
  MessageSquarePlus,
  CheckCircle2,
  FileCode,
  Palette,
  FileText,
  Layers,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { FeedbackModal } from "@/components/portal/feedback-modal";
import { StagingHealthWidget } from "@/components/portal/staging-health-widget";

export interface DeliverableItem {
  id: string;
  title: string;
  category: string; // e.g. "BRAND", "FIGMA", "STAGING", "CODE", "DOCUMENT", "ASSET"
  description: string;
  type: string;
  url: string;
  updated: string;
  isPrimary: boolean;
}

interface DeliverablesVaultViewerProps {
  deliverables: DeliverableItem[];
  projectName?: string;
  projectId?: string;
  stagingUrl?: string;
}

const CATEGORY_TABS = [
  { id: "ALL", label: "All Assets", icon: Layers },
  { id: "BRAND", label: "Brand Identity", icon: Palette },
  { id: "FIGMA", label: "Figma Canvases", icon: SlidersHorizontal },
  { id: "STAGING", label: "Staging Links", icon: Globe },
  { id: "CODE", label: "Source Code", icon: FileCode },
  { id: "DOCUMENT", label: "Documents & Decks", icon: FileText },
  { id: "ASSET", label: "Exported Assets", icon: FolderDown },
];

export function DeliverablesVaultViewer({
  deliverables,
  projectName = "Active Project Workspace",
  projectId,
  stagingUrl,
}: DeliverablesVaultViewerProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForFeedback, setSelectedForFeedback] = useState<DeliverableItem | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: deliverables.length };
    for (const d of deliverables) {
      const cat = d.category.toUpperCase();
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [deliverables]);

  // Filtered deliverables
  const filteredList = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return deliverables.filter((item) => {
      const matchesCategory =
        activeCategory === "ALL" || item.category.toUpperCase() === activeCategory;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [deliverables, activeCategory, searchQuery]);

  // Check if staging item exists in deliverables
  const detectedStagingUrl =
    stagingUrl ||
    deliverables.find((d) => d.category.toUpperCase() === "STAGING")?.url ||
    "https://studio.okikeenterprises.com";

  return (
    <div className="space-y-8 font-sans">
      {/* Staging Health Banner */}
      <StagingHealthWidget
        stagingUrl={detectedStagingUrl}
        projectName={projectName}
        projectId={projectId}
      />

      {/* Vault Search and Filters Bar */}
      <div className="space-y-4 border border-ink/15 bg-surface p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 bg-ink text-white flex items-center justify-center">
              <FolderDown className="h-4 w-4 text-action" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-tight text-ink">
                Deliverables &amp; Asset Vault
              </h2>
              <p className="text-[11px] text-muted">
                Showing {filteredList.length} of {deliverables.length} verified studio assets
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables, tokens..."
              className="w-full border border-ink/20 bg-paper pl-8 pr-8 py-2 text-xs text-ink placeholder:text-muted/70 focus:border-ink focus:ring-1 focus:ring-ink outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-muted hover:text-ink cursor-pointer"
                aria-label="Clear Search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-ink/10">
          {CATEGORY_TABS.map((tab) => {
            const count = categoryCounts[tab.id] || 0;
            const isSelected = activeCategory === tab.id;
            const Icon = tab.icon;

            // Only show category pills that have assets or if it's the ALL tab
            if (tab.id !== "ALL" && count === 0) return null;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-ink text-white border-ink shadow-2xs"
                    : "border-ink/15 bg-paper text-muted hover:border-ink/40 hover:text-ink"
                }`}
              >
                <Icon className={`h-3 w-3 ${isSelected ? "text-action" : "text-muted"}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-xs font-mono ml-0.5 ${
                    isSelected ? "bg-lime text-ink" : "bg-ink/10 text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deliverables Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`border p-6 flex flex-col justify-between space-y-5 bg-surface transition-all shadow-xs ${
                item.isPrimary
                  ? "border-2 border-ink hover:border-lime ring-1 ring-ink/10"
                  : "border border-ink/15 hover:border-ink"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase bg-paper border border-ink/15 px-2 py-0.5 text-muted tracking-wider">
                      {item.category}
                    </span>
                    {item.isPrimary && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 tracking-wider">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        Approved Final
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-muted font-medium font-mono">
                    Updated {item.updated}
                  </span>
                </div>

                <div className="pt-1">
                  <h3 className="text-base font-extrabold uppercase tracking-tight text-ink">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed font-normal mt-1.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-ink/10 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedForFeedback(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer"
                >
                  <MessageSquarePlus className="h-3.5 w-3.5 text-action" />
                  <span>Request Revision / Note</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-lime hover:text-ink px-3 py-1.5 text-xs uppercase font-extrabold transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Open Asset</span>
                  <ExternalLink className="h-3 w-3 text-action" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="border-2 border-dashed border-ink/20 bg-surface p-10 text-center space-y-4 shadow-xs">
          <div className="h-10 w-10 border border-ink/15 bg-paper flex items-center justify-center mx-auto text-muted">
            <Search className="h-5 w-5 text-muted" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-ink">
              No Deliverables Match Your Filter
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              We couldn&apos;t find any assets matching &quot;{searchQuery}&quot; under the &quot;{activeCategory}&quot; category.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveCategory("ALL");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {selectedForFeedback && (
        <FeedbackModal
          isOpen={Boolean(selectedForFeedback)}
          onClose={() => setSelectedForFeedback(null)}
          deliverableId={selectedForFeedback.id}
          deliverableTitle={selectedForFeedback.title}
          projectId={projectId}
          projectName={projectName}
        />
      )}
    </div>
  );
}
