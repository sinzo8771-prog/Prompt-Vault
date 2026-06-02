import { getAllPrompts, getFeaturedPrompts, getTrendingPrompts, getCategories } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroSearch } from "@/components/HeroSearch";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, categories, allPrompts] = await Promise.all([
    getFeaturedPrompts(6),
    getTrendingPrompts(6),
    getCategories(),
    getAllPrompts(),
  ]);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-dim border border-accent/20 text-accent text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  {allPrompts.length}+ prompts
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <h1 className="display mb-6">
                AI prompts<br />
                <span className="text-accent">that work.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <p className="body-lg max-w-xl mb-10">
                No fluff. No listicles. Just battle-tested prompts for ChatGPT, Midjourney, Claude, and more. Copy. Paste. Ship.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <HeroSearch />
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="flex flex-wrap items-center gap-2 mt-6">
                <span className="text-xs text-text-muted">Popular:</span>
                {["Blog Writer", "Code Review", "Cold Email", "SEO", "Midjourney"].map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="text-xs font-mono text-text-muted px-2.5 py-1 border border-border/50 rounded-md hover:border-accent/30 hover:text-accent transition-all"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="border-y border-border/50 bg-surface/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: allPrompts.length + "+", label: "Prompts" },
              { value: categories.length.toString(), label: "Categories" },
              { value: "8+", label: "AI Tools" },
              { value: "Free", label: "Forever" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-text">{stat.value}</p>
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-2">01 / Categories</p>
                <h2 className="heading-xl">Browse by use case</h2>
              </div>
              <Link href="/search" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors hidden sm:flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 60}>
                <CategoryCard category={cat} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="section bg-surface/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="label mb-2">02 / Featured</p>
                <h2 className="heading-xl">Hand-picked prompts</h2>
              </div>
              <Link href="/search" className="text-sm font-mono text-accent hover:text-accent-hover transition-colors hidden sm:flex items-center gap-1">
                Browse all <ArrowRight className="w-3.5 h-3.5" />
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

      {/* ═══ TRENDING ═══ */}
      <section className="section">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="mb-10">
              <p className="label mb-2">03 / Trending</p>
              <h2 className="heading-xl">Most copied this week</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {trending.map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 40}>
                <Link
                  href={`/prompt/${prompt.slug}`}
                  className="flex items-center gap-4 p-4 bg-surface-container border border-border/50 rounded-xl hover:border-accent/30 transition-all group"
                >
                  <span className="text-2xl font-bold font-mono text-text-muted/30 w-8 text-center shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-1">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1">{prompt.body.slice(0, 80)}</p>
                  </div>
                  <span className="text-xs font-mono text-text-muted shrink-0">{prompt.copyCount.toLocaleString()}</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="label mb-4">Ready?</p>
            <h2 className="display-2 mb-6">
              Stop prompting.<br />
              <span className="text-accent">Start shipping.</span>
            </h2>
            <p className="body-lg max-w-lg mx-auto mb-10">
              Join thousands of developers, marketers, and creators who use PromptVault to get better results from AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/category/writing" className="btn-primary">
                Browse Prompts →
              </Link>
              <Link href="/generator" className="btn-ghost">
                Try Generator
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
