import { notFound } from "next/navigation";
import Link from "next/link";
import { getPromptBySlug, getAllPrompts } from "@/lib/prompts";
import { CopyButton } from "@/components/CopyButton";
import { SaveButton } from "@/components/SaveButton";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";

export const revalidate = 60;

export async function generateStaticParams() {
  const prompts = await getAllPrompts();
  return prompts.map((p) => ({ slug: p.slug }));
}

export const metadata = { title: "Prompt", description: "AI prompt from PromptVault." };

const toolAffiliate: Record<string, { url: string; label: string }> = {
  ChatGPT: { url: "https://chat.openai.com/?model=auto", label: "Try in ChatGPT" },
  Midjourney: { url: "https://midjourney.com/membership/", label: "Get Midjourney" },
  Claude: { url: "https://claude.ai/?model=auto", label: "Try in Claude" },
  Gemini: { url: "https://gemini.google.com/app", label: "Try in Gemini" },
  Copilot: { url: "https://github.com/features/copilot", label: "Get Copilot" },
  DeepSeek: { url: "https://chat.deepseek.com/", label: "Try in DeepSeek" },
  Coding: { url: "https://github.com/features/copilot", label: "Get Copilot" },
  Other: { url: "https://chat.openai.com/?model=auto", label: "Try in ChatGPT" },
};

export default async function PromptDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const prompt = await getPromptBySlug(slug);
  if (!prompt) notFound();

  const all = await getAllPrompts();
  const related = all.filter((p) => p.category === prompt.category && p.id !== prompt.id).slice(0, 4);

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 pt-32">
        {/* Breadcrumb */}
        <ScrollReveal>
          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-10">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
             <span>/</span>
               <Link href={`/category/${prompt.category}`} className="hover:text-accent transition-colors capitalize">
               {prompt.category.replace(/-/g, " ")}
             </Link>
            <span>/</span>
            <span className="text-text-secondary line-clamp-1">{prompt.title}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal delay={50}>
          <div className="mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-text leading-tight tracking-tight mb-5">
              {prompt.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-accent/10 border border-accent/20 text-accent rounded-md uppercase tracking-wider">
                {prompt.aiTool}
              </span>
              <Link
                 href={`/category/${prompt.category}`}
                 className="text-xs font-mono text-text-muted hover:text-accent transition-colors capitalize"
               >
                {prompt.category.replace(/-/g, " ")}
              </Link>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <span>{prompt.copyCount.toLocaleString()} copies</span>
              <span>·</span>
              <span>{prompt.createdAt}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Code Block */}
        <ScrollReveal delay={100}>
          <div className="mb-10">
            <div className="flex items-center justify-between px-4 py-3 border border-border/50 border-b-0 rounded-t-xl bg-bg-card/50">
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted">Prompt</span>
              <div className="flex items-center gap-2">
                <SaveButton prompt={prompt} size="md" />
                <CopyButton text={prompt.body} />
              </div>
            </div>
            <div className="code-block rounded-t-none border-t-0" style={{ marginLeft: 0, paddingLeft: "1.5rem" }}>
              <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-text-secondary">
                {prompt.body}
              </pre>
            </div>
          </div>
        </ScrollReveal>

        {/* Tags */}
        <ScrollReveal delay={150}>
          <div className="flex flex-wrap gap-2 mb-10">
            {prompt.tags.map((tag) => (
              <Link
                 key={tag}
                 href={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs font-mono text-text-muted px-3 py-1.5 bg-bg-card border border-border/50 rounded-lg hover:border-accent/30 hover:text-accent transition-all"
              >
                {tag}
               </Link>
             ))}
          </div>
        </ScrollReveal>

        {/* Affiliate CTA */}
        {toolAffiliate[prompt.aiTool] && (
          <ScrollReveal delay={200}>
            <div className="p-6 bg-gradient-to-r from-accent/5 to-transparent border border-accent/20 rounded-xl mb-12">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-semibold text-text mb-1">{toolAffiliate[prompt.aiTool].label}</p>
                  <p className="text-xs text-text-muted font-mono">Best results with {prompt.aiTool}&apos;s latest model</p>
                </div>
                <a
                  href={toolAffiliate[prompt.aiTool].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-magnetic shrink-0 !py-3 !px-6 text-sm"
                >
                  <span>{toolAffiliate[prompt.aiTool].label} →</span>
                </a>
              </div>
              <p className="text-[10px] font-mono text-text-muted mt-3 pt-3 border-t border-border/30">
                Affiliate link — we may earn a commission at no extra cost to you.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Related */}
        {related.length > 0 && (
          <ScrollReveal>
            <section className="border-t border-border/50 pt-12">
              <p className="label mb-2">Related</p>
              <h2 className="heading-lg mb-8">Similar prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map((p) => (
                  <PromptCard key={p.id} prompt={p} />
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}
      </div>
    </>
  );
}
