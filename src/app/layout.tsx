import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GrainOverlay } from "@/components/GrainOverlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PromptVault — AI Prompts That Actually Work",
    template: "%s — PromptVault",
  },
  description:
    "Curated library of 256+ battle-tested AI prompts for ChatGPT, Claude, Gemini, Midjourney, Copilot, DeepSeek and more. 11 categories including AI Automation, Video & Film, Business, Education, and Sales.",
  keywords: [
    "AI prompts",
    "ChatGPT prompts",
    "Midjourney prompts",
    "Claude prompts",
    "Gemini prompts",
    "DeepSeek prompts",
    "Copilot prompts",
    "prompt engineering",
    "AI automation prompts",
    "video generation prompts",
  ],
  openGraph: {
    title: "PromptVault — AI Prompts That Actually Work",
    description: "Curated library of battle-tested AI prompts. No noise, just results.",
    type: "website",
    siteName: "PromptVault",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text overflow-x-hidden">
        {/* Grain overlay for texture */}
        <GrainOverlay />

        {/* Fixed header */}
        <Header />

        {/* Main content area */}
        <main className="flex-1 flex flex-col pt-0">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#131316",
              color: "#f5f5f4",
              border: "1px solid #1f1f24",
              fontFamily: "var(--font-mono)",
              fontSize: "13px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#131316",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#131316",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
