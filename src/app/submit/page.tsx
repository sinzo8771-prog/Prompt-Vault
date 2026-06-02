"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/data/prompts";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Send, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function SubmitPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("Submitting...");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || "",
      category: formData.get("category") as string,
      tags: (formData.get("tags") as string)
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      prompt: formData.get("prompt") as string,
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("Submitted successfully!");
        form.reset();
      } else {
        setStatus("Failed to submit. Please try again.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-10">
          <p className="label mb-3">Submit</p>
          <h1 className="display-2 mb-4">
            Share a <span className="text-accent">prompt</span>
          </h1>
          <p className="body-lg max-w-2xl">
            Share your best AI prompts with the community.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="bg-bg-card border border-border/50 rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title */}
            <div>
              <label htmlFor="title" className="label block mb-2">Prompt Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono text-sm"
                placeholder="e.g., Code Review Assistant"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="label block mb-2">Short Description</label>
              <input
                type="text"
                id="description"
                name="description"
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono text-sm"
                placeholder="One-line description"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="label block mb-2">Category *</label>
              <select
                id="category"
                name="category"
                required
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-text focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono text-sm"
              >
                <option value="" className="bg-bg-card">Select a category</option>
                {categories.map((cat: { slug: string; name: string }) => (
                  <option key={cat.slug} value={cat.name} className="bg-bg-card">{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="label block mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all font-mono text-sm"
                placeholder="e.g., coding, javascript, debugging"
              />
            </div>

            {/* Prompt */}
            <div>
              <label htmlFor="prompt" className="label block mb-2">Prompt Content *</label>
              <textarea
                id="prompt"
                name="prompt"
                required
                rows={10}
                className="w-full bg-bg border border-border/50 rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-y font-mono text-sm"
                placeholder="Paste or write the full prompt..."
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/30">
              <button
                type="submit"
                disabled={submitting}
                className={`btn-primary ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Submit Prompt
                  </span>
                )}
              </button>
              <Link href="/" className="btn-ghost">Cancel</Link>
              {status && (
                <span className={`text-sm ml-auto font-mono flex items-center gap-1.5 ${
                  status.includes("successfully") ? "text-success" : status.includes("Submitting") ? "text-text-muted" : "text-error"
                }`}>
                  {status.includes("successfully") && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {status}
                </span>
              )}
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
