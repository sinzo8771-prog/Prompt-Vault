"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import type { Prompt } from "@/lib/prompts";

export function SaveButton({ prompt }: { prompt: Prompt }) {
  // Use lazy initialization to check localStorage once
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    return favorites.includes(prompt.id);
  });

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (saved) {
      const newFavorites = favorites.filter((id: string) => id !== prompt.id);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setSaved(false);
      toast("Removed from favorites", {
        icon: "🔖",
        style: {
          background: "#131316",
          color: "#f5f5f4",
          border: "1px solid #1f1f24",
        },
      });
    } else {
      favorites.push(prompt.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setSaved(true);
      toast.success("Saved to favorites!", {
        icon: "❤️",
        style: {
          background: "#131316",
          color: "#f5f5f4",
          border: "1px solid #1f1f24",
        },
      });
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSave}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 ${
        saved
          ? "bg-accent/10 text-accent border border-accent/20"
          : "bg-bg-card text-text-muted border border-border/50 hover:text-accent hover:border-accent/30 hover:bg-accent-dim"
      }`}
    >
      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex items-center gap-1.5"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Saved</span>
          </motion.div>
        ) : (
          <motion.div
            key="save"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
