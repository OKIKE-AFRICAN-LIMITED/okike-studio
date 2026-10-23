import { generateGeminiJson } from "./gemini";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ValidatedEnquiry } from "@/lib/enquiry-server";

export interface TriageResult {
  summary: string;
  tags: {
    urgency: "high" | "medium" | "low";
    category: string;
    estimatedComplexity: "simple" | "moderate" | "complex";
    fit: "strong" | "moderate" | "low";
  };
  spamScore: number;
  spamReason?: string;
}

export async function runEnquiryTriage(
  enquiryId: string,
  enquiry: ValidatedEnquiry
): Promise<TriageResult | null> {
  const prompt = `Analyze this inbound client enquiry for OKIKE Studio (an independent brand, product and software studio):

Client Name: ${enquiry.contact.name}
Client Email: ${enquiry.contact.email}
Company: ${enquiry.contact.company || "Not provided"}
Services: ${enquiry.helpMeDecide ? "Help me decide (Needs guidance)" : enquiry.services.join(", ")}
Package: ${enquiry.package ? `${enquiry.package.name} (${enquiry.package.price})` : "Custom / None"}
Goal: ${enquiry.project.goal}
Brand Details: ${enquiry.project.brand || "N/A"}
Website Details: ${enquiry.project.website || "N/A"}
Software Details: ${enquiry.project.software || "N/A"}
Budget: ${enquiry.project.budget || "Not specified"}
Timeline: ${enquiry.project.timing || "Not specified"}

Provide a JSON object adhering to this schema:
{
  "summary": "1-2 sentence executive summary of the lead's core need and proposition",
  "tags": {
    "urgency": "high" | "medium" | "low",
    "category": "e.g. Ecommerce, Fintech, Professional Services, Brand Launch, Web Application",
    "estimatedComplexity": "simple" | "moderate" | "complex",
    "fit": "strong" | "moderate" | "low"
  },
  "spamScore": 0.0 to 1.0 (0.0 is completely legitimate, 1.0 is spam/bot),
  "spamReason": "optional brief note if spamScore > 0.4"
}`;

  const systemInstruction = `You are the chief operations & lead intake analyst for OKIKE Studio. Evaluate inbound briefs fairly and accurately. Distinguish serious founders from automated spam. Urgency is high if they have an imminent launch date or critical event. Fit is strong if their project aligns with brand, web, or custom software development.`;

  try {
    const { data } = await generateGeminiJson<TriageResult>({
      feature: "enquiry_triage",
      refId: enquiryId,
      prompt,
      systemInstruction,
      temperature: 0.2,
    });

    // Update Supabase enquiry record
    const supabase = createAdminClient();
    await supabase
      .from("enquiries")
      .update({
        ai_summary: data.summary,
        ai_tags: data.tags as unknown as import("@/lib/supabase/types").Json,
        ai_spam_score: data.spamScore,
        ai_triaged_at: new Date().toISOString(),
      })
      .eq("id", enquiryId);

    return data;
  } catch (err) {
    console.error("AI Triage failed:", err);
    return null;
  }
}
