"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchPageBarProps {
  defaultValue?: string;
}

export function SearchPageBar({ defaultValue = "" }: SearchPageBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  useEffect(() => {
    if (query !== defaultValue) {
      setQuery(defaultValue);
    }
  }, [defaultValue, query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search prompts..."
        className="w-full pl-11 pr-4 py-3 bg-bg border border-border/50 rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors font-mono"
      />
    </form>
  );
}
