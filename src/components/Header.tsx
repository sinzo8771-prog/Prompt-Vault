"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { AnimatedLogo } from "./AnimatedLogo";

const NAV = [
  { href: "/category/writing", label: "Prompts" },
  { href: "/generator", label: "Generator" },
  { href: "/search", label: "Search" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  return (
    <>
      <motion.header
        style={{ opacity: headerOpacity }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        {/* Glass background */}
        <motion.div
          style={{
            backdropFilter: `blur(${headerBlur}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${headerBlur}px) saturate(180%)`,
          }}
          className="absolute inset-0 bg-bg/70 border-b border-border/30"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedLogo size={32} />
              </motion.div>
              <span className="text-lg font-bold tracking-tight text-text hidden sm:block">
                Prompt<span className="text-accent">Vault</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-lg"
                  >
                    <span
                      className={`relative z-10 ${
                        active ? "text-text" : "text-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-text/5 border border-border/30 rounded-lg"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-bg-card border border-border/50 rounded-full hover:border-accent/30 transition-all group"
              >
                <Search className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                <span className="text-xs text-text-muted">Search</span>
                <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-bg/50 border border-border/50 rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Generate button */}
              <Link
                href="/generator"
                className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full hover:bg-accent-hover transition-all text-xs font-bold tracking-wide group"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                Generate
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text transition-colors rounded-lg"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[70] px-4"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-border/30">
                    <Search className="w-5 h-5 text-accent" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search prompts, tools, categories..."
                      className="flex-1 bg-transparent text-text placeholder:text-text-muted focus:outline-none font-medium"
                      autoFocus
                    />
                    <kbd className="px-2 py-1 text-[10px] font-mono text-text-muted bg-bg/50 border border-border/50 rounded">
                      ESC
                    </kbd>
                  </div>
                  <div className="p-3 max-h-[300px] overflow-y-auto">
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider px-3 py-2">
                      Popular searches
                    </p>
                    {["Blog Writer", "Code Review", "Cold Email", "SEO", "Midjourney"].map(
                      (suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                            setSearchOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-bg-hover transition-colors text-left group"
                        >
                          <Search className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                          <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                            {suggestion}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm z-50 bg-bg/98 backdrop-blur-2xl border-l border-border/30 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                    <AnimatedLogo size={28} />
                    <span className="text-lg font-bold tracking-tight text-text">
                      Prompt<span className="text-accent">Vault</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-2 text-text-muted hover:text-text transition-colors rounded-lg"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-6 py-8">
                  <div className="flex flex-col gap-2">
                    {NAV.map((item, i) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href + "/"));
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`text-xl font-bold py-3 block transition-colors ${
                              active ? "text-accent" : "text-text hover:text-accent"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </nav>

                {/* Mobile CTA */}
                <div className="px-6 pb-8">
                  <Link
                    href="/generator"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-accent text-white rounded-2xl font-bold text-lg hover:bg-accent-hover transition-colors"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Prompt
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
