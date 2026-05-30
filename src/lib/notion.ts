import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not set in environment variables");
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID is not set in environment variables");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
