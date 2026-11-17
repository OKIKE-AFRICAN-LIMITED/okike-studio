import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateFeedbackPayload, formatFeedbackEmail } from "@/lib/portal-feedback";

export async function POST(request: Request) {
  try {
    const raw = await request.json().catch(() => null);

    // Check user session
    let userEmail: string | undefined;
    let userName: string | undefined;
    let clientId: string | undefined;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userEmail = user.email;
        clientId = user.id;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (profile?.full_name) userName = profile.full_name;
      }
    } catch {
      // In development or if auth cookies are absent, fallback gracefully
    }

    const validation = validateFeedbackPayload(raw, { email: userEmail, name: userName });
    if (!validation.ok) {
      return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
    }

    const feedback = validation.data;

    // 1. Persist to Supabase if database is available
    try {
      const adminSupabase = createAdminClient();
      await adminSupabase.from("project_feedback").insert({
        project_id: feedback.projectId,
        deliverable_id: feedback.deliverableId,
        client_id: clientId || null,
        author_email: feedback.authorEmail,
        author_name: feedback.authorName,
        feedback_type: feedback.category,
        priority: feedback.priority,
        message: feedback.message,
        reference_url: feedback.referenceUrl,
        status: "open",
      });
    } catch {
      // Non-fatal if table not migrated yet
    }

    // 2. Send instant email notification to studio leads via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.ENQUIRY_TO_EMAIL || "hello@okikestudio.com";
    const fromEmail = process.env.ENQUIRY_FROM_EMAIL || "studio@okikestudio.com";

    if (resendApiKey && !resendApiKey.includes("your_api_key")) {
      try {
        const resend = new Resend(resendApiKey);
        const { subject, html } = formatFeedbackEmail(feedback);

        await resend.emails.send({
          from: `OKIKE Studio Portal <${fromEmail}>`,
          to: [toEmail],
          replyTo: feedback.authorEmail,
          subject,
          html,
        });
      } catch (emailErr) {
        console.error("Failed to send portal feedback email:", emailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Your feedback and notes have been delivered to the OKIKE Studio leads.",
      data: feedback,
    });
  } catch (error) {
    console.error("Portal feedback error:", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred while saving feedback." },
      { status: 500 }
    );
  }
}
