"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

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
      <div className="bg-surface-container border border-border/50 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">Generated Prompt</span>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Writing...
              </span>
            )}
          </div>
          {output && (
            <button
              onClick={onCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                copied
                  ? "bg-success/10 text-success border border-success/30"
                  : "bg-text/5 text-text-muted hover:text-text border border-border/30 hover:border-accent/30"
              }`}
            >
              {copied ? (
                <>✓ Copied</>
              ) : (
                <>📋 Copy</>
              )}
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && !output && (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 rounded bg-text/5 animate-pulse"
                style={{ width: `${100 - i * 12}%`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="p-6">
            <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-text-secondary">
              {output}
            </pre>
          </div>
        )}

        {/* Footer actions */}
        {output && (
          <div className="flex items-center gap-3 px-6 py-4 border-t border-border/30 bg-surface-dim/30">
            <button
              onClick={onCopy}
              className={`btn-primary !px-6 !py-2.5 text-sm ${copied ? "!bg-success" : ""}`}
            >
              {copied ? "✓ Copied" : "Copy Prompt"}
            </button>
            <span className="text-xs text-text-muted">
              Paste into your AI tool and customize as needed.
            </span>
          </div>
        )}
      </div>
    </ScrollReveal>
  );
}
