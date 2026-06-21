"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Fuse from "fuse.js";
import type { Prompt, SearchFilters } from "@/lib/types";

export type { SearchFilters };

export const EMPTY_FILTERS: SearchFilters = {
  category: "all",
  aiTool: "all",
  minRating: 0,
};

export function useSearch(prompts: Prompt[]) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);

  const fuse = useMemo(
    () =>
      new Fuse(prompts, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "tags", weight: 0.25 },
          { name: "body", weight: 0.15 },
          { name: "category", weight: 0.1 },
          { name: "aiTool", weight: 0.1 },
        ],
        threshold: 0.4,
        includeScore: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [prompts]
  );

  const results = useMemo(() => {
    // Step 1: text search
    let matched: Prompt[];
    if (query.trim()) {
      matched = fuse.search(query).map((r) => r.item);
    } else {
      matched = prompts;
    }

    // Step 2: apply filters
    if (filters.category && filters.category !== "all") {
      const cat = filters.category;
      matched = matched.filter(
        (p) =>
          p.category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") ===
          cat
      );
    }
    if (filters.aiTool && filters.aiTool !== "all") {
      const tool = filters.aiTool.toLowerCase();
      matched = matched.filter(
        (p) => p.aiTool.toLowerCase() === tool
      );
    }
    if (filters.minRating && filters.minRating > 0) {
      const min = filters.minRating;
      matched = matched.filter((p) => {
        const rating = p.rating ?? (p.upvotes ? Math.min(5, Math.max(1, Math.round(1 + Math.log10(p.upvotes + 1) * 1.8))) : 0);
        return rating >= min;
      });
    }

    return matched;
  }, [query, filters, fuse, prompts]);

  const categories = useMemo(() => {
    const cats = new Map<string, { name: string; count: number }>();
    for (const p of prompts) {
      const slug = p.category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
      const existing = cats.get(slug);
      if (existing) {
        existing.count++;
      } else {
        cats.set(slug, { name: p.category, count: 1 });
      }
    }
    return Array.from(cats.entries()).map(([slug, { name, count }]) => ({ slug, name, count })).sort((a, b) => b.count - a.count);
  }, [prompts]);

  const aiTools = useMemo(() => {
    const tools = new Map<string, number>();
    for (const p of prompts) {
      if (p.aiTool) {
        tools.set(p.aiTool, (tools.get(p.aiTool) || 0) + 1);
      }
    }
    return Array.from(tools.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [prompts]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== "all") count++;
    if (filters.aiTool && filters.aiTool !== "all") count++;
    if (filters.minRating && filters.minRating > 0) count++;
    return count;
  }, [filters]);

  const clearFilters = useCallback(() => setFilters(EMPTY_FILTERS), []);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    results,
    categories,
    aiTools,
    activeFilterCount,
    clearFilters,
  };
}
