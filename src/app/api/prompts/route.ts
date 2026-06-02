import { NextRequest, NextResponse } from "next/server";
import { prompts, categories } from "@/data/prompts";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const tool = searchParams.get("tool");
  const q = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "50");

  let filtered = [...prompts];

  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category === category);
  }

  if (tool && tool !== "all") {
    filtered = filtered.filter((p) => p.aiTool === tool);
  }

  if (q) {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.body.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }

  filtered.sort((a, b) => b.upvotes - a.upvotes);

  const enriched = filtered.slice(0, limit).map((p) => {
    const cat = categories.find((c) => c.slug === p.category);
    return { ...p, categoryObj: cat };
  });

  return NextResponse.json(enriched);
}
