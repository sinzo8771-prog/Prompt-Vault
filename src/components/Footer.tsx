import Link from "next/link";
import { LogoMark } from "@/components/AnimatedLogo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <LogoMark />
              <span className="text-base font-bold tracking-tight text-text">
                PromptVault
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed mb-5">
              Curated AI prompts for people who actually want results, not noise.
            </p>
            <div className="flex gap-2">
              {["X", "GH", "DC"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 bg-bg-card border border-border flex items-center justify-center text-[10px] font-mono font-bold text-text-muted hover:border-accent hover:text-accent transition-all"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-text-muted mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Writing", href: "/category/writing" },
                { name: "Development", href: "/category/development" },
                { name: "Marketing", href: "/category/marketing" },
                { name: "Design", href: "/category/design" },
                { name: "AI & Automation", href: "/category/ai-and-automation" },
                { name: "Video & Film", href: "/category/video-and-film" },
                { name: "Business & Finance", href: "/category/business-and-finance" },
                { name: "Education & Learning", href: "/category/education-and-learning" },
                { name: "Sales & CRM", href: "/category/sales-and-crm" },
                { name: "Productivity", href: "/category/productivity" },
                { name: "Creative", href: "/category/creative" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-text-muted mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              {[
                { name: "Generator", href: "/generator" },
                { name: "About", href: "/about" },
                { name: "Prompt Guide", href: "/generator" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-text-muted mb-4">
              Newsletter
            </h3>
            <p className="text-sm text-text-muted mb-4">
              Best prompts, once a week. No spam.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-3 py-2.5 bg-bg-card border border-border border-r-0 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-accent text-white text-xs font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-text-muted">
            &copy; {new Date().getFullYear()} PromptVault. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Affiliates"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-mono text-text-muted hover:text-text transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-bg-card border border-border">
          <p className="text-[11px] font-mono text-text-muted leading-relaxed">
            <strong className="text-text-secondary">Disclosure:</strong> We earn commissions from qualifying purchases through affiliate links. No extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  );
}
