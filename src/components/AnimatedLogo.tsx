"use client";

import { motion } from "framer-motion";

export function AnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background square */}
      <motion.rect
        x="0"
        y="0"
        width="36"
        height="36"
        fill="#ff3d00"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "center" }}
      />

      {/* P letter - left stroke */}
      <motion.path
        d="M8 8 L8 28"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="square"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      />

      {/* P letter - top curve */}
      <motion.path
        d="M8 8 L16 8 Q22 8 22 13 Q22 18 16 18 L8 18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      />

      {/* Accent dot */}
      <motion.rect
        x="26"
        y="8"
        width="4"
        height="4"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: "28px 10px" }}
      />

      {/* Bottom accent line */}
      <motion.rect
        x="8"
        y="28"
        width="22"
        height="2"
        fill="white"
        opacity="0.6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 1.0, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />

      {/* Animated scan line */}
      <motion.rect
        x="0"
        y="0"
        width="36"
        height="2"
        fill="rgba(255,255,255,0.3)"
        initial={{ y: -2 }}
        animate={{ y: 38 }}
        transition={{
          duration: 2,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "linear",
        }}
      />
    </motion.svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="36" height="36" fill="#ff3d00" />
      <path
        d="M8 8 L8 28"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <path
        d="M8 8 L16 8 Q22 8 22 13 Q22 18 16 18 L8 18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <rect x="26" y="8" width="4" height="4" fill="white" />
      <rect x="8" y="28" width="22" height="2" fill="white" opacity="0.6" />
    </svg>
  );
}
