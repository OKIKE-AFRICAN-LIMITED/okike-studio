import fs from "node:fs";
import path from "node:path";

const OLD_ENV_PATH = path.resolve(
  process.cwd(),
  "../OKIKE-MAIN/okike-enterprise-publish/.env"
);
const NEW_ENV_PATH = path.resolve(process.cwd(), ".env");
const PROJECTS_JSON_PATH = path.resolve(process.cwd(), "data/studio-projects.json");
const MIGRATED_IMG_DIR = path.resolve(process.cwd(), "public/work/migrated");

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing env file: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const map = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    map[key] = val;
  }
  return map;
}

function slugify(text) {
  return String(text || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferCategories(title, tags = [], description = "", url = "") {
  const haystack = `${title} ${tags.join(" ")} ${description} ${url}`.toUpperCase();
  const cats = new Set();

  if (
    haystack.includes("BRAND") ||
    haystack.includes("LOGO") ||
    haystack.includes("IDENTITY") ||
    haystack.includes("KRAIT")
  ) {
    cats.add("brand");
  }
  if (
    haystack.includes("UI") ||
    haystack.includes("UX") ||
    haystack.includes("FIGMA") ||
    haystack.includes("DESIGN")
  ) {
    cats.add("ui");
  }
  if (
    haystack.includes("WEB") ||
    haystack.includes("SITE") ||
    haystack.includes("STORE") ||
    haystack.includes("NEXT") ||
    haystack.includes("REACT") ||
    haystack.includes("APP") ||
    (url && !url.includes("figma.com"))
  ) {
    cats.add("websites");
  }
  if (
    haystack.includes("AUTOMAT") ||
    haystack.includes("AI") ||
    haystack.includes("BOT") ||
    haystack.includes("WORKFLOW") ||
    haystack.includes("TOOL") ||
    haystack.includes("DATA")
  ) {
    cats.add("automation");
  }

  if (cats.size === 0) cats.add("websites");
  return Array.from(cats);
}

async function downloadImage(imageUrl, slug) {
  if (!imageUrl) return "/work/koro.png";
  if (imageUrl.startsWith("/")) return imageUrl;

  try {
    fs.mkdirSync(MIGRATED_IMG_DIR, { recursive: true });
    const res = await fetch(imageUrl);
    if (!res.ok) return imageUrl;

    const contentType = res.headers.get("content-type") || "";
    let ext = ".png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) ext = ".jpg";
    else if (contentType.includes("webp")) ext = ".webp";
    else if (contentType.includes("svg")) ext = ".svg";
    else {
      const urlExt = path.extname(new URL(imageUrl).pathname);
      if (urlExt) ext = urlExt;
    }

    const fileName = `${slug}${ext}`;
    const dest = path.join(MIGRATED_IMG_DIR, fileName);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buffer);
    return `/work/migrated/${fileName}`;
  } catch (err) {
    console.warn(`Could not download image for ${slug}, keeping remote URL:`, err.message);
    return imageUrl;
  }
}

async function main() {
  console.log("Reading old and new Supabase configurations...");
  const oldEnv = readEnvFile(OLD_ENV_PATH);
  const newEnv = readEnvFile(NEW_ENV_PATH);

  const oldUrl = oldEnv.SUPABASE_URL || oldEnv.VITE_SUPABASE_URL;
  const oldKey = oldEnv.SUPABASE_SERVICE_ROLE_KEY || oldEnv.SUPABASE_ANON_KEY;
  if (!oldUrl || !oldKey) {
    throw new Error("Old Supabase URL or key missing in OKIKE-MAIN/.env");
  }

  console.log(`Fetching portfolio_items from ${oldUrl}...`);
  const res = await fetch(`${oldUrl}/rest/v1/portfolio_items?select=*&order=position.asc`, {
    headers: {
      apikey: oldKey,
      Authorization: `Bearer ${oldKey}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch old portfolio_items: ${res.status} ${await res.text()}`);
  }

  const oldItems = await res.json();
  if (!Array.isArray(oldItems) || oldItems.length === 0) {
    console.log("No items found in old portfolio_items table.");
    return;
  }

  console.log(`Found ${oldItems.length} portfolio item(s). Migrating assets and structure...`);

  const migratedProjects = [];
  for (let i = 0; i < oldItems.length; i++) {
    const item = oldItems[i];
    const title = String(item.title || `PROJECT ${i + 1}`).trim();
    const slug = slugify(title);
    const seq = String(i + 1).padStart(2, "0");
    const year = item.created_at
      ? String(new Date(item.created_at).getFullYear())
      : "2025";
    const tags = Array.isArray(item.tags) ? item.tags.map(String) : [];
    const description = String(item.description || "").trim();
    const rawUrl = String(item.url || "").trim();
    const isFigma = rawUrl.toLowerCase().includes("figma.com");

    const localImage = await downloadImage(item.image_url, slug);
    const categories = inferCategories(title, tags, description, rawUrl);
    const disciplines =
      tags.length > 0
        ? tags.join(" / ").toUpperCase()
        : categories.join(" / ").toUpperCase();

    const projectRecord = {
      id: slug,
      sequence: seq,
      year,
      title: title.toUpperCase(),
      disciplines,
      image: localImage,
      imageAlt: `${title} project showcase`,
      href: `/work/${slug}`,
      featured: i === 0,
      categories,
      stack: tags.length > 0 ? tags : ["Brand Identity", "Next.js"],
      caseStudy: {
        slug,
        caseNumber: seq,
        displayTitle: title.toUpperCase(),
        metadataTitle: `${title} Case Study | OKIKE Studio`,
        introduction: [
          description || `${disciplines} crafted by OKIKE Studio.`,
          "Migrated from the OKIKE Enterprises flagship archive.",
        ],
        previewNotice: "SELECTED CASE STUDY · OKIKE STUDIO",
        coverAlt: `${title} showcase visual`,
        facts: {
          client: title,
          sector: tags[0] || "Digital & Brand",
          scope: tags.join(", ") || disciplines,
          year,
        },
        question: [
          description ||
            `${title} partnered with OKIKE Studio to build a clear, durable digital presence and product experience.`,
          "Establish a cohesive visual system and dependable technical execution built for growth.",
        ],
        designDirection:
          "Structured visual hierarchy, purposeful typography, and cohesive system components across every touchpoint.",
        experience:
          description ||
          "Designed and engineered with fast performance, clear user journeys, and maintainable architecture.",
        outcome: [
          `Delivered ${title} with full brand and technical alignment.`,
          rawUrl ? `Live reference: ${rawUrl}` : "Shipped cleanly to production.",
        ],
        ...(isFigma ? { figmaEmbedUrl: rawUrl } : {}),
        ...(rawUrl && !isFigma ? { liveUrl: rawUrl } : {}),
      },
    };

    migratedProjects.push(projectRecord);
    console.log(`  [${seq}] ${title} -> /work/${slug} (${categories.join(", ")})`);
  }

  // 1. Write local JSON store
  fs.mkdirSync(path.dirname(PROJECTS_JSON_PATH), { recursive: true });
  fs.writeFileSync(PROJECTS_JSON_PATH, JSON.stringify(migratedProjects, null, 2), "utf8");
  console.log(`Saved ${migratedProjects.length} projects to data/studio-projects.json`);

  // 2. Upsert into new OKIKE Studio Supabase if configured
  const newUrl = newEnv.NEXT_PUBLIC_SUPABASE_URL;
  const newServiceKey = newEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (newUrl && newServiceKey && !newUrl.includes("placeholder")) {
    console.log(`Upserting ${migratedProjects.length} projects into new Supabase (${newUrl})...`);
    const rows = migratedProjects.map((p, idx) => ({
      id: p.id,
      sequence: p.sequence,
      year: p.year,
      title: p.title,
      disciplines: p.disciplines,
      image: p.image,
      image_alt: p.imageAlt,
      href: p.href,
      featured: p.featured,
      sort_order: idx + 1,
      is_published: true,
      case_study: {
        ...p.caseStudy,
        categories: p.categories,
        stack: p.stack,
      },
      updated_at: new Date().toISOString(),
    }));

    const upsertRes = await fetch(`${newUrl}/rest/v1/studio_projects?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: newServiceKey,
        Authorization: `Bearer ${newServiceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(rows),
    });

    if (!upsertRes.ok) {
      console.warn(
        `Supabase upsert returned ${upsertRes.status}: ${await upsertRes.text()}\n` +
          `Local data/studio-projects.json is already updated, and you can also save from /admin/projects.`
      );
    } else {
      console.log("Successfully synced all projects to new OKIKE Studio Supabase!");
    }
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
