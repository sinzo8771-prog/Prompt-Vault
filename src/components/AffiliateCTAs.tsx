"use client";


interface AffiliateTool {
  name: string;
  url: string;
  tagline: string;
  cta: string;
  color: string;
  primary?: boolean;
}

interface AffiliateCTAsProps {
  aiTool: string;
  category: string;
}

// ── Tool definitions ──────────────────────────────────────────

const TOOL_DATA: Record<string, Omit<AffiliateTool, "primary">> = {
  ChatGPT: {
    name: "ChatGPT",
    url: "https://chat.openai.com/?model=auto",
    tagline: "Best all-rounder for writing, analysis & coding prompts",
    cta: "Open ChatGPT",
    color: "#10a37f",
  },
  Claude: {
    name: "Claude",
    url: "https://claude.ai/?model=auto",
    tagline: "Superior reasoning, long-form & nuanced outputs",
    cta: "Open Claude",
    color: "#d97706",
  },
  Gemini: {
    name: "Gemini",
    url: "https://gemini.google.com/app",
    tagline: "Google's multimodal model — great for research",
    cta: "Open Gemini",
    color: "#4285f4",
  },
  Midjourney: {
    name: "Midjourney",
    url: "https://midjourney.com/membership/",
    tagline: "Industry-leading AI image generation",
    cta: "Get Midjourney",
    color: "#5865f2",
  },
  Copilot: {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    tagline: "AI pair programmer for real-time code completion",
    cta: "Get Copilot",
    color: "#24292e",
  },
  DeepSeek: {
    name: "DeepSeek",
    url: "https://chat.deepseek.com/",
    tagline: "Powerful open-weight model — great for coding",
    cta: "Open DeepSeek",
    color: "#6366f1",
  },
  Coding: {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    tagline: "AI pair programmer for real-time code completion",
    cta: "Get Copilot",
    color: "#24292e",
  },
  Other: {
    name: "ChatGPT",
    url: "https://chat.openai.com/?model=auto",
    tagline: "Best all-rounder for writing, analysis & coding prompts",
    cta: "Open ChatGPT",
    color: "#10a37f",
  },
};

// ── Category → secondary tool recommendations ─────────────────

const CATEGORY_SECONDARIES: Record<string, string[]> = {
  writing: ["ChatGPT", "Claude", "Gemini"],
  design: ["Midjourney", "ChatGPT", "Claude"],
  marketing: ["ChatGPT", "Claude", "Gemini"],
  development: ["Copilot", "DeepSeek", "ChatGPT", "Claude"],
  productivity: ["ChatGPT", "Claude", "Gemini"],
  creative: ["Midjourney", "ChatGPT", "Claude"],
  "ai-and-automation": ["ChatGPT", "Claude", "Gemini"],
  "video-and-film": ["ChatGPT", "Claude", "Gemini"],
  "business-and-finance": ["ChatGPT", "Claude", "DeepSeek"],
  "education-and-learning": ["ChatGPT", "Claude", "Gemini"],
  "sales-and-crm": ["ChatGPT", "Claude", "Gemini"],
};

// ── Helpers ───────────────────────────────────────────────────

function getTools(aiTool: string, category: string): AffiliateTool[] {
  const primaryName = TOOL_DATA[aiTool] ? aiTool : "Other";
  const primary: AffiliateTool = { ...TOOL_DATA[primaryName], primary: true };

  const secondaries = (CATEGORY_SECONDARIES[category] || ["ChatGPT", "Claude"])
    .filter((name) => name !== aiTool && TOOL_DATA[name])
    .slice(0, 2)
    .map((name) => TOOL_DATA[name]);

  return [primary, ...secondaries];
}

// ── Component ─────────────────────────────────────────────────

export function AffiliateCTAs({ aiTool, category }: AffiliateCTAsProps) {
  const tools = getTools(aiTool, category);
  const [primary, ...secondary] = tools;

  if (!primary) return null;

  return (
    <div className="mb-12">
      {/* Section label */}
      <p className="label mb-4">Try this prompt</p>

      {/* Primary CTA card */}
      <a
        href={primary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block p-6 bg-bg-card border border-border/50 rounded-2xl hover:border-accent/30 mb-4 transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: primary.color }}
            >
              {primary.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-text">{primary.name}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-accent/10 text-accent rounded-md uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-text-muted font-mono">{primary.tagline}</p>
            </div>
          </div>
          <span className="btn-magnetic shrink-0 group-hover:translate-x-0.5 transition-transform text-sm">
            {primary.cta} →
          </span>
        </div>
      </a>

      {/* Secondary CTA cards */}
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {secondary.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 p-4 bg-bg-card/60 border border-border/30 rounded-xl hover:border-accent/20 hover:bg-bg-card transition-all duration-300"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ background: tool.color }}
              >
                {tool.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-text block">{tool.name}</span>
                <span className="text-[11px] text-text-muted font-mono line-clamp-1">{tool.tagline}</span>
              </div>
              <span className="text-xs font-medium text-accent group-hover:translate-x-0.5 transition-transform shrink-0">
                Try →
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Disclosure */}
      <p className="text-[10px] font-mono text-text-muted mt-4 pt-3 border-t border-border/30">
        Affiliate links — we may earn a commission at no extra cost to you. We only recommend tools we genuinely use.
      </p>
    </div>
  );
}
