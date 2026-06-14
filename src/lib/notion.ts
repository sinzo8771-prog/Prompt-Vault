import { Client } from "@notionhq/client";

const apiKey = process.env.NOTION_API_KEY;
const databaseId = process.env.NOTION_DATABASE_ID;

export const notion = apiKey ? new Client({ auth: apiKey }) : null;
export const NOTION_DATABASE_ID = databaseId || "";
export const hasNotion = Boolean(apiKey && databaseId);

// Used to avoid hammering external services during `next build` / static generation.
export const isBuildTime =
  process.env.NEXT_PHASE === "phase-production-build" || process.env.NODE_ENV === "production";
