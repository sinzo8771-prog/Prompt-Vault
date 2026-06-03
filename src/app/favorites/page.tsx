import { Metadata } from "next";
import Link from "next/link";
import { getAllPrompts } from "@/lib/prompts";
import { PromptCard } from "@/components/PromptCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Favorites — PromptVault",
  description: "View your favorite prompts.",
};

export default async function FavoritesPage() {
  const favoriteIds = ["c1", "m1", "co1"];
  const allPrompts = await getAllPrompts();
  const favoritePrompts = allPrompts.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-12">
          <p className="label mb-3">Favorites</p>
          <h1 className="display-2 mb-4">
            Your <span className="text-accent">favorites</span>
          </h1>
          <p className="body-lg max-w-2xl">
            Quick access to the prompts you&apos;ve saved for later.
          </p>
        </div>
      </ScrollReveal>

      {favoritePrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoritePrompts.map((prompt, i) => (
            <ScrollReveal key={prompt.id} delay={i * 40}>
              <PromptCard prompt={prompt} index={i} />
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <ScrollReveal>
          <div className="text-center py-20 border border-border/50 rounded-xl bg-bg-card">
            <Heart className="w-12 h-12 mx-auto text-text-muted/30 mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">No favorites yet</h3>
            <p className="text-sm text-text-muted mb-6 max-w-sm mx-auto">
              Start saving prompts you love and they&apos;ll appear here.
            </p>
            <Link
              href="/"
              className="btn-primary"
            >
              Browse Prompts
            </Link>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
