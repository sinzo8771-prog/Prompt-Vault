import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { MagneticButton } from "@/components/MagneticButton";

const TOOLS = [
  { id: "ChatGPT", icon: "💬", desc: "Text & analysis" },
  { id: "Claude", icon: "🧠", desc: "Deep reasoning" },
  { id: "Gemini", icon: "✨", desc: "Multimodal" },
  { id: "Midjourney", icon: "🎨", desc: "Image generation" },
  { id: "Copilot", icon: "💻", desc: "Code generation" },
  { id: "DeepSeek", icon: "🔍", desc: "Fast & free" },
];

const CATEGORIES = [
  "Writing", "Marketing", "Development", "Design",
  "Productivity", "Creative", "AI & Automation",
  "Video & Film", "Business & Finance", "Education & Learning", "Sales & CRM",
];

const TONES = [
  { id: "Professional", icon: "💼" },
  { id: "Casual", icon: "😊" },
  { id: "Technical", icon: "⚙️" },
  { id: "Creative", icon: "🎨" },
  { id: "Concise", icon: "✂️" },
  { id: "Persuasive", icon: "🎯" },
  { id: "Educational", icon: "📚" },
];

export default function GeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="label mb-4">AI Prompt Generator</p>
          <h1 className="display-2 mb-6">
            Generate the<br />
            <span className="text-accent">perfect</span> prompt.
          </h1>
          <p className="body-lg max-w-lg mx-auto">
            Describe what you need. Get a battle-tested prompt in seconds. Powered by free AI models — no account required.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="bg-bg-card border border-border/50 rounded-2xl p-8 mb-8">
          {/* Tool Selection */}
          <div className="mb-8">
            <label className="label mb-3 block">1. Select AI Tool</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/50 bg-bg hover:border-accent/30 hover:bg-accent/5 transition-all"
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className="text-xs font-medium text-text-secondary">{tool.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="label mb-3 block">2. Select Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className="btn-ghost"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="label mb-3 block">3. Describe Your Goal</label>
            <textarea
              placeholder="Describe your goal in detail. The more specific, the better the prompt will be..."
              className="w-full h-32 px-4 py-3 bg-bg border border-border/50 rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none font-mono"
            />
          </div>

          {/* Tone */}
          <div className="mb-8">
            <label className="label mb-3 block">4. Select Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-bg hover:border-accent/30 transition-all"
                >
                  <span>{tone.icon}</span>
                  <span className="text-xs font-medium text-text-secondary">{tone.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button className="btn-magnetic !px-10 !py-4">
              <span>Generate Prompt →</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Output placeholder */}
      <ScrollReveal delay={200}>
        <div className="text-center py-12">
          <p className="text-text-muted text-sm font-mono">
            ↑ Fill in the form above and click Generate
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
