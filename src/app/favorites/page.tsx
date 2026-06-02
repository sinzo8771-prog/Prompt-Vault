import { Metadata } from "next";
import Link from "next/link";
import { getAllPrompts } from "@/lib/prompts";
import { Prompt } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "Favorites - PromptVault",
  description: "View your favorite prompts.",
};

export default async function FavoritesPage() {
  const favoriteIds = ["1", "2", "3"];
  const allPrompts = await getAllPrompts();
  const favoritePrompts = allPrompts.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Your Favorites
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Quick access to the prompts you&apos;ve saved for later.
          </p>
        </div>

        {favoritePrompts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritePrompts.map((prompt: Prompt, index: number) => (
              <div
                key={prompt.id}
                className="group relative bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {prompt.category}
                  </span>
                  <div className="flex items-center gap-1 text-pink-400 text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {prompt.copyCount}
                  </div>
                </div>
                <Link href={`/prompt/${prompt.id}`}>
                  <h3 className="text-xl font-semibold text-gray-100 group-hover:text-pink-400 transition-colors mb-2">
                    {prompt.title}
                  </h3>
                </Link>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {prompt.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-300 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">Start saving prompts you love and they&apos;ll appear here.</p>
            <Link
              href="/"
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
