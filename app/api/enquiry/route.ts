import { Resend } from "resend";
import { handleEnquiryRequest } from "@/lib/enquiry-handler";

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
  });
}
