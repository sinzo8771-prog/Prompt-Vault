import { notFound } from "next/navigation";
import Link from "next/link";
import { getPromptBySlug, getAllPrompts, toSlug } from "@/lib/prompts";
import { CopyButton } from "@/components/CopyButton";
import { SaveButton } from "@/components/SaveButton";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AffiliateCTAs } from "@/components/AffiliateCTAs";

export const revalidate = 60;

export async function generateStaticParams() {
  const prompts = await getAllPrompts();
  return prompts.map((p) => ({ slug: p.slug }));
}

function buildMetaDescription(prompt: { title: string; body: string; category: string; aiTool: string; metaDescription?: string }): string {
  if (prompt.metaDescription) return prompt.metaDescription.slice(0, 160);
  return `${prompt.title} — a ${prompt.aiTool} prompt for ${prompt.category}. ${prompt.body.slice(0, 120)}`.slice(0, 160);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return { title: "Prompt Not Found", description: "This prompt does not exist." };
  const description = buildMetaDescription(prompt);
  return {
    title: `${prompt.title} — ${prompt.aiTool} Prompt`,
    description,
    openGraph: { title: `${prompt.title} — PromptVault`, description, type: "article" as const },
  };
}

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const all = await getAllPrompts();
  const related = all.filter((p) => toSlug(p.category) === toSlug(prompt.category) && p.id !== prompt.id).slice(0, 4);

  const metaDesc = buildMetaDescription(prompt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: prompt.title,
    description: metaDesc,
    datePublished: prompt.createdAt,
    author: { "@type": "Organization", name: "PromptVault" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28 pt-28 sm:pt-36">

        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8 sm:mb-12">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span className="text-border">/</span>
            <Link href={`/category/${toSlug(prompt.category)}`} className="hover:text-accent transition-colors">
              {prompt.category}
            </Link>
            <span className="text-border">/</span>
            <span className="text-text-secondary line-clamp-1">{prompt.title}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={50}>
          <header className="mb-10 sm:mb-14">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Link
                href={`/category/${toSlug(prompt.category)}`}
                className="text-[11px] font-mono font-bold px-2.5 py-1 bg-accent/8 border border-accent/15 text-accent rounded-md uppercase tracking-wider hover:bg-accent/15 transition-colors"
              >
                {prompt.category}
              </Link>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 bg-bg-card border border-border/50 text-text-muted rounded-md uppercase tracking-wider">
                {prompt.aiTool}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] tracking-tight text-text mb-6">
              {prompt.title}
            </h1>

            <div className="flex items-center gap-3 text-sm font-mono text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                {prompt.copyCount.toLocaleString()} copies
              </span>
              <span className="text-border">·</span>
              <time dateTime={prompt.createdAt}>{prompt.createdAt}</time>
              {prompt.tags.length > 0 && (
                <>
                  <span className="text-border">·</span>
                  <span>{prompt.tags.length} tags</span>
                </>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* Divider */}
        <div className="divider mb-10 sm:mb-14" />

        {/* Prompt Body */}
        <ScrollReveal delay={100}>
          <section className="mb-10 sm:mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="label">Prompt</h2>
              <div className="flex items-center gap-2">
                <SaveButton prompt={prompt} />
                <CopyButton text={prompt.body} />
              </div>
            </div>
            <div className="bg-bg-card border border-border/60 rounded-2xl p-6 sm:p-8 lg:p-10">
              <p className="text-base sm:text-lg leading-[1.8] text-text-secondary whitespace-pre-wrap font-[450]">
                {prompt.body}
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <ScrollReveal delay={150}>
            <section className="mb-10 sm:mb-14">
              <h2 className="label mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/search?q=${encodeURIComponent(tag)}`}
                    className="text-sm font-mono text-text-muted px-3.5 py-2 bg-bg-card border border-border/50 rounded-lg hover:border-accent/30 hover:text-accent transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* Affiliate CTAs */}
        <ScrollReveal delay={200}>
          <AffiliateCTAs aiTool={prompt.aiTool} category={prompt.category} />
        </ScrollReveal>

        {/* Related */}
        {related.length > 0 && (
          <ScrollReveal>
            <section className="border-t border-border/50 pt-10 sm:pt-14">
              <div className="mb-8">
                <h2 className="label mb-2">Related</h2>
                <p className="heading-lg">More in {prompt.category}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((p) => (
                  <PromptCard key={p.id} prompt={p} />
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

      </article>
    </>
  );
}
