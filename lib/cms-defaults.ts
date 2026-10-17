export interface HomePageContent {
  hero: {
    eyebrowLeft: string;
    eyebrowRight: string;
    headingLine1: string;
    headingLine2: string;
    headingLine3: string;
    description: string;
    primaryCtaText: string;
    primaryCtaHref: string;
    secondaryCtaText: string;
    secondaryCtaHref: string;
    railDisciplines: string;
  };
  systemsFirst: {
    eyebrow: string;
    subEyebrow: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    discipline1Title: string;
    discipline1Desc: string;
    discipline2Title: string;
    discipline2Desc: string;
    discipline3Title: string;
    discipline3Desc: string;
  };
  closingCta: {
    masthead: string;
    headingLine1: string;
    headingLine2: string;
    description: string;
    buttonText: string;
    buttonHref: string;
  };
}

export interface ServicesPageContent {
  intro: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    paragraph1: string;
    paragraph2: string;
  };
  beforeWeBegin: {
    heading: string;
    lead: string;
    commitment: string;
  };
}

export interface StudioPageContent {
  intro: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    paragraph1: string;
    paragraph2: string;
  };
  story: {
    heading: string;
    paragraph1: string;
    paragraph2: string;
  };
}

export interface SiteSettingsContent {
  siteName: string;
  contactEmail: string;
  location: string;
  availabilityBadge: string;
  metaDescription: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
}

export const defaultHomePageContent: HomePageContent = {
  hero: {
    eyebrowLeft: "INDEPENDENT STUDIO",
    eyebrowRight: "BRAND, PRODUCT & TECHNOLOGY",
    headingLine1: "STRUCTURE.",
    headingLine2: "BEFORE",
    headingLine3: "SCALE.",
    description: "We turn ambitious ideas into distinct brands, useful digital products and ventures built to grow.",
    primaryCtaText: "Start a project",
    primaryCtaHref: "/enquiry",
    secondaryCtaText: "View selected work",
    secondaryCtaHref: "/work",
    railDisciplines: "01 STRATEGY / 02 DESIGN / 03 DEVELOPMENT",
  },
  systemsFirst: {
    eyebrow: "01 / SYSTEMS FIRST",
    subEyebrow: "HOW WE THINK",
    headingLine1: "Good ideas need",
    headingLine2: "a working system.",
    description: "We connect strategy, identity and technology from the start. Your positioning shapes the experience. The experience guides what we build.",
    discipline1Title: "01 / STRATEGY",
    discipline1Desc: "Define who it is for, what it needs to do, and what makes it different.",
    discipline2Title: "02 / IDENTITY",
    discipline2Desc: "Turn that direction into a visual language and an experience people recognise.",
    discipline3Title: "03 / TECHNOLOGY",
    discipline3Desc: "Build the experience on a technical foundation your team can maintain and extend.",
  },
  closingCta: {
    masthead: "Have something in mind?",
    headingLine1: "Let's build",
    headingLine2: "what comes next.",
    description: "Tell us what you're building, where you are now, and what you need help with.",
    buttonText: "Tell us about your project",
    buttonHref: "/enquiry",
  },
};

export const defaultServicesPageContent: ServicesPageContent = {
  intro: {
    eyebrow: "THE STUDIO / SERVICES",
    headingLine1: "FROM IDEA",
    headingLine2: "TO LAUNCH.",
    paragraph1: "Design the identity. Build the experience. Prepare for launch.",
    paragraph2: "Start with the part your business needs now.",
  },
  beforeWeBegin: {
    heading: "BEFORE WE BEGIN",
    lead: "We work in focused sprints with direct partner involvement and zero unnecessary handoff layers.",
    commitment: "Clear scopes, fixed timelines, verified design systems, and transparent code repositories.",
  },
};

export const defaultStudioPageContent: StudioPageContent = {
  intro: {
    eyebrow: "OKIKE STUDIO / WHO WE ARE",
    headingLine1: "GOOD WORK.",
    headingLine2: "SHARED PURPOSE.",
    paragraph1: "An independent studio connecting strategy, identity and technology.",
    paragraph2: "We help founders and small teams turn an idea into something ready to use.",
  },
  story: {
    heading: "HOW WE STARTED",
    paragraph1: "OKIKE was formed around a simple conviction: technology works better when the strategy and visual design are built together from day one.",
    paragraph2: "We operate as an agile, multidisciplinary practice with zero bloated agency layers and direct technical collaboration.",
  },
};

export const defaultSiteSettingsContent: SiteSettingsContent = {
  siteName: "OKIKE Studio",
  contactEmail: "studio@okike.com",
  location: "Lagos · London · Global",
  availabilityBadge: "Q1/Q2 2026 ENGAGEMENTS OPEN",
  metaDescription: "Independent studio connecting strategy, identity and technology for ambitious ventures.",
  twitterUrl: "https://x.com",
  linkedinUrl: "https://linkedin.com",
  instagramUrl: "https://instagram.com",
};
