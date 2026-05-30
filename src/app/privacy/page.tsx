import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 pt-24">
      <h1 className="text-3xl font-bold text-text mb-2">Privacy Policy</h1>
      <p className="text-sm text-text-muted mb-10">Last updated: May 30, 2026</p>

      <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text mb-3">1. Information We Collect</h2>
          <p>
            PromptVault collects minimal data necessary to operate the service. When you sign in
            via our authentication provider (Clerk), we receive your email address and basic
            profile information. We do not sell your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">2. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To authenticate your account and save your saved prompts</li>
            <li>To improve our prompt library based on aggregate usage patterns</li>
            <li>To send our weekly newsletter (only if you opt in)</li>
            <li>To display relevant advertisements via Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">3. Cookies & Tracking</h2>
          <p>
            We use cookies for authentication and analytics. Our advertising partner (Google
            AdSense) may also use cookies to serve personalized ads. You can opt out of
            personalized advertising through your browser settings or by visiting{" "}
            <a href="https://adssettings.google.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">4. Third-Party Links</h2>
          <p>
            Our prompt pages contain affiliate links to AI tools (ChatGPT, Midjourney, Claude,
            etc.). Clicking these links may earn us a small commission at no extra cost to you.
            These are the only monetization methods on our site — we do not have premium plans
            or locked content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">5. Data Security</h2>
          <p>
            We use industry-standard security practices. Your authentication is handled by
            Clerk (a SOC 2 compliant service). We do not store passwords or sensitive data
            on our own servers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">6. Children's Privacy</h2>
          <p>
            PromptVault is not directed at children under 13. We do not knowingly collect
            data from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on
            this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">8. Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:hello@promptvault.app" className="text-accent hover:underline">
              hello@promptvault.app
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/" className="text-sm text-text-muted hover:text-accent transition-colors">
          ← Back to PromptVault
        </Link>
      </div>
    </div>
  );
}
