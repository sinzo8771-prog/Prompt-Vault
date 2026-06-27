import {
  getAllPrompts,
  getCategories,
} from "@/lib/prompts";
import { Hero } from "@/components/Hero";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [allPrompts, categories] = await Promise.all([
    getAllPrompts(),
    getCategories(),
  ]);

  const featured = allPrompts.slice(0, 6);
  const trending = allPrompts.slice(0, 6);
  const totalPrompts = allPrompts.length;

  return (
    <>
      {/* ═══ HERO ═══ */}
      <Hero promptCount={totalPrompts} />

      {/* ═══ MARQUEE — AI Tools ═══ */}
      <section className="py-12 bg-[var(--color-surface-dark)] border-y border-white/5 overflow-hidden">
        <div className="marquee-track">
          <div className="flex items-center gap-20 px-10">
            {["ChatGPT", "Claude 3.5 Sonnet", "Midjourney v6", "Gemini 1.5 Pro", "Llama 3", "Perplexity AI"].map((tool, index) => (
              <span
                key={`m1-${tool}`}
                className="text-white/30 font-mono text-[11px] uppercase tracking-[0.4em] flex items-center gap-4 whitespace-nowrap"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/${index % 2 === 0 ? "60" : "40"}`} />
                {tool}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-20 px-10">
            {["ChatGPT", "Claude 3.5 Sonnet", "Midjourney v6", "Gemini 1.5 Pro", "Llama 3", "Perplexity AI"].map((tool, index) => (
              <span
                key={`m2-${tool}`}
                className="text-white/30 font-mono text-[11px] uppercase tracking-[0.4em] flex items-center gap-4 whitespace-nowrap"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]/${index % 2 === 0 ? "60" : "40"}`} />
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES (Asymmetric Editorial Layout) ═══ */}
      <section className="py-24 px-12 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-0">
          {/* Left Column / Title Block */}
          <div className="w-full md:w-[35%] md:pr-12 mb-12 md:mb-0">
            <ScrollReveal>
              <span className="text-[var(--color-on-surface-muted)] text-sm font-semibold tracking-widest uppercase mb-6 block">
                01 / Categories
              </span>
              <h2 className="text-headline text-[var(--color-on-surface)] mb-8">
                Architectural Clarity
              </h2>
              <p className="text-[var(--color-on-surface-muted)] text-lg leading-relaxed max-w-sm mb-12">
                We organize the world&apos;s finest prompts into semantic clusters, ensuring you find the exact nuance for your output.
              </p>
              <Link
                href="/search"
                className="group inline-flex items-center gap-3 text-[var(--color-primary)] font-bold transition-standard"
              >
                Explore all categories
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all transition-standard" />
              </Link>
            </ScrollReveal>
          </div>

          {/* Vertical dashed divider */}
          <div className="hidden md:block dashed-divider-v mx-12" />

          {/* Right Column / Cards Grid */}
          <div className="w-full md:flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 80}>
                <CategoryCard category={cat} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED (Editorial Document Layout) ═══ */}
      <section className="py-24 px-12 bg-[var(--color-surface-light)] border-y border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-0">
          {/* Left Column */}
          <div className="w-full md:w-[35%] md:pr-12 mb-12 md:mb-0">
            <ScrollReveal>
              <span className="text-[var(--color-on-surface-muted)] text-sm font-semibold tracking-widest uppercase mb-6 block">
                02 / Featured
              </span>
              <h2 className="text-headline text-[var(--color-on-surface)] mb-8">
                Masterpieces of Interaction
              </h2>
              <p className="text-[var(--color-on-surface-muted)] text-lg leading-relaxed max-w-sm">
                Hand-selected by our engineering team for their exceptional logic and creativity.
              </p>
            </ScrollReveal>
          </div>

          {/* Vertical dashed divider */}
          <div className="hidden md:block dashed-divider-v mx-12" />

          {/* Right Column */}
          <div className="w-full md:flex-1 space-y-8">
            {featured.slice(0, 1).map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={100}>
                <PromptCard prompt={prompt} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRENDING (List Discovery) ═══ */}
      <section className="py-24 px-12 bg-[var(--color-surface)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch gap-0">
          {/* Left Column */}
          <div className="w-full md:w-[35%] md:pr-12 mb-12 md:mb-0">
            <ScrollReveal>
              <span className="text-[var(--color-on-surface-muted)] text-sm font-semibold tracking-widest uppercase mb-6 block">
                03 / Trending
              </span>
              <h2 className="text-headline text-[var(--color-on-surface)] mb-8">
                Echoes of the Masses
              </h2>
              <p className="text-[var(--color-on-surface-muted)] text-lg leading-relaxed max-w-sm">
                The most duplicated and refined interactions across our global network this week.
              </p>
            </ScrollReveal>
          </div>

          {/* Vertical dashed divider */}
          <div className="hidden md:block dashed-divider-v mx-12" />

          {/* Right Column / List */}
          <div className="w-full md:flex-1 grid grid-cols-1 gap-5">
            {trending.slice(0, 3).map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 100}>
                <Link
                  href={`/prompt/${prompt.slug}`}
                  className="flex items-center gap-8 p-8 bg-[var(--color-surface-light)] border border-[var(--color-hairline)] rounded-[24px] hover:bg-white hover:border-[var(--color-primary)]/40 hover:-translate-y-1 hover:scale-[1.01] transition-all transition-standard group block"
                >
                  <span className="text-3xl font-bold font-mono text-[var(--color-on-surface)]/10 group-hover:text-[var(--color-primary)]/20 transition-all transition-standard">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                      {prompt.title}
                    </h4>
                    <p className="text-sm text-[var(--color-on-surface-muted)] mt-1 line-clamp-1">
                      {prompt.body}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-[var(--color-primary)]">
                      {prompt.copyCount.toLocaleString()} COPIES
                    </div>
                    <div className="text-[10px] text-[var(--color-on-surface-muted)] mt-1">
                      ↑ 24% this week
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-20 bg-[var(--color-surface-light)] border-y border-[var(--color-hairline)]">
        <div className="max-w-7xl mx-auto px-12 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { value: `${totalPrompts}+`, label: "Curated Prompts" },
            { value: `${categories.length}`, label: "Categories" },
            { value: "6", label: "AI Tools Supported" },
            { value: "Free", label: "Always" },
          ].map((stat) => (
            <ScrollReveal key={stat.label}>
              <div className="text-center group">
                <div className="text-5xl font-bold text-[var(--color-on-surface)] mb-2 group-hover:text-[var(--color-primary)] transition-colors transition-standard">
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-[var(--color-on-surface-muted)]">
                  {stat.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-light)] text-center px-6">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <span className="text-[var(--color-primary)] text-sm font-bold tracking-[0.3em] uppercase mb-8 block">
              Final Call
            </span>
            <h2 className="text-display text-[var(--color-on-surface)] mb-10">
              Stop Prompting.<br />Start Engineering.
            </h2>
            <p className="text-xl text-[var(--color-on-surface-muted)] mb-12 max-w-xl mx-auto">
              Join 50,000+ engineers using PromptVault to bridge the gap between human intent and machine perfection.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/category/writing"
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-surface-dark)] text-white px-10 py-5 rounded-xl transition-all transition-standard font-bold text-lg shadow-xl shadow-[var(--color-primary)]/10"
              >
                Create Your Vault
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
