"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RotateCcw,
  Download,
  Share2,
  Zap,
} from "lucide-react";

const TOOLS = [
  { id: "ChatGPT", icon: "💬", desc: "Text generation & analysis" },
  { id: "Midjourney", icon: "🎨", desc: "Image generation" },
  { id: "Claude", icon: "🧠", desc: "Analysis & reasoning" },
  { id: "Gemini", icon: "✨", desc: "Multimodal AI" },
  { id: "Copilot", icon: "💻", desc: "Code generation" },
];

const CATEGORIES = [
  "Writing",
  "Marketing",
  "Development",
  "Design",
  "Productivity",
  "Creative",
  "AI & Automation",
  "Video & Film",
  "Business & Finance",
  "Education & Learning",
  "Sales & CRM",
];

const TONES = [
  { id: "Professional", icon: "💼" },
  { id: "Casual", icon: "😊" },
  { id: "Technical", icon: "⚙️" },
  { id: "Creative", icon: "🎨" },
  { id: "Concise", icon: "✂️" },
  { id: "Persuasive", icon: "🎯" },
  { id: "Educational", icon: "📚" },
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Arabic",
];

const EXAMPLES = [
  { tool: "ChatGPT", category: "Marketing", desc: "Write a cold email sequence for my B2B SaaS that helps teams manage remote work. Target audience: CTOs at 50-200 person startups.", tone: "Professional" },
  { tool: "Midjourney", category: "Creative", desc: "A futuristic cyberpunk cityscape at night with neon signs in Japanese, flying cars, rain-slicked streets, and a lone detective silhouette.", tone: "Creative" },
  { tool: "ChatGPT", category: "Resume", desc: "Rewrite my resume bullet points for a Senior Product Manager role at a FAANG company. I have 8 years of experience leading cross-functional teams.", tone: "Professional" },
  { tool: "Claude", category: "Business", desc: "Analyze our competitor's pricing strategy and suggest how we should position our product. We're a project management tool for agencies.", tone: "Technical" },
];

interface HistoryItem {
  id: string;
  tool: string;
  category: string;
  description: string;
  tone: string;
  prompt: string;
  model: string;
  timestamp: number;
}

