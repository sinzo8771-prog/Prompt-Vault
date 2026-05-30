import { notFound } from "next/navigation";
import { getPromptBySlug, getAllPrompts } from "@/lib/prompts";
import { CopyButton } from "@/components/CopyButton";
import { SaveButton } from "@/components/SaveButton";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const prompts = await getAllPrompts();
  return prompts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) return {};
  return {
    title: prompt.title,
    description: prompt.body.slice(0, 160),
  };
}

const toolAffiliate: Record<string, string> = {
  ChatGPT: "https://chat.openai.com",
  Midjourney: "https://midjourney.com",
  Claude: "https://claude.ai",
  Gemini: "https://gemini.google.com",
  Coding: "https://github.com/features/copilot",
  Other: "https://chat.openai.com",
};

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  // Get related prompts from same category
  const all = await getAllPrompts();
  const related = all
    .filter((p) => p.category === prompt.category && p.id !== prompt.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: prompt.title,
    description: prompt.body.slice(0, 160),
    datePublished: prompt.createdAt,
    author: { "@type": "Organization", name: "PromptVault" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12 pt-24">
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-10">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <span>/</span>
            <a href={"/category/" + prompt.category} className="hover:text-accent transition-colors capitalize">
              {prompt.category}
            </a>
            <span>/</span>
            <span className="text-text-secondary line-clamp-1">{prompt.title}</span>
          </nav>
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight tracking-tight">
                {prompt.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-bg-card border border-border text-text-muted uppercase tracking-wider">
                {prompt.aiTool}
              </span>
              <span className="text-xs font-mono text-text-muted capitalize">{prompt.category}</span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <span>{prompt.copyCount.toLocaleString()} copies</span>
              <span>{prompt.createdAt}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="mb-8">
            <div className="flex items-center justify-between px-5 py-3 border border-border border-b-0 bg-bg-card">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent" />
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Prompt</span>
              </div>
              <div className="flex items-center gap-1">
                <SaveButton prompt={prompt} size="md" />
                <CopyButton text={prompt.body} />
              </div>
            </div>
            <div className="p-6 border border-border prompt-block">
              <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-text-secondary">
                {prompt.body}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="flex flex-wrap gap-2 mb-8">
            {prompt.tags.map((tag) => (
              <a
                key={tag}
                href={"/search?q=" + encodeURIComponent(tag)}
                className="text-[10px] font-mono text-text-muted px-2.5 py-1 bg-bg-card border border-border hover:border-accent/50 hover:text-accent transition-all"
              >
                {tag}
              </a>
            ))}
          </div>
        </ScrollReveal>

        {toolAffiliate[prompt.aiTool] && (
          <ScrollReveal delay={200}>
            <div className="p-6 bg-bg-card border border-border mb-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text mb-1">
                    Try this in {prompt.aiTool}
                  </p>
                  <p className="text-xs text-text-muted font-mono">
                    Best results with {" " + prompt.aiTool + "\u2019s"} latest model
                  </p>
                </div>
                <a
                  href={toolAffiliate[prompt.aiTool]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-btn shrink-0"
                >
                  <span>{"Try in " + prompt.aiTool + " \u2192"}</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        )}

        {related.length > 0 && (
          <ScrollReveal>
            <section className="border-t border-border pt-12">
              <p className="text-label mb-2">Related</p>
              <h2 className="text-heading mb-6">Similar prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
                {related.map((p) => (
                  <div key={p.id} className="bg-bg">
                    <PromptCard prompt={p} />
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </>
  );
}
