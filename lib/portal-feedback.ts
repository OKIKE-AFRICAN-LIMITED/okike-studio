export type FeedbackCategory = "revision" | "approval" | "question" | "issue";
export type FeedbackPriority = "low" | "normal" | "urgent";

export interface FeedbackInput {
  deliverableId?: string;
  deliverableTitle?: string;
  projectId?: string;
  projectName?: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  message: string;
  referenceUrl?: string;
  authorEmail?: string;
  authorName?: string;
}

export interface ValidatedFeedback {
  deliverableId: string | null;
  deliverableTitle: string | null;
  projectId: string | null;
  projectName: string | null;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  message: string;
  referenceUrl: string | null;
  authorEmail: string;
  authorName: string;
  createdAt: string;
}

export function validateFeedbackPayload(
  raw: unknown,
  fallbackUser?: { email?: string; name?: string }
): { ok: true; data: ValidatedFeedback } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Invalid feedback payload." };
  }

  const payload = raw as Record<string, unknown>;

  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (message.length < 5) {
    return { ok: false, error: "Feedback message must be at least 5 characters long." };
  }
  if (message.length > 3000) {
    return { ok: false, error: "Feedback message is too long (maximum 3000 characters)." };
  }

  const validCategories: FeedbackCategory[] = ["revision", "approval", "question", "issue"];
  const category: FeedbackCategory =
    typeof payload.category === "string" && validCategories.includes(payload.category as FeedbackCategory)
      ? (payload.category as FeedbackCategory)
      : "revision";

  const validPriorities: FeedbackPriority[] = ["low", "normal", "urgent"];
  const priority: FeedbackPriority =
    typeof payload.priority === "string" && validPriorities.includes(payload.priority as FeedbackPriority)
      ? (payload.priority as FeedbackPriority)
      : "normal";

  let referenceUrl: string | null = null;
  if (typeof payload.referenceUrl === "string" && payload.referenceUrl.trim().length > 0) {
    const trimmed = payload.referenceUrl.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return { ok: false, error: "Reference link must start with http:// or https://" };
    }
    referenceUrl = trimmed.slice(0, 500);
  }

  const authorEmail =
    (typeof payload.authorEmail === "string" && payload.authorEmail.includes("@")
      ? payload.authorEmail.trim()
      : fallbackUser?.email) || "client@workspace.com";

  const authorName =
    (typeof payload.authorName === "string" && payload.authorName.trim().length > 0
      ? payload.authorName.trim()
      : fallbackUser?.name) || authorEmail.split("@")[0] || "Client";

  const deliverableId =
    typeof payload.deliverableId === "string" && payload.deliverableId.trim().length > 0
      ? payload.deliverableId.trim()
      : null;

  const deliverableTitle =
    typeof payload.deliverableTitle === "string" && payload.deliverableTitle.trim().length > 0
      ? payload.deliverableTitle.trim()
      : null;

  const projectId =
    typeof payload.projectId === "string" && payload.projectId.trim().length > 0
      ? payload.projectId.trim()
      : null;

  const projectName =
    typeof payload.projectName === "string" && payload.projectName.trim().length > 0
      ? payload.projectName.trim()
      : null;

  return {
    ok: true,
    data: {
      deliverableId,
      deliverableTitle,
      projectId,
      projectName,
      category,
      priority,
      message,
      referenceUrl,
      authorEmail,
      authorName,
      createdAt: new Date().toISOString(),
    },
  };
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatFeedbackEmail(feedback: ValidatedFeedback): { subject: string; html: string } {
  const subjectTag =
    feedback.priority === "urgent"
      ? "[URGENT REVISION]"
      : feedback.category === "approval"
      ? "[ASSET APPROVED]"
      : "[CLIENT FEEDBACK]";

  const target = feedback.deliverableTitle
    ? `Deliverable: ${feedback.deliverableTitle}`
    : feedback.projectName
    ? `Project: ${feedback.projectName}`
    : "Client Workspace";

  const subject = `${subjectTag} ${target} · ${feedback.authorName}`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #0e0e0e; padding: 24px;">
      <div style="border-bottom: 2px solid #0e0e0e; padding-bottom: 16px; margin-bottom: 20px;">
        <span style="background: #e3ed33; color: #0e0e0e; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 8px; letter-spacing: 1px;">
          OKIKE Portal Feedback
        </span>
        <h1 style="font-size: 20px; font-weight: 800; text-transform: uppercase; margin: 12px 0 4px 0; color: #0e0e0e;">
          ${escapeHtml(target)}
        </h1>
        <p style="font-size: 13px; color: #666666; margin: 0;">
          Submitted by <strong>${escapeHtml(feedback.authorName)}</strong> (${escapeHtml(feedback.authorEmail)})
        </p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
        <tr>
          <td style="padding: 6px 0; color: #777777; width: 120px;">Category:</td>
          <td style="padding: 6px 0; font-weight: 700; text-transform: uppercase; color: #0e0e0e;">${escapeHtml(feedback.category)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #777777;">Priority:</td>
          <td style="padding: 6px 0; font-weight: 700; text-transform: uppercase; color: ${feedback.priority === "urgent" ? "#d9381e" : "#0e0e0e"};">
            ${escapeHtml(feedback.priority)}
          </td>
        </tr>
        ${
          feedback.referenceUrl
            ? `<tr>
                <td style="padding: 6px 0; color: #777777;">Reference URL:</td>
                <td style="padding: 6px 0;"><a href="${escapeHtml(feedback.referenceUrl)}" style="color: #0e0e0e; font-weight: 600;">${escapeHtml(feedback.referenceUrl)}</a></td>
              </tr>`
            : ""
        }
      </table>

      <div style="background: #f5f5f0; border-left: 4px solid #0e0e0e; padding: 16px; margin-bottom: 24px;">
        <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666666; margin: 0 0 8px 0;">
          Client Notes &amp; Specifications:
        </p>
        <div style="font-size: 14px; line-height: 1.6; color: #0e0e0e; white-space: pre-wrap;">
          ${escapeHtml(feedback.message)}
        </div>
      </div>

      <div style="border-top: 1px solid #e0e0dc; padding-top: 14px; font-size: 11px; color: #888888;">
        Sent directly from OKIKE Studio Client Portal · ${new Date().toUTCString()}
      </div>
    </div>
  `;

  return { subject, html };
}
