"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Category } from "@/lib/prompts";
import { ArrowRight } from "lucide-react";

export function CategoryCard({
  category,
  index = 0,
}: {
  category: Category;
  index?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for subtle 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 35,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 35,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <Link href={`/category/${category.slug}`} className="block">
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.4, 0.25, 1] }}
        className="group relative bg-[var(--color-surface-light)] border border-[var(--color-hairline)] p-10 rounded-[24px] hover:border-[var(--color-primary)]/40 hover:bg-white transition-standard overflow-hidden cursor-pointer"
      >
        <div className="relative z-10">
          {/* Icon & Count */}
          <div className="w-14 h-14 bg-[var(--color-primary)]/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[var(--color-primary)] transition-all transition-standard">
            <span className="text-2xl text-[var(--color-primary)] group-hover:text-white transition-colors">
              {category.icon}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold text-[var(--color-on-surface)] mb-4">
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-[var(--color-on-surface-muted)] text-base leading-relaxed mb-8">
            {category.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-on-surface)]/30 text-xs font-mono tracking-widest uppercase">
              {category.promptCount} prompts
            </span>
            <div className="w-8 h-8 rounded-full border border-[var(--color-hairline)] flex items-center justify-center group-hover:bg-[var(--color-on-surface)] group-hover:border-[var(--color-on-surface)] transition-standard">
              <ArrowRight className="w-4 h-4 text-[var(--color-on-surface)] group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
