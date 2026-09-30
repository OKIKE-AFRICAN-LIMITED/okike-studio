export type PricingPackage = {
  id: "starter" | "business-pro" | "custom-software";
  index: string;
  stage: string;
  name: string;
  price: string;
  description: string;
  scope: string;
  buttonLabel: string;
  href: string;
  highlighted?: boolean;
};

export const pricingPackages = [
  {
    id: "starter",
    index: "01",
    stage: "ESTABLISH",
    name: "Starter Site",
    price: "From ₦150,000",
    description: "For new businesses establishing a clear, professional online presence.",
    scope: "Up to 5 pages",
    buttonLabel: "Enquire about Starter",
    href: "/enquiry?package=starter",
  },
  {
    id: "business-pro",
    index: "02",
    stage: "EXPAND",
    name: "Business Pro",
    price: "From ₦450,000",
    description: "For growing businesses with more services, stories and information to share.",
    scope: "Up to 15 pages",
    buttonLabel: "Enquire about Business Pro",
    href: "/enquiry?package=business-pro",
    highlighted: true,
  },
  {
    id: "custom-software",
    index: "03",
    stage: "BUILD TO FIT",
    name: "Custom Software",
    price: "Quoted individually",
    description: "For products, platforms and workflows needing a purpose-built solution.",
    scope: "Bespoke development",
    buttonLabel: "Request a quote",
    href: "/enquiry?package=custom-software",
  },
] as const satisfies readonly PricingPackage[];
