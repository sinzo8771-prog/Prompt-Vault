import { notFound } from "next/navigation";
import { getCategories, getPromptsByCategory } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { SearchPageBar } from "@/components/SearchPageBar";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name + " Prompts",
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [categories, categoryPrompts] = await Promise.all([
    getCategories(),
    getPromptsByCategory(slug),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-24">
      <ScrollReveal>
        <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-10">
          <a href="/" className="hover:text-accent transition-colors">Home</a>
          <span>/</span>
          <span className="text-text-secondary">Categories</span>
          <span>/</span>
          <span className="text-text">{category.name}</span>
        </nav>
      </ScrollReveal>

      <ScrollReveal delay={50}>
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-bg-card border border-border flex items-center justify-center text-2xl">
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text tracking-tight">
                {category.name}
              </h1>
              <p className="text-xs font-mono text-text-muted">
                {categoryPrompts.length} prompts
              </p>
            </div>
          </div>
          <p className="text-text-secondary max-w-2xl mt-3">
            {category.description}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="mb-8 max-w-md">
          <SearchPageBar />
        </div>
      </ScrollReveal>

      {categoryPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {categoryPrompts.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 40}>
              <div className="bg-bg">
                <PromptCard prompt={prompt} index={i} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border">
            <p className="text-text-muted font-mono text-sm">No prompts yet.</p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
