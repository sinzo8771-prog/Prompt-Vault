import { AuthForm } from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your PromptVault account and start using better AI prompts.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 pt-24">
        <AuthForm mode="signup" />
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
            Get Started
          </div>

          <h2 className="text-3xl font-bold text-text tracking-tight mb-4 leading-tight">
            Join 10,000+<br />
            <span className="text-accent">prompt engineers.</span>
          </h2>

          <p className="text-sm text-text-secondary mb-8 leading-relaxed">
            Create your free account to save prompts, build collections, and
            get weekly curated prompts delivered to your inbox.
          </p>

          {/* What you get */}
          <div className="space-y-3 mb-8">
            {[
              "Save unlimited prompts to your library",
              "Copy prompts with one click",
              "Get weekly curated prompt emails",
              "Access to community submissions",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <span className="w-1 h-1 bg-accent shrink-0 mt-2" />
                <p className="text-sm text-text-secondary">{feature}</p>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-text">Free Forever</span>
              <span className="text-[10px] font-mono text-accent uppercase tracking-wider">No credit card</span>
            </div>
            <p className="text-xs text-text-muted">
              Start with full access to all prompts. No limits, no
              paywalls.
            </p>
          </div>
        </div>

        {/* Diagonal accent */}
        <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-accent/0 via-accent/30 to-accent/0 transform rotate-12 translate-x-20" />
      </div>
    </div>
  );
}
