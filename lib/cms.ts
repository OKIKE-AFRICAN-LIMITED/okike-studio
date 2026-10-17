import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { selectedProjects, type SelectedProject } from "@/lib/projects";
import {
  defaultHomePageContent,
  defaultServicesPageContent,
  defaultStudioPageContent,
  defaultSiteSettingsContent,
  type HomePageContent,
  type ServicesPageContent,
  type StudioPageContent,
  type SiteSettingsContent,
} from "./cms-defaults";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "studio-projects.json");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Ignore error if exists
  }
}

// -------------------------------------------------------------
// PROJECTS CMS
// -------------------------------------------------------------

async function readLocalProjects(): Promise<SelectedProject[] | null> {
  try {
    const raw = await fs.readFile(PROJECTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // File doesn't exist yet
  }
  return null;
}

async function writeLocalProjects(projects: SelectedProject[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local projects file:", err);
  }
}

export async function getStudioProjects(): Promise<SelectedProject[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("studio_projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        sequence: row.sequence,
        year: row.year,
        title: row.title,
        disciplines: row.disciplines,
        image: row.image,
        imageAlt: row.image_alt,
        href: (row.href as SelectedProject["href"]) || undefined,
        featured: row.featured,
        placeholder: true as const,
        caseStudy: (row.case_study as unknown as SelectedProject["caseStudy"]) || undefined,
      }));
    }
  } catch {
    // Fall back to local file / defaults
  }

  // Check local file cache
  const local = await readLocalProjects();
  if (local && local.length > 0) {
    return local;
  }

  return [...selectedProjects];
}

export async function getStudioProjectBySlug(slug: string): Promise<SelectedProject | null> {
  const all = await getStudioProjects();
  return all.find((p) => p.id === slug || p.caseStudy?.slug === slug) ?? null;
}

export async function saveStudioProject(
  project: SelectedProject
): Promise<{ success: boolean; error?: string }> {
  // 1. Update local file storage first so changes are immediate
  try {
    const current = await getStudioProjects();
    const index = current.findIndex((p) => p.id === project.id);
    let updatedList: SelectedProject[];
    if (index >= 0) {
      updatedList = current.map((p) => (p.id === project.id ? project : p));
    } else {
      updatedList = [...current, project];
    }
    await writeLocalProjects(updatedList);
  } catch (e: unknown) {
    console.error("Error updating local project store:", e);
  }

  // 2. Persist to Supabase studio_projects table
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("studio_projects").upsert({
      id: project.id,
      sequence: project.sequence,
      year: project.year,
      title: project.title,
      disciplines: project.disciplines,
      image: project.image,
      image_alt: project.imageAlt,
      href: project.href,
      featured: project.featured || false,
      is_published: true,
      case_study: project.caseStudy as unknown as import("@/lib/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn("Supabase studio_projects upsert warning (stored in local store):", error.message);
    }
  } catch {
    // Local store succeeded
  }

  return { success: true };
}

export async function deleteStudioProject(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getStudioProjects();
    const filtered = current.filter((p) => p.id !== id);
    await writeLocalProjects(filtered);
  } catch (e: unknown) {
    console.error("Failed to delete from local store:", e);
  }

  try {
    const supabase = createAdminClient();
    await supabase.from("studio_projects").delete().eq("id", id);
  } catch {
    // Local delete succeeded
  }

  return { success: true };
}

// -------------------------------------------------------------
// PUBLIC PAGES CMS
// -------------------------------------------------------------

async function readLocalSiteContent(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeLocalSiteContent(data: Record<string, unknown>): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write local content file:", err);
  }
}

export async function getSiteContent<T>(pageKey: string, defaultData: T): Promise<T> {
  // 1. Try Supabase
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_pages_content")
      .select("content")
      .eq("id", pageKey)
      .single();

    if (data?.content) {
      return { ...defaultData, ...(data.content as Record<string, unknown>) };
    }
  } catch {
    // Fall back to local
  }

  // 2. Try Local File
  try {
    const local = await readLocalSiteContent();
    if (local[pageKey]) {
      return { ...defaultData, ...(local[pageKey] as Record<string, unknown>) };
    }
  } catch {
    // Fall back
  }

  return defaultData;
}

export async function saveSiteContent(
  pageKey: string,
  content: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  // 1. Save locally
  try {
    const current = await readLocalSiteContent();
    current[pageKey] = content;
    await writeLocalSiteContent(current);
  } catch (e: unknown) {
    console.error("Failed to write local site content:", e);
  }

  // 2. Save to Supabase
  try {
    const supabase = createAdminClient();
    await supabase.from("site_pages_content").upsert({
      id: pageKey,
      title: `${pageKey.toUpperCase()} Page Content`,
      content: content as unknown as import("@/lib/supabase/types").Json,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // Local write succeeded
  }

  return { success: true };
}

// Convenient loaders for public pages
export async function getHomePageContent(): Promise<HomePageContent> {
  return getSiteContent<HomePageContent>("home", defaultHomePageContent);
}

export async function getServicesPageContent(): Promise<ServicesPageContent> {
  return getSiteContent<ServicesPageContent>("services", defaultServicesPageContent);
}

export async function getStudioPageContent(): Promise<StudioPageContent> {
  return getSiteContent<StudioPageContent>("studio", defaultStudioPageContent);
}

export async function getSiteSettingsContent(): Promise<SiteSettingsContent> {
  return getSiteContent<SiteSettingsContent>("settings", defaultSiteSettingsContent);
}
