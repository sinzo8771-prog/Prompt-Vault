import Link from "next/link";
import type { Prompt } from "@/lib/prompts";
import { CopyButton } from "./CopyButton";
import { SaveButton } from "./SaveButton";

const toolTags: Record<string, string> = {
  ChatGPT: "GPT",
  Midjourney: "MJ",
  Claude: "CL",
  Gemini: "GM",
  Copilot: "CP",
  General: "AI",
};

export function PromptCard({
  prompt,
  compact = false,
  index = 0,
}: {
  prompt: Prompt;
  compact?: boolean;
  index?: number;
}) {
  if (compact) {
    return (
      <div className="group relative p-4 bg-bg-card border border-border hover:border-accent/50 transition-all duration-400">
        <div className="flex items-start justify-between gap-3 mb-2">
          <Link
            href={`/prompt/${prompt.slug}`}
            className="text-sm font-semibold text-text hover:text-accent transition-colors line-clamp-1"
          >
            {prompt.title}
          </Link>
          <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 bg-bg-elevated border border-border text-text-muted">
            {toolTags[prompt.aiTool] || "AI"}
          </span>
        </div>
        <p className="text-xs text-text-muted line-clamp-2 mb-3 font-mono leading-relaxed">
          {prompt.body.slice(0, 100)}...
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
    <div className="group relative bg-bg-card border border-border hover:border-accent/50 transition-all duration-400 overflow-hidden">
      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <Link
            href={`/prompt/${prompt.slug}`}
            className="text-base font-bold text-text hover:text-accent transition-colors line-clamp-2 leading-tight"
          >
            {prompt.title}
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-bg-elevated border border-border text-text-muted uppercase tracking-wider">
            {prompt.aiTool}
          </span>
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
            {prompt.category}
          </span>
        </div>

        <div className="p-4 bg-bg border border-border mb-4 prompt-block">
          <pre className="text-xs font-mono whitespace-pre-wrap line-clamp-5 leading-relaxed text-text-secondary">
            {prompt.body}
          </pre>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-[10px] font-mono text-text-muted px-2 py-0.5 bg-bg-elevated border border-border hover:border-accent/30 hover:text-accent transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-[11px] font-mono text-text-muted">
            <span>{prompt.copyCount.toLocaleString()} copies</span>
            <span>{prompt.upvotes.toLocaleString()} upvotes</span>
          </div>
          <div className="flex items-center gap-1">
            <SaveButton prompt={prompt} />
            <CopyButton text={prompt.body} />
          </div>
        </div>
      </div>
    </div>
  );
}
