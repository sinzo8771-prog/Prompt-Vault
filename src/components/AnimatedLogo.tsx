"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  className?: string;
}

export function AnimatedLogo({ size = 36, className = "" }: LogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      initial={{ rotate: -10, scale: 0.9 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="logoShine" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background shape */}
      <motion.rect
        x="2" y="2" width="36" height="36" rx="10"
        fill="url(#logoBg)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Shine overlay */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#logoShine)" />

      {/* P letter - vertical stroke */}
      <motion.path
        d="M13 10 L13 30"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      />

      {/* P letter - bowl */}
      <motion.path
        d="M13 10 L20 10 Q27 10 27 16 Q27 22 20 22 L13 22"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      />

      {/* Sparkle dot */}
      <motion.circle
        cx="30" cy="10" r="3"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
      />

      {/* Bottom accent line */}
      <motion.rect
        x="13" y="30" width="16" height="2" rx="1"
        fill="white"
        opacity="0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay: 1.0, ease: "easeOut" }}
        style={{ transformOrigin: "13px 31px" }}
      />

      {/* Animated scan line */}
      <motion.rect
        x="2" y="2" width="36" height="2" rx="1"
        fill="white"
        opacity="0.2"
        initial={{ y: 2 }}
        animate={{ y: 36 }}
        transition={{
          duration: 2.5,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
        }}
      />
    </motion.svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <AnimatedLogo size={36} />
      <span className="text-lg font-bold tracking-tight text-text hidden sm:block">
        PromptVault
      </span>
    </div>
  );
}
