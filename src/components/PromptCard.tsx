"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Prompt } from "@/lib/prompts";
import { CopyButton } from "./CopyButton";
import { SaveButton } from "./SaveButton";
import { ArrowUpRight, Sparkles } from "lucide-react";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const badge = TOOL_BADGE[prompt.aiTool] || TOOL_BADGE.Other;

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  if (compact) {
    return (
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group relative p-4 bg-bg-card border border-border/50 rounded-xl hover:border-accent/30 transition-colors"
      >
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              href={`/prompt/${prompt.slug}`}
              className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-1 flex-1"
            >
              {prompt.title}
            </Link>
            <span
              className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 border rounded-md uppercase tracking-wider ${badge}`}
            >
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
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative bg-bg-card border border-border/50 rounded-2xl hover:border-border-hover transition-all duration-500 p-6 flex flex-col overflow-hidden"
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10" />
      </div>

      {/* Mouse-following spotlight */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, rgba(220, 106, 74, 0.08), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <Link
            href={`/prompt/${prompt.slug}`}
            className="text-base font-bold text-text group-hover:text-accent transition-colors line-clamp-2 leading-tight flex-1"
          >
            {prompt.title}
          </Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
            className="shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-1 border rounded-md uppercase tracking-wider ${badge}`}
          >
            {prompt.aiTool}
          </span>
          <span className="text-[10px] font-mono text-text-muted capitalize px-2 py-1 bg-text/5 rounded-md">
            {prompt.category.replace(/-/g, " ")}
          </span>
        </div>

        {/* Code preview */}
        <div className="code-block mb-4 flex-1 relative">
          <pre className="text-xs font-mono whitespace-pre-wrap line-clamp-5 leading-relaxed text-text-secondary">
            {prompt.body}
          </pre>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-surface to-transparent" />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-[10px] font-mono text-text-muted px-2 py-1 bg-text/5 rounded-md hover:bg-accent/10 hover:text-accent transition-all duration-300"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-accent/60" />
            <span className="text-[11px] font-mono text-text-muted">
              {prompt.copyCount.toLocaleString()} copies
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton prompt={prompt} />
            <CopyButton text={prompt.body} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
