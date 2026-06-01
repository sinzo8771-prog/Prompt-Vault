"use client";

import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const FOOTER_LINKS = [
  {
    title: "Browse",
    links: [
      { label: "All Prompts", href: "/search" },
      { label: "Writing", href: "/category/writing" },
      { label: "Development", href: "/category/development" },
      { label: "Marketing", href: "/category/marketing" },
      { label: "Design", href: "/category/design" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "AI & Automation", href: "/category/ai-and-automation" },
      { label: "Video & Film", href: "/category/video-and-film" },
      { label: "Business", href: "/category/business-and-finance" },
      { label: "Education", href: "/category/education-and-learning" },
      { label: "Sales & CRM", href: "/category/sales-and-crm" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Prompt Generator", href: "/generator" },
      { label: "Search Prompts", href: "/search" },
      { label: "About", href: "/about" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Welcome to the Vault! Newsletter subscription active.");
    setEmail("");
  };

  return (
    <footer className="w-full py-16 md:py-24 border-t border-border/50 bg-[#090e1c] mt-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
        <div className="max-w-md w-full">
          <Link href="/" className="flex items-center gap-2.5 mb-6 group">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:scale-105 transition-all">
              <span className="text-accent font-bold text-base">P</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text">
              PromptVault
            </span>
          </Link>
          <p className="text-sm text-text-secondary leading-relaxed mb-8">
            The leading open library of human-perfected AI prompts. Engineered for absolute precision, 100% free, and supported by visual excellence.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 w-full">
            <label className="text-xs font-mono font-bold uppercase tracking-[0.1em] text-text-muted">
              Subscribe to the prompt feed
            </label>
            <div className="gradient-border-animated p-[1px] w-full max-w-sm">
              <div className="flex bg-[#161b2b] rounded-lg overflow-hidden p-1">
                <input
                  type="email"
                  required
                  placeholder="Your best email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 px-4 py-2.5 text-sm text-text placeholder:text-text-muted w-full font-mono"
                />
                <button
                  type="submit"
                  className="bg-primary text-ink px-6 py-2 rounded-md font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-none"
                >
                  Join
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 w-full lg:w-auto">
          {FOOTER_LINKS.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                {group.title}
              </span>
              <div className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
        <p>&copy; {new Date().getFullYear()} PromptVault. Dedicated to anti-AI slop interfaces.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-text transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-text transition-colors">Terms of Service</Link>
          <span className="text-accent/60 font-mono uppercase tracking-[0.1em]">100% Free & Open</span>
        </div>
      </div>
    </footer>
  );
}
