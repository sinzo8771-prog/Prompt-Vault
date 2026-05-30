"use client";

import { SearchBar } from "@/components/ui/search-bar";

export function SearchPageBar({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <div className="w-full max-w-lg">
      <SearchBar
        placeholder="Search prompts..."
        onSearch={(query) => {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }}
      />
    </div>
  );
}
