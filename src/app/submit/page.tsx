"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/data/prompts";

export default function SubmitPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Submit a Prompt
          </h1>
          <p className="text-gray-400 text-lg">
            Share your best AI prompts with the community.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Prompt Title *</label>
            <input type="text" id="title" name="title" required className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" placeholder="e.g., Code Review Assistant" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
            <input type="text" id="description" name="description" className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" placeholder="One-line description" />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select id="category" name="category" required className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all">
              <option value="">Select a category</option>
              {categories.map((cat: { slug: string; name: string }) => (
                <option key={cat.slug} value={cat.name} className="bg-neutral-900">{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" placeholder="e.g., coding, javascript, debugging" />
          </div>

          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Prompt Content *</label>
            <textarea id="prompt" name="prompt" required rows={10} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-y" placeholder="Paste or write the full prompt..." />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">Submit Prompt</button>
            <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors">Cancel</Link>
            {status && <span className="text-sm text-gray-400 ml-auto">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
