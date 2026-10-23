import { generateGeminiContent } from "@/lib/ai/gemini";
import { pricingPackages } from "@/lib/pricing";
import { studioServices } from "@/lib/services";
import { defaultSiteSettingsContent } from "@/lib/cms-defaults";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = (await request.json()) as { messages?: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages array is required." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || typeof lastMessage.content !== "string") {
      return Response.json({ error: "Invalid message format." }, { status: 400 });
    }

    const packageSummary = pricingPackages
      .map((p) => `- ${p.name} (${p.price}): ${p.scope}. ${p.description}`)
      .join("\n");

    const servicesSummary = studioServices
      .map((s) => `- ${s.title}: ${s.summary} Deliverables: ${s.deliverables}`)
      .join("\n");

    const systemInstruction = `You are the OKIKE Studio AI Assistant on the public website.
Your role is to help prospective clients, founders, and visitors understand OKIKE Studio's services, process, packages, and technical capabilities.

KNOWLEDGE BASE:
- OKIKE Studio: Independent brand, product, and software studio. Motto: "Structure before scale."
- Services:
${servicesSummary}
- Pricing Packages:
${packageSummary}
- Delivery Timeline:
  - Starter Site: ~1-2 weeks.
  - Business Pro: ~3-4 weeks.
  - Custom Software: Structured sprints (typically 6-10 weeks).
- Pricing Model: All public prices are in Nigerian Naira (NGN). Final quotes are confirmed by a human studio partner following brief review.
- Client Portal: Authenticated client space with Project Pulse, milestone tracking, sprint reviews, and an Asset Vault for deliverables (Figma, code, staging links).
- Studio Lead & Contact: studio@okike.com. Headquartered in Lagos, working globally.

BEHAVIOR GUIDELINES:
1. Tone: Calm, precise, confident, design-literate, helpful. Avoid hyperbole or buzzwords.
2. Grounding: ONLY answer questions related to OKIKE Studio, design, web development, custom software, pricing, and project onboarding. If asked unrelated questions (e.g. recipes, generic trivia, coding homework), politely redirect them to how OKIKE Studio can build their project.
3. Call to Action: Whenever relevant, invite the user to start a brief at /enquiry or browse selected projects at /work.
4. Conciseness: Keep responses under 100 words unless the user explicitly requests an in-depth breakdown.`;

    const conversationHistory = messages
      .slice(-6)
      .map((m) => `${m.role === "user" ? "Visitor" : "OKIKE Assistant"}: ${m.content}`)
      .join("\n");

    const result = await generateGeminiContent({
      feature: "site_chat",
      prompt: conversationHistory,
      systemInstruction,
      temperature: 0.3,
      maxOutputTokens: 500,
    });

    return Response.json({
      ok: true,
      message: {
        role: "assistant",
        content: result.text.trim(),
      },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return Response.json(
      {
        error: "Studio chat is momentarily busy. Please try again or email studio@okike.com.",
      },
      { status: 500 }
    );
  }
}
