import { NextResponse } from "next/server";
import { generateGeminiJson } from "@/lib/ai/gemini";

export interface GeneratedProposal {
  title: string;
  executiveSummary: string;
  recommendedPackage: string;
  indicativeInvestmentNgn: string;
  estimatedTimeline: string;
  architectureHighlights: string[];
  sprints: Array<{
    number: number;
    title: string;
    weeks: string;
    deliverables: string[];
  }>;
  commercialNotes: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      enquiryId,
      clientName,
      clientCompany,
      services = [],
      packageSelected,
      scopeAnswers = {},
      budgetRange,
      timeline,
    } = body;

    if (!clientName) {
      return NextResponse.json(
        { error: "Client name is required." },
        { status: 400 }
      );
    }

    const prompt = `You are the Lead Systems Architect and Partner at OKIKE Studio, an independent brand, product, and software studio based in Lagos/Abuja, Nigeria.
Our offerings:
- Starter Site (from ₦250,000, up to 5 pages)
- Business Pro (from ₦750,000, up to 15 pages, CMS, GSAP animations)
- Custom Software (quoted individually, typically ₦1.5M - ₦6M+, Next.js App Router, Supabase, APIs)

Draft a formal, structured studio proposal based on this inbound lead:
Client Name: ${clientName}
Client Company: ${clientCompany || "Independent Venture"}
Services Requested: ${services.join(", ") || "Digital Product & Web Engineering"}
Package Selected: ${packageSelected || "Custom Scope"}
Budget Bracket: ${budgetRange || "To be confirmed"}
Desired Timeline: ${timeline || "Standard studio sprint (4-8 weeks)"}
Scope Answers / Problem Brief:
${JSON.stringify(scopeAnswers, null, 2)}

Requirements:
1. Ground prices in Nigerian Naira (₦). All pricing is indicative, subject to partner sign-off.
2. Outline 3 to 4 sequential sprints with specific deliverables (e.g. Sprint 1: Strategic Discovery & Wireframes; Sprint 2: High-fidelity Design System; Sprint 3: Engineering & Motion; Sprint 4: Performance, SEO & Launch).
3. Recommend modern tech architecture (Next.js 16, GSAP motion, Tailwind CSS, Supabase backend, NDPA 2023 compliance).
4. Provide structured JSON matching this schema:
{
  "title": string,
  "executiveSummary": string,
  "recommendedPackage": string,
  "indicativeInvestmentNgn": string,
  "estimatedTimeline": string,
  "architectureHighlights": string[],
  "sprints": [
    {
      "number": number,
      "title": string,
      "weeks": string,
      "deliverables": string[]
    }
  ],
  "commercialNotes": string
}`;

    const { data } = await generateGeminiJson<GeneratedProposal>({
      feature: "admin_proposal_draft",
      refId: enquiryId,
      prompt,
      temperature: 0.25,
      maxOutputTokens: 3500,
    });

    return NextResponse.json({
      success: true,
      proposal: data,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate proposal";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
