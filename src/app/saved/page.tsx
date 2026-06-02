import { Metadata } from "next";
import Link from "next/link";
import { getAllPrompts } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
  title: "Saved — PromptVault",
  description: "View your saved prompts.",
};

export default async function SavedPage() {
  const savedIds = ["1", "4", "7"];
  const allPrompts = await getAllPrompts();
  const savedPrompts = allPrompts.filter((p) => savedIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-12">
          <p className="label mb-3">Saved</p>
          <h1 className="display-2 mb-4">
            Your <span className="text-accent">collection</span>
          </h1>
          <p className="body-lg max-w-2xl">
            Your personal collection of saved prompts for quick access.
          </p>
        </div>
      </ScrollReveal>

      {savedPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPrompts.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 40}>
              <PromptCard prompt={prompt} index={i} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border/50 rounded-xl bg-bg-card">
            <Bookmark className="w-12 h-12 mx-auto text-text-muted/30 mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">No saved prompts</h3>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              Browse prompts and save the ones you like.
            </p>
            <Link href="/" className="btn-primary">
              Browse Prompts
            </Link>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
