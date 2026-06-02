"use client";

import { useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Sparkles, Zap, Copy } from "lucide-react";
import { SearchBar } from "./SearchBar";

interface HeroProps {
  promptCount: number;
}

function FloatingElement({
  scrollYProgress,
  from,
  to,
  className,
}: {
  scrollYProgress: MotionValue<number>;
  from: number[];
  to: number[];
  className: string;
}) {
  const y = useTransform(scrollYProgress, from, to);
  return <motion.div style={{ y }} className={className} />;
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  const stats = [
    { icon: Sparkles, value: `${promptCount}+`, label: "Prompts" },
    { icon: Zap, value: "8+", label: "AI Tools" },
    { icon: Copy, value: "Free", label: "Forever" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center"
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl"
        />
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl"
        />
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Floating decorative elements */}
      <FloatingElement
        scrollYProgress={scrollYProgress}
        from={[0, 1]}
        to={[0, -50]}
        className="absolute top-32 right-20 w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/10 animate-float hidden lg:block"
      />
      <FloatingElement
        scrollYProgress={scrollYProgress}
        from={[0, 1]}
        to={[0, -30]}
        className="absolute bottom-40 left-16 w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/10 animate-float hidden lg:block"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-dim border border-accent/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="text-xs font-mono font-medium text-accent">
                {promptCount}+ battle-tested prompts
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              <span className="block text-text">AI prompts</span>
              <span className="block text-gradient-warm">that work.</span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
              No fluff. No listicles. Just battle-tested prompts for ChatGPT,
              Midjourney, Claude, and more.{" "}
              <span className="text-text font-semibold">Copy. Paste. Ship.</span>
            </p>
          </motion.div>

          {/* Search */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <SearchBar />
          </motion.div>

          {/* Popular tags */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-text-muted font-mono">Popular:</span>
              {["Blog Writer", "Code Review", "Cold Email", "SEO", "Midjourney"].map(
                (term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="text-xs font-mono text-text-muted px-3 py-1.5 border border-border/50 rounded-full hover:border-accent/30 hover:text-accent hover:bg-accent-dim transition-all duration-300"
                  >
                    {term}
                  </Link>
                )
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-card border border-border/50 flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-text">{stat.value}</p>
                    <p className="text-xs font-mono text-text-muted uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
