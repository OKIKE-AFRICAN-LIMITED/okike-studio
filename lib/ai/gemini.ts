import fs from "node:fs";
import path from "node:path";
import { createAdminClient } from "../supabase/admin";

export interface GeminiCallParams {
  feature: string;
  refId?: string;
  prompt: string;
  systemInstruction?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResult {
  text: string;
  promptTokens?: number;
  outputTokens?: number;
  latencyMs: number;
  model: string;
}

function getGeminiApiKey(): string | undefined {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
      if (match) {
        process.env.GEMINI_API_KEY = match[1].trim();
        return process.env.GEMINI_API_KEY;
      }
    }
  } catch {
    // Non-fatal
  }
  return undefined;
}

export async function generateGeminiContent(params: GeminiCallParams): Promise<GeminiResult> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const model = params.model || process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const start = Date.now();

  const body: Record<string, unknown> = {
    contents: [
      {
        parts: [{ text: params.prompt }],
      },
    ],
    generationConfig: {
      temperature: params.temperature ?? 0.3,
      ...(params.maxOutputTokens ? { maxOutputTokens: params.maxOutputTokens } : {}),
    },
  };

  if (params.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: params.systemInstruction }],
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  let responseText = "";
  let promptTokens: number | undefined;
  let outputTokens: number | undefined;
  let errorToLog: string | null = null;
  let isOk = true;

  try {
    const candidateModels = [
    model,
    ...(model !== "gemini-flash-latest" ? ["gemini-flash-latest"] : []),
  ];

  let lastError: Error | null = null;

  for (const currentModel of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "x-goog-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
          const errMsg = data?.error?.message || `Gemini API error (status ${res.status})`;
          // If high demand or rate limit, wait briefly and retry or try fallback model
          if (res.status === 503 || res.status === 429 || errMsg.toLowerCase().includes("high demand")) {
            await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
            continue;
          }
          throw new Error(errMsg);
        }

        const candidate = data.candidates?.[0];
        const textPart = candidate?.content?.parts?.[0]?.text;
        if (typeof textPart !== "string") {
          throw new Error("Gemini returned no text content.");
        }

        responseText = textPart;
        promptTokens = data.usageMetadata?.promptTokenCount;
        outputTokens = data.usageMetadata?.candidatesTokenCount;

        return {
          text: responseText,
          promptTokens,
          outputTokens,
          latencyMs: Date.now() - start,
          model: currentModel,
        };
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to fallback model or retry
      }
    }
  }

  isOk = false;
  errorToLog = lastError?.message || "Failed to generate content with available Gemini models";
  throw (lastError || new Error(errorToLog));
} finally {
  const latencyMs = Date.now() - start;
    // Log asynchronously to ai_runs table without blocking execution
    try {
      const supabase = createAdminClient();
      await supabase.from("ai_runs").insert({
        feature: params.feature,
        model,
        ref_id: params.refId ?? null,
        input_chars: params.prompt.length,
        output: responseText ? { text: responseText.slice(0, 1000) } : null,
        prompt_tokens: promptTokens ?? null,
        output_tokens: outputTokens ?? null,
        latency_ms: latencyMs,
        ok: isOk,
        error: errorToLog,
      });
    } catch {
      // Non-blocking log failure
    }
  }
}

export async function generateGeminiJson<T>(
  params: GeminiCallParams
): Promise<{ data: T; usage: GeminiResult }> {
  const system = [
    params.systemInstruction || "",
    "IMPORTANT: You MUST respond ONLY with valid JSON. Do not include markdown code fence formatting (e.g. no ```json). Return pure JSON text only.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = await generateGeminiContent({
    ...params,
    systemInstruction: system,
  });

  let raw = result.text.trim();
  // Strip markdown code fences if model accidentally emitted them
  if (raw.startsWith("```json")) {
    raw = raw.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (raw.startsWith("```")) {
    raw = raw.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(raw) as T;
  return { data: parsed, usage: result };
}
