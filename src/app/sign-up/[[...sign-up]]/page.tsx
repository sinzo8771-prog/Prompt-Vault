import { SignUp } from "@clerk/nextjs";
import { TerminalAnimation } from "@/components/TerminalAnimation";

export default function SignUpPage() {
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
              Register
            </div>
            <h1 className="text-3xl font-bold text-text tracking-tight mb-2">
              Create your account.
            </h1>
            <p className="text-sm text-text-secondary font-mono">
              Join 10,000+ prompt engineers.
            </p>
          </div>

          <SignUp
            routing="path"
            path="/sign-up"
          />

          <div className="mt-8 space-y-2">
            {[
              "Save unlimited prompts to your library",
              "Copy prompts with one click",
              "Get weekly curated prompt emails",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-accent shrink-0" />
                <p className="text-xs font-mono text-text-muted">{feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-mono text-text-muted">
              Already have an account?{" "}
              <a href="/sign-in" className="text-accent hover:text-accent-hover transition-colors">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-8 text-center font-mono text-[10px] text-text-muted/30">
            ────────────────
          </div>

          <p className="mt-4 text-center text-[10px] font-mono text-text-muted/50">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
