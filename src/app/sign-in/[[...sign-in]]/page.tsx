import { SignIn } from "@clerk/nextjs";
import { TerminalAnimation } from "@/components/TerminalAnimation";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: Terminal Animation */}
      <div className="hidden lg:flex flex-1">
        <TerminalAnimation />
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center px-6 py-12 bg-bg-card border-l border-border relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 w-full max-w-sm">
          <div className="mb-8">
            <div className="label-tag mb-6 inline-flex">
              <span className="dot" />
              Authenticate
            </div>
            <h1 className="text-3xl font-bold text-text tracking-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-sm text-text-secondary font-mono">
              Sign in to access your saved prompts.
            </p>
          </div>

          <SignIn
            routing="path"
            path="/sign-in"
          />

          <div className="mt-8 text-center">
            <p className="text-xs font-mono text-text-muted">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="text-accent hover:text-accent-hover transition-colors">
                Create one
              </a>
            </p>
          </div>

          <div className="mt-8 text-center font-mono text-[10px] text-text-muted/30">
            ────────────────
          </div>

          <p className="mt-4 text-center text-[10px] font-mono text-text-muted/50">
            Free forever. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
