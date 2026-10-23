import { generateGeminiJson } from "@/lib/ai/gemini";
import { pricingPackages } from "@/lib/pricing";

export interface ScopingAssistRequest {
  goal: string;
  industry?: string;
  currentStage?: string;
}

export interface ScopingAssistResponse {
  recommendedPackageId: "starter" | "business-pro" | "custom-software";
  recommendedPackageName: string;
  recommendedServices: Array<"brand" | "website" | "software">;
  indicativePriceRange: string;
  reasoning: string;
  draftBrief: {
    summary: string;
    brandNeeds?: string;
    websiteNeeds?: string;
    softwareNeeds?: string;
  };
  adaptiveQuestions: Array<{
    id: string;
    label: string;
    placeholder: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScopingAssistRequest;
    const goal = typeof body?.goal === "string" ? body.goal.trim() : "";

    if (!goal || goal.length < 5) {
      return Response.json(
        { error: "Please provide a sentence or two about your project idea or goal." },
        { status: 400 }
      );
    }

    const systemInstruction = `You are the lead project strategist at OKIKE Studio, an independent brand, web, and custom software studio.
Review the visitor's project description and recommend the best starting point among OKIKE Studio's packages:
1. "starter" — Starter Site (From ₦150,000, up to 5 pages). For new ventures or founders needing a crisp, professional first web presence.
2. "business-pro" — Business Pro (From ₦450,000, up to 15 pages). For growing companies needing brand identity, CMS content, case studies, or detailed service offerings.
3. "custom-software" — Custom Software (Quoted individually, typically ₦1,200,000 - ₦3,500,000+). For purpose-built web apps, portals, platforms, multi-role user dashboards, or API workflows.

Pricing Rule: Always quote in Nigerian Naira (NGN). Indicative ranges must start from the package minimums:
- starter: "₦150,000 – ₦300,000 (indicative, subject to partner review)"
- business-pro: "₦450,000 – ₦850,000 (indicative, subject to partner review)"
- custom-software: "₦1,200,000 – ₦3,500,000+ (indicative, custom quote required)"

Never present prices as fixed or binding; always emphasize that final quotes require studio partner confirmation.`;

    const prompt = `Client project description:
"${goal}"
${body.industry ? `Industry: ${body.industry}` : ""}
${body.currentStage ? `Stage: ${body.currentStage}` : ""}

Return a JSON object adhering to this schema:
{
  "recommendedPackageId": "starter" | "business-pro" | "custom-software",
  "recommendedPackageName": "Starter Site" | "Business Pro" | "Custom Software",
  "recommendedServices": ["brand", "website"] or ["website"] or ["software"],
  "indicativePriceRange": "naira range string",
  "reasoning": "2 sentences explaining why this package matches their needs",
  "draftBrief": {
    "summary": "Crisp 2-3 sentence project brief based on their goal",
    "brandNeeds": "recommended brand deliverables or null if not needed",
    "websiteNeeds": "recommended pages/architecture or null if not needed",
    "softwareNeeds": "recommended technical features or null if not needed"
  },
  "adaptiveQuestions": [
    {
      "id": "q1",
      "label": "Specific relevant question for this type of project",
      "placeholder": "Brief helpful example answer"
    },
    {
      "id": "q2",
      "label": "Another targeted question (e.g. content readiness, integrations, timeline)",
      "placeholder": "Brief helpful example answer"
    }
  ]
}`;

    const { data } = await generateGeminiJson<ScopingAssistResponse>({
      feature: "enquiry_assist",
      prompt,
      systemInstruction,
      temperature: 0.3,
    });

    // Verify package ID is valid
    const validIds = ["starter", "business-pro", "custom-software"];
    if (!validIds.includes(data.recommendedPackageId)) {
      data.recommendedPackageId = "business-pro";
      data.recommendedPackageName = "Business Pro";
    }

    return Response.json({ ok: true, data });
  } catch (error) {
    console.error("Scoping assistant error:", error);
    return Response.json(
      {
        error: "AI scoping assistant is currently unavailable. You can continue filling the enquiry manually.",
      },
      { status: 500 }
    );
  }
}
