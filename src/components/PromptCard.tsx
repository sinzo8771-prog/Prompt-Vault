import Link from "next/link";
import type { Prompt } from "@/lib/prompts";
import { CopyButton } from "./CopyButton";
import { SaveButton } from "./SaveButton";

const TOOL_BADGE: Record<string, string> = {
  ChatGPT: "badge-chatgpt",
  Midjourney: "badge-midjourney",
  Claude: "badge-claude",
  Gemini: "badge-gemini",
  Copilot: "badge-copilot",
  DeepSeek: "badge-deepseek",
  Coding: "badge-coding",
  Other: "badge-other",
};

export function PromptCard({
  prompt,
  compact = false,
}: {
  prompt: Prompt;
  compact?: boolean;
  index?: number;
}) {
  const badge = TOOL_BADGE[prompt.aiTool] || TOOL_BADGE.Other;

  if (compact) {
    return (
      <div className="group relative p-4 bg-bg-card border border-border/50 rounded-xl hover:border-accent/30 transition-all">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            href={`/prompt/${prompt.slug}`}
            className="text-sm font-semibold text-text hover:text-accent transition-colors line-clamp-1 flex-1"
          >
            {prompt.title}
          </Link>
          <span className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${badge}`}>
            {prompt.aiTool}
          </span>
        </div>
        <p className="text-xs text-text-muted line-clamp-2 mb-3 font-mono leading-relaxed">
          {prompt.body.slice(0, 120)}...
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-text-muted">
            {prompt.copyCount.toLocaleString()} copies
          </span>
          <div className="flex items-center gap-1">
            <SaveButton prompt={prompt} />
            <CopyButton text={prompt.body} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-bg-card border border-border/50 border-t-border/80 hover:border-accent/30 transition-all duration-300 p-6 flex flex-col">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <Link
          href={`/prompt/${prompt.slug}`}
          className="text-base font-bold text-text group-hover:text-accent transition-colors line-clamp-2 leading-tight flex-1"
        >
          {prompt.title}
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${badge}`}>
          {prompt.aiTool}
        </span>
        <span className="text-[10px] font-mono text-text-muted capitalize">
          {prompt.category.replace(/-/g, " ")}
        </span>
      </div>

      <div className="code-block mb-4 flex-1">
        <pre className="text-xs font-mono whitespace-pre-wrap line-clamp-5 leading-relaxed text-text-secondary">
          {prompt.body}
        </pre>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        {prompt.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/search?q=${encodeURIComponent(tag)}`}
            className="text-[10px] font-mono text-text-muted px-2 py-0.5 bg-text/5 rounded-md hover:bg-accent/10 hover:text-accent transition-all"
          >
            {tag}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <span className="text-[11px] font-mono text-text-muted">
          {prompt.copyCount.toLocaleString()} copies
        </span>
        <div className="flex items-center gap-1">
          <SaveButton prompt={prompt} />
          <CopyButton text={prompt.body} />
        </div>
      </div>
    </div>
  );
}
