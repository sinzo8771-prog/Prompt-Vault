"use client";

import Link from "next/link";

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline";
}

export function MagneticButton({ href, children, className = "", variant = "primary" }: MagneticButtonProps) {
  return (
    <Link
      href={href}
      className={`btn-magnetic ${variant === "outline" ? "btn-magnetic-outline" : ""} ${className}`}
    >
      <span>{children}</span>
    </Link>
  );
}
