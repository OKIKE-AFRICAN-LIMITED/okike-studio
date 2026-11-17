export type PortfolioCategory =
  | "brand"
  | "ui"
  | "websites"
  | "automation"
  // Legacy aliases kept for compatibility with existing saved records
  | "digital"
  | "software";

export type GalleryScreen = {
  id: string;
  url: string;
  caption: string;
  type?: "ui" | "brand" | "automation" | "mobile";
};

export type SelectedProject = {
  id: string;
  sequence: string;
  year: string;
  title: string;
  disciplines: string;
  image: string;
  imageAlt: string;
  href?: string;
  featured?: boolean;
  placeholder?: boolean;
  category?: PortfolioCategory;
  categories?: readonly PortfolioCategory[];
  stack?: readonly string[];
  caseStudy?: CaseStudy;
};

export type CaseStudy = {
  slug: string;
  caseNumber: string;
  displayTitle: string;
  metadataTitle: string;
  introduction: readonly [string, string];
  previewNotice: string;
  coverAlt: string;
  facts: {
    client: string;
    sector: string;
    scope: string;
    year: string;
  };
  question: readonly [string, string];
  designDirection: string;
  experience: string;
  outcome: readonly [string, string];
  figmaEmbedUrl?: string;
  liveUrl?: string;
  gallery?: readonly GalleryScreen[];
  placeholder?: boolean;
};

export function toFigmaEmbedUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  if (trimmed.includes("figma.com/embed")) return trimmed;
  return `https://www.figma.com/embed?embed_host=okikestudio&url=${encodeURIComponent(trimmed)}`;
}

export type CanonicalCategory = "brand" | "ui" | "websites" | "automation";

export function normalizeCategory(cat: PortfolioCategory): CanonicalCategory {
  if (cat === "digital") return "websites";
  if (cat === "software") return "automation";
  return cat;
}

export function inferProjectCategories(project: SelectedProject): CanonicalCategory[] {
  const set = new Set<CanonicalCategory>();

  if (project.categories && project.categories.length > 0) {
    for (const c of project.categories) set.add(normalizeCategory(c));
  }
  if (project.category) {
    set.add(normalizeCategory(project.category));
  }

  if (set.size === 0) {
    const disc = project.disciplines.toUpperCase();
    if (disc.includes("BRAND") || disc.includes("IDENTITY") || disc.includes("POSITIONING")) {
      set.add("brand");
    }
    if (disc.includes("UI") || disc.includes("UX") || disc.includes("FIGMA") || disc.includes("PRODUCT")) {
      set.add("ui");
    }
    if (disc.includes("WEB") || disc.includes("DIGITAL") || disc.includes("LAUNCH")) {
      set.add("websites");
    }
    if (disc.includes("AUTOMAT") || disc.includes("AI") || disc.includes("SOFTWARE") || disc.includes("TOOL")) {
      set.add("automation");
    }
    if (set.size === 0) set.add("websites");
  }

  return Array.from(set);
}

