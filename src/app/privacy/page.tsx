import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24 pt-32">
      <ScrollReveal>
        <div className="mb-12">
          <p className="label mb-3">Legal</p>
          <h1 className="display-2 mb-4">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="body-lg">Last updated: May 30, 2026</p>
        </div>
      </ScrollReveal>

      <div className="space-y-10">
        {[
          { title: "1. Information We Collect", content: "PromptVault collects minimal data necessary to operate the service. We do not sell your personal data to third parties." },
          { title: "2. How We Use Your Data", content: "We use data to improve our prompt library based on aggregate usage patterns, to send our weekly newsletter (only if you opt in), and to display relevant advertisements via Google AdSense." },
          { title: "3. Cookies & Tracking", content: "We use cookies for functionality and analytics. Our advertising partner (Google AdSense) may also use cookies to serve personalized ads. You can opt out of personalized advertising through your browser settings." },
          { title: "4. Third-Party Links", content: "Our prompt pages contain affiliate links to AI tools (ChatGPT, Midjourney, Claude, etc.). Clicking these links may earn us a small commission at no extra cost to you." },
          { title: "5. Data Security", content: "We use industry-standard security practices. We do not store passwords or sensitive data on our own servers." },
          { title: "6. Children's Privacy", content: "PromptVault is not directed at children under 13. We do not knowingly collect data from children under 13." },
          { title: "7. Changes to This Policy", content: "We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date." },
          { title: "8. Contact", content: "For privacy-related questions, contact us at hello@promptvault.app" },
        ].map((section, i) => (
          <ScrollReveal key={section.title} delay={i * 40}>
            <section>
              <h2 className="heading-lg mb-3">{section.title}</h2>
              <div className="divider mb-5" />
              <p className="body">{section.content}</p>
            </section>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={100}>
        <div className="divider mt-16 mb-8" />
        <Link href="/" className="btn-ghost inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to PromptVault
        </Link>
      </ScrollReveal>
    </div>
  );
}