export default function GeneratorPage() {
  const [tool, setTool] = useState("ChatGPT");
  const [category, setCategory] = useState("Writing");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [remaining, setRemaining] = useState(10);
  const [model, setModel] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("promptvault-history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);

  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev].slice(0, 20); // Keep last 20
      localStorage.setItem("promptvault-history", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      setError("Tell me what you want the prompt to do.");
      return;
    }

    setLoading(true);
    setError("");
    setGenerated("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, category, description, tone, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        if (res.status === 429) setRemaining(0);
        return;
      }

      setGenerated(data.prompt);
      setRemaining(data.remaining);
      setModel(data.model || "");

      // Save to history
      saveToHistory({
        id: Date.now().toString(),
        tool,
        category,
        description,
        tone,
        prompt: data.prompt,
        model: data.model || "",
        timestamp: Date.now(),
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tool, category, description, tone, language, saveToHistory]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompt-${tool.toLowerCase()}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Prompt for ${tool}`,
        text: generated,
      });
    } else {
      await navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadExample = (example: typeof EXAMPLES[0]) => {
    setTool(example.tool);
    setCategory(example.category);
    setDescription(example.desc);
    setTone(example.tone);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setTool(item.tool);
    setCategory(item.category);
    setDescription(item.description);
    setTone(item.tone);
    setGenerated(item.prompt);
    setModel(item.model);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("promptvault-history");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pt-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-8">
        <a href="/" className="hover:text-accent transition-colors">Home</a>
        <span>/</span>
        <span className="text-text">Generator</span>
        {showHistory && (
          <>
            <span>/</span>
            <span className="text-text">History</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <div className="label-tag mb-4 inline-flex">
            <span className="dot" />
            AI Generator
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text tracking-tight mb-2">
            Generate the <span className="text-accent">perfect prompt</span>
          </h1>
          <p className="text-text-secondary max-w-lg">
            Describe what you need. Get a battle-tested prompt in seconds.
            Powered by free AI models — no account required.
          </p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-mono border border-border hover:border-accent hover:text-accent transition-all shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          {showHistory ? "Back" : `History (${history.length})`}
        </button>
      </div>

      {/* History View */}
      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text">Generation History</h2>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-xs font-mono text-text-muted hover:text-error transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-20 border border-border">
                <p className="text-text-muted font-mono text-sm">No history yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-4 bg-bg-card border border-border hover:border-accent/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-bg-elevated border border-border text-text-muted uppercase">
                        {item.tool}
                      </span>
                      <span className="text-xs font-mono text-text-muted">{item.category}</span>
                      <span className="text-[10px] font-mono text-text-muted ml-auto">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-1">{item.description}</p>
                    <p className="text-xs font-mono text-text-muted mt-1 line-clamp-2">{item.prompt}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="generator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Examples */}
            <div className="mb-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                Quick examples
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => loadExample(ex)}
                    className="shrink-0 px-3 py-2 text-xs font-mono border border-border bg-bg-card hover:border-accent/50 hover:text-accent transition-all text-left"
                  >
                    <span className="font-bold">{ex.tool}</span>
                    <span className="text-text-muted mx-1">·</span>
                    <span className="text-text-muted">{ex.desc.slice(0, 40)}...</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Form */}
              <div className="space-y-6">
                {/* Tool Selector */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                    AI Tool
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {TOOLS.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTool(t.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 border transition-all ${
                          tool === t.id
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                        }`}
                      >
                        <span className="text-lg">{t.icon}</span>
                        <span className="text-[10px] font-mono uppercase tracking-wider">{t.id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-3 py-1.5 text-xs font-mono border transition-all ${
                          category === c
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                    What do you want the prompt to do?
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your goal in detail. The more specific, the better the prompt..."
                    rows={5}
                    className="w-full px-4 py-3 bg-bg-card border border-border text-sm text-text placeholder:text-text-muted font-mono focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] font-mono text-text-muted">
                      {description.length} characters
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      Tip: Be specific for better results
                    </span>
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                    Tone
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-all ${
                          tone === t.id
                            ? "border-accent bg-accent/10 text-accent"
                            : "border-border bg-bg-card text-text-secondary hover:border-border-hover"
                        }`}
                      >
                        <span>{t.icon}</span>
                        {t.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted mb-3">
                    Output Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-bg-card border border-border text-sm text-text font-mono focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Generate */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !description.trim() || remaining <= 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent text-white text-sm font-bold uppercase tracking-wider hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Prompt
                    </>
                  )}
                </button>

                {/* Rate Limit */}
                <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>
                    {remaining > 0
                      ? `${remaining} generation${remaining !== 1 ? "s" : ""} left this minute`
                      : "Rate limit reached. Wait a minute."}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 transition-colors ${i < remaining ? "bg-accent" : "bg-border"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Output */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">
                    Generated Prompt
                  </label>
                  {model && !loading && (
                    <span className="text-[10px] font-mono text-text-muted flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {model}
                    </span>
                  )}
                </div>

                <div className="min-h-[400px] bg-bg-card border border-border relative">
                  <AnimatePresence mode="wait">
                    {loading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-6 h-6 text-accent animate-spin" />
                          <span className="text-xs font-mono text-text-muted">
                            Crafting your prompt...
                          </span>
                          <span className="text-[10px] font-mono text-text-muted/60">
                            Trying multiple AI models
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {error && !loading && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-3 text-center px-6">
                          <AlertCircle className="w-6 h-6 text-error" />
                          <span className="text-sm text-error">{error}</span>
                          <button
                            onClick={handleGenerate}
                            className="text-xs font-mono text-accent hover:underline"
                          >
                            Try again
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {generated && !loading && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-success flex items-center gap-1.5">
                            <Check className="w-3 h-3" />
                            Ready to use
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={handleCopy}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border transition-all ${
                                copied
                                  ? "border-success/30 bg-success/10 text-success"
                                  : "border-border hover:border-accent hover:text-accent"
                              }`}
                            >
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                              onClick={handleDownload}
                              className="p-1.5 text-text-muted border border-border hover:border-accent hover:text-accent transition-all"
                              title="Download as text file"
                            >
                              <Download className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleShare}
                              className="p-1.5 text-text-muted border border-border hover:border-accent hover:text-accent transition-all"
                              title="Share"
                            >
                              <Share2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={handleGenerate}
                              className="p-1.5 text-text-muted border border-border hover:border-accent hover:text-accent transition-all"
                              title="Regenerate"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <pre className="text-sm font-mono text-text-secondary whitespace-pre-wrap leading-relaxed prompt-block">
                          {generated}
                        </pre>
                      </motion.div>
                    )}

                    {!generated && !loading && !error && (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="flex flex-col items-center gap-3 text-center px-6">
                          <div className="w-12 h-12 border border-border flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-text-muted" />
                          </div>
                          <span className="text-sm text-text-muted">
                            Your generated prompt will appear here
                          </span>
                          <span className="text-[10px] font-mono text-text-muted/60">
                            Fill in the form and click Generate
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Tips */}
                <AnimatePresence>
                  {generated && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 bg-bg-elevated border border-border"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-wider text-text-muted mb-2">
                        Tips
                      </p>
                      <ul className="space-y-1.5 text-xs text-text-secondary">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-accent shrink-0 mt-1.5" />
                          Replace [BRACKETED] text with your specific details
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-accent shrink-0 mt-1.5" />
                          Click regenerate for a different variation
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-accent shrink-0 mt-1.5" />
                          Adjust tone for different writing styles
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
