"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

const LINKS = {
  Platform: [
    { href: "/search", label: "Prompt Search" },
    { href: "/submit", label: "Submit Prompt" },
    { href: "/generator", label: "Generator" },
  ],
  Resources: [
    { href: "/generator", label: "AI Generator" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "mailto:hello@promptvault.com", label: "Contact" },
  ],
};

const SOCIALS = [
  { href: "https://twitter.com/promptvault", label: "X / Twitter", icon: "twitter" as const },
  { href: "https://github.com/promptvault", label: "GitHub", icon: "github" as const },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-dark)] text-white/40 py-20 px-12 border-t border-white/5 relative overflow-hidden">
      {/* Cinematic subtle glow / reflection */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#7C9AD3]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-8">
              <AnimatedLogo size={28} />
              <span className="text-white text-3xl font-bold tracking-tighter">
                PromptVault.
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-8 text-white/60">
              The definitive library for the age of synthetic reasoning. Engineered for clarity, optimized for output. No fluff, just results.
            </p>
            <div className="flex gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all transition-standard"
                  aria-label={social.label}
                >
                  {social.icon === "twitter" ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-8">
                {category}
              </h5>
              <ul className="space-y-4 text-sm font-medium">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors transition-standard flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs font-mono">
            © {new Date().getFullYear()} PROMPTVAULT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-8 text-xs font-mono">
            <span>LATENCY: 14MS</span>
            <span className="text-emerald-500">STATUS: ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
