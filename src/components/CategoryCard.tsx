import Link from "next/link";
import type { Category } from "@/lib/prompts";

const CATEGORY_COLORS: Record<string, string> = {
  writing: "from-orange-500/20 to-amber-500/10",
  development: "from-blue-500/20 to-cyan-500/10",
  marketing: "from-rose-500/20 to-pink-500/10",
  design: "from-violet-500/20 to-purple-500/10",
  productivity: "from-emerald-500/20 to-green-500/10",
  creative: "from-fuchsia-500/20 to-pink-500/10",
  "ai-and-automation": "from-amber-500/20 to-orange-500/10",
  "video-and-film": "from-red-500/20 to-rose-500/10",
  "business-and-finance": "from-sky-500/20 to-blue-500/10",
  "education-and-learning": "from-teal-500/20 to-emerald-500/10",
  "sales-and-crm": "from-yellow-500/20 to-amber-500/10",
};

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const gradient = CATEGORY_COLORS[category.slug] || "from-accent/20 to-accent/5";

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block p-6 bg-bg-card border border-border/50 border-t-border/80 hover:border-accent/30 transition-all duration-300 overflow-hidden"
    >
      {/* Hover gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl">{category.icon}</span>
          <span className="text-xs font-mono text-text-muted group-hover:text-accent transition-colors">
            {category.promptCount} prompts
          </span>
        </div>
        <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-text-muted line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
