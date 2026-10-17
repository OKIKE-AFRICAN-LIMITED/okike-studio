"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type SelectedProject } from "@/lib/projects";
import {
  Plus,
  Check,
  Edit3,
  X,
  Save,
  Globe,
  Trash2,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  CheckCircle2,
  Upload,
  Loader2,
  ImageIcon,
  Copy,
  ExternalLink,
} from "lucide-react";

const IMAGE_PRESETS = [
  { label: "Koro (Tactile Studio)", path: "/work/koro.png" },
  { label: "North Common (Collaborative)", path: "/work/north-common.png" },
  { label: "Tend (Interface Systems)", path: "/work/tend.png" },
  { label: "Architecture Desktop", path: "/hero/architecture-desktop.svg" },
];

export function PortfolioManager({
  initialProjects,
}: {
  initialProjects: SelectedProject[];
}) {
  const [projects, setProjects] = useState<SelectedProject[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<SelectedProject | null>(null);
  const [activeTab, setActiveTab] = useState<"general" | "narrative" | "visibility">("general");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [slug, setSlug] = useState("");
  const [href, setHref] = useState("");
  const [useCustomHref, setUseCustomHref] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [title, setTitle] = useState("");
  const [disciplines, setDisciplines] = useState("");
  const [year, setYear] = useState("2026");
  const [sequence, setSequence] = useState("01");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [featured, setFeatured] = useState(false);
  const [introLine1, setIntroLine1] = useState("");
  const [introLine2, setIntroLine2] = useState("");
  const [client, setClient] = useState("");
  const [sector, setSector] = useState("");
  const [scope, setScope] = useState("");
  const [question, setQuestion] = useState("");
  const [questionGoal, setQuestionGoal] = useState("");
  const [direction, setDirection] = useState("");
  const [experience, setExperience] = useState("");
  const [outcome, setOutcome] = useState("");
  const [outcomeMetrics, setOutcomeMetrics] = useState("");

  // Upload States
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploadingImage(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Upload failed");
      }

      setImage(data.url);
      if (!imageAlt || imageAlt.includes("tactile brand materials") || imageAlt.includes("Hands arranging")) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      setUploadError(msg);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Lock background scroll when modal is open so wheel events target only modal
  useEffect(() => {
    if (editingProject) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [editingProject]);

  const openEditor = (proj?: SelectedProject) => {
    setStatusMessage(null);
    setActiveTab("general");

    if (proj) {
      setEditingProject(proj);
      setIsNewProject(false);
      setSlug(proj.id);
      const isCustom = proj.href ? proj.href !== `/work/${proj.id}` : false;
      setUseCustomHref(isCustom);
      setHref(proj.href || `/work/${proj.id}`);
      setTitle(proj.title);
      setDisciplines(proj.disciplines);
      setYear(proj.year);
      setSequence(proj.sequence);
      setImage(proj.image);
      setImageAlt(proj.imageAlt);
      setFeatured(proj.featured ?? false);
      setIntroLine1(proj.caseStudy?.introduction?.[0] || `${proj.disciplines}.`);
      setIntroLine2(
        proj.caseStudy?.introduction?.[1] ||
          "A crafted digital experience from strategy to final launch."
      );
      setClient(proj.caseStudy?.facts.client || "");
      setSector(proj.caseStudy?.facts.sector || "");
      setScope(proj.caseStudy?.facts.scope || "");
      setQuestion(proj.caseStudy?.question?.[0] || "");
      setQuestionGoal(proj.caseStudy?.question?.[1] || "");
      setDirection(proj.caseStudy?.designDirection || "");
      setExperience(proj.caseStudy?.experience || "");
      setOutcome(proj.caseStudy?.outcome?.[0] || "");
      setOutcomeMetrics(proj.caseStudy?.outcome?.[1] || "");
    } else {
      const nextSeq = String(projects.length + 1).padStart(2, "0");
      const defaultSlug = `project-${nextSeq}`;
      const newProj: SelectedProject = {
        id: defaultSlug,
        sequence: nextSeq,
        year: "2026",
        title: "NEW VENTURE",
        disciplines: "STRATEGY / IDENTITY / DIGITAL",
        image: "/work/koro.png",
        imageAlt: "Hands arranging brand identity architecture",
        placeholder: true,
        featured: false,
        href: `/work/${defaultSlug}` as SelectedProject["href"],
      };

      setEditingProject(newProj);
      setIsNewProject(true);
      setSlug(defaultSlug);
      setHref(`/work/${defaultSlug}`);
      setUseCustomHref(false);
      setTitle("NEW VENTURE");
      setDisciplines("STRATEGY / IDENTITY / DIGITAL");
      setYear("2026");
      setSequence(nextSeq);
      setImage("/work/koro.png");
      setImageAlt("Hands arranging brand identity architecture");
      setFeatured(false);
      setIntroLine1("Strategy, identity and digital flagship.");
      setIntroLine2("A cohesive brand and interactive platform built for scale.");
      setClient("Studio Partner");
      setSector("Venture Technology");
      setScope("Strategy, identity, interactive flagship");
      setQuestion("How can we architect a distinctive identity system that scales?");
      setQuestionGoal("Deliver a high-velocity digital platform and cohesive visual system.");
      setDirection("Typographic precision paired with tactile digital surfaces.");
      setExperience("A structured design language built on Next.js and GSAP animation layers.");
      setOutcome("Elevated global valuation, tripling qualified partner inquiries.");
      setOutcomeMetrics("100% lighthouse score and accelerated market conversion.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setIsSaving(true);
    setStatusMessage(null);

    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-");

    const finalHref = useCustomHref && href.trim() ? href.trim() : `/work/${cleanSlug}`;

    const updatedCaseStudy = {
      slug: cleanSlug,
      caseNumber: sequence,
      displayTitle: `PROJECT ${sequence}`,
      metadataTitle: `${title} | OKIKE Studio`,
      introduction: [
        introLine1 || `${disciplines}.`,
        introLine2 || "A crafted digital experience from strategy to final launch.",
      ] as const,
      previewNotice: "VERIFIED CASE STUDY · OKIKE Studio",
      coverAlt: imageAlt || title,
      facts: {
        client: client || "[Client]",
        sector: sector || "[Industry]",
        scope: scope || "[Scope]",
        year: year || "2026",
      },
      question: [
        question || "Strategic brief and design problem to solve.",
        questionGoal || "Clear goal formulated with client stakeholders.",
      ] as const,
      designDirection: direction || "Design direction and concept explanation.",
      experience: experience || "Digital walkthrough and interactive touchpoints.",
      outcome: [
        outcome || "Measurable outcomes and business transformations.",
        outcomeMetrics || "Demonstrated client satisfaction and metrics.",
      ] as const,
      placeholder: true as const,
    };

    const updated: SelectedProject = {
      ...editingProject,
      id: cleanSlug,
      title,
      disciplines,
      year,
      sequence,
      image,
      imageAlt,
      featured,
      href: finalHref as SelectedProject["href"],
      caseStudy: updatedCaseStudy,
    };

    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: updated,
          oldId: isNewProject ? undefined : editingProject.id,
        }),
      });

      const resData = await response.json();

      if (!response.ok || resData.error) {
        throw new Error(resData.error || "Failed to persist project changes");
      }

      // Update local state (replacing by old or new id)
      setProjects((prev) => {
        const withoutOld = prev.filter((p) => p.id !== editingProject.id && p.id !== cleanSlug);
        return [...withoutOld, updated].sort((a, b) => a.sequence.localeCompare(b.sequence));
      });

      setStatusMessage({
        type: "success",
        text: "Case study saved successfully!",
      });

      setTimeout(() => {
        setEditingProject(null);
        setStatusMessage(null);
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving project";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingProject) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${editingProject.title}" from the portfolio?`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/projects?id=${editingProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      setProjects((prev) => prev.filter((p) => p.id !== editingProject.id));
      setEditingProject(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting project";
      setStatusMessage({ type: "error", text: msg });
    } finally {
      setIsDeleting(false);
    }
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
            Portfolio CMS
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Manage showcase case studies, hero imagery, facts, and narrative briefs published to /work.
          </p>
        </div>

        <button
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4 text-action" />
          Add Case Study
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="border border-ink/15 bg-surface flex flex-col justify-between group hover:border-ink transition-colors shadow-xs"
          >
            <div>
              <div className="relative aspect-16/10 bg-paper overflow-hidden border-b border-ink/15">
                <Image
                  src={proj.image}
                  alt={proj.imageAlt || proj.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-ink text-action text-xs font-extrabold px-2 py-0.5 uppercase tracking-wider">
                  {proj.sequence}
                </div>
                <div className="absolute top-3 right-3 bg-surface/90 text-ink text-[10px] font-extrabold uppercase px-2 py-0.5 border border-ink/20">
                  {proj.year}
                </div>
                {proj.featured && (
                  <div className="absolute bottom-3 left-3 bg-lime text-ink text-[9px] font-extrabold uppercase px-2 py-0.5 tracking-wider border border-lime shadow-xs">
                    Featured
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase tracking-tight text-ink">
                    {proj.title}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-muted">
                    /{proj.id}
                  </span>
                </div>
                <p className="text-[11px] text-muted tracking-wider uppercase font-bold">
                  {proj.disciplines}
                </p>
                {proj.caseStudy && (
                  <p className="text-xs text-neutral-600 line-clamp-2 pt-2 border-t border-ink/10 font-normal">
                    {proj.caseStudy.question[0]}
                  </p>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-ink/10 mt-4">
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-extrabold uppercase tracking-wider">
                <Check className="h-3.5 w-3.5" /> Published
              </span>

              <div className="flex items-center gap-2">
                {proj.href && (
                  <Link
                    href={proj.href}
                    target="_blank"
                    className="p-2 text-muted hover:text-ink transition-colors"
                    title="View Public Page"
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </Link>
                )}
                <button
                  onClick={() => openEditor(proj)}
                  className="inline-flex items-center gap-1.5 bg-paper hover:bg-ink hover:text-white border border-ink/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FIXED, NON-CLIPPING CASE STUDY EDITOR MODAL */}
      {editingProject && (
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
        >
          <div
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            className="flex flex-col w-full max-w-3xl h-[88vh] max-h-[860px] bg-surface border-2 border-ink shadow-2xl overflow-hidden my-auto"
          >
            {/* 1. STICKY TOP HEADER */}
            <div className="flex items-center justify-between border-b border-ink/15 bg-surface px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="bg-ink text-action font-extrabold text-xs px-2.5 py-1 uppercase tracking-wider">
                  {sequence || "01"}
                </span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold block">
                    Case Study Editor
                  </span>
                  <h2 className="text-base font-extrabold uppercase tracking-tight text-ink">
                    {title ? `Edit ${title}` : "New Project"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1.5 text-muted hover:text-ink hover:bg-paper transition-colors cursor-pointer border border-transparent hover:border-ink/15"
                aria-label="Close Editor"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 2. TAB CONTROLS */}
            <div className="flex border-b border-ink/10 bg-paper/60 px-6 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`py-3 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                  activeTab === "general"
                    ? "border-ink text-ink bg-surface"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                1. Info &amp; Imagery
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("narrative")}
                className={`py-3 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                  activeTab === "narrative"
                    ? "border-ink text-ink bg-surface"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                2. Case Study Narrative
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("visibility")}
                className={`py-3 px-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                  activeTab === "visibility"
                    ? "border-ink text-ink bg-surface"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                3. Settings &amp; URLs
              </button>
            </div>

            {/* 3. SCROLLABLE FORM BODY WITH NATIVE SCROLLBAR */}
            <div
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-6 overscroll-contain focus:outline-none"
              tabIndex={0}
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "var(--ink, #111) rgba(0,0,0,0.06)",
              }}
            >
              {statusMessage && (
                <div
                  className={`p-3.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${
                    statusMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                      : "bg-red-50 border-red-300 text-red-900"
                  }`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-700" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* TAB 1: GENERAL & IMAGERY */}
              {activeTab === "general" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1.5">
                        Sequence
                      </label>
                      <input
                        type="text"
                        required
                        value={sequence}
                        onChange={(e) => setSequence(e.target.value)}
                        placeholder="01"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-extrabold focus:outline-none focus:border-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="2026"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-medium focus:outline-none focus:border-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1.5">
                        Project Title
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (isNewProject) {
                            setSlug(
                              e.target.value
                                .toLowerCase()
                                .trim()
                                .replace(/[^a-z0-9_-]/g, "-")
                                .replace(/-+/g, "-")
                            );
                          }
                        }}
                        placeholder="KORO"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs uppercase text-ink font-extrabold focus:outline-none focus:border-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1.5">
                        Slug (URL)
                      </label>
                      <input
                        type="text"
                        required
                        value={slug}
                        onChange={(e) =>
                          setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-"))
                        }
                        placeholder="koro"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-mono font-bold focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1.5">
                      Disciplines (e.g. VENTURE STRATEGY / BRAND / PRODUCT)
                    </label>
                    <input
                      type="text"
                      required
                      value={disciplines}
                      onChange={(e) => setDisciplines(e.target.value)}
                      placeholder="VENTURE STRATEGY / BRAND / PRODUCT"
                      className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold focus:outline-none focus:border-ink"
                    />
                  </div>

                  {/* Image Path, Device Upload & Preview */}
                  <div className="border border-ink/15 bg-paper/30 p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center justify-between">
                      <span>Cover Image &amp; Media</span>
                      <span className="text-[10px] text-muted font-normal lowercase">
                        local device upload or public path
                      </span>
                    </h4>

                    {/* DRAG & DROP / DEVICE UPLOAD BOX */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleFileUpload(e.dataTransfer.files[0]);
                        }
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-ink/30 hover:border-ink bg-surface p-5 text-center transition-colors cursor-pointer group"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0]);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                      />

                      <div className="flex flex-col items-center justify-center gap-2">
                        {isUploadingImage ? (
                          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink py-3">
                            <Loader2 className="h-5 w-5 animate-spin text-lime" />
                            <span>Uploading image from device...</span>
                          </div>
                        ) : (
                          <>
                            <div className="p-2.5 bg-paper border border-ink/20 group-hover:bg-ink group-hover:text-white transition-colors">
                              <Upload className="h-5 w-5" />
                            </div>
                            <div>
                              <span className="text-xs font-extrabold uppercase tracking-wider text-ink block">
                                Choose File from Device
                              </span>
                              <span className="text-[11px] text-muted block mt-0.5">
                                Drag &amp; drop or click to upload PNG, JPG, WebP, SVG (saved locally to project)
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {uploadError && (
                      <div className="p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs font-bold uppercase tracking-wide">
                        {uploadError}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <div className="flex-1 space-y-3">
                        <div>
                          <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1">
                            Current Image URL / Path
                          </label>
                          <input
                            type="text"
                            required
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="/work/koro.png or https://..."
                            className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-mono font-medium focus:outline-none focus:border-ink"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase text-muted font-bold tracking-wider mb-1">
                            Image Alt Description
                          </label>
                          <input
                            type="text"
                            required
                            value={imageAlt}
                            onChange={(e) => setImageAlt(e.target.value)}
                            placeholder="Descriptive explanation for accessibility"
                            className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink focus:outline-none focus:border-ink"
                          />
                        </div>

                        {/* Presets */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                            Or Quick Select Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {IMAGE_PRESETS.map((p) => (
                              <button
                                key={p.path}
                                type="button"
                                onClick={() => {
                                  setImage(p.path);
                                  setImageAlt(p.label);
                                }}
                                className={`text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                                  image === p.path
                                    ? "bg-ink text-white border-ink font-bold"
                                    : "bg-paper text-muted border-ink/15 hover:text-ink"
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Live Image Thumbnail Preview */}
                      <div className="w-full sm:w-44 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-muted block mb-1">
                          Cover Preview
                        </span>
                        <div className="relative aspect-16/10 sm:aspect-square bg-paper border border-ink/20 overflow-hidden flex items-center justify-center">
                          {image ? (
                            <Image
                              src={image}
                              alt={imageAlt || "Preview"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-muted">
                              <ImageIcon className="h-6 w-6 opacity-40" />
                              <span className="text-[10px]">No Image Selected</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASE STUDY NARRATIVE */}
              {activeTab === "narrative" && (
                <div className="space-y-6">
                  {/* Case Study Introduction */}
                  <div className="border border-ink/15 bg-paper/40 p-4 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                      Case Study Introduction
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                          Headline / Summary (e.g. Brand identity and digital experience)
                        </label>
                        <input
                          type="text"
                          value={introLine1}
                          onChange={(e) => setIntroLine1(e.target.value)}
                          placeholder="Brand identity and digital experience."
                          className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                          Narrative Scope (e.g. A project story, from question to final system)
                        </label>
                        <input
                          type="text"
                          value={introLine2}
                          onChange={(e) => setIntroLine2(e.target.value)}
                          placeholder="A project story, from the first question to the final system."
                          className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Facts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        placeholder="e.g. KORO or Aether"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Sector / Industry
                      </label>
                      <input
                        type="text"
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        placeholder="e.g. Tactile Materials"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Scope
                      </label>
                      <input
                        type="text"
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        placeholder="Strategy, identity, website"
                        className="w-full bg-paper border border-ink/20 px-3 py-2 text-xs text-ink"
                      />
                    </div>
                  </div>

                  {/* The Brief / Challenge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Problem &amp; Context
                      </label>
                      <textarea
                        rows={3}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Explain what needed to change, why it mattered, and the constraints."
                        className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Strategic Goal
                      </label>
                      <textarea
                        rows={3}
                        value={questionGoal}
                        onChange={(e) => setQuestionGoal(e.target.value)}
                        placeholder="State the agreed goal in one clear sentence."
                        className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                      Design Direction
                    </label>
                    <textarea
                      rows={3}
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      placeholder="Explain the central design decision and how it connects identity and experience."
                      className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                      Interactive Experience &amp; Build
                    </label>
                    <textarea
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Describe the key user journey and how the digital engineering supports it."
                      className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                    />
                  </div>

                  {/* Outcomes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Outcome &amp; Deliverables
                      </label>
                      <textarea
                        rows={3}
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="Summarise what was delivered and what changed for the client."
                        className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase text-muted font-bold tracking-wider mb-1">
                        Key Metrics &amp; Validation
                      </label>
                      <textarea
                        rows={3}
                        value={outcomeMetrics}
                        onChange={(e) => setOutcomeMetrics(e.target.value)}
                        placeholder="Measurable metrics, growth figures, or conversion impact."
                        className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VISIBILITY & SETTINGS */}
              {activeTab === "visibility" && (
                <div className="space-y-6">
                  {/* URL Configuration Box */}
                  <div className="border border-ink/15 bg-paper/40 p-5 space-y-5">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink flex items-center gap-2">
                        <Globe className="h-4 w-4 text-action" />
                        <span>Project URLs &amp; Routes</span>
                      </h4>
                      <p className="text-[11px] text-muted mt-0.5">
                        Configure the public URL slug and card destination link for this project.
                      </p>
                    </div>

                    {/* 1. Public Case Study Slug */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase text-muted font-bold tracking-wider">
                        Public URL Slug (/work/[slug])
                      </label>
                      <div className="flex items-center bg-surface border border-ink/20 focus-within:border-ink">
                        <span className="bg-paper px-3 py-2 text-xs text-muted font-mono border-r border-ink/15 select-none shrink-0">
                          /work/
                        </span>
                        <input
                          type="text"
                          required
                          value={slug}
                          onChange={(e) => {
                            const val = e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9_-]/g, "-");
                            setSlug(val);
                            if (!useCustomHref) setHref(`/work/${val}`);
                          }}
                          placeholder="koro"
                          className="w-full bg-transparent px-3 py-2 text-xs font-mono font-extrabold text-ink focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted pt-1">
                        <span>
                          Full Link: <code className="bg-paper px-1.5 py-0.5 font-bold font-mono text-ink">https://okikestudio.com/work/{slug || "slug"}</code>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://okikestudio.com/work/${slug}`);
                              setCopiedUrl(true);
                              setTimeout(() => setCopiedUrl(false), 2000);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{copiedUrl ? "Copied!" : "Copy Link"}</span>
                          </button>
                          <span className="text-ink/20">·</span>
                          <Link
                            href={`/work/${slug || ""}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted hover:text-ink"
                          >
                            <span>Open Route</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* 2. Target Navigation URL (href) */}
                    <div className="space-y-3 pt-4 border-t border-ink/10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <label className="block text-xs uppercase text-muted font-bold tracking-wider">
                            Card Click Navigation URL
                          </label>
                          <span className="text-[11px] text-muted">
                            Where visitors are sent when clicking this project in galleries
                          </span>
                        </div>
                        <label className="flex items-center gap-2 text-xs font-bold text-ink cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={useCustomHref}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setUseCustomHref(checked);
                              if (!checked) setHref(`/work/${slug}`);
                            }}
                            className="h-4 w-4 accent-ink cursor-pointer"
                          />
                          <span className="uppercase text-[11px] tracking-wider">Custom / External URL</span>
                        </label>
                      </div>

                      {useCustomHref ? (
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={href}
                            onChange={(e) => setHref(e.target.value)}
                            placeholder="https://client-project.com or /work/custom-route"
                            className="w-full bg-surface border border-ink/20 px-3 py-2 text-xs text-ink font-mono font-medium focus:outline-none focus:border-ink"
                          />
                          <p className="text-[10px] text-muted">
                            Enter an external link (e.g. <span className="font-mono">https://client.com</span>) or custom path.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-surface border border-ink/10 p-3 text-xs font-mono text-ink flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5">
                              Internal Route
                            </span>
                            <span>{`/work/${slug}`}</span>
                          </div>
                          <span className="text-[10px] text-muted font-sans font-bold">
                            Default Case Study
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Publishing Status & Placement */}
                  <div className="border border-ink/15 bg-paper/40 p-5 space-y-4">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                      Publishing Status &amp; Placement
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="h-4 w-4 accent-ink cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-ink uppercase tracking-wider block">
                          Featured on Studio Homepage
                        </span>
                        <span className="text-[11px] text-muted block">
                          Pin this project directly on the Selected Work showcase on the home page.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 4. STICKY BOTTOM ACTION BAR (ALWAYS VISIBLE!) */}
            <div className="sticky bottom-0 bg-paper border-t border-ink/15 px-6 py-4 flex items-center justify-between gap-4 shrink-0 z-10">
              <div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting || isSaving}
                  className="inline-flex items-center gap-1.5 text-xs uppercase font-extrabold text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{isDeleting ? "Removing..." : "Delete Project"}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border border-ink/20 text-xs uppercase tracking-wider text-muted hover:text-ink hover:bg-surface font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Save className="h-3.5 w-3.5 text-action" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
