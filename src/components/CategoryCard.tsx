import Link from "next/link";
import type { Category } from "@/lib/prompts";

export function CategoryCard({ category }: { category: Category; index?: number }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative block p-6 bg-surface-container border border-border/50 rounded-xl hover:border-accent/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{category.icon}</span>
        <span className="text-xs font-mono text-text-muted">
          {category.promptCount} prompts
        </span>
      </div>
      <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors mb-2">
        {category.name}
      </h3>
      <p className="text-sm text-text-muted line-clamp-2">
        {category.description}
      </p>
    </Link>
  );
}
