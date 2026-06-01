import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
      <p className="text-sm text-text-muted mb-10">Last updated: May 30, 2026</p>

      <div className="space-y-8">
        {[
          { title: "1. Acceptance of Terms", content: "By accessing and using PromptVault (\"the Service\"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service." },
          { title: "2. Description of Service", content: "PromptVault is a free, curated library of AI prompts for tools like ChatGPT, Midjourney, Claude, Gemini, Copilot, and DeepSeek. All prompts are free to access, copy, and use." },
          { title: "3. Use of Prompts", content: "All prompts on PromptVault are provided for personal and commercial use. You may copy, modify, and use them with any AI tool. We do not guarantee specific results — AI outputs vary by model, settings, and input data." },
          { title: "4. Affiliate Links", content: "Some pages contain affiliate links to third-party AI tools. We may earn a small commission when you sign up through these links, at no extra cost to you. This is one of our two monetization methods (alongside Google AdSense)." },
          { title: "5. Intellectual Property", content: "The PromptVault brand, design, and website code are proprietary. Individual prompts are provided as-is for public use. You may not scrape, redistribute, or resell the prompt library as a competing product." },
          { title: "6. Disclaimer", content: "The Service is provided \"as is\" without warranties of any kind. We do not guarantee uptime, accuracy of prompts, or specific AI outputs. We are not responsible for any outcomes resulting from the use of prompts on this site." },
          { title: "7. Limitation of Liability", content: "PromptVault shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service." },
          { title: "8. Changes to Terms", content: "We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms." },
        ].map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-text mb-3">{section.title}</h2>
            <p className="body">{section.content}</p>
          </section>
        ))}
      </div>

      <div className="divider mt-12 pt-8">
        <Link href="/" className="text-sm text-text-muted hover:text-accent transition-colors">
          ← Back to PromptVault
        </Link>
      </div>
    </div>
  );
}
