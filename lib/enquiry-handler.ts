import { renderEnquiryEmail, validateEnquiry, type ValidatedEnquiry } from "./enquiry-server.ts";

const maxBodyBytes = 24_000;
const genericDeliveryError = "We couldn’t submit your enquiry. Your answers are still here, so please try again.";
const missingConfigurationError = "Enquiry delivery is temporarily unavailable. Email studio@okike.com while setup is completed.";

export type ResendSendResult = {
  data: { id: string } | null;
  error: unknown;
};

export type EnquiryHandlerDependencies = {
  apiKey?: string;
  from?: string;
  to?: string;
  send: (message: {
    from: string;
    to: string[];
    replyTo: string;
    subject: string;
    html: string;
    text: string;
  }, options: { idempotencyKey: string }) => Promise<ResendSendResult>;
  saveEnquiry?: (enquiry: ValidatedEnquiry) => Promise<{ id?: string; error?: unknown }>;
  triggerTriage?: (enquiryId: string, enquiry: ValidatedEnquiry) => Promise<void>;
};

export async function handleEnquiryRequest(request: Request, dependencies: EnquiryHandlerDependencies) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return Response.json({ ok: false, error: "Send the enquiry as JSON." }, { status: 415 });
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBodyBytes) return Response.json({ ok: false, error: "The enquiry is too large." }, { status: 413 });
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > maxBodyBytes) return Response.json({ ok: false, error: "The enquiry is too large." }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const result = validateEnquiry(body);
  if (!result.success) return Response.json({ ok: false, error: "Check the highlighted details.", fields: result.errors }, { status: 422 });
  if (!dependencies.apiKey || !dependencies.from || !dependencies.to) {
    return Response.json({ ok: false, error: missingConfigurationError }, { status: 503, headers: { "Retry-After": "3600" } });
  }
  if (dependencies.to.toLowerCase() !== "studio@okike.com") {
    return Response.json({ ok: false, error: missingConfigurationError }, { status: 503, headers: { "Retry-After": "3600" } });
  }

  // 1. Persist to database first (so enquiries are never lost even if email fails)
  let savedId: string | undefined;
  if (dependencies.saveEnquiry) {
    try {
      const saveRes = await dependencies.saveEnquiry(result.data);
      savedId = saveRes?.id;
    } catch (saveErr) {
      console.warn("Enquiry database save non-fatal error:", saveErr);
    }
  }

  const email = renderEnquiryEmail(result.data);
  try {
    const providerResult = await dependencies.send({
      from: dependencies.from,
      to: [dependencies.to],
      replyTo: result.data.contact.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    }, { idempotencyKey: result.data.submissionId });

    if (providerResult.error || !providerResult.data?.id) {
      return Response.json({ ok: false, error: genericDeliveryError }, { status: 502 });
    }

    // 2. Trigger asynchronous AI triage
    if (savedId && dependencies.triggerTriage) {
      dependencies.triggerTriage(savedId, result.data).catch((triageErr) => {
        console.warn("Enquiry AI triage background error:", triageErr);
      });
    }

    return Response.json({
      ok: true,
      message: "Your enquiry has been submitted.",
      ...(savedId ? { enquiryId: savedId } : {}),
    }, { status: 200 });
  } catch {
    return Response.json({ ok: false, error: genericDeliveryError }, { status: 502 });
  }
}
