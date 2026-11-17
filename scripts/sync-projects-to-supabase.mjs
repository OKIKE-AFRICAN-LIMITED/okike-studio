import fs from "node:fs";
import path from "node:path";

const envRaw = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf8");
const url = envRaw.match(/^NEXT_PUBLIC_SUPABASE_URL="?([^"\r\n]+)/m)?.[1];
const key = envRaw.match(/^SUPABASE_SERVICE_ROLE_KEY="?([^"\r\n]+)/m)?.[1];

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const projects = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "data/studio-projects.json"), "utf8")
);

const rows = projects.map((p, idx) => ({
  id: p.id,
  sequence: p.sequence,
  year: p.year,
  title: p.title,
  disciplines: p.disciplines,
  image: p.image,
  image_alt: p.imageAlt,
  href: p.href,
  featured: Boolean(p.featured),
  sort_order: idx + 1,
  is_published: true,
  case_study: {
    ...p.caseStudy,
    categories: p.categories,
    stack: p.stack,
  },
  updated_at: new Date().toISOString(),
}));

const res = await fetch(`${url}/rest/v1/studio_projects?on_conflict=id`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  },
  body: JSON.stringify(rows),
});

if (!res.ok) {
  throw new Error(`Supabase sync failed (${res.status}): ${await res.text()}`);
}

console.log(`Synced ${rows.length} enriched projects to Supabase studio_projects!`);
