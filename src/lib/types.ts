// Shared types — safe to import from both server and client components

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
  metaDescription?: string;
  rating?: number;       // 1-5 star rating
  upvotes?: number;       // raw upvote count (local data)
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  promptCount: number;
  color: string;
}

export interface SearchFilters {
  category?: string;
  aiTool?: string;
  minRating?: number;
}
