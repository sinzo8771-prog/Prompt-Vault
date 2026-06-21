"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, X, SlidersHorizontal } from "lucide-react";
import type { SearchFilters } from "@/lib/types";

interface FilterSidebarProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  categories: { slug: string; name: string; count: number }[];
  aiTools: { name: string; count: number }[];
  activeFilterCount: number;
  clearFilters: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function FilterSidebar({
  filters,
  setFilters,
  categories,
  aiTools,
  activeFilterCount,
  clearFilters,
  isMobileOpen,
  onMobileClose,
}: FilterSidebarProps) {
  const content = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--color-primary)]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-on-surface)]">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-mono text-[var(--color-on-surface-muted)] hover:text-[var(--color-primary)] transition-colors uppercase tracking-wider"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-on-surface-muted)] mb-3 block">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setFilters({ ...filters, category: "all" })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all transition-standard flex items-center justify-between ${
              filters.category === "all"
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                : "text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-on-surface)]"
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] font-mono opacity-60">
              {categories.reduce((s, c) => s + c.count, 0)}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setFilters({ ...filters, category: cat.slug })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all transition-standard flex items-center justify-between ${
                filters.category === cat.slug
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] font-mono opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Tool Filter */}
      <div>
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-on-surface-muted)] mb-3 block">
          AI Tool
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setFilters({ ...filters, aiTool: "all" })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all transition-standard flex items-center justify-between ${
              filters.aiTool === "all"
                ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                : "text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-on-surface)]"
            }`}
          >
            <span>All Tools</span>
          </button>
          {aiTools.map((tool) => (
            <button
              key={tool.name}
              onClick={() => setFilters({ ...filters, aiTool: tool.name })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all transition-standard flex items-center justify-between ${
                filters.aiTool === tool.name
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              <span>{tool.name}</span>
              <span className="text-[10px] font-mono opacity-60">{tool.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--color-on-surface-muted)] mb-3 block">
          Min. Rating
        </label>
        <div className="space-y-1">
          {[
            { value: 0, label: "Any rating" },
            { value: 4, label: "4+ stars" },
            { value: 3, label: "3+ stars" },
            { value: 2, label: "2+ stars" },
            { value: 1, label: "1+ stars" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilters({ ...filters, minRating: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all transition-standard flex items-center gap-2 ${
                filters.minRating === opt.value
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-on-surface-muted)] hover:bg-[var(--color-surface-light)] hover:text-[var(--color-on-surface)]"
              }`}
            >
              {opt.value > 0 && (
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: opt.value }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[10px] font-mono ml-1 opacity-60">
                    {5 - opt.value > 0 && `${5 - opt.value}+ more`}
                  </span>
                </span>
              )}
              {opt.value === 0 && <span>{opt.label}</span>}
              {opt.value > 0 && <span>{opt.label}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 p-6 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-2xl">
          {content}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-80 max-w-[85vw] z-50 bg-[var(--color-surface)] border-r border-[var(--color-hairline)] p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-on-surface)]">
                  Filters
                </span>
                <button
                  onClick={onMobileClose}
                  className="p-2 text-[var(--color-on-surface-muted)] hover:text-[var(--color-on-surface)] transition-colors rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