export const selectedProjects: readonly SelectedProject[] = [
  {
    id: "koro",
    sequence: "01",
    year: "2026",
    title: "KORO",
    disciplines: "VENTURE STRATEGY / BRAND / PRODUCT",
    image: "/work/koro.png",
    imageAlt: "Hands arranging tactile brand materials on a dark table",
    href: "/work/koro",
    featured: true,
    categories: ["brand", "ui", "websites"],
    stack: ["Brand System", "Figma UI", "Next.js", "Supabase"],
    caseStudy: {
      slug: "koro",
      caseNumber: "01",
      displayTitle: "KORO",
      metadataTitle: "KORO Case Study | OKIKE Studio",
      introduction: [
        "Brand identity, venture positioning, and digital commerce flagship.",
        "Turning a fragmented supply chain offer into a cohesive, high-trust digital brand.",
      ],
      previewNotice: "SELECTED CASE STUDY · OKIKE STUDIO",
      coverAlt: "Hands arranging KORO identity materials on a dark studio table",
      facts: {
        client: "Koro Ventures",
        sector: "B2B Commerce & Logistics",
        scope: "Strategy, visual identity, web platform",
        year: "2026",
      },
      question: [
        "Koro operates across regional merchant networks where trust, speed, and operational clarity determine whether a buyer commits. Their early product worked reliably, but their public presence looked disconnected from the scale of their operation.",
        "Unify brand positioning, visual identity, and the merchant onboarding web flow into one unmistakable system.",
      ],
      designDirection:
        "We paired utilitarian editorial typography with high-contrast monochrome surfaces and decisive signal accents—giving Koro an industrial, architectural authority across both physical collateral and digital interfaces.",
      experience:
        "The web flagship was restructured around buyer intent: clear capability proof, transparent operational tiers, and a streamlined merchant onboarding path built on Next.js for instant page transitions on low-bandwidth connections.",
      outcome: [
        "Koro launched with a unified brand system, a component-driven web platform, and a repeatable design token library their internal engineering team now extends independently.",
        "Sub-second page loads across mobile networks and a 2.4x increase in qualified enterprise onboarding enquiries within the first quarter.",
      ],
    },
  },
  {
    id: "north-common",
    sequence: "02",
    year: "2025",
    title: "NORTH COMMON",
    disciplines: "POSITIONING / IDENTITY / DIGITAL",
    image: "/work/north-common.png",
    imageAlt: "A collaborative team working in a bright open studio",
    href: "/work/north-common",
    categories: ["brand", "websites"],
    stack: ["Brand Identity", "Editorial Grid", "Headless CMS"],
    caseStudy: {
      slug: "north-common",
      caseNumber: "02",
      displayTitle: "NORTH COMMON",
      metadataTitle: "North Common Case Study | OKIKE Studio",
      introduction: [
        "Positioning, editorial identity, and digital portfolio architecture.",
        "Helping a multidisciplinary practice articulate complex spatial and advisory work.",
      ],
      previewNotice: "SELECTED CASE STUDY · OKIKE STUDIO",
      coverAlt: "North Common collaborative studio workspace",
      facts: {
        client: "North Common Partners",
        sector: "Advisory & Spatial Strategy",
        scope: "Positioning, identity system, CMS website",
        year: "2025",
      },
      question: [
        "North Common advises civic and commercial leaders on long-horizon projects, yet their previous site buried their strongest research and case outcomes inside dense, static PDFs.",
        "Create an editorial digital home that makes complex research effortless to navigate and positions the partners for institutional mandates.",
      ],
      designDirection:
        "Drawing from Swiss index systems, we designed a calm, grid-governed layout system where long-form essays, project dossiers, and partner perspectives share a single typographic spine.",
      experience:
        "Visitors move seamlessly between high-level practice areas and deep project indexes, backed by a custom structured CMS that allows partners to publish new research without developer intervention.",
      outcome: [
        "Delivered a complete brand refresh, publication templates, and a fast, accessible digital archive.",
        "Reduced time-to-publish for new case dossiers from two weeks to under thirty minutes.",
      ],
    },
  },
  {
    id: "tend",
    sequence: "03",
    year: "2025",
    title: "TEND",
    disciplines: "PRODUCT / EXPERIENCE / LAUNCH",
    image: "/work/tend.png",
    imageAlt: "Product interface plans pinned beneath a clear acrylic sheet",
    href: "/work/tend",
    categories: ["ui", "automation"],
    stack: ["Figma UI", "Next.js", "TypeScript", "Automation"],
    caseStudy: {
      slug: "tend",
      caseNumber: "03",
      displayTitle: "TEND",
      metadataTitle: "TEND Case Study | OKIKE Studio",
      introduction: [
        "Product interface architecture, workflow design, and launch website.",
        "Designing calm, dependable software for distributed operations teams.",
      ],
      previewNotice: "SELECTED CASE STUDY · OKIKE STUDIO",
      coverAlt: "TEND product interface plans and component specifications",
      facts: {
        client: "Tend Systems",
        sector: "Operations Software (SaaS)",
        scope: "Product UI, design system, launch flagship",
        year: "2025",
      },
      question: [
        "Operations managers using Tend were juggling spreadsheets, chat threads, and legacy dashboards to track daily field milestones. Feature bloat was slowing down adoption.",
        "Strip away interface noise and establish a focused product UI paired with a conversion-ready commercial launch site.",
      ],
      designDirection:
        "We established a high-legibility interface grammar built around status clarity, keyboard-first navigation, and tactile state feedback.",
      experience:
        "Both the core web application and the public marketing flagship share the same underlying React component primitives—ensuring zero visual drift between the promise on the website and the product in use.",
      outcome: [
        "Shipped a unified UI kit, interactive product walkthroughs, and a high-converting self-serve onboarding flow.",
        "Cut average new-team setup time by 60% during the commercial launch cohort.",
      ],
    },
  },
];
