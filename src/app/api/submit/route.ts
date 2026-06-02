import { NextResponse } from "next/server";

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

    const newPrompt = {
      id: `custom-${Date.now()}`,
      title,
      description: description || "",
      category,
      tags: tags || [],
      prompt,
      author: "Anonymous",
      saves: 0,
      views: 0,
      isPublic: true,
    };

    return NextResponse.json({ prompt: newPrompt }, { status: 201 });
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
