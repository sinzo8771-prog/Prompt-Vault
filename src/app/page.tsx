import { getAllPrompts, getFeaturedPrompts, getTrendingPrompts, getCategories } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, categories, allPrompts] = await Promise.all([
    getFeaturedPrompts(6),
    getTrendingPrompts(10),
    getCategories(),
    getAllPrompts(),
  ]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/3 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-32">
          <div className="max-w-4xl">
            <ScrollReveal>
              <div className="flex items-center gap-2 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {allPrompts.length}+ prompts
                </span>
                <span className="text-xs text-text-muted font-mono">
                  across {categories.length} categories
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="display mb-6">
                AI prompts
                <br />
                <span className="text-accent">without</span> the
                <br />
                BS.
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="body-lg max-w-xl mb-10">
                Battle-tested prompts that actually deliver results. No fluff, no listicles, no "Act as a world-class..." nonsense. Just copy, paste, ship.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="flex flex-wrap gap-3 mb-12">
                {["Blog Writer", "Code Review", "Cold Email", "SEO", "Midjourney"].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="btn-ghost"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex items-center gap-8">
                <Link href="/category/writing" className="btn-magnetic">
                  <span>Browse Prompts →</span>
                </Link>
                <Link href="/generator" className="btn-magnetic btn-magnetic-outline">
                  <span>Generator</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Floating stats */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2">
          <ScrollReveal delay={500}>
            <div className="space-y-6 text-right">
              {[
                { value: allPrompts.length + "+", label: "Prompts" },
                { value: categories.length.toString(), label: "Categories" },
                { value: "8+", label: "AI Tools" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="stat-number text-4xl">{stat.value}</p>
                  <p className="label mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MARQUEE
      ═══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-border/50 bg-bg-card/30 overflow-hidden">
        <div className="marquee">
          <div className="marquee-track py-5" style={{ ["--marquee-speed" as string]: "40s" }}>
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-8 px-4">
                {["ChatGPT", "Claude", "Gemini", "Midjourney", "Copilot", "DeepSeek", "Writing", "Marketing", "Development", "Design", "Video", "Business"].map((item, i) => (
                  <span key={`${setIdx}-${i}`} className="flex items-center gap-8">
                    <span className="text-sm font-medium text-text-muted/60 hover:text-text-muted transition-colors whitespace-nowrap">
                      {item}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-accent/40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label mb-3">01 / Categories</p>
                <h2 className="heading-xl">
                  Find what you <span className="text-accent">need</span>
                </h2>
              </div>
              <Link href="/search" className="label text-accent hover:text-accent-hover transition-colors hidden sm:block">
                View all →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 60}>
                <CategoryCard category={cat} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-bg-card/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label mb-3">02 / Featured</p>
                <h2 className="heading-xl">
                  Hand-picked <span className="text-accent">favorites</span>
                </h2>
              </div>
              <Link href="/search" className="label text-accent hover:text-accent-hover transition-colors hidden sm:block">
                Browse all →
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 60}>
                <PromptCard prompt={prompt} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRENDING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label mb-3">03 / Trending</p>
                <h2 className="heading-xl">
                  Most <span className="text-accent">copied</span> this week
                </h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trending.map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 40}>
                <div className="flex items-center gap-5 p-4 bg-bg-card border border-border/50 rounded-xl hover:border-accent/30 transition-all group">
                  <span className="text-2xl font-bold font-mono text-text-muted/30 w-8 text-center shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/prompt/${prompt.slug}`} className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-1">
                      {prompt.title}
                    </Link>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">{prompt.body.slice(0, 80)}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted shrink-0">{prompt.copyCount.toLocaleString()}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-4">Ready?</p>
            <h2 className="display-2 mb-6">
              Stop prompting.
              <br />
              <span className="text-accent">Start shipping.</span>
            </h2>
            <p className="body-lg max-w-lg mx-auto mb-10">
              Join thousands of developers, marketers, and creators who use PromptVault to get better results from AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/category/writing" className="btn-magnetic">
                <span>Browse Prompts →</span>
              </Link>
              <Link href="/generator" className="btn-magnetic btn-magnetic-outline">
                <span>Try Generator</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
