import type { Metadata } from "next";
import { EnquiryFlow } from "@/components/enquiry/enquiry-flow";
import { parsePackage } from "@/lib/enquiry";

export const metadata: Metadata = { title: "Project Enquiry | OKIKE Studio" };

export default async function EnquiryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const selectedPackage = parsePackage(params.package);
  const previews = ["validation", "sending", "failure", "confirmation"] as const;
  const preview = process.env.NODE_ENV === "development" && typeof params.preview === "string" && previews.includes(params.preview as (typeof previews)[number]) ? params.preview as (typeof previews)[number] : undefined;
  return <EnquiryFlow initialPackageId={selectedPackage?.id} preview={preview} />;
}
