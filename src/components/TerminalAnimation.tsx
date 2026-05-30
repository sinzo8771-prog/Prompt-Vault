"use client";

import { useEffect, useState, useRef } from "react";

const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;':,./<>?";

const TERMINAL_LINES = [
  "$ promptvault --init",
  "Loading prompt database...",
  "500+ prompts indexed",
  "6 categories available",
  "AI tools: ChatGPT, Midjourney, Claude, Gemini, Copilot",
  "Status: Ready to generate",
  "",
  "> What will you build today?",
];

export function TerminalAnimation() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (currentLine >= TERMINAL_LINES.length) return;

    const line = TERMINAL_LINES[currentLine];
    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[currentLine] = (newLines[currentLine] || "") + line[currentChar];
          return newLines;
        });
        setCurrentChar((c) => c + 1);
      }, 30 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 600;

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(255, 61, 0, 0.15)";
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(char, i * 14, drops[i] * 14);

        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-bg flex flex-col justify-center overflow-hidden">
      {/* Matrix background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40 pointer-events-none"
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Terminal content */}
      <div className="relative z-10 p-8 md:p-12 max-w-lg">
        <div className="mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-accent">
            PromptVault Terminal v2.0
          </span>
        </div>

        <div className="font-mono text-sm text-text-secondary leading-relaxed">
          {displayedLines.map((line, i) => (
            <div key={i} className="flex">
              {i === 0 && <span className="text-accent mr-2">&gt;</span>}
              {i > 0 && line.startsWith("$") && <span className="text-accent mr-2">&gt;</span>}
              <span className={i === currentLine && currentLine < TERMINAL_LINES.length ? "" : ""}>
                {line}
              </span>
            </div>
          ))}
          {currentLine < TERMINAL_LINES.length && (
            <span className={`inline-block w-2 h-4 bg-accent ${showCursor ? "opacity-100" : "opacity-0"}`} />
          )}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-px bg-border/30">
          {[
            { value: "500+", label: "Prompts" },
            { value: "6", label: "Categories" },
            { value: "4.9", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-text">{stat.value}</p>
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ASCII art divider */}
        <div className="mt-8 font-mono text-[10px] text-text-muted/30 leading-none">
          ┌──────────────────────────────────────┐<br />
          │ &quot;Stop Googling prompts.&quot; │<br />
          │ &quot;Start building with them.&quot; │<br />
          └──────────────────────────────────────┘
        </div>
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
