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

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
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
        className="group relative bg-bg-card border border-border/50 rounded-2xl p-6 hover:border-border-hover transition-all duration-500 overflow-hidden"
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(400px circle at ${mouseX.get() * 100 + 50}% ${mouseY.get() * 100 + 50}%, ${category.color}15, transparent 40%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }}
        />

        <div className="relative z-10">
          {/* Icon & Arrow */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: `${category.color}15`,
                border: `1px solid ${category.color}25`,
              }}
            >
              {category.icon}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${category.color}20` }}
              >
                <ArrowRight
                  className="w-4 h-4"
                  style={{ color: category.color }}
                />
              </div>
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-text group-hover:text-white transition-colors mb-2">
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-muted line-clamp-2 mb-4">
            {category.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-muted">
              {category.promptCount} prompts
            </span>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: category.color,
                    opacity: 0.3 + i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
