import "server-only";

import { notion, hasNotion } from "./notion";
import { prompts as localPrompts, categories as localCategories } from "@/data/prompts";
import type { Prompt, Category, SearchFilters } from "./types";

export type { Prompt, Category, SearchFilters };

// ── Notion Helpers ──────────────────────────────────────────

type NotionProperties = Record<string, { type: string; [key: string]: unknown }>;

function extractTitle(rec: { properties: NotionProperties }, name = "Name"): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "title" && Array.isArray(prop.title) && prop.title.length > 0) return prop.title[0].plain_text;
  return "";
}

function extractRichText(rec: { properties: NotionProperties }, name: string): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "rich_text" && Array.isArray(prop.rich_text) && prop.rich_text.length > 0)
    return prop.rich_text.map((t: { plain_text: string }) => t.plain_text).join("");
  return "";
}

function extractSelect(rec: { properties: NotionProperties }, name: string): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "select" && prop.select) return (prop.select as { name?: string }).name || "";
  return "";
}

function extractMultiSelect(rec: { properties: NotionProperties }, name: string): string[] {
  const prop = rec.properties?.[name];
  if (prop?.type === "multi_select" && Array.isArray(prop.multi_select))
    return prop.multi_select.map((s: { name: string }) => s.name);
  return [];
}

function extractNumber(rec: { properties: NotionProperties }, name: string): number {
  const prop = rec.properties?.[name];
  return prop?.type === "number" && typeof prop.number === "number" ? prop.number : 0;
}

function toPrompt(rec: { id: string; created_time: string; properties: NotionProperties }): Prompt {
  const upvotes = extractNumber(rec, "Upvotes");
  // Normalize upvotes to a 1-5 rating (log scale: 0→1, 50→2, 200→3, 800→4, 2000+→5)
  const rating = upvotes <= 0 ? undefined : Math.min(5, Math.max(1, Math.round(1 + Math.log10(upvotes + 1) * 1.8)));
  const title = extractTitle(rec, "Name");
  const body = extractRichText(rec, "Body");
  const category = extractSelect(rec, "Category");
  const aiTool = extractSelect(rec, "AI Tool");
  const metaDesc = extractRichText(rec, "MetaDescription");
  return {
    id: rec.id,
    slug: extractRichText(rec, "Slug"),
    title,
    body,
    aiTool,
    category,
    tags: extractMultiSelect(rec, "Tags"),
    copyCount: extractNumber(rec, "CopyCount"),
    createdAt: rec.created_time,
    metaDescription: metaDesc || `${title} — ${aiTool} prompt for ${category}. ${body.slice(0, 120)}...`,
    rating,
    upvotes,
  };
}

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || "";

type NotionQueryFilter = Record<string, unknown>;
type NotionQuerySort = { property: string; direction: "ascending" | "descending" } | { timestamp: "created_time" | "last_edited_time"; direction: "ascending" | "descending" };

async function queryDataSource(
  filter?: NotionQueryFilter,
  sorts?: NotionQuerySort[],
): Promise<{ id: string; created_time: string; properties: NotionProperties }[]> {
  if (!notion || !DATA_SOURCE_ID) return [];
  const allResults: { id: string; created_time: string; properties: NotionProperties }[] = [];
  let startCursor: string | undefined;
  let hasMore = true;

  // During `next build`, external requests can be noisy and slow. Keep it small and fail fast.
  const buildCapPages = process.env.NEXT_PHASE === "phase-production-build" ? 1 : 0;
  const effectiveMaxPages = buildCapPages ? buildCapPages : Number.POSITIVE_INFINITY;
  const effectivePageSize = buildCapPages ? 20 : 100;

  let pageCount = 0;

  while (hasMore && pageCount < effectiveMaxPages) {
    pageCount++;
    const params: Record<string, unknown> = {
      data_source_id: DATA_SOURCE_ID,
      page_size: effectivePageSize,
    };
    if (filter) params.filter = filter;
    if (sorts) params.sorts = sorts;
    if (startCursor) params.start_cursor = startCursor;

    const response = await notion.dataSources.query(params as unknown as Parameters<typeof notion.dataSources.query>[0]);
    const results = (response.results ?? []) as { id: string; created_time: string; properties: NotionProperties }[];
    allResults.push(...results);
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }
  return allResults;
}


// ─── Helpers ────────────────────────────────────────────────

/** Normalize a category name (e.g. "AI & Automation") to a URL slug (e.g. "ai-and-automation") */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}


// ─── Public API (with Notion → local fallback) ─────────────

export async function getAllPrompts(): Promise<Prompt[]> {
  if (!hasNotion) return localPrompts as Prompt[];

  try {
    const records = await queryDataSource(undefined, [
      { property: "CopyCount", direction: "descending" },
    ]);
    const notionPrompts = records.map(toPrompt);
    return notionPrompts.length > 0 ? notionPrompts : localPrompts as Prompt[];
  } catch {
    return localPrompts as Prompt[];
  }
}

export async function getFeaturedPrompts(count = 6): Promise<Prompt[]> {
  const all = await getAllPrompts();
  return all.slice(0, count);
}

