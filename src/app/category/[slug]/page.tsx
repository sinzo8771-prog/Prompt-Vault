import { notFound } from "next/navigation";
import { getCategories, getPromptsByCategory } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SearchPageBar } from "@/components/SearchPageBar";
export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  if (!category) notFound();
  return { title: category.name + " Prompts", description: category.description };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categories] = await Promise.all([
    getCategories(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();
  const categoryPrompts = await getPromptsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      {/* Header */}
      <ScrollReveal>
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl">
              {category.icon}
            </div>
            <div>
              <h1 className="display-2">
                {category.name}
              </h1>
              <p className="text-sm font-mono text-text-muted mt-1">
                {categoryPrompts.length} prompts
              </p>
            </div>
          </div>
          <p className="text-text-secondary max-w-2xl">{category.description}</p>
        </div>
      </ScrollReveal>

      {/* Search */}
      <ScrollReveal delay={50}>
        <div className="mb-8 max-w-md">
          <SearchPageBar />
        </div>
      </ScrollReveal>

      {/* Prompts Grid */}
      {categoryPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryPrompts.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 40}>
              <PromptCard prompt={prompt} index={i} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border/50 rounded-xl bg-bg-card">
            <p className="text-text-muted font-mono text-sm">No prompts yet in this category.</p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
