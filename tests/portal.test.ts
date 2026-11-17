import assert from "node:assert/strict";
import test from "node:test";
import {
  validateFeedbackPayload,
  formatFeedbackEmail,
  escapeHtml,
} from "../lib/portal-feedback.ts";

test("validateFeedbackPayload accepts complete valid feedback payload", () => {
  const raw = {
    deliverableId: "deliv-figma-01",
    deliverableTitle: "Design System Tokens",
    projectId: "proj-123",
    projectName: "SwiftLog Platform",
    category: "revision",
    priority: "urgent",
    message: "Please adjust button padding on the mobile breakpoint to 12px instead of 16px.",
    referenceUrl: "https://www.figma.com/design/sample?node-id=10",
    authorEmail: "client@swiftlog.ng",
    authorName: "Emeka Okonkwo",
  };

  const result = validateFeedbackPayload(raw);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.deliverableId, "deliv-figma-01");
    assert.equal(result.data.category, "revision");
    assert.equal(result.data.priority, "urgent");
    assert.equal(result.data.referenceUrl, "https://www.figma.com/design/sample?node-id=10");
    assert.equal(result.data.authorEmail, "client@swiftlog.ng");
  }
});

test("validateFeedbackPayload rejects message under 5 characters", () => {
  const result = validateFeedbackPayload({
    message: "Fix",
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /at least 5 characters/);
  }
});

test("validateFeedbackPayload rejects malformed reference URL", () => {
  const result = validateFeedbackPayload({
    message: "Here is the screenshot with the issue",
    referenceUrl: "not-a-valid-url",
  });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.match(result.error, /must start with http/);
  }
});

test("validateFeedbackPayload defaults category and priority when omitted", () => {
  const result = validateFeedbackPayload(
    { message: "Looks great, let us proceed to the next milestone." },
    { email: "partner@brand.com", name: "Partner" }
  );
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.category, "revision");
    assert.equal(result.data.priority, "normal");
    assert.equal(result.data.authorEmail, "partner@brand.com");
    assert.equal(result.data.authorName, "Partner");
  }
});

test("escapeHtml sanitizes user input tags", () => {
  const unsafe = '<script>alert("xss")</script> & "quote"';
  const safe = escapeHtml(unsafe);
  assert.equal(safe, '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &quot;quote&quot;');
});

test("formatFeedbackEmail outputs correct urgent subject tag and escapes content", () => {
  const feedback = {
    deliverableId: "d-1",
    deliverableTitle: "Staging Preview <v1>",
    projectId: "p-1",
    projectName: "Project",
    category: "issue" as const,
    priority: "urgent" as const,
    message: "Found a critical bug <script>",
    referenceUrl: null,
    authorEmail: "test@client.com",
    authorName: "Test Client",
    createdAt: new Date().toISOString(),
  };

  const { subject, html } = formatFeedbackEmail(feedback);
  assert.match(subject, /\[URGENT REVISION\]/);
  assert.match(subject, /Staging Preview <v1>/);
  assert.match(html, /Staging Preview &lt;v1&gt;/);
  assert.match(html, /&lt;script&gt;/);
});
