import { searchPrompts } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { SearchPageBar } from "@/components/SearchPageBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const revalidate = 0; // dynamic, always fresh

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? "Search: " + q : "Search",
    description: q ? "Results for \"" + q + "\"" : "Search prompts.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const results = await searchPrompts(query || "");

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-24">
      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-4 tracking-tight">
            {query ? (
              <>
                Results for &quot;<span className="text-accent">{query}</span>&quot;
              </>
            ) : (
              "Search"
            )}
          </h1>
          <SearchPageBar defaultValue={query || ""} />
        </div>
      </ScrollReveal>

      {query && (
        <ScrollReveal delay={50}>
          <p className="text-xs font-mono text-text-muted mb-6">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </ScrollReveal>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {results.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 30}>
              <div className="bg-bg">
                <PromptCard prompt={prompt} index={i} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border">
            <p className="text-text-muted font-mono text-sm mb-2">
              {query ? "No results for \"" + query + "\"" : "Type to search"}
            </p>
            <a href="/category/writing" className="text-xs font-mono text-accent hover:underline">
              Browse categories &rarr;
            </a>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
