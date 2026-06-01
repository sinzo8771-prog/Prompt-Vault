import { getAllPrompts, getFeaturedPrompts, getTrendingPrompts, getCategories } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SearchBar } from "@/components/SearchBar";
import { AdSense } from "@/components/AdSense";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Compass, Star } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [featured, trending, categories, allPrompts] = await Promise.all([
    getFeaturedPrompts(6),
    getTrendingPrompts(6), // Display top 6 trending prompts
    getCategories(),
    getAllPrompts(),
  ]);

  return (
    <div className="relative min-h-screen">
      {/* Floating Ambient Orbs */}
      <div className="orb w-[500px] h-[500px] bg-accent top-[10%] left-[-10%] opacity-10" />
      <div className="orb w-[400px] h-[400px] bg-secondary bottom-[25%] right-[-5%] opacity-10" />
      <div className="orb w-[450px] h-[450px] bg-tertiary top-[45%] left-[20%] opacity-5" />

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
        {/* Background texture */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }} 
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-8">
              <ScrollReveal>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-dim border border-accent/20 text-accent text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {allPrompts.length}+ active prompts
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    across {categories.length} categories
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <h1 className="display leading-[1.05] tracking-tighter">
                  AI prompts <br />
                  <span className="shimmer-text">without the BS.</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="body-lg max-w-xl text-text-secondary opacity-90">
                  Battle-tested, human-perfected prompt templates that actually deliver results. Copy, paste, and ship your ideas instantly.
                </p>
              </ScrollReveal>

              {/* Gooey Search Bar */}
              <ScrollReveal delay={300}>
                <div className="max-w-2xl w-full pt-2">
                  <SearchBar />
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="text-xs font-mono text-text-muted uppercase">Hot:</span>
                  {["Blog outline", "Code analysis", "Cold email", "SEO meta", "Midjourney portrait"].map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="btn-ghost !py-1.5 !px-3.5 text-[11px] font-mono lowercase cursor-none"
                    >
                      #{term}
                    </Link>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right Stats Block */}
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <ScrollReveal delay={500}>
                <div className="glass p-8 rounded-2xl border border-border/50 space-y-8 min-w-[280px]">
                  {[
                    { value: allPrompts.length + "+", label: "Indexed Prompts" },
                    { value: categories.length.toString(), label: "Curated Categories" },
                    { value: "8+", label: "Supported AI Engines" },
                  ].map((stat, i) => (
                    <div key={stat.label} className="border-b border-border/20 last:border-0 pb-6 last:pb-0">
                      <p className="stat-number shimmer-text text-5xl">{stat.value}</p>
                      <p className="text-xs font-mono uppercase tracking-wider text-text-muted mt-2">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MARQUEE SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-border/40 bg-[#090e1c]/80 backdrop-blur-md overflow-hidden py-5">
        <div className="marquee">
          <div className="marquee-track" style={{ ["--marquee-speed" as string]: "40s" }}>
            {[...Array(2)].map((_, setIdx) => (
              <div key={setIdx} className="flex items-center gap-12 px-6">
                {["ChatGPT", "Claude 3.5 Sonnet", "Gemini 1.5 Pro", "Midjourney v6", "DeepSeek-V3", "GitHub Copilot", "Writing", "SEO Optimizers", "Code Debugging", "Sales Funnels", "Productivity Hooks"].map((item, i) => (
                  <span key={`${setIdx}-${i}`} className="flex items-center gap-12">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-text-muted/60 hover:text-accent transition-colors whitespace-nowrap">
                      {item}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORIES GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="label text-accent mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                01 / EXPLORE
              </p>
              <h2 className="heading-xl">Curated Categories</h2>
            </div>
            <Link 
              href="/search" 
              className="text-sm font-mono font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1 cursor-none"
            >
              View all prompts <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 60}>
              <CategoryCard category={cat} index={i} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          GOOGLE ADS MONETIZATION BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 my-8">
        <div className="w-full flex justify-center bg-[#090e1c]/40 border border-border/40 py-6 rounded-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-2 left-2 text-[9px] font-mono text-text-muted uppercase tracking-wider">Advertisement</div>
          <div className="w-full max-w-4xl px-4 flex justify-center">
            <AdSense
              slot="1111111111"
              style={{ display: "block", width: "100%", minHeight: 90 }}
              format="horizontal"
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED HAND-PICKED PROMPTS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section bg-[#090e1c]/30 border-y border-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="label text-secondary mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  02 / FEATURED
                </p>
                <h2 className="heading-xl">Hand-picked Favorites</h2>
              </div>
              <Link 
                href="/search" 
                className="text-sm font-mono font-semibold text-secondary hover:text-[#e8dbff] transition-colors flex items-center gap-1 cursor-none"
              >
                Browse directory <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((prompt, i) => (
              <ScrollReveal key={prompt.id} delay={i * 80}>
                <PromptCard prompt={prompt} index={i} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRENDING LIST
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-12">
            <p className="label text-tertiary mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              03 / TRENDING
            </p>
            <h2 className="heading-xl">Popular Copied Prompts</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((prompt, i) => {
            // Simulated popular progress widths 98%, 88%, 79%, 71%, etc.
            const percentages = ["95%", "88%", "82%", "75%", "69%", "62%"];
            const colors = [
              "bg-accent border-accent",
              "bg-secondary border-secondary",
              "bg-tertiary border-tertiary",
              "bg-accent border-accent",
              "bg-secondary border-secondary",
              "bg-tertiary border-tertiary"
            ];
            const textColors = [
              "text-accent bg-accent/15 border-accent/20",
              "text-secondary bg-secondary/15 border-secondary/20",
              "text-tertiary bg-tertiary/15 border-tertiary/20",
              "text-accent bg-accent/15 border-accent/20",
              "text-secondary bg-secondary/15 border-secondary/20",
              "text-tertiary bg-tertiary/15 border-tertiary/20"
            ];

            return (
              <ScrollReveal key={prompt.id} delay={i * 50}>
                <Link
                  href={`/prompt/${prompt.slug}`}
                  className="bg-[#161b2b]/40 p-5 rounded-2xl border border-border/40 hover:border-accent/40 transition-all duration-300 block group shadow-md hover:-translate-y-0.5 cursor-none"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold font-mono ${textColors[i]}`}>
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">{prompt.aiTool}</span>
                  </div>
                  <div className="font-bold text-text mb-4 group-hover:text-accent transition-colors line-clamp-1">
                    {prompt.title}
                  </div>
                  <div className="w-full bg-[#0a0f1e] h-1.5 rounded-full overflow-hidden border border-border/30">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${colors[i].split(" ")[0]}`} 
                      style={{ width: percentages[i] }} 
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono text-text-muted">
                    <span>Popularity: {percentages[i]}</span>
                    <span>{prompt.copyCount.toLocaleString()} copies</span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA & CLOSING
      ═══════════════════════════════════════════════════════════════ */}
      <section className="section border-t border-border/30 max-w-5xl mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="label text-accent mb-4">ready to build?</p>
          <h2 className="display-2 mb-6">
            Stop guessing prompts.<br />
            <span className="shimmer-text">Start building tools.</span>
          </h2>
          <p className="body-lg max-w-lg mx-auto mb-10 text-text-secondary opacity-90">
            Open-source and fully free. Leverage human-curated and battle-tested instructions to build high-quality software, content, and visuals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/category/writing" 
              className="btn-primary cursor-none !rounded-xl !px-8 !py-3.5 text-sm font-semibold tracking-wide"
            >
              Explore Prompt Library
            </Link>
            <Link 
              href="/generator" 
              className="btn-ghost cursor-none !rounded-xl !px-8 !py-3.5 text-sm font-semibold tracking-wide"
            >
              Try Free Generator
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
