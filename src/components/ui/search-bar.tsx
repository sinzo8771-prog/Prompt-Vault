"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({ placeholder = "What are you building?", onSearch, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) onSearch(query);
      else router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <div className={`
        flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all duration-300
        ${focused
          ? "border-accent bg-surface-container shadow-[0_0_25px_rgba(99,102,241,0.12)]"
          : "border-border bg-surface-container hover:border-border-hover"}
      `}>
        <Search className={cn("w-5 h-5 transition-colors shrink-0", focused ? "text-accent" : "text-text-muted")} />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="flex-1 bg-transparent outline-none text-text placeholder:text-text-muted font-mono text-sm"
        />
        {query.trim() && (
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent to-secondary text-white text-xs font-semibold rounded-lg hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all shrink-0"
          >
            <span className="hidden sm:inline">Go</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

export { SearchBar as default };
