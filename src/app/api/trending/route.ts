import { NextResponse } from "next/server";
import { prompts, categories } from "@/data/prompts";

export async function GET() {
  const trending = [...prompts]
    .sort((a, b) => b.copyCount - a.copyCount)
    .slice(0, 12);

  const enriched = trending.map((p) => {
    const cat = categories.find((c) => c.slug === p.category);
    return { ...p, categoryObj: cat };
  });

  return NextResponse.json(enriched);
}
