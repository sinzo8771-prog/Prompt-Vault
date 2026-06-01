"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, X } from "lucide-react";

const SUGGESTIONS = [
  "Blog Writer", "Midjourney Portrait", "Code Review", "Cold Email",
  "Resume Builder", "Flashcard Generator", "SEO Content", "Ad Copy",
  "Interview Prep", "Email Sequence", "Product Description", "Social Media Post",
];

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = query.trim()
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setFocused(false);
  }, [query, router]);

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  return (
    <div className="relative max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          flex items-center gap-3 px-5 py-4 rounded-xl border-2 transition-all duration-300
          ${focused
            ? "border-accent bg-surface-container shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            : "border-border bg-surface-container hover:border-border-hover"}
        `}>
          <Search className={`w-5 h-5 transition-colors ${focused ? "text-accent" : "text-text-muted"}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="What are you building?"
            className="flex-1 bg-transparent outline-none text-text placeholder:text-text-muted font-mono text-sm"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="p-1 text-text-muted hover:text-text transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-secondary text-white text-sm font-semibold rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all"
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {focused && filtered.length > 0 && (
        <div className="absolute z-20 w-full mt-2 py-2 bg-surface-container border border-border rounded-xl shadow-2xl overflow-hidden">
          {filtered.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={() => {
                setQuery(suggestion);
                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                setFocused(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-bg-elevated transition-colors group"
            >
              <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />
              <span className="text-sm text-text-secondary group-hover:text-text font-mono transition-colors">
                {suggestion}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
