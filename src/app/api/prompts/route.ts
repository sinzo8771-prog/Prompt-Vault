import { getAllPrompts } from "@/lib/prompts";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const prompts = await getAllPrompts();
  return NextResponse.json(prompts);
}
