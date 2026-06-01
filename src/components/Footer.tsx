import Link from "next/link"

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
    title: "Tools",
    links: [
      { label: "Generator", href: "/generator" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Info",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold text-sm">P</span>
              </div>
              <span className="text-base font-bold tracking-tight text-text">
                PromptVault
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Curated AI prompts for people who actually want results, not noise.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-mono font-bold uppercase tracking-[0.1em] text-text-muted mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="divider-thick mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} PromptVault. All prompts are free to use.
          </p>
          <p className="text-xs text-text-muted">
            <Link href="/privacy" className="hover:text-text transition-colors">Privacy</Link>
            {" · "}
            <Link href="/terms" className="hover:text-text transition-colors">Terms</Link>
            {" · "}
            <span className="text-accent/60">100% Free</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
