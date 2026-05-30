"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Copy, Check, ExternalLink, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

interface SavedPrompt {
  id: string;
  slug: string;
  title: string;
  body: string;
  aiTool: string;
  category: string;
  savedAt: number;
}

export default function LibraryPage() {
  const [saved, setSaved] = useState<SavedPrompt[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("promptvault-saved");
    if (stored) {
      try {
        setSaved(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const removePrompt = useCallback((id: string) => {
    setSaved((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("promptvault-saved", JSON.stringify(updated));
      return updated;
    });
    toast.success("Removed from library");
  }, []);

  const copyPrompt = useCallback(async (prompt: SavedPrompt) => {
    await navigator.clipboard.writeText(prompt.body);
    setCopiedId(prompt.id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const clearAll = useCallback(() => {
    setSaved([]);
    localStorage.removeItem("promptvault-saved");
    toast.success("Library cleared");
  }, []);

  const tools = ["all", ...new Set(saved.map((p) => p.aiTool))];
  const filtered = filter === "all" ? saved : saved.filter((p) => p.aiTool === filter);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 pt-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
        <a href="/" className="hover:text-accent transition-colors">Home</a>
        <span>/</span>
        <span className="text-text">My Library</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="label-tag mb-4 inline-flex">
            <Bookmark className="w-3 h-3" />
            Saved
          </div>
          <h1 className="text-3xl font-bold text-text tracking-tight mb-2">
            My Library
          </h1>
          <p className="text-text-secondary">
            {saved.length} saved prompt{saved.length !== 1 ? "s" : ""}
          </p>
        </div>
        {saved.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-mono text-text-muted hover:text-error transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter */}
      {tools.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tools.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                filter === t
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
              }`}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {/* Prompts */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-border">
          <Bookmark className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted font-mono text-sm mb-2">
            {saved.length === 0 ? "No saved prompts yet." : "No prompts match this filter."}
          </p>
          {saved.length === 0 && (
            <Link
              href="/category/chatgpt"
              className="text-xs font-mono text-accent hover:underline"
            >
              Browse prompts &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((prompt) => (
              <motion.div
                key={prompt.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                className="p-4 bg-bg-card border border-border hover:border-accent/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <Link
                    href={`/prompt/${prompt.slug}`}
                    className="text-sm font-bold text-text hover:text-accent transition-colors line-clamp-1"
                  >
                    {prompt.title}
                  </Link>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-bg-elevated border border-border text-text-muted uppercase">
                      {prompt.aiTool}
                    </span>
                  </div>
                </div>

                <pre className="text-xs font-mono text-text-muted whitespace-pre-wrap line-clamp-2 mb-3">
                  {prompt.body}
                </pre>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-text-muted">
                    Saved {new Date(prompt.savedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyPrompt(prompt)}
                      className={`flex items-center gap-1 px-2 py-1 text-[10px] font-mono border transition-all ${
                        copiedId === prompt.id
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-border hover:border-accent hover:text-accent"
                      }`}
                    >
                      {copiedId === prompt.id ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Copy
                    </button>
                    <Link
                      href={`/prompt/${prompt.slug}`}
                      className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono border border-border hover:border-accent hover:text-accent transition-all"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Link>
                    <button
                      onClick={() => removePrompt(prompt.id)}
                      className="p-1 text-text-muted hover:text-error border border-border hover:border-error/30 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
