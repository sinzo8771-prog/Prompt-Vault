import Link from "next/link";
import type { Category } from "@/lib/prompts";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative bg-bg-card border border-border hover:border-accent/50 transition-all duration-400 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bg-elevated border border-border flex items-center justify-center text-lg group-hover:border-accent/30 transition-colors">
              {category.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-text group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                {category.promptCount} prompts
              </p>
            </div>
          </div>
          <svg
            className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Bottom accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}
