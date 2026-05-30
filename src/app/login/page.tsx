import { SignIn } from "@clerk/nextjs";
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
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text tracking-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-sm text-text-secondary">
              Sign in to access your saved prompts and collections.
            </p>
          </div>

          <SignIn
            routing="path"
            path="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-bg-card border border-border shadow-none w-full",
                headerTitle: "text-text text-lg font-bold",
                headerSubtitle: "text-text-secondary text-sm",
                socialButtonsBlockButton: "bg-bg-elevated border border-border text-text hover:border-border-hover",
                socialButtonsBlockButtonText: "text-text-secondary font-mono text-sm",
                dividerLine: "bg-border",
                dividerText: "text-text-muted",
                formFieldLabel: "text-text-muted text-[10px] font-mono uppercase tracking-[0.15em]",
                formFieldInput: "bg-bg-elevated border border-border text-text placeholder:text-text-muted focus:border-accent",
                formButtonPrimary: "bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider",
                footerActionLink: "text-accent hover:text-accent-hover",
                identityPreviewEditButton: "text-accent",
              },
            }}
          />
        </div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-bg-card border-l border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

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
        </div>

        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-accent/0 via-accent/30 to-accent/0 transform rotate-12 translate-x-20" />
      </div>
    </div>
  );
}
