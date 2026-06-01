"use client";

import { useEffect } from "react";

interface AdSenseProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdSense({
  slot,
  style,
  className = "",
  format = "auto",
  responsive = true,
}: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && !window.adsbygoogle) {
        const script = document.createElement("script");
        script.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
        script.async = true;
        script.setAttribute("crossorigin", "anonymous");
        document.head.appendChild(script);
      }
    } catch {
      // ignore ad blocking
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );
}
