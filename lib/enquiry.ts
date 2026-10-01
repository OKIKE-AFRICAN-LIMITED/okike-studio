import { pricingPackages, type PricingPackage } from "./pricing.ts";

export const serviceIds = ["brand", "website", "software"] as const;
export type ServiceId = (typeof serviceIds)[number];
export type PackageId = PricingPackage["id"];

export type EnquiryAnswers = {
  goal: string;
  brand: string;
  website: string;
  software: string;
  budget: string;
  timing: string;
  name: string;
  email: string;
  company: string;
};

export type EnquiryPayload = {
  services: ServiceId[];
  helpMeDecide: boolean;
  packageId?: PackageId;
  project: { goal: string; brand?: string; website?: string; software?: string; budget: string; timing: string };
  contact: { name: string; email: string; company?: string };
  submission: { id: string; startedAt: number; companyWebsite: string };
};

export function parsePackage(value?: string | string[]): PricingPackage | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  return pricingPackages.find((item) => item.id === candidate);
}

export function servicesForPackage(packageId?: PackageId): ServiceId[] {
  if (packageId === "custom-software") return ["software"];
  if (packageId === "starter" || packageId === "business-pro") return ["website"];
  return [];
}

export function buildPayload(services: ServiceId[], helpMeDecide: boolean, packageId: PackageId | undefined, answers: EnquiryAnswers, submission?: EnquiryPayload["submission"]): EnquiryPayload {
  return {
    services,
    helpMeDecide,
    ...(packageId ? { packageId } : {}),
    project: {
      goal: answers.goal.trim(),
      ...(services.includes("brand") ? { brand: answers.brand.trim() } : {}),
      ...(services.includes("website") ? { website: answers.website.trim() } : {}),
      ...(services.includes("software") ? { software: answers.software.trim() } : {}),
      budget: answers.budget.trim(),
      timing: answers.timing.trim(),
    },
    contact: {
      name: answers.name.trim(),
      email: answers.email.trim(),
      ...(answers.company.trim() ? { company: answers.company.trim() } : {}),
    },
    submission: submission ?? { id: crypto.randomUUID(), startedAt: Date.now(), companyWebsite: "" },
  };
}

export function payloadErrors(payload: EnquiryPayload): string[] {
  const errors: string[] = [];
  if (!payload.helpMeDecide && payload.services.length === 0) errors.push("Choose at least one service or select Help me decide.");
  if (!payload.project.goal) errors.push("Tell us about your goal.");
  if (!payload.contact.name) errors.push("Enter your name.");
  if (!/^\S+@\S+\.\S+$/.test(payload.contact.email)) errors.push("Enter a valid email address.");
  return errors;
}
