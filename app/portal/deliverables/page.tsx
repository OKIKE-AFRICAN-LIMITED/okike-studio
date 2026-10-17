import {
  FolderDown,
  ExternalLink,
  FileCode,
  Palette,
  FileText,
  Download,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Deliverables & Asset Vault | OKIKE Studio Client Workspace",
  description: "Direct access to design links, staging environments, and brand archives.",
};

export default function ClientDeliverablesPage() {
  const deliverables = [
    {
      id: "figma-board",
      title: "Interactive Figma Master Workspace",
      category: "Design System",
      icon: Palette,
      description: "Complete component tokens, mobile/desktop artboards, and user flow wireframes.",
      type: "External URL",
      url: "https://figma.com",
      updated: "Oct 13, 2026",
      isPrimary: true,
    },
    {
      id: "brand-deck",
      title: "Brand Strategy & Positioning Manual (v1.2)",
      category: "Strategy & Documents",
      icon: FileText,
      description: "Audience narrative, voice & tone pillars, typographic scale rules, and clear space guides.",
      type: "PDF Document (14.2 MB)",
      url: "#",
      updated: "Oct 12, 2026",
      isPrimary: false,
    },
    {
      id: "staging-site",
      title: "Staging Preview Environment",
      category: "Interactive Prototype",
      icon: Layers,
      description: "Password-protected deployment of the live Next.js application with GSAP motion layers.",
      type: "Vercel Preview",
      url: "https://okikestudio.com",
      updated: "Oct 10, 2026",
      isPrimary: true,
    },
    {
      id: "vector-pack",
      title: "Primary & Secondary Vector Logo Pack",
      category: "Brand Assets",
      icon: FolderDown,
      description: "SVG, EPS, and high-resolution PNG variations in light, dark, and monochromatic schemes.",
      type: "ZIP Archive (8.4 MB)",
      url: "#",
      updated: "Oct 08, 2026",
      isPrimary: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-ink/15 pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-muted">
          Artifacts & Repository
        </span>
        <h1 className="text-heading-md font-bold uppercase tracking-tight text-ink mt-1">
          Deliverables & Asset Vault
        </h1>
        <p className="text-xs text-muted mt-1">
          Verified brand assets, Figma canvases, and private staging links delivered by OKIKE Studio.
        </p>
      </div>

      {/* Grid of Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {deliverables.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`border p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-surface transition-colors ${
                item.isPrimary ? "border-ink hover:border-action" : "border-ink/15 hover:border-ink"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase bg-paper border border-ink/15 px-2 py-0.5 text-muted tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-muted">
                    Updated {item.updated}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="p-2 bg-paper border border-ink/10 text-ink shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm uppercase text-ink">
                      {item.title}
                    </h2>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-medium">
                  {item.type}
                </span>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase font-bold tracking-wider transition-colors ${
                    item.isPrimary
                      ? "bg-ink text-white hover:bg-action hover:text-ink"
                      : "bg-paper border border-ink/20 hover:bg-ink hover:text-white"
                  }`}
                >
                  <span>{item.type.includes("ZIP") || item.type.includes("PDF") ? "Download" : "Launch"}</span>
                  {item.type.includes("ZIP") || item.type.includes("PDF") ? (
                    <Download className="h-3 w-3" />
                  ) : (
                    <ExternalLink className="h-3 w-3" />
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
