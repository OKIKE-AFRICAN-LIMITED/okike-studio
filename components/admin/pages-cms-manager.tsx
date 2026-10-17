"use client";

import { useState } from "react";
import Link from "next/link";
import {
  defaultHomePageContent,
  defaultServicesPageContent,
  defaultStudioPageContent,
  defaultSiteSettingsContent,
  type HomePageContent,
  type ServicesPageContent,
  type StudioPageContent,
  type SiteSettingsContent,
} from "@/lib/cms-defaults";
import {
  Save,
  RotateCcw,
  ExternalLink,
  Globe,
  Layout,
  Briefcase,
  Layers,
  Settings,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";

interface PagesCmsManagerProps {
  initialHome: HomePageContent;
  initialServices: ServicesPageContent;
  initialStudio: StudioPageContent;
  initialSettings: SiteSettingsContent;
}

export function PagesCmsManager({
  initialHome,
  initialServices,
  initialStudio,
  initialSettings,
}: PagesCmsManagerProps) {
  const [activeTab, setActiveTab] = useState<"home" | "services" | "studio" | "settings">("home");

  // State for all pages
  const [home, setHome] = useState<HomePageContent>(initialHome || defaultHomePageContent);
  const [services, setServices] = useState<ServicesPageContent>(initialServices || defaultServicesPageContent);
  const [studio, setStudio] = useState<StudioPageContent>(initialStudio || defaultStudioPageContent);
  const [settings, setSettings] = useState<SiteSettingsContent>(initialSettings || defaultSiteSettingsContent);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveCurrent = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    let pageKey = activeTab;
    let payload: Record<string, unknown> = {};

    if (activeTab === "home") payload = home as unknown as Record<string, unknown>;
    if (activeTab === "services") payload = services as unknown as Record<string, unknown>;
    if (activeTab === "studio") payload = studio as unknown as Record<string, unknown>;
    if (activeTab === "settings") payload = settings as unknown as Record<string, unknown>;

    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageKey, content: payload }),
      });

      const res = await response.json();
      if (!response.ok || res.error) {
        throw new Error(res.error || "Failed to save CMS changes");
      }

      setSaveMessage({
        type: "success",
        text: `${activeTab.toUpperCase()} content saved and published to public site!`,
      });

      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving content";
      setSaveMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    const confirmReset = window.confirm(
      `Are you sure you want to reset ${activeTab.toUpperCase()} back to default studio typography and copy?`
    );
    if (!confirmReset) return;

    if (activeTab === "home") setHome({ ...defaultHomePageContent });
    if (activeTab === "services") setServices({ ...defaultServicesPageContent });
    if (activeTab === "studio") setStudio({ ...defaultStudioPageContent });
    if (activeTab === "settings") setSettings({ ...defaultSiteSettingsContent });

    setSaveMessage({
      type: "success",
      text: `Reset ${activeTab} to default copy. Click "Save & Publish Changes" to apply.`,
    });
  };

  const getPublicLink = () => {
    if (activeTab === "home") return "/";
    if (activeTab === "services") return "/services";
    if (activeTab === "studio") return "/studio";
    return "/";
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Public Content Management
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            Pages CMS
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Edit headlines, editorial copy, calls to action, and studio principles across all public pages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={getPublicLink()}
            target="_blank"
            className="inline-flex items-center gap-1.5 border border-ink/15 bg-paper hover:bg-ink hover:text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview Page</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5 text-action" />
            <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {saveMessage && (
        <div
          className={`p-4 text-xs font-bold uppercase tracking-wider border flex items-center justify-between gap-3 ${
            saveMessage.type === "success"
              ? "bg-emerald-50 border-emerald-300 text-emerald-900"
              : "bg-red-50 border-red-300 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {saveMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-700 shrink-0" />
            )}
            <span>{saveMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveMessage(null)}
            className="text-[10px] underline uppercase tracking-wider cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs for Pages */}
      <div className="flex border-b border-ink/15 overflow-x-auto bg-surface">
        <button
          type="button"
          onClick={() => {
            setActiveTab("home");
            setSaveMessage(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "home"
              ? "border-ink text-ink bg-paper/50"
              : "border-transparent text-muted hover:text-ink hover:bg-paper/20"
          }`}
        >
          <Layout className="h-4 w-4 text-action" />
          <span>Home Page (/)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("services");
            setSaveMessage(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "services"
              ? "border-ink text-ink bg-paper/50"
              : "border-transparent text-muted hover:text-ink hover:bg-paper/20"
          }`}
        >
          <Briefcase className="h-4 w-4 text-action" />
          <span>Services Page (/services)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("studio");
            setSaveMessage(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "studio"
              ? "border-ink text-ink bg-paper/50"
              : "border-transparent text-muted hover:text-ink hover:bg-paper/20"
          }`}
        >
          <Layers className="h-4 w-4 text-action" />
          <span>Studio Page (/studio)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("settings");
            setSaveMessage(null);
          }}
          className={`flex items-center gap-2 px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === "settings"
              ? "border-ink text-ink bg-paper/50"
              : "border-transparent text-muted hover:text-ink hover:bg-paper/20"
          }`}
        >
          <Settings className="h-4 w-4 text-action" />
          <span>Global Settings</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: HOME PAGE EDITOR */}
      {/* ============================================================== */}
      {activeTab === "home" && (
        <div className="space-y-8">
          {/* Section: Hero */}
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                  Top Hero Section
                </span>
                <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                  Hero Headline &amp; Positioning
                </h2>
              </div>
              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                Home 01
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Eyebrow Left
                </label>
                <input
                  type="text"
                  value={home.hero.eyebrowLeft}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, eyebrowLeft: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Eyebrow Right
                </label>
                <input
                  type="text"
                  value={home.hero.eyebrowRight}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, eyebrowRight: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={home.hero.headingLine1}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, headingLine1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs uppercase font-extrabold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={home.hero.headingLine2}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, headingLine2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs uppercase font-extrabold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 3
                </label>
                <input
                  type="text"
                  value={home.hero.headingLine3}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, headingLine3: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs uppercase font-extrabold text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Hero Narrative Statement
              </label>
              <textarea
                rows={2}
                value={home.hero.description}
                onChange={(e) =>
                  setHome({
                    ...home,
                    hero: { ...home.hero, description: e.target.value },
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-ink/10">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Primary Action Button Label
                </label>
                <input
                  type="text"
                  value={home.hero.primaryCtaText}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, primaryCtaText: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Secondary Action Button Label
                </label>
                <input
                  type="text"
                  value={home.hero.secondaryCtaText}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      hero: { ...home.hero, secondaryCtaText: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
                />
              </div>
            </div>
          </div>

          {/* Section: Systems First */}
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Philosophy Section
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Systems First &amp; Core Disciplines
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={home.systemsFirst.headingLine1}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      systemsFirst: {
                        ...home.systemsFirst,
                        headingLine1: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={home.systemsFirst.headingLine2}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      systemsFirst: {
                        ...home.systemsFirst,
                        headingLine2: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Systems Philosophy Narrative
              </label>
              <textarea
                rows={2}
                value={home.systemsFirst.description}
                onChange={(e) =>
                  setHome({
                    ...home,
                    systemsFirst: {
                      ...home.systemsFirst,
                      description: e.target.value,
                    },
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-ink/10">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                  Discipline 1 Description
                </span>
                <textarea
                  rows={3}
                  value={home.systemsFirst.discipline1Desc}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      systemsFirst: {
                        ...home.systemsFirst,
                        discipline1Desc: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-2.5 text-xs text-ink"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                  Discipline 2 Description
                </span>
                <textarea
                  rows={3}
                  value={home.systemsFirst.discipline2Desc}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      systemsFirst: {
                        ...home.systemsFirst,
                        discipline2Desc: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-2.5 text-xs text-ink"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                  Discipline 3 Description
                </span>
                <textarea
                  rows={3}
                  value={home.systemsFirst.discipline3Desc}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      systemsFirst: {
                        ...home.systemsFirst,
                        discipline3Desc: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-2.5 text-xs text-ink"
                />
              </div>
            </div>
          </div>

          {/* Section: Closing CTA */}
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Bottom Closing Call to Action
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Closing Banner (Lime Section)
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Masthead Prompt
                </label>
                <input
                  type="text"
                  value={home.closingCta.masthead}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      closingCta: {
                        ...home.closingCta,
                        masthead: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={home.closingCta.buttonText}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      closingCta: {
                        ...home.closingCta,
                        buttonText: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={home.closingCta.headingLine1}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      closingCta: {
                        ...home.closingCta,
                        headingLine1: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={home.closingCta.headingLine2}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      closingCta: {
                        ...home.closingCta,
                        headingLine2: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Description Paragraph
              </label>
              <textarea
                rows={2}
                value={home.closingCta.description}
                onChange={(e) =>
                  setHome({
                    ...home,
                    closingCta: {
                      ...home.closingCta,
                      description: e.target.value,
                    },
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SERVICES PAGE EDITOR */}
      {/* ============================================================== */}
      {activeTab === "services" && (
        <div className="space-y-8">
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Services Hero Intro
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Services Page Title &amp; Philosophy
              </h2>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Eyebrow
              </label>
              <input
                type="text"
                value={services.intro.eyebrow}
                onChange={(e) =>
                  setServices({
                    ...services,
                    intro: { ...services.intro, eyebrow: e.target.value },
                  })
                }
                className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={services.intro.headingLine1}
                  onChange={(e) =>
                    setServices({
                      ...services,
                      intro: { ...services.intro, headingLine1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={services.intro.headingLine2}
                  onChange={(e) =>
                    setServices({
                      ...services,
                      intro: { ...services.intro, headingLine2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={services.intro.paragraph1}
                  onChange={(e) =>
                    setServices({
                      ...services,
                      intro: { ...services.intro, paragraph1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={services.intro.paragraph2}
                  onChange={(e) =>
                    setServices({
                      ...services,
                      intro: { ...services.intro, paragraph2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Process Standards
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                &quot;Before We Begin&quot; Section
              </h2>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Section Heading
              </label>
              <input
                type="text"
                value={services.beforeWeBegin.heading}
                onChange={(e) =>
                  setServices({
                    ...services,
                    beforeWeBegin: {
                      ...services.beforeWeBegin,
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Lead Principle
              </label>
              <textarea
                rows={2}
                value={services.beforeWeBegin.lead}
                onChange={(e) =>
                  setServices({
                    ...services,
                    beforeWeBegin: {
                      ...services.beforeWeBegin,
                      lead: e.target.value,
                    },
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Studio Commitment Statement
              </label>
              <textarea
                rows={2}
                value={services.beforeWeBegin.commitment}
                onChange={(e) =>
                  setServices({
                    ...services,
                    beforeWeBegin: {
                      ...services.beforeWeBegin,
                      commitment: e.target.value,
                    },
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: STUDIO PAGE EDITOR */}
      {/* ============================================================== */}
      {activeTab === "studio" && (
        <div className="space-y-8">
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Studio Manifesto
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Studio Intro Headline &amp; Purpose
              </h2>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Eyebrow
              </label>
              <input
                type="text"
                value={studio.intro.eyebrow}
                onChange={(e) =>
                  setStudio({
                    ...studio,
                    intro: { ...studio.intro, eyebrow: e.target.value },
                  })
                }
                className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 1
                </label>
                <input
                  type="text"
                  value={studio.intro.headingLine1}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      intro: { ...studio.intro, headingLine1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Heading Line 2
                </label>
                <input
                  type="text"
                  value={studio.intro.headingLine2}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      intro: { ...studio.intro, headingLine2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-extrabold uppercase text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={studio.intro.paragraph1}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      intro: { ...studio.intro, paragraph1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={studio.intro.paragraph2}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      intro: { ...studio.intro, paragraph2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>
            </div>
          </div>

          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Founding Philosophy
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Studio Story &amp; Origins
              </h2>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Story Heading
              </label>
              <input
                type="text"
                value={studio.story.heading}
                onChange={(e) =>
                  setStudio({
                    ...studio,
                    story: { ...studio.story, heading: e.target.value },
                  })
                }
                className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Narrative Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={studio.story.paragraph1}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      story: { ...studio.story, paragraph1: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Narrative Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={studio.story.paragraph2}
                  onChange={(e) =>
                    setStudio({
                      ...studio,
                      story: { ...studio.story, paragraph2: e.target.value },
                    })
                  }
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: GLOBAL SETTINGS */}
      {/* ============================================================== */}
      {activeTab === "settings" && (
        <div className="space-y-8">
          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Site Identity &amp; Contact
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Global Studio Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Official Studio Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs font-bold text-ink"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Contact &amp; Enquiry Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) =>
                    setSettings({ ...settings, contactEmail: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Studio Locations
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) =>
                    setSettings({ ...settings, location: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Engagement Availability Status
                </label>
                <input
                  type="text"
                  value={settings.availabilityBadge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      availabilityBadge: e.target.value,
                    })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                Global Meta Description (SEO)
              </label>
              <textarea
                rows={2}
                value={settings.metaDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    metaDescription: e.target.value,
                  })
                }
                className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
              />
            </div>
          </div>

          <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block">
                Social Profiles
              </span>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                Social Media Links
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, twitterUrl: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, linkedinUrl: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted tracking-wider mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, instagramUrl: e.target.value })
                  }
                  className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 border-2 border-ink bg-surface p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="inline-flex items-center gap-1.5 text-xs uppercase font-bold text-muted hover:text-ink transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset {activeTab} To Default</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href={getPublicLink()}
            target="_blank"
            className="px-4 py-2 border border-ink/20 text-xs font-bold uppercase tracking-wider text-muted hover:text-ink hover:bg-paper transition-colors"
          >
            Preview Public Page
          </Link>

          <button
            type="button"
            onClick={handleSaveCurrent}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5 text-action" />
            <span>{isSaving ? "Publishing Changes..." : "Save & Publish Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
