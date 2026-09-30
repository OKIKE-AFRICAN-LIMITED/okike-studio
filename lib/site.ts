export const site = {
  name: "OKIKE Studio",
  email: "studio@okike.com",
  navigation: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Studio", href: "/studio" },
  ],
  enquiryHref: "/enquiry",
} as const;

export type SiteNavigationItem = (typeof site.navigation)[number];
