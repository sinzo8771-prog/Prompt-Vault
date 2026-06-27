import { NextRequest, NextResponse } from "next/server";

// Rate limiter — sliding window with periodic cleanup
// Note: In-memory only; on serverless (Vercel) this resets per instance.
// For production scale, use Upstash Redis or similar.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute window

function getRateLimit(ip: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1, resetIn: RATE_WINDOW };
  }

  if (record.count >= RATE_LIMIT) {
    const resetIn = Math.max(0, record.resetTime - now);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetIn: Math.max(0, record.resetTime - now) };
}

// Cleanup every 5 minutes (lazy — also cleans on each check above)
const rateCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// Prevent interval from keeping Node.js process alive in serverless
if (typeof rateCleanupInterval === "object" && "unref" in rateCleanupInterval) {
  (rateCleanupInterval as NodeJS.Timeout).unref();
}

interface GenerateRequest {
  tool: string;
  category: string;
  description: string;
  tone: string;
  language?: string;
}

function normalizeIp(ip: string): string {
  // Prevent unbounded map keys / header injection strings
  const cleaned = (ip || "").trim().slice(0, 64);
  return cleaned || "unknown";
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidTool(tool: unknown): tool is keyof typeof TOOL_GUIDES {
  return typeof tool === "string" && tool in TOOL_GUIDES;
}

function isValidTone(tone: unknown): tone is keyof typeof TONE_MAP {
  return typeof tone === "string" && tone in TONE_MAP;
}

function isValidCategory(category: unknown): category is keyof typeof CATEGORIES_CONTEXT {
  return typeof category === "string" && category in CATEGORIES_CONTEXT;
}

const SYSTEM_PROMPT = `You are an expert AI prompt engineer with 10 years of experience. You create high-quality, effective prompts that deliver exceptional results.

CORE RULES:
- Output ONLY the prompt text — no explanations, no prefixes, no markdown formatting, no quotes
- Make prompts specific, actionable, and detailed
- Include customizable placeholders in [BRACKETS]
- Optimize for the specific AI tool and category
- Match the requested tone precisely
- Length: 30-300 words depending on complexity
- Always structure prompts with clear sections when appropriate

PROMPT STRUCTURE (adapt as needed):
1. Role/Context setting (if useful)
2. Clear task description
3. Specific requirements/constraints
4. Output format expectations
5. Examples (if helpful)`;

const TOOL_GUIDES: Record<string, string> = {
  ChatGPT: `PROMPT FORMAT for ChatGPT:
- Use natural language instructions
- Start with role assignment if needed: "Act as a [ROLE]..."
- Be specific about output format (bullets, tables, JSON, etc.)
- Include context and constraints
- Use delimiters for multi-part instructions
- Example: "Act as a senior marketing copywriter. Write a cold email for [PRODUCT] targeting [AUDIENCE]. Tone: [TONE]. Include: subject line, opening hook, value proposition, CTA. Max 150 words."`,

  Midjourney: `PROMPT FORMAT for Midjourney:
- Structure: [Subject], [Style], [Details], [Lighting], [Parameters]
- Use descriptive adjectives and artistic terms
- Include parameters: --ar (aspect ratio), --v (version), --s (stylize), --q (quality)
- Common styles: photorealistic, oil painting, watercolor, cyberpunk, minimalist
- Example: "A serene Japanese garden with cherry blossoms, koi pond, stone lantern, soft morning light, misty atmosphere, Studio Ghibli style --ar 16:9 --v 6 --s 250"`,

  Claude: `PROMPT FORMAT for Claude:
- Provide detailed context and background
- Use clear task decomposition
- Specify thinking/reasoning approach if needed
- Include constraints and edge cases
- Request structured analysis when appropriate
- Example: "Analyze the following business proposal and provide: 1) Executive summary (2-3 sentences), 2) Strengths (bullet list), 3) Weaknesses (bullet list), 4) Recommendations (prioritized list). Be critical but constructive. Consider market viability, financial projections, and competitive positioning."`,

  Gemini: `PROMPT FORMAT for Gemini:
- Clear, direct instructions
- Leverage multimodal capabilities when relevant
- Specify output format explicitly
- Include examples for complex tasks
- Use structured sections
- Example: "You are a data analyst. Given the following sales data: [DATA], create a comprehensive analysis including: 1) Key trends, 2) Anomalies, 3) Forecast for next quarter, 4) Actionable recommendations. Present findings as a structured report with headings."`,

  Copilot: `PROMPT FORMAT for GitHub Copilot:
- Specify programming language and framework
- Include function signature or class structure
- Describe the expected behavior clearly
- Mention error handling requirements
- Include comments for complex logic
- Example: "// TypeScript React component for a user profile card\n// Props: name, email, avatarUrl, role\n// Features: responsive layout, edit button, role badge\n// Uses Tailwind CSS for styling\n// Include loading and error states"`,
};

const TONE_MAP: Record<string, string> = {
  Professional: "Formal, authoritative, business-appropriate. Use precise language and avoid slang.",
  Casual: "Conversational, friendly, approachable. Use everyday language and a relaxed rhythm.",
  Technical: "Precise, detail-oriented, jargon-appropriate. Use domain-specific terminology accurately.",
  Creative: "Imaginative, engaging, unconventional. Encourage fresh perspectives and bold ideas.",
  Concise: "Minimal, direct, efficient. Eliminate every unnecessary word while keeping clarity.",
  Persuasive: "Compelling, action-oriented, benefit-focused. Drive the reader toward a specific action.",
  Educational: "Clear, explanatory, patient. Build understanding step by step with examples.",
};

const CATEGORIES_CONTEXT: Record<string, string> = {
  Writing: "Blog posts, articles, essays, stories, scripts, documentation, creative writing.",
  Marketing: "Ad copy, email campaigns, social media, SEO content, brand messaging, landing pages.",
  Development: "Code review, debugging, documentation, architecture, boilerplates, system design, DevOps, CI/CD.",
  Design: "Image generation prompts, UI/UX design, logos, branding, product mockups, glassmorphism, design systems.",
  Productivity: "Automation, organization, time management, meeting agendas, SOPs, workflow optimization, deep work.",
  Creative: "Art prompts, brainstorming, naming, taglines, creative writing, ideation, storytelling.",
  "AI & Automation": "AI agent design, RAG systems, prompt engineering, n8n/Make/Zapier workflows, fine-tuning, multi-agent systems.",
  "Video & Film": "AI video generation (Sora, Kling, Runway), YouTube production, short-form content, storyboards, motion graphics.",
  "Business & Finance": "Business plans, financial models, investor pitches, market research, competitive analysis, startup strategy.",
  "Education & Learning": "Course creation, curriculum design, lesson plans, flashcards, study systems, tutoring prompts.",
  "Sales & CRM": "Discovery calls, outreach sequences, deal strategy, churn prevention, proposal writing, LinkedIn selling.",
};

// Verified working free models — ordered by speed/cost
const MODELS = [
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-coder:free",
  "google/gemma-4-31b-it:free",
];

const MODEL_TIMEOUT = 15000; // 15s per model attempt

type ModelAttemptResult =
  | { ok: true; content: string }
  | { ok: false; status: number | "timeout"; message: string };

async function callOpenRouterWithTimeout(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<ModelAttemptResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MODEL_TIMEOUT);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.SITE_URL || "https://promptvault.com",
        "X-Title": "PromptVault Generator",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 429) {
      return { ok: false, status: 429, message: "Rate limited by upstream" };
    }

    if (!response.ok) {
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch {
        // ignore
      }
      const safeSnippet = bodyText ? bodyText.slice(0, 200) : "";
      console.error("OpenRouter non-OK response", {
        model,
        status: response.status,
        bodySnippet: safeSnippet,
      });

      return { ok: false, status: response.status, message: "Upstream request failed" };
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    let content = typeof raw === "string" ? raw.trim() : "";

    if (content) {
      content = content
        .replace(/^["']|["']$/g, "")
        .replace(/^Here'?s? (a |the |your )?prompt:?\s*/i, "")
        .replace(/^Generated prompt:?\s*/i, "")
        .replace(/^Prompt:?\s*/i, "")
        .trim();
    }

    if (!content) {
      return { ok: false, status: 502, message: "Upstream returned empty content" };
    }

    return { ok: true, content };
  } catch (e) {
    clearTimeout(timeout);

    const isAbort = (e as Error | undefined)?.name === "AbortError";
    return isAbort
      ? { ok: false, status: "timeout", message: "Request timed out" }
      : { ok: false, status: 500, message: "Network/unknown error" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawIp =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const ip = normalizeIp(rawIp);

    const { allowed, remaining, resetIn } = getRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a moment.", resetIn },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(resetIn / 1000)),
          },
        }
      );
    }

    let bodyUnknown: unknown;
    try {
      bodyUnknown = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const body = bodyUnknown as Partial<GenerateRequest>;
    const { tool, category, description, tone, language } = body;

    const validationErrors: Record<string, string> = {};

    if (!isValidTool(tool)) validationErrors.tool = `Invalid tool. Allowed: ${Object.keys(TOOL_GUIDES).join(", ")}`;
    if (category !== "" && category !== undefined && !isValidCategory(category)) {
      validationErrors.category = `Invalid category. Allowed: ${Object.keys(CATEGORIES_CONTEXT).join(", ")}`;
    }
    if (!isValidTone(tone)) validationErrors.tone = `Invalid tone. Allowed: ${Object.keys(TONE_MAP).join(", ")}`;
    if (!isNonEmptyString(description)) validationErrors.description = "Description is required and must be a non-empty string";
    if (language !== undefined && (!isNonEmptyString(language) || language === "")) validationErrors.language = "Language must be a non-empty string when provided";

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json({ error: "Invalid request body", validationErrors }, { status: 400 });
    }

    // Narrow types after validation
    const validatedTool = tool as keyof typeof TOOL_GUIDES;
    const validatedCategory = (category || "") as keyof typeof CATEGORIES_CONTEXT | "";
    const validatedTone = tone as keyof typeof TONE_MAP;
    const validatedDescription = description as string;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const toolGuide = TOOL_GUIDES[validatedTool];
    const toneGuide = TONE_MAP[validatedTone];
    const categoryContext = validatedCategory ? CATEGORIES_CONTEXT[validatedCategory] : "";
    const categoryLine = validatedCategory ? ` in the ${validatedCategory} category` : "";
    const categoryContextLine = categoryContext ? `\nCATEGORY CONTEXT: ${categoryContext}` : "";
    const langNote = language && language !== "English" ? `\nOutput language: ${language}` : "";

    const userPrompt = `TASK: Generate a prompt for ${validatedTool}${categoryLine}.

USER DESCRIPTION: ${validatedDescription}

TOOL-SPECIFIC FORMAT:
${toolGuide}

TONE: ${tone} — ${toneGuide}${categoryContextLine}
${langNote}

Generate ONLY the prompt text (no explanations, no quotes, no markdown):`;

    // Try models: first 3 in parallel, then fallback to remaining
    let generatedPrompt: string | null = null;
    let usedModel = "";
    let lastModelError: { status: number | "timeout"; message: string } | null = null;

    const primaryModels = MODELS.slice(0, 3);
    const fallbackModels = MODELS.slice(3);

    // Race first 3 models — fastest wins
    const primaryResult = await Promise.any(
      primaryModels.map(async (model) => {
        const result = await callOpenRouterWithTimeout(apiKey, model, SYSTEM_PROMPT, userPrompt);
        if (!result.ok) {
          // keep most recent error for reporting
          lastModelError = { status: result.status, message: result.message };
          throw new Error(`${model} failed`);
        }
        return { result: result.content, model };
      })
    ).catch(() => null);

    if (primaryResult) {
      generatedPrompt = primaryResult.result;
      usedModel = primaryResult.model;
    } else {
      // Fallback: try remaining models sequentially
      for (const model of fallbackModels) {
        const result = await callOpenRouterWithTimeout(apiKey, model, SYSTEM_PROMPT, userPrompt);
        if (result.ok) {
          generatedPrompt = result.content;
          usedModel = model;
          break;
        }
        lastModelError = { status: result.status, message: result.message };
      }
    }

    if (!generatedPrompt) {
      return NextResponse.json(
        {
          error: "All models are temporarily unavailable. Please try again in a few seconds.",
          modelsTried: MODELS,
          lastError: lastModelError,
        },
        { status: 503, headers: { "X-RateLimit-Remaining": String(remaining) } }
      );
    }

    return NextResponse.json(
      { prompt: generatedPrompt, remaining, model: usedModel.split("/")[1]?.split(":")[0] || usedModel },
      { headers: { "X-RateLimit-Remaining": String(remaining) } }
    );
  } catch (error) {
    console.error("Generator error:", error);
    return NextResponse.json({ error: "Internal error. Please try again." }, { status: 500 });
  }
}
