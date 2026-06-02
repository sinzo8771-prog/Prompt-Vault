import { searchPrompts } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { SearchPageBar } from "@/components/SearchPageBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import NextLink from "next/link";

export const revalidate = 0;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search", description: q ? `Results for "${q}"` : "Search prompts." };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query } = await searchParams;
  const results = await searchPrompts(query || "");

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-10">
          <h1 className="display-2 mb-6">
            {query ? (
              <>Results for &quot;<span className="text-accent">{query}</span>&quot;</>
            ) : (
              <>Search <span className="text-accent">prompts</span></>
            )}
          </h1>
          <SearchPageBar defaultValue={query || ""} />
        </div>
      </ScrollReveal>

      {query && (
        <ScrollReveal delay={50}>
          <p className="text-xs font-mono text-text-muted mb-8">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </p>
        </ScrollReveal>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 30}>
              <PromptCard prompt={prompt} index={i} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border/50 rounded-xl bg-bg-card">
            <p className="text-text-muted font-mono text-sm mb-3">
              {query ? `No results for "${query}"` : "Type above to search"}
            </p>
            <NextLink href="/category/writing" className="btn-ghost text-xs">
              Browse categories
            </NextLink>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
