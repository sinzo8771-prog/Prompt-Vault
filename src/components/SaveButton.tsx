"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";

interface SaveButtonProps {
  prompt: {
    id: string;
    slug: string;
    title: string;
    body: string;
    aiTool: string;
    category: string;
  };
  size?: "sm" | "md";
  className?: string;
}

export function SaveButton({ prompt, size = "sm", className = "" }: SaveButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("promptvault-saved");
    if (stored) {
      try {
        const savedPrompts = JSON.parse(stored);
        setSaved(savedPrompts.some((p: { id: string }) => p.id === prompt.id));
      } catch { /* ignore */ }
    }
  }, [prompt.id]);

  const toggleSave = useCallback(() => {
    const stored = localStorage.getItem("promptvault-saved");
    let savedPrompts: Array<{
      id: string;
      slug: string;
      title: string;
      body: string;
      aiTool: string;
      category: string;
      savedAt: number;
    }> = [];

    try {
      savedPrompts = stored ? JSON.parse(stored) : [];
    } catch { /* ignore */ }

    if (saved) {
      savedPrompts = savedPrompts.filter((p) => p.id !== prompt.id);
      localStorage.setItem("promptvault-saved", JSON.stringify(savedPrompts));
      setSaved(false);
      toast.success("Removed from library");
    } else {
      savedPrompts.unshift({
        ...prompt,
        savedAt: Date.now(),
      });
      localStorage.setItem("promptvault-saved", JSON.stringify(savedPrompts));
      setSaved(true);
      toast.success("Saved to library");
    }
  }, [prompt, saved]);

  return (
    <button
      onClick={toggleSave}
      className={`inline-flex items-center gap-1.5 font-mono border transition-all ${
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
      } ${
        saved
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border text-text-muted hover:border-accent hover:text-accent"
      } ${className}`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-3 h-3" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="w-3 h-3" />
          Save
        </>
      )}
    </button>
  );
}
