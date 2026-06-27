"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Search, Trash2, X } from "lucide-react";
import { PromptCard } from "@/components/PromptCard";
import type { Prompt } from "@/lib/types";

interface Props {
  allPrompts: Prompt[];
}

export function SavedClientPage({ allPrompts }: Props) {
  // Lazy initializer reads localStorage once on mount (client-only, SSR-safe).
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("favorites") || "[]") as string[];
  });
  const [query, setQuery] = useState("");

  // Keep in sync across tabs — setState only in callback, satisfies lint rule.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "favorites") {
        setSavedIds(JSON.parse(e.newValue || "[]"));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hydrated = true; // lazy initializer runs synchronously on client

  const savedPrompts = allPrompts.filter((p) => (savedIds ?? []).includes(p.id));

  const filtered = query.trim()
    ? savedPrompts.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.aiTool.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : savedPrompts;

  const clearAll = () => {
    localStorage.setItem("favorites", "[]");
    setSavedIds([]);
  };

  const removeOne = (id: string) => {
    const updated = (savedIds ?? []).filter((sid) => sid !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setSavedIds(updated);
  };

  if (!hydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-xl bg-bg-card border border-border/40 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      {savedPrompts.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter saved prompts…"
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-bg-card border border-border/60 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats + Clear */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm text-text-muted">
              {filtered.length} / {savedPrompts.length} prompts
            </span>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-text-muted border border-border/50 hover:text-red-400 hover:border-red-400/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((prompt, i) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                className="relative group"
              >
                <PromptCard prompt={prompt} index={i} />
                {/* Quick-remove button overlaid on card */}
                <button
                  onClick={() => removeOne(prompt.id)}
                  title="Remove from saved"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : savedPrompts.length > 0 ? (
          /* Results empty after filtering */
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-text-muted text-sm">
              No saved prompts match &ldquo;{query}&rdquo;
            </p>
            <button
              onClick={() => setQuery("")}
              className="mt-3 text-accent text-sm underline underline-offset-4"
            >
              Clear filter
            </button>
          </motion.div>
        ) : (
          /* Truly empty */
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 border border-border/50 rounded-xl bg-bg-card"
          >
            <Bookmark className="w-12 h-12 mx-auto text-text-muted/30 mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No saved prompts yet
            </h3>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              Hit the <strong>Save</strong> button on any prompt card and it
              will appear here for quick access.
            </p>
            <Link href="/" className="btn-primary">
              Browse Prompts
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