export async function getTrendingPrompts(count = 10): Promise<Prompt[]> {
  return getFeaturedPrompts(count);
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  // Map URL slug back to Notion category name
  const slugToNotion: Record<string, string> = {
    writing: "Writing",
    design: "Design",
    marketing: "Marketing",
    development: "Development",
    productivity: "Productivity",
    creative: "Creative",
    "sales-and-crm": "Sales & CRM",
    "business-and-finance": "Business & Finance",
    "education-and-learning": "Education & Learning",
    "ai-and-automation": "AI & Automation",
    "video-and-film": "Video & Film",
  };
  const notionCat = slugToNotion[category.toLowerCase()] || category;

  if (!hasNotion) {
    return (localPrompts as Prompt[]).filter(
      (p) => toSlug(p.category) === category.toLowerCase()
    );
  }

  try {
    const records = await queryDataSource(
      { property: "Category", select: { equals: notionCat } },
      [{ property: "CopyCount", direction: "descending" }],
    );
    const notionPrompts = records.map(toPrompt);
    return notionPrompts.length > 0
      ? notionPrompts
      : (localPrompts as Prompt[]).filter(
          (p) => toSlug(p.category) === category.toLowerCase()
        );
  } catch {
    return (localPrompts as Prompt[]).filter(
      (p) => toSlug(p.category) === category.toLowerCase()
    );
  }
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  if (!hasNotion) {
    return (localPrompts as Prompt[]).find((p) => p.slug === slug) || null;
  }

  try {
    const records = await queryDataSource({
      property: "Slug",
      rich_text: { equals: slug },
    });
    if (records.length > 0) return toPrompt(records[0]);
  } catch { /* fallback */ }

  return (localPrompts as Prompt[]).find((p) => p.slug === slug) || null;
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  if (!query.trim()) return getAllPrompts();

  if (!hasNotion) {
    const q = query.toLowerCase();
    return (localPrompts as Prompt[]).filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.aiTool.toLowerCase().includes(q)
    );
  }

  try {
    const records = await queryDataSource({
      or: [
        { property: "Name", title: { contains: query } },
        { property: "Body", rich_text: { contains: query } },
        { property: "Tags", multi_select: { contains: query } },
      ],
    });
    const notionPrompts = records.map(toPrompt);
    if (notionPrompts.length > 0) return notionPrompts;
  } catch { /* fallback */ }

  const q = query.toLowerCase();
  return (localPrompts as Prompt[]).filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.body.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}


export async function searchPromptsWithFilters(
  query: string,
  filters: SearchFilters
): Promise<Prompt[]> {
  let results = await searchPrompts(query);

  if (filters.category && filters.category !== "all") {
    results = results.filter((p) => toSlug(p.category) === filters.category);
  }
  if (filters.aiTool && filters.aiTool !== "all") {
      results = results.filter((p) => p.aiTool.toLowerCase() === filters.aiTool!.toLowerCase());
    }
  if (filters.minRating && filters.minRating > 0) {
    // Rating filter — no-op since rating/upvotes fields were removed
    // Kept for API compatibility with SearchFilters interface
  }

  return results;
}

export async function getAiTools(): Promise<string[]> {
  const prompts = await getAllPrompts();
  const tools = new Set(prompts.map((p) => p.aiTool).filter(Boolean));
  return Array.from(tools).sort();
}

export function getUniqueCategoriesFromPrompts(prompts: Prompt[]): string[] {
  const cats = new Set(prompts.map((p) => p.category).filter(Boolean));
  return Array.from(cats).sort();
}

export async function getCategories(): Promise<Category[]> {
  if (!hasNotion) {
    // Compute real prompt counts from local data
    const counts: Record<string, number> = {};
    for (const p of localPrompts) {
      const c = p.category.toLowerCase();
      counts[c] = (counts[c] || 0) + 1;
    }
    return (localCategories as Category[]).map((cat) => ({
      ...cat,
      promptCount: counts[cat.slug] || 0,
    }));
  }

  try {
    const prompts = await getAllPrompts();

  const catDef: Record<string, { icon: string; color: string; description: string }> = {
    writing: { icon: "✍️", color: "#10a37f", description: "Writing, brainstorming, and content creation prompts." },
    design: { icon: "🎨", color: "#5865f2", description: "Image generation, UI design, and creative visual prompts." },
    marketing: { icon: "📈", color: "#ef4444", description: "Ad copy, email campaigns, and brand strategy prompts." },
    development: { icon: "💻", color: "#f59e0b", description: "Code review, debugging, and development workflow prompts." },
    productivity: { icon: "⚡", color: "#8b5cf6", description: "Automation, organization, and efficiency prompts." },
    creative: { icon: "💡", color: "#06b6d4", description: "Creative ideation, storytelling, and artistic prompts." },
    "sales-and-crm": { icon: "🎯", color: "#f97316", description: "Sales scripts, CRM workflows, and deal strategy prompts." },
    "ai-and-automation": { icon: "🤖", color: "#7c3aed", description: "AI agent design, workflow automation, and RAG prompts." },
    "education-and-learning": { icon: "📚", color: "#059669", description: "Course creation, curriculum design, and study system prompts." },
    "business-and-finance": { icon: "💼", color: "#0284c7", description: "Business plans, financial models, and fundraising prompts." },
    "video-and-film": { icon: "🎬", color: "#dc2626", description: "Video generation, YouTube production, and motion design prompts." },
  };

  const counts: Record<string, number> = {};
  for (const p of prompts) {
    const c = toSlug(p.category);
    counts[c] = (counts[c] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([slug, count]) => {
      const def = catDef[slug] || { icon: "📁", color: "#666", description: "" };
      // Map slug back to display name
      const displayNameMap: Record<string, string> = {
        writing: "Writing",
        design: "Design",
        marketing: "Marketing",
        development: "Development",
        productivity: "Productivity",
        creative: "Creative",
        "sales-and-crm": "Sales & CRM",
        "business-and-finance": "Business & Finance",
        "education-and-learning": "Education & Learning",
        "ai-and-automation": "AI & Automation",
        "video-and-film": "Video & Film",
      };
      return {
        slug,
        name: displayNameMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
        description: def.description,
        icon: def.icon,
        promptCount: count,
        color: def.color,
      };
    })
    .sort((a, b) => b.promptCount - a.promptCount);
  } catch {
    return localCategories as Category[];
  }
}
