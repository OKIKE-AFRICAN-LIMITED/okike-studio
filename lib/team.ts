export type TeamRecord = {
  id: string;
  image: string;
  imageAlt: string;
  caption: string;
  namesAndRoles: string;
  introduction: string;
  placeholder?: boolean;
};

export const studioTeam: readonly TeamRecord[] = [
  {
    id: "studio-practice",
    image: "/studio/team-placeholder.png",
    imageAlt: "Designers and engineers collaborating around a studio table",
    caption: "Strategy, visual identity, and software engineering working at the same table.",
    namesAndRoles: "PRINCIPAL STRATEGY · BRAND DIRECTION · SYSTEMS ENGINEERING",
    introduction:
      "OKIKE is led by senior brand designers and full-stack product engineers who partner directly with founders from first brief to production release—without account layers or handoff friction.",
  },
];
