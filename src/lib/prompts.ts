import "server-only";

import { notion, hasNotion } from "./notion";
import { prompts as localPrompts, categories as localCategories } from "@/data/prompts";

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  body: string;
  aiTool: string;
  category: string;
  tags: string[];
  copyCount: number;
  createdAt: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  promptCount: number;
  color: string;
}

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
  return {
    id: rec.id,
    slug: extractRichText(rec, "Slug"),
    title: extractTitle(rec, "Name"),
    body: extractRichText(rec, "Body"),
    aiTool: extractSelect(rec, "AI Tool"),
    category: extractSelect(rec, "Category"),
    tags: extractMultiSelect(rec, "Tags"),
    copyCount: extractNumber(rec, "CopyCount"),
    createdAt: rec.created_time,
  };
}

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || "";

type NotionQueryFilter = Record<string, unknown>;
type NotionQuerySort = { property: string; direction: "ascending" | "descending" } | { timestamp: "created_time" | "last_edited_time"; direction: "ascending" | "descending" };

async function queryDataSource(filter?: NotionQueryFilter, sorts?: NotionQuerySort[]): Promise<{ id: string; created_time: string; properties: NotionProperties }[]> {
  if (!notion || !DATA_SOURCE_ID) return [];
  const allResults: { id: string; created_time: string; properties: NotionProperties }[] = [];
  let startCursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const params: Record<string, unknown> = {
      data_source_id: DATA_SOURCE_ID,
      page_size: 100,
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
  if (!hasNotion) {
    return (localPrompts as Prompt[]).filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  try {
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

    const records = await queryDataSource(
      { property: "Category", select: { equals: notionCat } },
      [{ property: "CopyCount", direction: "descending" }],
    );
    const notionPrompts = records.map(toPrompt);
    return notionPrompts.length > 0
      ? notionPrompts
      : (localPrompts as Prompt[]).filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
  } catch {
    return (localPrompts as Prompt[]).filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
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

export async function getCategories(): Promise<Category[]> {
  if (!hasNotion) return localCategories as Category[];

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
    const c = p.category.toLowerCase();
    counts[c] = (counts[c] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([slug, count]) => {
      const def = catDef[slug] || { icon: "📁", color: "#666", description: "" };
      // Map slug back to display name
      const displayNameMap: Record<string, string> = {
        "writing": "Writing",
        "design": "Design",
        "marketing": "Marketing",
        "development": "Development",
        "productivity": "Productivity",
        "creative": "Creative",
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
