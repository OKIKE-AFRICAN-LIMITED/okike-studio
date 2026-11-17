"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid, List, ArrowUpRight } from "lucide-react";
import {
  inferProjectCategories,
  type SelectedProject,
  type CanonicalCategory,
} from "@/lib/projects";

type FilterId = "all" | CanonicalCategory;
type ViewMode = "grid" | "index";

const FILTER_OPTIONS: ReadonlyArray<{ id: FilterId; label: string }> = [
  { id: "all", label: "ALL" },
  { id: "brand", label: "BRANDING" },
  { id: "ui", label: "UI / FIGMA" },
  { id: "websites", label: "WEBSITES" },
  { id: "automation", label: "AUTOMATION & TOOLS" },
];

function inferStack(project: SelectedProject): readonly string[] {
  if (project.stack && project.stack.length > 0) return project.stack;
  const cats = inferProjectCategories(project);
  const tags: string[] = [];
  if (cats.includes("brand")) tags.push("Brand Identity");
  if (cats.includes("ui")) tags.push("Figma UI");
  if (cats.includes("websites")) tags.push("Next.js");
  if (cats.includes("automation")) tags.push("Automation");
  return tags.length > 0 ? tags : ["Next.js", "Supabase", "GSAP"];
}

function ProjectLinkWrapper({
  href,
  projectId,
  className,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  children,
}: {
  href?: string;
  projectId: string;
  className: string;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: () => void;
  onMouseMove?: (e: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
}) {
  if (!href) {
    return (
      <article
        data-project={projectId}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {children}
      </article>
    );
  }

  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-project={projectId}
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      data-project={projectId}
      className={className}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {children}
    </Link>
  );
}

