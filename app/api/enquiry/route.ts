import { Resend } from "resend";
import { handleEnquiryRequest } from "@/lib/enquiry-handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { runEnquiryTriage } from "@/lib/ai/triage";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = apiKey ? new Resend(apiKey) : null;
  return handleEnquiryRequest(request, {
    apiKey,
    from: process.env.ENQUIRY_FROM_EMAIL,
    to: process.env.ENQUIRY_TO_EMAIL,
    send: async (message, options) => {
      if (!resend) return { data: null, error: new Error("Resend is not configured") };
      return resend.emails.send(message, options);
    },
    saveEnquiry: async (enquiry) => {
      try {
        const supabase = createAdminClient();
        const scopeAnswers: Record<string, string> = {
          goal: enquiry.project.goal,
          budget: enquiry.project.budget,
          timing: enquiry.project.timing,
        };
        if (enquiry.project.brand) scopeAnswers.brand = enquiry.project.brand;
        if (enquiry.project.website) scopeAnswers.website = enquiry.project.website;
        if (enquiry.project.software) scopeAnswers.software = enquiry.project.software;

        const { data, error } = await supabase
          .from("enquiries")
          .upsert(
            {
              submission_id: enquiry.submissionId,
              client_name: enquiry.contact.name,
              client_email: enquiry.contact.email,
              client_company: enquiry.contact.company || null,
              services: enquiry.services,
              package_selected: enquiry.package?.id || null,
              scope_answers: scopeAnswers,
              budget_range: enquiry.project.budget || null,
              timeline: enquiry.project.timing || null,
              status: "new",
              source: "website",
              consent_at: enquiry.consentAt || new Date().toISOString(),
              assistant_used: enquiry.assistantUsed || false,
              ai_recommended_package: enquiry.aiRecommendedPackage || null,
            },
            { onConflict: "submission_id" }
          )
          .select("id")
          .single();

        if (error) {
          console.warn("Could not save enquiry in DB:", error.message);
          return { error };
        }
        return { id: data?.id };
      } catch (err) {
        console.warn("Supabase connection skipped in enquiry save:", err);
        return { error: err };
      }
    },
    triggerTriage: async (enquiryId, enquiry) => {
      await runEnquiryTriage(enquiryId, enquiry);
    },
  });
}

