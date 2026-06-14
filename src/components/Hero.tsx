"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Sparkles, Search } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  promptCount: number;
}

export function Hero({ promptCount }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Smooth spring for mouse following
  const springConfig = useMemo(() => ({ damping: 25, stiffness: 150 }), []);
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll depth transformations for 3D parallax on mockups
  const yFloating1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yFloating2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacityFloating = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[820px] bg-[var(--color-surface-dark)] overflow-hidden flex flex-col items-center justify-center px-6 pt-32 pb-24"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#7C9AD3]/10 via-[#314682]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(113,76,182,0.15),transparent_70%)] pointer-events-none" />

      {/* Decorative Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent blur-3xl"
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">
            Redesign 2.0: Deep Twilight Phase
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter leading-none mb-12"
        >
          The Oracle of<br />Synthetic Logic
        </motion.h1>

        {/* Oracle Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full max-w-3xl mx-auto group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-[#7C9AD3] rounded-2xl blur-2xl opacity-10 group-focus-within:opacity-30 transition-all duration-300" />
          <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-1 flex items-center oracle-glow transition-all duration-300 group-focus-within:border-white/20">
            <SearchBar />
          </div>

          {/* Prompt Inspiration Prompts */}
          <div className="mt-10 flex flex-wrap gap-4 sm:gap-6 justify-center items-center">
            <span className="text-white/25 text-xs font-medium uppercase tracking-widest pt-0.5">
              Inspiration:
            </span>
            {["Technical Documentation", "Creative Narratives", "Persona Synthesis"].map((suggestion) => (
              <Link
                key={suggestion}
                href={`/search?q=${encodeURIComponent(suggestion)}`}
                className="text-white/60 hover:text-[var(--color-primary-hover)] text-sm font-medium px-4 py-1.5 bg-white/5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Mockup Cards (Deep Twilight aesthetic) */}
      <motion.div
        style={{ y: yFloating1, opacity: opacityFloating }}
        className="absolute top-[20%] -left-16 w-80 h-48 frosted-glass rounded-[24px] p-8 animate-float hidden xl:block pointer-events-none"
        custom={{ "--rot": "-3deg" } as any}
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mb-4" />
        <div className="space-y-2">
          <div className="w-full h-1 bg-white/10 rounded-full" />
          <div className="w-4/5 h-1 bg-white/10 rounded-full" />
          <div className="w-2/3 h-1 bg-white/10 rounded-full" />
        </div>
        <div className="mt-8 flex gap-2">
          <div className="w-6 h-6 rounded-full bg-[var(--color-primary)]/40" />
          <div className="w-20 h-2 bg-white/10 rounded-full mt-2" />
        </div>
      </motion.div>

      <motion.div
        style={{ y: yFloating2, opacity: opacityFloating }}
        className="absolute bottom-[20%] -right-16 w-88 h-56 frosted-glass rounded-[24px] p-8 animate-float hidden xl:block pointer-events-none"
        custom={{ "--rot": "4deg" } as any}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[var(--color-primary-hover)]" />
          </div>
          <div className="text-white/80 font-bold text-sm">System Prompt</div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-1.5 bg-white/10 rounded-full" />
          <div className="w-full h-1.5 bg-white/10 rounded-full" />
          <div className="w-1/2 h-1.5 bg-white/10 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
