"use client";

import { useEffect, useState } from "react";

const TERMINAL_LINES = [
  "$ promptvault --init",
  "─────────────────────────────",
  "  PromptVault v2.0",
  "  256+ curated prompts",
  "  11 categories",
  "  8 AI tools supported",
  "",
  "  ✓ ChatGPT  ✓ Claude  ✓ Gemini",
  "  ✓ Midjourney  ✓ Copilot  ✓ DeepSeek",
  "",
  "  Status: Ready",
  "",
  "▸ What will you build today?",
];

export function TerminalAnimation() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);

  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) return;
    const line = TERMINAL_LINES[currentLine];
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const next = [...prev];
          next[currentLine] = (next[currentLine] || "") + line[currentChar];
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, 25 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  return (
    <div className="relative w-full h-full bg-surface flex flex-col justify-center overflow-hidden rounded-xl border border-border">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-surface-container border-b border-border flex items-center gap-2 px-3">
        <div className="w-2.5 h-2.5 rounded-full bg-error/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-warning/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-success/80" />
        <span className="text-[10px] font-mono text-text-muted ml-2">promptvault — zsh</span>
      </div>

      {/* Terminal content */}
      <div className="p-6 pt-14 font-mono text-sm leading-relaxed">
        {displayedLines.map((line, i) => (
          <div key={i} className="flex min-h-[1.4em]">
            {i === 0 && <span className="text-accent mr-2">$</span>}
            {i > 0 && line.startsWith("▸") && <span className="text-secondary mr-2">▸</span>}
            <span className={
              line.startsWith("✓") ? "text-success text-xs" :
              line.startsWith("─") ? "text-border" :
              line.startsWith("  Status") ? "text-accent font-semibold" :
              "text-text-secondary"
            }>
              {line}
            </span>
          </div>
        ))}
        {currentLine < TERMINAL_LINES.length && (
          <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
        )}
      </div>
    </div>
  );
}
