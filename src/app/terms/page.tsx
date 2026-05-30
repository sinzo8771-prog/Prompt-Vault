import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 pt-24">
      <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
      <p className="text-sm text-text-muted mb-10">Last updated: May 30, 2026</p>

      <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using PromptVault ("the Service"), you agree to be bound by these
            Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">2. Description of Service</h2>
          <p>
            PromptVault is a free, curated library of AI prompts for tools like ChatGPT,
            Midjourney, Claude, Gemini, Copilot, and DeepSeek. All prompts are free to access,
            copy, and use. We do not offer premium tiers or locked content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">3. Use of Prompts</h2>
          <p>
            All prompts on PromptVault are provided for personal and commercial use. You may
            copy, modify, and use them with any AI tool. We do not guarantee specific results
            — AI outputs vary by model, settings, and input data. Use prompts at your own
            discretion.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">4. Affiliate Links</h2>
          <p>
            Some pages contain affiliate links to third-party AI tools. We may earn a small
            commission when you sign up through these links, at no extra cost to you. This is
            one of our two monetization methods (alongside Google AdSense). We clearly
            disclose affiliate relationships.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">5. User Accounts</h2>
          <p>
            Account creation is optional and only required for saving prompts. You are
            responsible for maintaining the security of your account. Do not share your
            credentials with others.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">6. Intellectual Property</h2>
          <p>
            The PromptVault brand, design, and website code are proprietary. Individual
            prompts are provided as-is for public use. You may not scrape, redistribute, or
            resell the prompt library as a competing product.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">7. Disclaimer</h2>
          <p>
            The Service is provided "as is" without warranties of any kind. We do not guarantee
            uptime, accuracy of prompts, or specific AI outputs. We are not responsible for
            any outcomes resulting from the use of prompts on this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">8. Limitation of Liability</h2>
          <p>
            PromptVault shall not be liable for any indirect, incidental, or consequential
            damages arising from your use of the Service or any AI tool prompted by our content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the
            Service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text mb-3">10. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
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
