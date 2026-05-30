import "server-only";

import { notion, NOTION_DATABASE_ID } from "./notion";

// Prompt type used throughout the app & stored in Notion
export interface Prompt {
  id: string;
  slug: string;
  title: string;
  body: string;
  aiTool: string;
  category: string;
  tags: string[];
  copyCount: number;
  upvotes: number;
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

// ── Helpers ─────────────────────────────────────────────────

function extractTitle(rec: { properties: Record<string, any> }, name = "Name"): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "title" && prop.title?.length > 0) return prop.title[0].plain_text;
  return "";
}

function extractRichText(rec: { properties: Record<string, any> }, name: string): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "rich_text" && prop.rich_text?.length > 0)
    return prop.rich_text.map((t: any) => t.plain_text).join("");
  return "";
}

function extractSelect(rec: { properties: Record<string, any> }, name: string): string {
  const prop = rec.properties?.[name];
  if (prop?.type === "select" && prop.select) return prop.select.name;
  return "";
}

function extractMultiSelect(rec: { properties: Record<string, any> }, name: string): string[] {
  const prop = rec.properties?.[name];
  if (prop?.type === "multi_select") return prop.multi_select.map((s: any) => s.name);
  return [];
}

function extractCheckbox(rec: { properties: Record<string, any> }, name: string): boolean {
  const prop = rec.properties?.[name];
  return prop?.type === "checkbox" ? prop.checkbox : false;
}

function extractNumber(rec: { properties: Record<string, any> }, name: string): number {
  const prop = rec.properties?.[name];
  return prop?.type === "number" && prop.number != null ? prop.number : 0;
}

// We need the data_source_id for queries. We'll derive it from the database
// or use a separate env var.
const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || "";

function toPrompt(rec: any): Prompt {
  const title = extractTitle(rec);
  const slug = extractRichText(rec, "Slug") || title.toLowerCase().replace(/\s+/g, "-");
  return {
    id: rec.id,
    slug,
    title,
    body: extractRichText(rec, "Body"),
    aiTool: extractSelect(rec, "AI Tool"),
    category: extractSelect(rec, "Category").toLowerCase().replace(/\s+/g, "-"),
    tags: extractMultiSelect(rec, "Tags"),
    copyCount: extractNumber(rec, "CopyCount"),
    upvotes: 0,
    createdAt: rec.created_time,
  };
}

// ─── Query helpers ──────────────────────────────────────────

async function queryDataSource(filter?: any, sorts?: any[]): Promise<any[]> {
  const allResults: any[] = [];
  let startCursor: string | undefined;
  let hasMore = true;

  while (hasMore) {
    const params: any = {
      data_source_id: DATA_SOURCE_ID,
      page_size: 100,
    };
    if (filter) params.filter = filter;
    if (sorts) params.sorts = sorts;
    if (startCursor) params.start_cursor = startCursor;

    const response = await notion.dataSources.query(params);
    allResults.push(...response.results);
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }
  return allResults;
}

// ─── Public API ─────────────────────────────────────────────

export async function getAllPrompts(): Promise<Prompt[]> {
  const records = await queryDataSource(undefined, [
    { property: "CopyCount", direction: "descending" },
  ]);
  return records.map(toPrompt);
}

export async function getFeaturedPrompts(count = 6): Promise<Prompt[]> {
  const all = await getAllPrompts();
  return all.slice(0, count);
}

export async function getTrendingPrompts(count = 10): Promise<Prompt[]> {
  return getFeaturedPrompts(count);
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  const catMap: Record<string, string> = {
    writing: "Writing",
    design: "Design",
    marketing: "Marketing",
    development: "Development",
    productivity: "Productivity",
    creative: "Creative",
  };
  const notionCat = catMap[category.toLowerCase()] || category;

  const records = await queryDataSource(
    { property: "Category", select: { equals: notionCat } },
    [{ property: "CopyCount", direction: "descending" }],
  );
  return records.map(toPrompt);
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  const records = await queryDataSource({
    property: "Slug",
    rich_text: { equals: slug },
  });
  return records.length > 0 ? toPrompt(records[0]) : null;
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
  if (!query.trim()) return getAllPrompts();

  const records = await queryDataSource({
    or: [
      { property: "Name", title: { contains: query } },
      { property: "Body", rich_text: { contains: query } },
      { property: "Tags", multi_select: { contains: query } },
    ],
  });
  return records.map(toPrompt);
}

export async function getCategories(): Promise<Category[]> {
  const prompts = await getAllPrompts();

  const catDef: Record<string, { icon: string; color: string; description: string }> = {
    writing: { icon: "✍️", color: "#10a37f", description: "Writing, brainstorming, and content creation prompts." },
    design: { icon: "🎨", color: "#5865f2", description: "Image generation, UI design, and creative visual prompts." },
    marketing: { icon: "📈", color: "#ef4444", description: "Ad copy, email campaigns, and brand strategy prompts." },
    development: { icon: "💻", color: "#f59e0b", description: "Code review, debugging, and development workflow prompts." },
    productivity: { icon: "⚡", color: "#8b5cf6", description: "Automation, organization, and efficiency prompts." },
    creative: { icon: "💡", color: "#06b6d4", description: "Creative ideation, storytelling, and artistic prompts." },
  };

  const counts: Record<string, number> = {};
  for (const p of prompts) {
    const c = p.category.toLowerCase();
    counts[c] = (counts[c] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([slug, count]) => {
      const def = catDef[slug] || { icon: "📁", color: "#666", description: "" };
      return {
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        description: def.description,
        icon: def.icon,
        promptCount: count,
        color: def.color,
      };
    })
    .sort((a, b) => b.promptCount - a.promptCount);
}
