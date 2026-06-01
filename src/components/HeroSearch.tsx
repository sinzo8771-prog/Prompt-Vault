"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What are you building?"
        className="w-full pl-12 pr-32 py-4 bg-bg-card border border-border/50 rounded-xl text-base text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors"
      >
        Search
      </button>
    </form>
  );
}
