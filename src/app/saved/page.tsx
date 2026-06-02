import { Metadata } from "next";
import Link from "next/link";
import { getAllPrompts } from "@/lib/prompts";
import { Prompt } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "Saved Prompts - PromptVault",
  description: "View your saved prompts.",
};

export default async function SavedPage() {
  const savedIds = ["1", "4", "7"];
  const allPrompts = await getAllPrompts();
  const savedPrompts = allPrompts.filter((p) => savedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">
            Saved Prompts
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Your personal collection of saved prompts for quick access.
          </p>
        </div>

        {savedPrompts.length > 0 ? (
          <div className="space-y-4">
            {savedPrompts.map((prompt: Prompt, index: number) => (
              <div
                key={prompt.id}
                className="group bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/prompt/${prompt.id}`}>
                      <h3 className="text-xl font-semibold text-gray-100 group-hover:text-green-400 transition-colors mb-2">
                        {prompt.title}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {prompt.body}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {prompt.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {prompt.copyCount} copies
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No saved prompts</h3>
            <p className="text-gray-500 mb-6">Browse prompts and save the ones you like.</p>
            <Link
              href="/generator"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
            >
              Browse Prompts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
