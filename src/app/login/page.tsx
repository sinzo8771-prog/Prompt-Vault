import { AuthForm } from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PromptVault account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 pt-24">
        <AuthForm mode="login" />
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-bg-card border-l border-border relative overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 max-w-md">
          <div className="label-tag mb-6">
            <span className="dot" />
            PromptVault
          </div>

          <h2 className="text-3xl font-bold text-text tracking-tight mb-4 leading-tight">
            500+ prompts that<br />
            <span className="text-accent">actually work.</span>
          </h2>

          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Stop wasting time on generic prompts. Get access to curated,
            battle-tested prompts for ChatGPT, Midjourney, Claude, and more.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-px bg-border">
            {[
              { value: "500+", label: "Prompts" },
              { value: "6", label: "Categories" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="bg-bg-card p-4 text-center">
                <p className="text-lg font-bold text-text">{stat.value}</p>
                <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-4 border border-border">
            <p className="text-sm text-text-secondary italic mb-3">
              &ldquo;I used to spend 20 minutes crafting a single prompt. Now I
              copy from PromptVault and get better results in 10 seconds.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                S
              </div>
              <div>
                <p className="text-xs font-medium text-text">Sahil M.</p>
                <p className="text-[10px] text-text-muted">Marketing Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal accent */}
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-accent/0 via-accent/30 to-accent/0 transform rotate-12 translate-x-20" />
      </div>
    </div>
  );
}
