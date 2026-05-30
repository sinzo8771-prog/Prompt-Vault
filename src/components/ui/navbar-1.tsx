"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search } from "lucide-react"
import { useAuth, UserButton } from "@clerk/nextjs"
import { AnimatedLogo } from "@/components/AnimatedLogo"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery("")
    }
  }

  const navLinks = [
    { href: "/category/chatgpt", label: "Prompts" },
    { href: "/generator", label: "Generator" },
    { href: "/account/library", label: "Library" },
    { href: "/about", label: "About" },
  ]

  return (
    <>
      <div className="flex justify-center w-full px-4">
        <motion.div
          className={`flex items-center justify-between px-6 py-3 w-full max-w-6xl relative z-50 transition-all duration-500 ${
            scrolled
              ? "bg-bg/90 backdrop-blur-xl border border-border"
              : "bg-transparent"
          }`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <AnimatedLogo />
            <span className="text-base font-bold tracking-tight text-text hidden sm:block">
              PromptVault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href={item.href}
                  className="text-sm text-text-secondary hover:text-accent transition-colors font-mono uppercase tracking-wider"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-text-secondary hover:text-accent transition-colors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-4 w-4" />
            </motion.button>

            {!isSignedIn ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-xs font-mono text-text-secondary hover:text-text transition-colors uppercase tracking-wider"
                >
                  Sign In
                </Link>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    href="/sign-up"
                    className="inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-wider bg-text text-ink hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <Link
                  href="/account/library"
                  className="text-xs font-mono text-text-secondary hover:text-text transition-colors uppercase tracking-wider"
                >
                  Library
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-bg-card border border-border",
                      userButtonPopoverItem: "hover:bg-bg-elevated text-text",
                      userButtonPopoverFooter: "border-border",
                    },
                  }}
                />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden flex items-center p-2 text-text-secondary"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-5 w-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-[60] bg-bg/95 backdrop-blur-xl border-b border-border"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-2xl mx-auto px-6 py-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  autoFocus
                  className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-border text-text text-lg placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors font-mono"
                />
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-xs font-mono text-text-muted hover:text-text transition-colors uppercase tracking-wider"
                  >
                    Close [ESC]
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-mono font-bold uppercase tracking-wider text-accent hover:text-accent-hover transition-colors"
                  >
                    Search &rarr;
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-bg z-[70] pt-24 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-6 right-6 p-2 text-text-secondary"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.button>

            <div className="flex flex-col space-y-6">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Link
                    href={item.href}
                    className="text-2xl font-bold text-text hover:text-accent transition-colors font-mono uppercase tracking-wider"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="h-px bg-border my-4" />

              {!isSignedIn ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href="/sign-in"
                      className="text-lg font-medium text-text-secondary hover:text-accent transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign In
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-bold uppercase tracking-wider bg-text text-ink hover:bg-accent hover:text-white transition-all"
                      onClick={toggleMenu}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                  <span className="text-sm text-text-secondary">Account</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export { Navbar1 }
