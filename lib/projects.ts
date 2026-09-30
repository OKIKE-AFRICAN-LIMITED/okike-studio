export type SelectedProject = {
  id: "koro" | "north-common" | "tend";
  sequence: string;
  year: string;
  title: string;
  disciplines: string;
  image: string;
  imageAlt: string;
  href?: `/work/${string}`;
  featured?: boolean;
  placeholder: true;
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
  placeholder: true;
};

/**
 * Placeholder portfolio records copied from the current Figma composition.
 * Replace these with the final project data and routes when case studies exist.
 */
export const selectedProjects = [
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
    placeholder: true,
    caseStudy: {
      slug: "koro",
      caseNumber: "01",
      displayTitle: "PROJECT 01",
      metadataTitle: "Project 01 | OKIKE Studio",
      introduction: [
        "Brand identity and digital experience.",
        "A project story, from the first question to the final system.",
      ],
      previewNotice: "TEMPLATE PREVIEW · Sample imagery and content",
      coverAlt: "Hands arranging Project 01 identity materials on a dark table",
      facts: {
        client: "[Client name]",
        sector: "[Industry]",
        scope: "Strategy, identity, website",
        year: "[Completion year]",
      },
      question: [
        "[Introduce the business and the people it serves. Explain what needed to change, why it mattered, and the constraints shaping the project.]",
        "[State the agreed goal in one clear sentence. Keep the focus on the client’s problem.]",
      ],
      designDirection: "[Explain the central design decision and how it connects the identity, content and digital experience.]",
      experience: "[Describe the key user journey and show how the design supports it. Replace the preview below with final project screens.]",
      outcome: [
        "[Summarise what was delivered and what changed for the client or their customers.]",
        "[Add verified results with a source and time period, or describe observable improvements when metrics are unavailable.]",
      ],
      placeholder: true,
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
    placeholder: true,
  },
  {
    id: "tend",
    sequence: "03",
    year: "2025",
    title: "TEND",
    disciplines: "PRODUCT / EXPERIENCE / LAUNCH",
    image: "/work/tend.png",
    imageAlt: "Product interface plans pinned beneath a clear acrylic sheet",
    placeholder: true,
  },
] as const satisfies readonly SelectedProject[];
