import { Metadata } from "next";
import { getAllPrompts } from "@/lib/prompts";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SavedClientPage } from "./SavedClientPage";

export const metadata: Metadata = {
  title: "Saved Prompts — PromptVault",
  description: "Your personal collection of saved AI prompts.",
};

export default async function SavedPage() {
  const allPrompts = await getAllPrompts();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-12">
          <p className="label mb-3">My Library</p>
          <h1 className="display-2 mb-4">
            Your <span className="text-accent">saved</span> prompts
          </h1>
          <p className="body-lg max-w-2xl">
            Your personal collection of prompts — saved across sessions, searchable, and ready to use.
          </p>
        </div>
      </ScrollReveal>

      <SavedClientPage allPrompts={allPrompts} />
    </div>
  );
}

