"use client";

import Link from "next/link";
import { ExternalLink, Heart, ArrowUpRight, MessageCircle } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

const LINKS = {
  product: [
    { href: "/category/writing", label: "Browse Prompts" },
    { href: "/generator", label: "AI Generator" },
    { href: "/search", label: "Search" },
    { href: "/submit", label: "Submit Prompt" },
  ],
  resources: [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
  tools: [
    { label: "ChatGPT", href: "#" },
    { label: "Claude", href: "#" },
    { label: "Midjourney", href: "#" },
    { label: "Gemini", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-bg-elevated">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <AnimatedLogo size={28} />
              <span className="text-lg font-bold tracking-tight text-text">
                Prompt<span className="text-accent">Vault</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted mb-5 max-w-xs leading-relaxed">
              Battle-tested AI prompts for developers, marketers, and creators. No
              fluff, just results.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-bg-card border border-border/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="Contact us"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-bg-card border border-border/50 flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-all"
                aria-label="External links"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-mono font-medium text-text-muted uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-accent transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} PromptVault. All rights reserved.
            </p>
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              Built with <Heart className="w-3 h-3 text-accent" /> for the AI
              community
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
