"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollTop > 400);
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`scroll-top ${visible ? "visible" : ""}`}
      aria-label="Scroll to top"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 44 44"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="rgba(128,131,255,0.3)"
          strokeWidth="2"
        />
        <circle
          cx="22"
          cy="22"
          r="20"
          fill="none"
          stroke="#8083ff"
          strokeWidth="2"
          strokeDasharray="125.6"
          strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
    </button>
  );
}
