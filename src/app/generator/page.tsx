"use client";

import { useState, useCallback } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GeneratorOutput } from "./output";

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
  const [selectedTool, setSelectedTool] = useState("ChatGPT");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!goal.trim()) {
      setError("Please describe what you want the prompt to do.");
      return;
    }

    setLoading(true);
    setError("");
    setOutput("");

    try {
      const response = fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selectedTool,
          category: selectedCategory,
          goal: goal.trim(),
          tone: selectedTone,
          language: "English",
        }),
      });

      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 30000)
      );

      const result = await Promise.race([response, timeout]);

      if (!result.ok) {
        throw new Error(`Server error: ${result.status}`);
      }

      const data = await result.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setOutput(data.prompt || "No output generated. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate prompt. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [goal, selectedTool, selectedCategory, selectedTone]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 pt-32">
      {/* Header */}
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

      {/* Form */}
      <ScrollReveal delay={100}>
        <div className="bg-surface-container border border-border/50 rounded-2xl p-8 mb-8">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Tool Selection */}
          <div className="mb-8">
            <label className="label mb-3 block">1. Select AI Tool</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setSelectedTool(tool.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    selectedTool === tool.id
                      ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-border/50 bg-bg hover:border-accent/30 hover:bg-accent/5"
                  }`}
                >
                  <span className="text-xl">{tool.icon}</span>
                  <span className={`text-xs font-medium ${selectedTool === tool.id ? "text-accent" : "text-text-secondary"}`}>
                    {tool.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="label mb-3 block">2. Select Category (optional)</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`btn-ghost ${
                    selectedCategory === cat
                      ? "!border-accent !bg-accent/10 !text-accent"
                      : ""
                  }`}
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
              placeholder="E.g., Write a cold email sequence for a B2B SaaS product targeting HR managers. The email should focus on pain points around employee retention..."
              value={goal}
              onChange={(e) => { setGoal(e.target.value); setError(""); }}
              className="w-full h-36 px-4 py-3 bg-bg border border-border/50 rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors resize-none font-mono"
            />
            <p className="text-xs text-text-muted mt-2">Be specific for better results. Include audience, format, and key points.</p>
          </div>

          {/* Tone */}
          <div className="mb-8">
            <label className="label mb-3 block">4. Select Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => setSelectedTone(tone.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    selectedTone === tone.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border/50 bg-bg hover:border-accent/30 text-text-secondary"
                  }`}
                >
                  <span>{tone.icon}</span>
                  <span className="text-xs font-medium">{tone.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className={`btn-primary !px-10 !py-4 text-base font-semibold tracking-wide ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                <>Generate Prompt →</>
              )}
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Output */}
      <GeneratorOutput output={output} loading={loading} onCopy={handleCopy} copied={copied} />
    </div>
  );
}
