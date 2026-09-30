export type TeamRecord = {
  id: string;
  image: string;
  imageAlt: string;
  caption: string;
  namesAndRoles: string;
  introduction: string;
  placeholder: boolean;
};

export const studioTeam = [
  {
    id: "team-placeholder",
    image: "/studio/team-placeholder.png",
    imageAlt: "People collaborating around tables in a bright studio workspace",
    caption: "Sample image, replace before launch.",
    namesAndRoles: "[Team names and roles]",
    introduction: "[Add a short introduction to the people shaping the work.]",
    placeholder: true,
  },
] as const satisfies readonly TeamRecord[];
