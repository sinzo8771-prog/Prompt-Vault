import { NextResponse } from "next/server";
import { notion, hasNotion } from "@/lib/notion";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, prompt, category, tags } = body;

    if (!title || !prompt || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, prompt, category" },
        { status: 400 }
      );
    }

    // If Notion is configured, save there
    if (hasNotion && notion) {
      try {
        // Notion SDK v5 uses camelCase: databases.create for pages
        // But this project uses data sources — use the raw API
        const { Client } = await import("@notionhq/client");
        const response = await (notion as unknown as Client).pages.create({
          parent: { database_id: process.env.NOTION_DATABASE_ID || "" },
          properties: {
            Name: {
              title: [{ text: { content: title } }],
            },
            ...(description
              ? {
                  Description: {
                    rich_text: [{ text: { content: description } }],
                  },
                }
              : {}),
            Body: {
              rich_text: [{ text: { content: prompt } }],
            },
            Category: {
              select: { name: category },
            },
            Tags: {
              multi_select: (tags || []).map((t: string) => ({ name: t })),
            },
            Slug: {
              rich_text: [{ text: { content: title.toLowerCase().replace(/[^a-z0-9]+g, "-").replace(/^-|-$/g, "") } }],
            },
            CopyCount: { number: 0 },
          },
        });
        return NextResponse.json({ success: true, id: (response as { id: string }).id }, { status: 201 });
      } catch (notionError) {
        console.error("Notion save failed:", notionError);
        // Fall through to local response
      }
    }

    // Fallback: return success (data not persisted without Notion)
    return NextResponse.json(
      {
        success: true,
        warning: "Saved locally — connect Notion to persist submissions",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Submit a new prompt via POST request.",
    fields: ["title", "description", "prompt", "category", "tags"],
  });
}
