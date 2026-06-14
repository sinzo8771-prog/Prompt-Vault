"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Prompt } from "@/lib/prompts";
import { CopyButton } from "./CopyButton";
import { SaveButton } from "./SaveButton";
import { Sparkles } from "lucide-react";

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

  // Mouse tracking for subtle 3D hover depth
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
  };

  if (compact) {
    return (
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group relative p-6 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-[20px] hover:bg-white hover:border-[var(--color-primary)]/30 transition-all transition-standard"
      >
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              href={`/prompt/${prompt.slug}`}
              className="text-lg font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 flex-1"
            >
              {prompt.title}
            </Link>
            <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 border border-[var(--color-hairline)] rounded-md uppercase tracking-wider text-[var(--color-primary)] bg-[var(--color-primary)]/10">
              {prompt.aiTool}
            </span>
          </div>

          <p className="text-xs text-[var(--color-on-surface-muted)] line-clamp-2 mb-3 leading-relaxed">
            {prompt.body.slice(0, 120)}...
          </p>

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--color-on-surface-muted)] uppercase tracking-wider">
              {prompt.copyCount.toLocaleString()} copies
            </span>
            <div className="flex items-center gap-2">
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
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
      className="group relative bg-white border border-[var(--color-hairline)] rounded-[32px] overflow-hidden hover:border-[var(--color-primary)]/20 transition-all transition-standard p-12 flex flex-col h-full"
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold rounded-full uppercase tracking-tighter">
              {prompt.aiTool}
            </span>
            <span className="text-[var(--color-on-surface-muted)] text-xs font-mono uppercase">
              {prompt.category.replace(/-/g, " ")}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase">
              High Reliability
            </span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/prompt/${prompt.slug}`}
          className="text-3xl font-semibold text-[var(--color-on-surface)] hover:text-[var(--color-primary)] transition-colors mb-6 leading-tight block"
        >
          {prompt.title}
        </Link>

        {/* Code/Prompt Body */}
        <p className="text-[var(--color-on-surface-muted)] text-lg leading-relaxed mb-8 italic border-l-4 border-[var(--color-primary)]/20 pl-6 line-clamp-4">
          &ldquo;{prompt.body}&rdquo;
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              href={`/search?q=${encodeURIComponent(tag)}`}
              className="text-xs font-mono text-[var(--color-on-surface-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-[var(--color-hairline)] mt-auto">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest opacity-40 leading-none mb-1">Executions</span>
              <span className="text-sm font-bold leading-none">{prompt.copyCount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <SaveButton prompt={prompt} />
            <CopyButton text={prompt.body} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
