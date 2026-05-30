import { ScrollReveal } from "@/components/ScrollReveal";
import { MagneticButton } from "@/components/MagneticButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About PromptVault.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 pt-24">
      <ScrollReveal>
        <div className="mb-16">
          <p className="text-label mb-2">About</p>
          <h1 className="text-display mb-6">
            AI prompts<br />
            <span className="text-accent">without the BS.</span>
          </h1>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="space-y-8">
          <p className="text-body text-lg leading-relaxed">
            PromptVault exists because AI tools are powerful — but only if you
            know what to type. Most people don&apos;t. So they Google &quot;best
            ChatGPT prompts&quot; and land on listicles written by people who
            also don&apos;t know what they&apos;re doing.
          </p>

          <div className="h-px bg-border" />

          <div>
            <p className="text-label mb-3">What we do</p>
            <p className="text-body">
              We curate, test, and organize prompts that actually deliver
              results. Every prompt in our library has been battle-tested by
              real people doing real work. No filler, no padding, no &quot;Act
              as a world-class...&quot; nonsense.
            </p>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-label mb-3">Who it&apos;s for</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {[
                { title: "Developers", desc: "Code review, debugging, documentation" },
                { title: "Marketers", desc: "Copy, emails, SEO, social" },
                { title: "Creators", desc: "Writing, art, strategy" },
              ].map((persona) => (
                <div key={persona.title} className="p-4 bg-bg-card border border-border">
                  <h3 className="text-sm font-bold text-text mb-1">{persona.title}</h3>
                  <p className="text-xs text-text-muted">{persona.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div>
            <p className="text-label mb-3">How it works</p>
            <div className="space-y-3">
              {[
                { step: "01", text: "Browse by category or search for what you need" },
                { step: "02", text: "Copy the prompt with one click" },
                { step: "03", text: "Paste into any AI tool and get results" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="text-xs font-mono font-bold text-accent shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <p className="text-sm text-text-secondary">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="text-center py-8">
            <p className="text-body mb-6">
              Want to contribute? We&apos;re building a community of prompt engineers.
            </p>
            <MagneticButton href="#">Get in Touch</MagneticButton>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
