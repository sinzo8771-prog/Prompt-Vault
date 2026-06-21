"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Category {
  slug: string;
  name: string;
  icon: string;
}

interface SearchFiltersProps {
  categories: Category[];
  aiTools: string[];
  selectedCategory: string;
  selectedAiTool: string;
  selectedMinRating: number;
}

export function SearchFilters({ categories, aiTools, selectedCategory, selectedAiTool, selectedMinRating }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "0") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/search?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="mb-8 p-4 bg-bg-card border border-border/50 rounded-xl">
      <div className="flex flex-wrap gap-4 items-end">
        {/* Category Filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border/50 rounded-lg text-sm text-text focus:outline-none focus:border-accent/50 transition-colors font-mono"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* AI Tool Filter */}
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">AI Tool</label>
          <select
            value={selectedAiTool}
            onChange={(e) => updateFilter("aiTool", e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border/50 rounded-lg text-sm text-text focus:outline-none focus:border-accent/50 transition-colors font-mono"
          >
            <option value="all">All Tools</option>
            {aiTools.map((tool) => (
              <option key={tool} value={tool.toLowerCase()}>
                {tool}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-mono text-text-muted mb-2 uppercase tracking-wider">Min Rating</label>
          <select
            value={selectedMinRating}
            onChange={(e) => updateFilter("minRating", e.target.value)}
            className="w-full px-3 py-2 bg-bg border border-border/50 rounded-lg text-sm text-text focus:outline-none focus:border-accent/50 transition-colors font-mono"
          >
            <option value={0}>Any Rating</option>
            <option value={1}>1+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(selectedCategory !== "all" || selectedAiTool !== "all" || selectedMinRating > 0) && (
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("category");
              params.delete("aiTool");
              params.delete("minRating");
              router.push(`/search?${params.toString()}`);
            }}
            className="px-4 py-2 text-xs font-mono text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
