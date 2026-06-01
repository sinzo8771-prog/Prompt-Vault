"use client";

import Link from "next/link";
import { useState } from "react";
import type { Prompt } from "@/lib/prompts";
import { CopyButton } from "./CopyButton";
import { SaveButton } from "./SaveButton";
import { Circle, Sparkles, Copy, Eye, Bookmark } from "lucide-react";

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
  index = 0,
}: {
  prompt: Prompt;
  compact?: boolean;
  index?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const badge = TOOL_BADGE[prompt.aiTool] || TOOL_BADGE.Other;

  const handleTouchCard = (e: React.MouseEvent) => {
    // Avoid flipping if clicking links or action buttons
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    setFlipped(!flipped);
  };

  if (compact) {
    return (
      <div 
        onClick={handleTouchCard}
        className="group relative p-5 bg-[#161b2b]/60 backdrop-blur-md border border-border/60 hover:border-accent/40 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_30px_rgba(192,193,255,0.1)] hover:-translate-y-0.5"
      >
        <div className="flex items-start justify-between gap-3 mb-2.5">
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
        <p className="text-xs text-text-secondary line-clamp-2 mb-3.5 font-mono leading-relaxed opacity-85">
          {prompt.body.slice(0, 120)}...
        </p>
        <div className="flex items-center justify-between pt-2.5 border-t border-border/20">
          <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-accent/60" />
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
    <div 
      onClick={handleTouchCard}
      className="flip-card h-[380px] w-full"
    >
      <div className={`flip-card-inner ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* FRONT SIDE */}
        <div className="flip-card-front bg-[#161b2b]/40 backdrop-blur-md border border-border/60 p-6 flex flex-col justify-between shadow-xl">
          {/* Top colored indicator bar */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-accent to-secondary" />

          <div>
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 border rounded-md uppercase tracking-wider ${badge}`}>
                {prompt.aiTool}
              </span>
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-secondary" />
                {prompt.category.replace(/-/g, " ")}
              </span>
            </div>

            <Link
              href={`/prompt/${prompt.slug}`}
              className="block text-lg font-bold text-text hover:text-accent transition-colors line-clamp-2 leading-tight mb-3"
            >
              {prompt.title}
            </Link>

            <p className="text-xs text-text-secondary font-mono leading-relaxed line-clamp-5 mt-2 opacity-80 bg-surface-dim/40 p-3 border border-border/40 rounded-lg">
              {prompt.body}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {prompt.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-[10px] font-mono text-text-muted px-2 py-0.5 bg-text/5 rounded-md hover:bg-accent/15 hover:text-accent transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/20">
              <span className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
                <Circle className="w-1.5 h-1.5 rounded-full fill-accent text-accent animate-pulse" />
                {prompt.copyCount.toLocaleString()} copies
              </span>
              <span className="text-accent text-[11px] font-mono font-semibold flex items-center gap-1 select-none">
                <Eye className="w-3.5 h-3.5" />
                Reveal
              </span>
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="flip-card-back bg-[#1a1f2f] border border-accent/40 p-6 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Source code</span>
              <span className="text-xs font-mono text-accent">TXT_VAULT</span>
            </div>
            <div className="bg-surface-dim/60 rounded-xl p-4 border border-border/40 h-[220px] overflow-y-auto scrollbar-thin select-all">
              <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed text-text-secondary">
                {prompt.body}
              </pre>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="grow">
              <CopyButton text={prompt.body} className="w-full flex items-center justify-center gap-2 bg-accent text-[#0e1322] hover:bg-accent-hover font-bold py-3 rounded-xl transition-all shadow-lg text-sm" />
            </div>
            <SaveButton prompt={prompt} className="p-3 bg-surface-container border border-border hover:border-accent/40 hover:text-accent text-text-secondary rounded-xl transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
