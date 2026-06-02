import {
  getAllPrompts,
  getFeaturedPrompts,
  getTrendingPrompts,
  getCategories,
} from "@/lib/prompts";
import { Hero } from "@/components/Hero";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Globe, Heart } from "lucide-react";

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
      <Hero promptCount={allPrompts.length} />

      {/* ═══ MARQUEE — AI Tools ═══ */}
      <section className="py-6 sm:py-8 border-y border-border/30 bg-bg-elevated/50 overflow-hidden">
        <div className="marquee">
          <div className="marquee-track" style={{ "--marquee-speed": "25s" } as React.CSSProperties}>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-6 sm:gap-8 px-4">
                {["ChatGPT", "Claude", "Midjourney", "Gemini", "Copilot", "DeepSeek", "Llama", "Grok"].map(
                  (tool) => (
                    <span
                      key={`${i}-${tool}`}
                      className="text-xs sm:text-sm font-mono text-text-muted/50 whitespace-nowrap flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                      {tool}
                    </span>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10 sm:mb-12">
              <div>
                <p className="label mb-2 sm:mb-3">01 / Categories</p>
                <h2 className="heading-xl">Browse by use case</h2>
              </div>
              <Link
                href="/search"
                className="text-sm font-mono text-accent hover:text-accent-hover transition-colors hidden sm:flex items-center gap-1 group"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {categories.slice(0, 6).map((cat, i) => (
              <CategoryCard key={cat.slug} category={cat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="section bg-bg-elevated/30">
        <div className="container">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10 sm:mb-12">
              <div>
                <p className="label mb-2 sm:mb-3">02 / Featured</p>
                <h2 className="heading-xl">Hand-picked prompts</h2>
              </div>
              <Link
                href="/search"
                className="text-sm font-mono text-accent hover:text-accent-hover transition-colors hidden sm:flex items-center gap-1 group"
              >
                Browse all
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {featured.map((prompt, i) => (
              <PromptCard key={prompt.id} prompt={prompt} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRENDING ═══ */}
      <section className="section">
        <div className="container">
          <ScrollReveal>
            <div className="mb-10 sm:mb-12">
              <p className="label mb-2 sm:mb-3">03 / Trending</p>
              <h2 className="heading-xl">Most copied this week</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {trending.map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 40}>
                <Link
                  href={`/prompt/${prompt.slug}`}
                  className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-bg-card border border-border/50 rounded-xl hover:border-accent/30 transition-all duration-300 group"
                >
                  <span className="text-xl sm:text-2xl font-bold font-mono text-text-muted/20 w-7 sm:w-8 text-center shrink-0 group-hover:text-accent/40 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text group-hover:text-accent transition-colors line-clamp-1">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-1 font-mono">
                      {prompt.body.slice(0, 80)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-mono text-accent/70">
                      {prompt.copyCount.toLocaleString()}
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="section-sm bg-bg-elevated/30 border-y border-border/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Sparkles, value: allPrompts.length + "+", label: "Prompts" },
              { icon: Zap, value: categories.length.toString(), label: "Categories" },
              { icon: Globe, value: "8+", label: "AI Tools" },
              { icon: Heart, value: "Free", label: "Forever" },
            ].map((stat) => (
              <ScrollReveal key={stat.label}>
                <div className="text-center group">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-bg-card border border-border/50 flex items-center justify-center group-hover:border-accent/30 transition-colors">
                    <stat.icon className="w-4 sm:w-5 h-4 sm:h-5 text-accent" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-text">{stat.value}</p>
                  <p className="text-[10px] sm:text-xs font-mono text-text-muted uppercase tracking-wider mt-1.5 sm:mt-2">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <p className="label mb-4">Ready?</p>
              <h2 className="display-2 mb-6">
                Stop prompting.
                <br />
                <span className="text-gradient-warm">Start shipping.</span>
              </h2>
              <p className="body-lg max-w-lg mx-auto mb-10">
                Join thousands of developers, marketers, and creators who use
                PromptVault to get better results from AI tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/category/writing" className="btn-primary">
                  Browse Prompts
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/generator" className="btn-ghost">
                  Try Generator
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
