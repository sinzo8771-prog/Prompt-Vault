"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Search, CircleDot } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "Blog Writer",
  "Midjourney Portrait",
  "Code Review",
  "Cold Email",
  "Resume Builder",
  "Flashcard Generator",
  "SEO Content",
  "Ad Copy",
  "Interview Prep",
]

const GooeyFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="gooey-effect">
        <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
  </svg>
)

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

const SearchBar = ({ placeholder = "What are you building?", onSearch }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isClicked, setIsClicked] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isUnsupportedBrowser = useMemo(() => {
    if (typeof window === "undefined") return false
    const ua = navigator.userAgent.toLowerCase()
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium")
    const isChromeOniOS = ua.includes("crios")
    return isSafari || isChromeOniOS
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    if (value.trim()) {
      const filtered = SUGGESTIONS.filter((item) => item.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
      setIsFocused(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isFocused) {
      const rect = e.currentTarget.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 800)
  }

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isFocused])

  const searchIconVariants = {
    initial: { scale: 1 },
    animate: {
      rotate: isAnimating ? [0, -15, 15, -10, 10, 0] : 0,
      scale: isAnimating ? [1, 1.3, 1] : 1,
      transition: { duration: 0.6, ease: "easeInOut" as const },
    },
  }

  const suggestionVariants = {
    hidden: (i: number) => ({
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15, delay: i * 0.05 },
    }),
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 15, delay: i * 0.07 },
    }),
    exit: (i: number) => ({
      opacity: 0,
      y: -5,
      scale: 0.9,
      transition: { duration: 0.1, delay: i * 0.03 },
    }),
  }

  const particles = Array.from({ length: isFocused ? 12 : 0 }, (_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0 }}
      animate={{
        x: [0, (Math.random() - 0.5) * 40],
        y: [0, (Math.random() - 0.5) * 40],
        scale: [0, Math.random() * 0.8 + 0.4],
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: Math.random() * 1.5 + 1.5,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      className="absolute w-2 h-2 rounded-full bg-accent/60"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        filter: "blur(1px)",
      }}
    />
  ))

  const clickParticles = isClicked
    ? Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`click-${i}`}
          initial={{ x: mousePosition.x, y: mousePosition.y, scale: 0, opacity: 1 }}
          animate={{
            x: mousePosition.x + (Math.random() - 0.5) * 120,
            y: mousePosition.y + (Math.random() - 0.5) * 120,
            scale: Math.random() * 0.6 + 0.2,
            opacity: [1, 0],
          }}
          transition={{ duration: Math.random() * 0.6 + 0.4, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full bg-accent"
          style={{
            boxShadow: "0 0 6px rgba(255, 61, 0, 0.6)",
          }}
        />
      ))
    : null

  return (
    <div className="relative w-full">
      <GooeyFilter />
      <motion.form
        onSubmit={handleSubmit}
        className="relative flex items-center justify-center w-full mx-auto"
        initial={{ width: "100%" }}
        animate={{ width: isFocused ? "100%" : "100%", scale: isFocused ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          className={cn(
            "flex items-center w-full border-2 relative overflow-hidden",
            isFocused ? "border-accent shadow-[0_0_30px_rgba(255,61,0,0.15)]" : "border-border bg-bg-card hover:border-border-hover"
          )}
          animate={{
            boxShadow: isClicked
              ? "0 0 40px rgba(255, 61, 0, 0.3), 0 0 15px rgba(255, 61, 0, 0.2) inset"
              : isFocused
              ? "0 0 30px rgba(255, 61, 0, 0.15)"
              : "0 0 0 rgba(0, 0, 0, 0)",
          }}
          onClick={handleClick}
        >
          {isFocused && (
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.05,
                background: [
                  "linear-gradient(90deg, #ff3d00 0%, #ff5722 100%)",
                  "linear-gradient(90deg, #ff5722 0%, #ff3d00 100%)",
                  "linear-gradient(90deg, #ff3d00 0%, #ff5722 100%)",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          )}

          <div
            className="absolute inset-0 overflow-hidden -z-5"
            style={{ filter: isUnsupportedBrowser ? "none" : "url(#gooey-effect)" }}
          >
            {particles}
          </div>

          {isClicked && (
            <>
              <motion.div
                className="absolute inset-0 -z-5 bg-accent/10"
                initial={{ scale: 0, opacity: 0.7 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 -z-5 bg-white/5"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </>
          )}

          {clickParticles}

          <motion.div className="pl-5 py-4" variants={searchIconVariants} initial="initial" animate="animate">
            <Search
              size={20}
              strokeWidth={isFocused ? 2.5 : 1.5}
              className={cn(
                "transition-all duration-300",
                isAnimating ? "text-accent" : isFocused ? "text-accent" : "text-text-muted",
              )}
            />
          </motion.div>

          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "w-full py-4 bg-transparent outline-none font-mono text-sm relative z-10",
              isFocused ? "text-text placeholder:text-text-muted" : "text-text placeholder:text-text-muted"
            )}
          />

          <AnimatePresence>
            {searchQuery && (
              <motion.button
                type="submit"
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(255, 61, 0, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 mr-3 text-xs font-bold uppercase tracking-wider rounded-none bg-accent text-white transition-all"
              >
                Search
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 overflow-hidden bg-bg-card border border-border shadow-2xl"
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion}
                  custom={index}
                  variants={suggestionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onClick={() => {
                    setSearchQuery(suggestion)
                    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
                    setIsFocused(false)
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-bg-elevated group transition-colors"
                >
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: index * 0.06 }}>
                    <CircleDot size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                  </motion.div>
                  <motion.span
                    className="text-sm text-text-secondary group-hover:text-text font-mono transition-colors"
                    initial={{ x: -5, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    {suggestion}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { SearchBar }
