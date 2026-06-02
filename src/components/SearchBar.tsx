"use client";

import { SearchBar as GooeySearchBar } from "@/components/ui/search-bar";

export function SearchBar({
  size = "lg",
}: {
  size?: "sm" | "lg";
}) {
  return (
    <div className="w-full">
      <GooeySearchBar
        placeholder={size === "sm" ? "Search prompts..." : "What are you building?"}
      />
    </div>
  );
}
