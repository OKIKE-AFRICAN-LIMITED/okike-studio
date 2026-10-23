import { NextResponse } from "next/server";
import { generateGeminiContent, generateGeminiJson } from "@/lib/ai/gemini";

interface WeeklySummaryInput {
  action: "weekly_summary";
  projectName: string;
  clientCompany?: string;
  activePhase: string;
  sprint: string;
  progressPercent: number;
  phases: Array<{ title: string; status: string; description: string }>;
  deliverables: Array<{ title: string; type: string; updated: string }>;
}

interface VaultQaInput {
  action: "vault_qa";
  question: string;
  projectName: string;
  deliverables: Array<{ title: string; type: string; description?: string; updated: string }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "weekly_summary") {
      const {
        projectName,
        clientCompany = "Client Partner",
        activePhase,
        sprint,
        progressPercent,
        phases = [],
        deliverables = [],
      } = body as WeeklySummaryInput;

      const prompt = `You are the Lead Producer at OKIKE Studio writing a concise, weekly executive progress update for our client ${clientCompany}.
Project: ${projectName}
Current Phase: ${activePhase}
Sprint Status: ${sprint} (${progressPercent}% complete)

Phases overview:
${phases.map((p) => `- [${p.status.toUpperCase()}] ${p.title}: ${p.description}`).join("\n")}

Recent Deliverables / Vault assets:
${deliverables.map((d) => `- ${d.title} (${d.type}, updated ${d.updated})`).join("\n")}

Generate a structured JSON response with:
1. "headline": crisp one-sentence status headline.
2. "achievements": 3 bullet points of what was completed/shipped this sprint.
3. "inProgress": 2-3 bullet points of active focus right now.
4. "upcomingFocus": 2 bullet points of what starts next week.
5. "riskAssessment": "On Track" | "Attention Needed" | "Blocked", accompanied by a 1-sentence note.

Schema:
{
  "headline": string,
  "achievements": string[],
  "inProgress": string[],
  "upcomingFocus": string[],
  "riskAssessment": string,
  "riskNote": string
}`;

      const { data } = await generateGeminiJson<{
        headline: string;
        achievements: string[];
        inProgress: string[];
        upcomingFocus: string[];
        riskAssessment: string;
        riskNote: string;
      }>({
        feature: "portal_weekly_summary",
        prompt,
        temperature: 0.2,
      });

      return NextResponse.json({ success: true, summary: data });
    }

    if (action === "vault_qa") {
      const { question, projectName, deliverables = [] } = body as VaultQaInput;

      if (!question) {
        return NextResponse.json({ error: "Question is required." }, { status: 400 });
      }

      const prompt = `You are the OKIKE Studio Vault Assistant helping a client find assets and understand deliverables for "${projectName}".
Available Vault Deliverables & Artifacts:
${deliverables
  .map(
    (d) =>
      `- Title: ${d.title}\n  Type: ${d.type}\n  Description: ${d.description || "N/A"}\n  Updated: ${d.updated}`
  )
  .join("\n")}

User question: "${question}"

Provide a concise, helpful, and direct answer explaining where to find the relevant asset in the vault, what it contains, and how to access it. If the answer is not in the listed assets, politely explain what is currently available and advise them to message studio@okikestudio.com.`;

      const result = await generateGeminiContent({
        feature: "portal_vault_qa",
        prompt,
        temperature: 0.3,
        maxOutputTokens: 500,
      });

      return NextResponse.json({ success: true, answer: result.text.trim() });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error processing portal insight";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
