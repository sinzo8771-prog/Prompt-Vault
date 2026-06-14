"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

const SUGGESTIONS = [
  "Blog post writer",
  "Code review assistant",
  "Cold email generator",
  "SEO content optimizer",
  "Midjourney portrait prompt",
  "YouTube script writer",
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!isFocused) return;
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = query.trim();
    if (!next) return;
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(next)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setQuery("");
      setIsFocused(false);
    }
  };

  const shouldShowSuggestions =
    isFocused && query.trim().length > 0 && query.trim().length < 8;

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center w-full bg-transparent">
          {/* Search icon */}
          <div className="pl-6 text-white/30">
            <Search className="w-7 h-7" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="I need a prompt for..."
            className="w-full bg-transparent border-none outline-hidden text-white px-8 py-6 text-2xl placeholder:text-white/20 font-light tracking-tight focus:ring-0 focus:outline-hidden"
          />

          {/* Submit/Ask Oracle button */}
          <button
            type="submit"
            className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-surface-dark)] text-white px-12 py-5 rounded-xl transition-standard font-bold text-lg mr-1 shadow-2xl active:scale-[0.98] shrink-0"
          >
            Ask Oracle
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {shouldShowSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-[var(--color-surface-dark)] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 oracle-glow text-left"
          >
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider px-3 py-2">
              Popular searches
            </p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
              >
                <Search className="w-4 h-4 text-white/40 group-hover:text-[var(--color-primary-hover)] transition-colors" />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {suggestion}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
