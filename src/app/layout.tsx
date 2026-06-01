import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { GrainOverlay } from "@/components/GrainOverlay";
import { AdSense } from "@/components/AdSense";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PromptVault — AI Prompts That Actually Work",
    template: "%s — PromptVault",
  },
  description:
    "Curated library of 124+ battle-tested AI prompts for ChatGPT, Claude, Gemini, Midjourney, Copilot, DeepSeek and more. 11 categories including AI Automation, Video & Film, Business, Education, and Sales.",
  keywords: ["AI prompts", "ChatGPT prompts", "Midjourney prompts", "Claude prompts", "Gemini prompts", "DeepSeek prompts", "Copilot prompts", "prompt engineering", "AI automation prompts", "video generation prompts"],
  openGraph: {
    title: "PromptVault — AI Prompts That Actually Work",
    description: "Curated library of battle-tested AI prompts. No noise, just results.",
    type: "website",
    siteName: "PromptVault",
  },
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
      <body className="min-h-full flex flex-col bg-bg text-text">
        <CustomCursor />
        <GrainOverlay />
        <Header />
        <div className="w-full flex justify-center bg-bg/80 border-b border-border/40 py-2.5">
          <div className="w-full max-w-7xl px-4">
            <AdSense
              slot="0000000000"
              style={{ display: "block", width: "100%", minHeight: 90 }}
              className="mx-auto"
              format="horizontal"
            />
          </div>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#e8e8e8",
              border: "1px solid #2a2a2a",
              fontFamily: "monospace",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
