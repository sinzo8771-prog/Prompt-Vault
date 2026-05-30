import { getAllPrompts, getFeaturedPrompts, getTrendingPrompts, getCategories } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { HeroSearch } from "@/components/HeroSearch";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Marquee } from "@/components/Marquee";
import { MagneticButton } from "@/components/MagneticButton";
import { TextScramble } from "@/components/TextScramble";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const [featured, trending, categories, allPrompts] = await Promise.all([
    getFeaturedPrompts(6),
    getTrendingPrompts(10),
    getCategories(),
    getAllPrompts(),
  ]);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <ScrollReveal>
                <div className="label-tag mb-6">
                  <span className="dot" />
                  {allPrompts.length}+ curated prompts
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="text-display mb-6">
                  <TextScramble text="Stop" className="text-text" />{" "}
                  <span className="text-accent">Googling</span>{" "}
                  <br className="hidden sm:block" />
                  <TextScramble text="prompts." className="text-text" delay={300} />
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-body text-lg max-w-lg mb-8">
                  A curated library of AI prompts that actually work. No fluff,
                  no listicles, no LinkedIn broetry. Just battle-tested prompts
                  for ChatGPT, Midjourney, Claude, and more.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <HeroSearch />
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-wrap gap-3 mt-6">
                  {["Blog Writer", "Code Review", "Midjourney", "Cold Email", "Resume"].map(
                    (term) => (
                      <a
                        key={term}
                        href={"/search?q=" + encodeURIComponent(term)}
                        className="text-xs font-mono text-text-muted px-3 py-1.5 border border-border hover:border-accent/50 hover:text-accent transition-all"
                      >
                        {term}
                      </a>
                    )
                  )}
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-5">
              <ScrollReveal delay={200}>
                <div className="grid grid-cols-2 gap-px bg-border">
                  {[
                    { value: allPrompts.length + "+", label: "Prompts" },
                    { value: categories.length + "", label: "Categories" },
                    { value: "6+", label: "AI Tools" },
                    { value: "Free", label: "To Browse" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-bg p-6 text-center">
                      <p className="stat-number mb-1">{stat.value}</p>
                      <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE ===== */}
      <div className="border-y border-border bg-bg-card">
        <Marquee
          items={[
            "ChatGPT Prompts", "Midjourney Art", "Code Review", "Marketing Copy",
            "Resume Builder", "Study Notes", "Email Sequences", "SEO Content",
            "Debug Assistant", "Blog Writer",
          ]}
          className="py-4"
          speed={40}
        />
      </div>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-label mb-2">01 / Categories</p>
              <h2 className="text-heading">
                Browse by <span className="text-accent">use case</span>
              </h2>
            </div>
            <a
              href="/category/writing"
              className="text-sm text-text-secondary hover:text-accent transition-colors link-underline hidden sm:block"
            >
              View all &rarr;
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {categories.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 80}>
              <div className="bg-bg">
                <CategoryCard category={cat} index={i} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-label mb-2">02 / Featured</p>
              <h2 className="text-heading">
                Hand-picked <span className="text-accent">prompts</span>
              </h2>
            </div>
            <a
              href="/search?q="
              className="text-sm text-text-secondary hover:text-accent transition-colors link-underline hidden sm:block"
            >
              Browse all &rarr;
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {featured.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 60}>
              <div className="bg-bg">
                <PromptCard prompt={prompt} index={i} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== TRENDING ===== */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-label mb-2">03 / Trending</p>
              <h2 className="text-heading">
                Most <span className="text-accent">copied</span> this week
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-px">
          {trending.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 60}>
              <div className="flex items-center gap-6">
                <div className="hidden sm:flex w-12 h-12 bg-bg-card border border-border items-center justify-center shrink-0">
                  <span className="text-lg font-bold font-mono text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1">
                  <PromptCard prompt={prompt} compact index={i} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="border-y border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
          <ScrollReveal>
            <p className="text-label mb-4">Ready?</p>
            <h2 className="text-display mb-6">
              Stop prompting.<br />
              <span className="text-accent">Start shipping.</span>
            </h2>
            <p className="text-body max-w-lg mx-auto mb-8">
              Join thousands of developers, marketers, and creators who use
              PromptVault to get better results from AI tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="/category/writing">
                Browse Prompts
              </MagneticButton>
              <MagneticButton href="/signup" className="!bg-transparent !text-text !border !border-border hover:!border-accent hover:!text-accent">
                Sign Up Free
              </MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
