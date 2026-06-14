"use client";

import Link from "next/link";
import { ExternalLink, ArrowUpRight, MessageCircle } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

const LINKS = {
  Platform: [
    { href: "/search", label: "Prompt Search" },
    { href: "/submit", label: "Submit Prompt" },
    { href: "/generator", label: "API Generator" },
  ],
  Resources: [
    { href: "/about", label: "Engineering Guide" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Contact" },
  ],
};

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
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all transition-standard"
                aria-label="Twitter"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all transition-standard"
                aria-label="GitHub"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
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
