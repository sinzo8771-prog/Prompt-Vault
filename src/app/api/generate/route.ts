import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter
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
    const resetIn = record.resetTime - now;
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count, resetIn: record.resetTime - now };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) rateLimitMap.delete(ip);
  }
}, 60000);

interface GenerateRequest {
  tool: string;
  category: string;
  description: string;
  tone: string;
  language?: string;
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
  Coding: "Code review, debugging, documentation, architecture, boilerplates, algorithms.",
  Resume: "Resume bullet points, cover letters, LinkedIn profiles, interview prep, career summaries.",
  Studying: "Note-taking, flashcards, concept explanations, study plans, practice problems.",
  Creative: "Art prompts, brainstorming, naming, taglines, creative writing, ideation.",
  Business: "Strategy, analysis, proposals, reports, meeting agendas, executive summaries.",
  "Social Media": "Posts, threads, captions, engagement hooks, content calendars, community building.",
};

// Verified working free models
const MODELS = [
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "qwen/qwen3-coder:free",
  "google/gemma-4-31b-it:free",
];

async function callOpenRouter(
  apiKey: string,
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://promptvault.com",
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
    });

    if (response.status === 429) return null;
    if (!response.ok) return null;

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || null;

    // Clean up common prefixes the model might add
    if (content) {
      content = content
        .replace(/^["']|["']$/g, "")
        .replace(/^Here'?s? (a |the |your )?prompt:?\s*/i, "")
        .replace(/^Generated prompt:?\s*/i, "")
        .replace(/^Prompt:?\s*/i, "")
        .trim();
    }

    return content;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

    const { allowed, remaining, resetIn } = getRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again in a moment.", resetIn },
        { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(Math.ceil(resetIn / 1000)) } }
      );
    }

    const body: GenerateRequest = await request.json();
    const { tool, category, description, tone, language } = body;

    if (!description?.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const toolGuide = TOOL_GUIDES[tool] || TOOL_GUIDES.ChatGPT;
    const toneGuide = TONE_MAP[tone] || TONE_MAP.Professional;
    const categoryContext = CATEGORIES_CONTEXT[category] || "";
    const langNote = language && language !== "English" ? `\nOutput language: ${language}` : "";

    const userPrompt = `TASK: Generate a prompt for ${tool} in the ${category} category.

USER DESCRIPTION: ${description}

TOOL-SPECIFIC FORMAT:
${toolGuide}

TONE: ${tone} — ${toneGuide}

CATEGORY CONTEXT: ${categoryContext}
${langNote}

Generate ONLY the prompt text (no explanations, no quotes, no markdown):`;

    // Try models until one works
    let generatedPrompt: string | null = null;
    let usedModel = "";
    for (const model of MODELS) {
      generatedPrompt = await callOpenRouter(apiKey, model, SYSTEM_PROMPT, userPrompt);
      if (generatedPrompt) {
        usedModel = model;
        break;
      }
    }

    if (!generatedPrompt) {
      return NextResponse.json(
        { error: "All models are temporarily busy. Please try again in a few seconds." },
        { status: 503 }
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
