"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Copy, Check, FileText } from "lucide-react";

interface GeneratorOutputProps {
  output: string;
  loading: boolean;
  onCopy: () => void;
  copied: boolean;
}

export function GeneratorOutput({ output, loading, onCopy, copied }: GeneratorOutputProps) {
  if (!output && !loading) return null;

  return (
    <ScrollReveal delay={200}>
      <div className="bg-bg-card border border-border/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <div>
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider block">Generated Prompt</span>
              {loading && (
                <span className="flex items-center gap-1.5 text-xs text-accent mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  Writing...
                </span>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {output && (
              <motion.button
                key={copied ? "copied" : "copy"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={onCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  copied
                    ? "bg-success/10 text-success border border-success/30"
                    : "bg-text/5 text-text-muted hover:text-text border border-border/30 hover:border-accent/30"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Loading skeleton */}
        {loading && !output && (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="h-4 rounded-lg bg-text/5 animate-pulse"
                style={{ width: `${100 - i * 10}%` }}
              />
            ))}
          </div>
        )}

        {/* Output */}
        <AnimatePresence>
          {output && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-text-secondary">
                {output}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer actions */}
        {output && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 px-6 py-4 border-t border-border/30"
          >
            <button
              onClick={onCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                copied
                  ? "bg-success text-white"
                  : "btn-primary !py-2"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </button>
            <span className="text-xs text-text-muted">
              Paste into your AI tool and customize as needed.
            </span>
          </motion.div>
        )}
      </div>
    </ScrollReveal>
  );
}
