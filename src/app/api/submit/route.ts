import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, prompt, category } = body;

    if (!title || !prompt || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, prompt, category" },
        { status: 400 }
      );
    }

    // In production with Notion configured, this would save to the database.
    // For now, return success — the form shows a helpful message about Notion.
    return NextResponse.json(
      {
        success: true,
        warning: "Submission received! Connect Notion to auto-save new prompts to the database.",
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
