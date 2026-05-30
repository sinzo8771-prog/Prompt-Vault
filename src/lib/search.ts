// Legacy search module — kept for backwards compatibility.
// All pages now use @/lib/prompts for data fetching.
import Fuse from "fuse.js";
import { prompts, type Prompt } from "@/data/prompts";

const fuse = new Fuse(prompts, {
  keys: ["title", "body", "tags", "category", "aiTool"],
  threshold: 0.3,
  includeScore: true,
});

export function searchPrompts(query: string): Prompt[] {
  if (!query.trim()) return prompts;
  return fuse.search(query).map((result) => result.item);
}

export function getPromptsByCategory(category: string): Prompt[] {
  return prompts.filter((p) => p.category === category);
}

export function getPromptBySlug(slug: string): Prompt | undefined {
  return prompts.find((p) => p.slug === slug);
}

export function getFeaturedPrompts(): Prompt[] {
  return prompts.filter((p) => p.copyCount > 1000).slice(0, 8);
}

export function getTrendingPrompts(): Prompt[] {
  return [...prompts].sort((a, b) => b.copyCount - a.copyCount).slice(0, 6);
}

export function getRelatedPrompts(prompt: Prompt, count = 4): Prompt[] {
  return prompts
    .filter(
      (p) =>
        p.id !== prompt.id &&
        (p.category === prompt.category || p.aiTool === prompt.aiTool)
    )
    .slice(0, count);
}
