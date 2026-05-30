"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({
  size = "lg",
  defaultValue = "",
}: {
  size?: "sm" | "lg";
  defaultValue?: string;
}) {
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (size === "sm") {
    return (
      <form onSubmit={handleSearch} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search prompts..."
          className={`w-full px-4 py-3 bg-bg-card text-sm text-text placeholder:text-text-muted font-mono focus:outline-none transition-all border ${
            focused ? "border-accent" : "border-border"
          }`}
        />
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className={`relative transition-all duration-300 ${focused ? "shadow-[0_0_30px_rgba(255,61,0,0.1)]" : ""}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="What are you building?"
          className="w-full px-6 py-5 pr-32 bg-bg-card text-base text-text placeholder:text-text-muted font-mono focus:outline-none border-2 border-border focus:border-accent transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}
