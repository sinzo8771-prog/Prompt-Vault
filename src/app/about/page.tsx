import { ScrollReveal } from "@/components/ScrollReveal";
import { MagneticButton } from "@/components/MagneticButton";
import Link from "next/link";

export const metadata = { title: "About — PromptVault", description: "About PromptVault — curated AI prompts without the BS." };

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-16">
          <p className="label mb-4">About</p>
          <h1 className="display-2 mb-6">
            AI prompts<br />
            <span className="text-accent">without</span> the BS.
          </h1>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-8">
          <p className="body-lg leading-relaxed mb-8">
            PromptVault exists because AI tools are powerful — but only if you know what to type. Most people don&apos;t. So they Google &quot;best ChatGPT prompts&quot; and land on listicles written by people who also don&apos;t know what they&apos;re doing.
          </p>

          <div className="divider" />

          <div>
            <p className="label mb-3">What we do</p>
            <p className="body">
              We curate, test, and organize prompts that actually deliver results. Every prompt in our library has been battle-tested by real people doing real work. No filler, no padding, no &quot;Act as a world-class...&quot; nonsense.
            </p>
          </div>

          <div className="divider" />

          <div>
            <p className="label mb-3">Who it&apos;s for</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {[
                { title: "Developers", desc: "Code review, debugging, documentation" },
                { title: "Marketers", desc: "Copy, emails, SEO, social" },
                { title: "Creators", desc: "Writing, art, strategy" },
              ].map((persona) => (
                <div key={persona.title} className="p-5 bg-bg-card border border-border/50 rounded-xl">
                  <h3 className="text-sm font-bold text-text mb-1">{persona.title}</h3>
                  <p className="text-xs text-text-muted">{persona.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div>
            <p className="label mb-3">How it works</p>
            <div className="space-y-4">
              {[
                { step: "01", text: "Browse by category or search for what you need" },
                { step: "02", text: "Copy the prompt with one click" },
                { step: "03", text: "Paste into any AI tool and get results" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="text-sm font-mono font-bold text-accent shrink-0 mt-0.5">{item.step}</span>
                  <p className="text-sm text-text-secondary">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div className="text-center py-8">
            <p className="body mb-6">Ready to get better results from AI?</p>
            <MagneticButton href="/category/writing">Browse Prompts →</MagneticButton>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