export function WorkInteractiveGallery({ projects }: { projects: SelectedProject[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Cursor / Hover preview state
  const [hoveredProject, setHoveredProject] = useState<SelectedProject | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => inferProjectCategories(p).includes(activeFilter));
  }, [projects, activeFilter]);

  const [featuredProject, ...remainingProjects] = filteredProjects;

  const totalCountStr = String(projects.length).padStart(2, "0");

  const handlePointerMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col gap-8 lg:gap-10"
      onMouseLeave={() => setHoveredProject(null)}
    >
      {/* Top Controls Bar: Zero-Reload Filter Pills + [Grid / Index] Toggle */}
      <div
        data-gsap="work-index-bar"
        className="flex flex-col gap-4 border-b border-[#ccccc7] pb-6 md:flex-row md:items-center md:justify-between"
      >
        {/* Filter Pills */}
        <div
          className="flex flex-wrap items-center gap-2.5"
          role="tablist"
          aria-label="Filter projects by discipline"
        >
          {FILTER_OPTIONS.map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveFilter(pill.id);
                  setHoveredProject(null);
                }}
                className={`inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-[12px] font-bold tracking-[0.6px] uppercase transition-all duration-200 ${
                  isActive
                    ? "border-[#0e0e0e] bg-[#0e0e0e] text-[#f5f5f0] shadow-xs"
                    : "border-[#0e0e0e]/40 bg-transparent text-[#0e0e0e] hover:border-[#0e0e0e] hover:bg-[#0e0e0e]/5"
                }`}
              >
                {pill.id === "all" ? (
                  <span>
                    [ALL <span className="text-[#a3a39e]">{totalCountStr}</span>]
                  </span>
                ) : (
                  <span>{pill.label}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher: [GRID / INDEX] */}
        <div className="flex items-center gap-5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setViewMode("grid");
              setHoveredProject(null);
            }}
            aria-pressed={viewMode === "grid"}
            className={`inline-flex cursor-pointer items-center gap-2 text-[12px] font-extrabold tracking-[0.8px] uppercase transition-colors ${
              viewMode === "grid"
                ? "text-[#0e0e0e]"
                : "text-[#737370] hover:text-[#0e0e0e]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className={viewMode === "grid" ? "underline underline-offset-4" : ""}>
              GRID
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode("index");
              setHoveredProject(null);
            }}
            aria-pressed={viewMode === "index"}
            className={`inline-flex cursor-pointer items-center gap-2 text-[12px] font-extrabold tracking-[0.8px] uppercase transition-colors ${
              viewMode === "index"
                ? "text-[#0e0e0e]"
                : "text-[#737370] hover:text-[#0e0e0e]"
            }`}
          >
            <List className="h-4 w-4" />
            <span className={viewMode === "index" ? "underline underline-offset-4" : ""}>
              INDEX
            </span>
          </button>
        </div>
      </div>

      {/* DIRECTION 01: VISUAL GRID VIEW + MAGNETIC LIME FOLLOWER */}
      {viewMode === "grid" && (
        <div className="border border-[#ccccc7] bg-[#f7f7f2]">
          {/* Featured Row */}
          {featuredProject && (
            <div
              className={`grid grid-cols-1 ${
                remainingProjects.length > 0 ? "border-b border-[#ccccc7] lg:grid-cols-12" : ""
              }`}
            >
              <ProjectLinkWrapper
                href={featuredProject.href || (featuredProject.caseStudy ? `/work/${featuredProject.caseStudy.slug}` : undefined)}
                projectId={featuredProject.id}
                onMouseEnter={(e) => {
                  setHoveredProject(featuredProject);
                  handlePointerMove(e);
                }}
                onMouseLeave={() => setHoveredProject(null)}
                onMouseMove={handlePointerMove}
                className="group relative flex flex-col justify-between gap-5 p-4 sm:p-6 lg:col-span-12 lg:flex-row lg:items-center lg:gap-10 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414] lg:w-[64%] lg:flex-none">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1023px) calc(100vw - 40px), 64vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="pointer-events-none absolute bottom-5 left-5 right-5 text-[#f5f5f0] sm:bottom-7 sm:left-7">
                    <p className="text-[28px]/[32px] font-extrabold tracking-[-1px] uppercase sm:text-[42px]/[44px]">
                      {featuredProject.title} / {featuredProject.sequence}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold tracking-[1px] text-[#e0e0da] uppercase sm:text-[13px]">
                      {featuredProject.caseStudy?.facts.sector || featuredProject.disciplines}
                    </p>
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-6 py-2 lg:pr-4">
                  <div className="space-y-3">
                    <p className="font-mono text-[11px] font-bold tracking-[1px] text-[#737370] uppercase">
                      {featuredProject.sequence} /{" "}
                      {featuredProject.caseStudy?.facts.client || "OKIKE STUDIO"} &middot;{" "}
                      {featuredProject.year}
                    </p>
                    <h2 className="text-[32px]/[36px] font-extrabold tracking-[-1.2px] text-[#0e0e0e] uppercase transition-colors group-hover:text-[#52524e] lg:text-[48px]/[48px]">
                      {featuredProject.title}
                    </h2>
                    <p className="text-[14px]/[22px] text-[#52524e] lg:text-[15px]/[24px]">
                      {featuredProject.caseStudy?.introduction[0] || featuredProject.disciplines}
                    </p>
                  </div>

                  {/* Tech Stack Badges */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {inferStack(featuredProject).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-[#0e0e0e]/45 px-3 py-1 text-[11px] font-semibold text-[#0e0e0e]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1.5 pt-2 text-[12px] font-extrabold tracking-[0.8px] text-[#0e0e0e] uppercase">
                      <span>Explore Case Study</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </div>
              </ProjectLinkWrapper>
            </div>
          )}

          {/* Remaining Projects Grid */}
          {remainingProjects.length > 0 && (
            <div className="grid grid-cols-1 divide-y divide-[#ccccc7] md:grid-cols-2 md:divide-x md:divide-y-0">
              {remainingProjects.map((project) => {
                const stack = inferStack(project);
                const projectHref =
                  project.href ||
                  (project.caseStudy ? `/work/${project.caseStudy.slug}` : undefined);

                return (
                  <ProjectLinkWrapper
                    key={project.id}
                    href={projectHref}
                    projectId={project.id}
                    onMouseEnter={(e) => {
                      setHoveredProject(project);
                      handlePointerMove(e);
                    }}
                    onMouseLeave={() => setHoveredProject(null)}
                    onMouseMove={handlePointerMove}
                    className="group flex flex-col justify-between gap-5 p-4 sm:p-6 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px]"
                  >
                    <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#141414]">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 767px) calc(100vw - 40px), 48vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                      <div className="space-y-1.5">
                        <p className="font-mono text-[11px] font-bold tracking-[0.8px] text-[#737370] uppercase">
                          {project.sequence} / {project.caseStudy?.facts.client || "STUDIO ARCHIVE"}{" "}
                          &middot; {project.year}
                        </p>
                        <h3 className="text-[28px]/[32px] font-extrabold tracking-[-1px] text-[#0e0e0e] uppercase lg:text-[36px]/[38px]">
                          {project.title}
                        </h3>
                        <p className="text-[13px]/[18px] font-medium text-[#52524e]">
                          {project.caseStudy?.facts.sector || project.disciplines}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-[#0e0e0e]/45 px-3 py-1 text-[11px] font-semibold text-[#0e0e0e]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </ProjectLinkWrapper>
                );
              })}
            </div>
          )}

          {/* Magnetic Floating Neon Lime "EXPLORE CASE ↗" Follower (Desktop Grid Hover) */}
          {hoveredProject && (
            <div
              aria-hidden="true"
              style={{
                transform: `translate3d(${cursorPos.x - 56}px, ${cursorPos.y - 56}px, 0)`,
              }}
              className="pointer-events-none absolute top-0 left-0 z-30 hidden h-28 w-28 flex-col items-center justify-center rounded-full bg-[#e3ed33] text-center text-[#0e0e0e] shadow-xl transition-transform duration-75 ease-out lg:flex"
            >
              <span className="text-[11px]/[13px] font-extrabold tracking-[0.6px] uppercase">
                EXPLORE
                <br />
                CASE ↗
              </span>
            </div>
          )}
        </div>
      )}

      {/* DIRECTION 02: ARCHITECTURAL INDEX TABLE VIEW + FLOATING HOVER PREVIEW */}
      {viewMode === "index" && (
        <div className="overflow-hidden rounded-t-sm border border-[#ccccc7] bg-[#f7f7f2]">
          {/* Table Header */}
          <div className="hidden grid-cols-12 items-center bg-[#141414] px-5 py-4 text-[11px] font-extrabold tracking-[0.8px] text-[#f5f5f0] uppercase md:grid">
            <div className="col-span-1">01</div>
            <div className="col-span-3 border-l border-[#333330] pl-4">PROJECT</div>
            <div className="col-span-2 border-l border-[#333330] pl-4">CLIENT</div>
            <div className="col-span-3 border-l border-[#333330] pl-4">DISCIPLINE</div>
            <div className="col-span-2 border-l border-[#333330] pl-4">TECH STACK</div>
            <div className="col-span-1 border-l border-[#333330] pl-4 text-right">YEAR</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#ccccc7]">
            {filteredProjects.map((project, idx) => {
              const seq = String(idx + 1).padStart(2, "0");
              const clientName = project.caseStudy?.facts.client || "OKIKE STUDIO";
              const stackStr = inferStack(project).join(", ").toUpperCase();
              const projectHref =
                project.href ||
                (project.caseStudy ? `/work/${project.caseStudy.slug}` : undefined);

              return (
                <ProjectLinkWrapper
                  key={project.id}
                  href={projectHref}
                  projectId={project.id}
                  onMouseEnter={(e) => {
                    setHoveredProject(project);
                    handlePointerMove(e);
                  }}
                  onMouseLeave={() => setHoveredProject(null)}
                  onMouseMove={handlePointerMove}
                  className="group grid grid-cols-1 gap-2 px-5 py-5 transition-colors hover:bg-[#eaeae2] md:grid-cols-12 md:items-center md:gap-0 focus-visible:outline-[3px] focus-visible:outline-offset-[-3px]"
                >
                  <div className="font-mono text-[12px] font-bold text-[#52524e] md:col-span-1">
                    {seq}
                  </div>
                  <div className="flex items-center justify-between text-[15px] font-extrabold tracking-[-0.3px] text-[#0e0e0e] uppercase md:col-span-3 md:border-l md:border-[#ccccc7] md:pl-4">
                    <span>{project.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#737370] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0e0e0e] md:hidden" />
                  </div>
                  <div className="text-[12px] font-semibold text-[#333330] uppercase md:col-span-2 md:border-l md:border-[#ccccc7] md:pl-4">
                    {clientName}
                  </div>
                  <div className="text-[12px] font-semibold text-[#333330] uppercase md:col-span-3 md:border-l md:border-[#ccccc7] md:pl-4">
                    {project.disciplines}
                  </div>
                  <div className="font-mono text-[11px] font-semibold text-[#52524e] uppercase md:col-span-2 md:border-l md:border-[#ccccc7] md:pl-4">
                    {stackStr}
                  </div>
                  <div className="font-mono text-[12px] font-bold text-[#0e0e0e] md:col-span-1 md:border-l md:border-[#ccccc7] md:pl-4 md:text-right">
                    {project.year}
                  </div>
                </ProjectLinkWrapper>
              );
            })}
          </div>

          {/* Floating Hover Thumbnail Preview Card (Desktop Index Hover) */}
          {hoveredProject && (
            <div
              aria-hidden="true"
              style={{
                transform: `translate3d(${Math.min(cursorPos.x + 24, 560)}px, ${Math.max(cursorPos.y - 90, 16)}px, 0)`,
              }}
              className="pointer-events-none absolute top-0 left-0 z-30 hidden w-80 overflow-hidden rounded-md border-2 border-[#e3ed33] bg-[#0e0e0e] text-[#f5f5f0] shadow-2xl transition-transform duration-100 ease-out lg:block"
            >
              <div className="flex items-center justify-between border-b border-[#262626] px-3 py-2 text-[10px] font-extrabold tracking-[0.8px] uppercase">
                <span>{hoveredProject.title}</span>
                <span className="text-[#e3ed33]">OKIKE STUDIO</span>
              </div>
              <div className="relative aspect-[16/10] w-full bg-[#141414]">
                <Image
                  src={hoveredProject.image}
                  alt={hoveredProject.imageAlt}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-[9px] font-bold tracking-[0.6px] text-[#ccccc7] uppercase">
                <span>
                  {hoveredProject.title} | {hoveredProject.year}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#e3ed33]">
                  <span>| DESIGNED &amp; BUILT</span>
                  <span className="h-2 w-4 rounded-full bg-[#e3ed33]" />
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
