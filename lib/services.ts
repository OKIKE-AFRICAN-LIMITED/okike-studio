export type ServiceId = "design" | "build" | "deploy";

export type StudioService = {
  id: ServiceId;
  number: string;
  title: string;
  summary: string;
  description: string;
  deliverables: string;
  scopeNote: string;
};

export const studioServices = [
  {
    id: "design",
    number: "01",
    title: "Design",
    summary: "Give the idea a clear position and a visual identity people recognise.",
    description: "For a new business or an identity that needs a clearer direction. Define the positioning, visual language and user experience before development.",
    deliverables: "POSITIONING / VISUAL IDENTITY / UX & UI",
    scopeNote: "Scope agreed around your existing brand and goals.",
  },
  {
    id: "build",
    number: "02",
    title: "Build",
    summary: "Turn the direction into a website or digital product people can use.",
    description: "For a business website or a product with specific workflows. Turn the agreed designs into a responsive, reviewable build.",
    deliverables: "WEBSITES / DIGITAL PRODUCTS / PROTOTYPES",
    scopeNote: "Pages, integrations and functionality scoped before quoting.",
  },
  {
    id: "deploy",
    number: "03",
    title: "Deploy",
    summary: "Get ready for launch, equip your team, and improve what comes next.",
    description: "For a project approaching launch. Prepare the release, check the experience and give the team a clear handover.",
    deliverables: "LAUNCH CHECKS / HANDOVER / ITERATION",
    scopeNote: "Ongoing support is scoped separately.",
  },
] as const satisfies readonly StudioService[];
