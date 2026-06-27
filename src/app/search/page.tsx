"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import type { Prompt } from "@/lib/types";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useSearch } from "@/components/useSearch";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [promptsLoaded, setPromptsLoaded] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Load prompts from API on mount
  useEffect(() => {
    fetch("/api/prompts")
      .then((res) => res.json())
      .then((data: Prompt[]) => {
        setPrompts(data);
        setPromptsLoaded(true);
      })
      .catch(() => {
        setPromptsLoaded(true);
      });
  }, []);

  const {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    categories,
    aiTools,
    activeFilterCount,
    clearFilters,
  } = useSearch(prompts);

  // Set initial query from URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery, setQuery]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="display-2 mb-6">
            {query ? (
              <>
                Results for &quot;<span className="text-[var(--color-primary)]">{query}</span>&quot;
              </>
            ) : (
              <>
                Search <span className="text-[var(--color-primary)]">prompts</span>
              </>
            )}
          </h1>

          {/* Search bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts, tools, categories..."
                className="w-full pl-11 pr-10 py-3 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-xl text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)]/50 transition-colors font-mono"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-xl text-sm font-mono text-[var(--color-text)] hover:border-[var(--color-primary)]/50 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Results info bar */}
      {query && (
        <ScrollReveal delay={50}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-mono text-[var(--color-text-muted)]">
              {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
              {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount !== 1 ? "s" : ""} active`}
            </p>
          </div>
        </ScrollReveal>
      )}

      {/* Main layout: sidebar + results */}
      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          aiTools={aiTools}
          activeFilterCount={activeFilterCount}
          clearFilters={clearFilters}
          isMobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          {!promptsLoaded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((prompt, i) => (
                <ScrollReveal key={prompt.id} delay={i * 30}>
                  <PromptCard prompt={prompt} index={i} />
                </ScrollReveal>
              ))}
            </div>
          ) : query ? (
            <ScrollReveal>
              <div className="text-center py-20 border border-[var(--color-hairline)] rounded-2xl bg-[var(--color-surface-light)]">
                <p className="text-[var(--color-text-muted)] font-mono text-sm mb-3">
                  No results for &quot;{query}&quot;
                </p>
                <p className="text-[var(--color-text-muted)] text-xs mb-4">
                  {activeFilterCount > 0
                    ? "Try removing some filters or using different keywords."
                    : "Try different keywords or browse by category."}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="btn-ghost text-xs"
                    >
                      Clear filters
                    </button>
                  )}
                  <Link href="/category/writing" className="btn-ghost text-xs">
                    Browse categories
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal>
              <div className="text-center py-20 border border-[var(--color-hairline)] rounded-2xl bg-[var(--color-surface-light)]">
                <p className="text-[var(--color-text-muted)] font-mono text-sm mb-3">
                  🔍 Search {prompts.length}+ curated prompts
                </p>
                <p className="text-[var(--color-text-muted)] text-xs">
                  Type a keyword above — e.g. &quot;resume&quot;, &quot;Midjourney&quot;, &quot;cold email&quot;
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
          <div className="h-12 w-64 bg-[var(--color-surface-light)] rounded-xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
