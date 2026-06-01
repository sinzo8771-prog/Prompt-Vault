"use client";

import Link from "next/link";
import type { Category } from "@/lib/prompts";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  writing: "from-[#6366f1]/10 to-transparent border-[#6366f1]/30 text-[#6366f1]",
  development: "from-[#3b82f6]/10 to-transparent border-[#3b82f6]/30 text-[#3b82f6]",
  marketing: "from-[#ef4444]/10 to-transparent border-[#ef4444]/30 text-[#ef4444]",
  design: "from-[#a855f7]/10 to-transparent border-[#a855f7]/30 text-[#a855f7]",
  productivity: "from-[#10b981]/10 to-transparent border-[#10b981]/30 text-[#10b981]",
  creative: "from-[#f43f5e]/10 to-transparent border-[#f43f5e]/30 text-[#f43f5e]",
  "ai-and-automation": "from-[#8b5cf6]/10 to-transparent border-[#8b5cf6]/30 text-[#8b5cf6]",
  "video-and-film": "from-[#dc2626]/10 to-transparent border-[#dc2626]/30 text-[#dc2626]",
  "business-and-finance": "from-[#0284c7]/10 to-transparent border-[#0284c7]/30 text-[#0284c7]",
  "education-and-learning": "from-[#059669]/10 to-transparent border-[#059669]/30 text-[#059669]",
  "sales-and-crm": "from-[#f97316]/10 to-transparent border-[#f97316]/30 text-[#f97316]",
};

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const styling = CATEGORY_COLORS[category.slug] || "from-accent/10 to-transparent border-accent/30 text-accent";

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block p-8 bg-[#161b2b]/40 border border-border/50 rounded-2xl hover:border-accent/40 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] hover:-translate-y-1.5"
    >
      {/* Background glow hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styling.split(" ")[0]} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`w-14 h-14 rounded-2xl bg-surface-container-high border border-border/60 flex items-center justify-center text-3xl group-hover:rotate-[360deg] transition-all duration-700 shadow-md ${styling.split(" ").slice(2).join(" ")}`}>
            {category.icon}
          </div>
          <span className="text-xs font-mono font-bold text-text-muted bg-[#161b2b] px-3.5 py-1.5 rounded-full border border-border/40 group-hover:border-accent/30 group-hover:text-accent transition-all">
            {category.promptCount} prompts
          </span>
        </div>

        <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors duration-300 mb-2.5 flex items-center gap-1.5">
          {category.name}
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-accent" />
        </h3>
        
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 opacity-85">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
