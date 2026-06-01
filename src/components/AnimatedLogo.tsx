"use client";

import { motion } from "framer-motion";

export function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      width="36" height="36" viewBox="0 0 36 36" fill="none"
      className={className}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.rect
        x="0" y="0" width="36" height="36" rx="8"
        fill="url(#logoGrad)"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />
      <path d="M10 10 L10 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 10 L18 10 Q24 10 24 15 Q24 20 18 20 L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="26" y="10" width="4" height="4" rx="2" fill="white" />
      <rect x="10" y="26" width="18" height="2" rx="1" fill="white" opacity="0.5" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className}>
      <rect width="36" height="36" rx="8" fill="url(#logoMarkGrad)" />
      <path d="M10 10 L10 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 10 L18 10 Q24 10 24 15 Q24 20 18 20 L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="26" y="10" width="4" height="4" rx="2" fill="white" />
      <rect x="10" y="26" width="18" height="2" rx="1" fill="white" opacity="0.5" />
      <defs>
        <linearGradient id="logoMarkGrad" x1="0" y1="0" x2="36" y2="36">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
