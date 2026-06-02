"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Command } from "lucide-react";

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
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px rgba(220, 106, 74, 0.3), 0 20px 60px rgba(0, 0, 0, 0.4)"
              : "0 4px 20px rgba(0, 0, 0, 0.3)",
          }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center bg-bg-card border border-border/50 rounded-2xl overflow-hidden"
        >
          {/* Search icon */}
          <div className="pl-5 pr-2">
            <Search
              className={`w-5 h-5 transition-colors duration-300 ${
                isFocused ? "text-accent" : "text-text-muted"
              }`}
            />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search prompts, tools, categories..."
            className="flex-1 bg-transparent py-4 px-2 text-text placeholder:text-text-muted focus:outline-none font-medium"
          />

          {/* Keyboard shortcut hint */}
          <AnimatePresence>
            {!isFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:flex items-center gap-1 pr-4"
              >
                <kbd className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-text-muted bg-bg/50 border border-border/50 rounded-md">
                  <Command className="w-3 h-3" />K
                </kbd>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                className="mr-3 p-2.5 bg-accent rounded-xl hover:bg-accent-hover transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && !query && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-bg-card border border-border/50 rounded-2xl p-3 shadow-2xl z-50"
          >
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-3 py-2">
              Popular searches
            </p>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onMouseDown={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-hover transition-colors text-left group"
              >
                <Search className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                  {suggestion}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
