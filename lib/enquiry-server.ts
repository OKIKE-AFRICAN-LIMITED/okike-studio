import { pricingPackages, type PricingPackage } from "./pricing.ts";
import { serviceIds, type EnquiryPayload, type ServiceId } from "./enquiry.ts";

const limits = {
  goal: 2_000,
  serviceAnswer: 3_000,
  shortAnswer: 200,
  name: 120,
  email: 254,
  company: 160,
} as const;

export type ValidatedEnquiry = Omit<EnquiryPayload, "packageId" | "submission"> & {
  package?: Pick<PricingPackage, "id" | "name" | "price" | "scope">;
  submissionId: string;
};

export type ValidationResult =
  | { success: true; data: ValidatedEnquiry }
  | { success: false; errors: Record<string, string> };

function stringField(value: unknown, field: string, max: number, errors: Record<string, string>, required = false) {
  if (typeof value !== "string") {
    if (required) errors[field] = "This field is required.";
    return "";
  }
  const cleaned = value.trim();
  if (required && !cleaned) errors[field] = "This field is required.";
  if (cleaned.length > max) errors[field] = `Must be ${max} characters or fewer.`;
  return cleaned;
}

export function validateEnquiry(input: unknown, now = Date.now()): ValidationResult {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object" || Array.isArray(input)) return { success: false, errors: { form: "Invalid enquiry payload." } };
  const value = input as Record<string, unknown>;
  const rawServices = Array.isArray(value.services) ? value.services : [];
  const services = [...new Set(rawServices.filter((item): item is ServiceId => typeof item === "string" && serviceIds.includes(item as ServiceId)))];
  if (services.length !== rawServices.length) errors.services = "One or more services are invalid.";
  const helpMeDecide = value.helpMeDecide === true;
  if (!helpMeDecide && services.length === 0) errors.services = "Choose at least one service or Help me decide.";
  if (helpMeDecide && services.length) errors.services = "Help me decide cannot be combined with a selected service.";

  const project = value.project && typeof value.project === "object" && !Array.isArray(value.project) ? value.project as Record<string, unknown> : {};
  const contact = value.contact && typeof value.contact === "object" && !Array.isArray(value.contact) ? value.contact as Record<string, unknown> : {};
  const submission = value.submission && typeof value.submission === "object" && !Array.isArray(value.submission) ? value.submission as Record<string, unknown> : {};
  const goal = stringField(project.goal, "project.goal", limits.goal, errors, true);
  const brand = services.includes("brand") ? stringField(project.brand, "project.brand", limits.serviceAnswer, errors) : undefined;
  const website = services.includes("website") ? stringField(project.website, "project.website", limits.serviceAnswer, errors) : undefined;
  const software = services.includes("software") ? stringField(project.software, "project.software", limits.serviceAnswer, errors) : undefined;
  const budget = stringField(project.budget, "project.budget", limits.shortAnswer, errors);
  const timing = stringField(project.timing, "project.timing", limits.shortAnswer, errors);
  const name = stringField(contact.name, "contact.name", limits.name, errors, true);
  const email = stringField(contact.email, "contact.email", limits.email, errors, true).toLowerCase();
  const company = stringField(contact.company, "contact.company", limits.company, errors);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors["contact.email"] = "Enter a valid email address.";

  const packageRecord = typeof value.packageId === "string" ? pricingPackages.find((item) => item.id === value.packageId) : undefined;
  if (value.packageId !== undefined && !packageRecord) errors.packageId = "Unknown package.";
  if (packageRecord) {
    const expected = packageRecord.id === "custom-software" ? "software" : "website";
    if (services.length !== 1 || services[0] !== expected || helpMeDecide) errors.packageId = "The package does not match the selected service.";
  }

  const submissionId = stringField(submission.id, "submission.id", 64, errors, true);
  if (submissionId && !/^[0-9a-f-]{36}$/i.test(submissionId)) errors["submission.id"] = "Invalid submission identifier.";
  const startedAt = typeof submission.startedAt === "number" ? submission.startedAt : 0;
  if (!Number.isSafeInteger(startedAt) || startedAt <= 0 || startedAt > now) errors["submission.startedAt"] = "Invalid form start time.";
  if (stringField(submission.companyWebsite, "submission.companyWebsite", 200, errors)) errors.form = "Unable to accept this enquiry.";

  if (Object.keys(errors).length) return { success: false, errors };
  return {
    success: true,
    data: {
      services,
      helpMeDecide,
      ...(packageRecord ? { package: { id: packageRecord.id, name: packageRecord.name, price: packageRecord.price, scope: packageRecord.scope } } : {}),
      project: { goal, ...(brand !== undefined ? { brand } : {}), ...(website !== undefined ? { website } : {}), ...(software !== undefined ? { software } : {}), budget, timing },
      contact: { name, email, ...(company ? { company } : {}) },
      submissionId,
    },
  };
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
}

export function renderEnquiryEmail(enquiry: ValidatedEnquiry) {
  const rows: Array<[string, string]> = [
    ["Services", enquiry.helpMeDecide ? "Help me decide" : enquiry.services.join(", ")],
    ...(enquiry.package ? [["Package", `${enquiry.package.name} — ${enquiry.package.price} — ${enquiry.package.scope}`] as [string, string]] : []),
    ["Goal", enquiry.project.goal],
    ...(enquiry.project.brand !== undefined ? [["Brand", enquiry.project.brand] as [string, string]] : []),
    ...(enquiry.project.website !== undefined ? [["Website", enquiry.project.website] as [string, string]] : []),
    ...(enquiry.project.software !== undefined ? [["Software", enquiry.project.software] as [string, string]] : []),
    ["Budget", enquiry.project.budget || "Not provided"],
    ["Timeline", enquiry.project.timing || "Not provided"],
    ["Name", enquiry.contact.name],
    ["Email", enquiry.contact.email],
    ["Company", enquiry.contact.company || "Not provided"],
  ];
  const subjectName = enquiry.contact.name.replace(/[\r\n]+/g, " ");
  const html = `<h1>New OKIKE Studio enquiry</h1><table>${rows.map(([label, content]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td>${escapeHtml(content).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>`;
  const text = ["New OKIKE Studio enquiry", "", ...rows.map(([label, content]) => `${label}: ${content}`)].join("\n");
  return { subject: `New project enquiry from ${subjectName}`, html, text };
}
