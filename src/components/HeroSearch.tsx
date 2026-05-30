"use client";

import { SearchBar } from "@/components/ui/search-bar";

export function HeroSearch() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <SearchBar
        placeholder="What are you building?"
        onSearch={(query) => {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }}
      />
    </div>
  );
}
