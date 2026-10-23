"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot, ArrowRight, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const starterPrompts = [
  "What is included in Business Pro?",
  "How much is Custom Software?",
  "How do studio sprints work?",
  "What services do you offer?",
];

export function StudioChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to OKIKE Studio. I'm your grounded AI guide. Ask me anything about our design systems, pricing in Naira, technical stack, or project sprints.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Studio AI is momentarily busy.");
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm momentarily having trouble connecting. You can also reach our studio partners directly at studio@okike.com or submit a brief at /enquiry.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="Studio AI Assistant" className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-3 border border-ink/20 shadow-2xl transition-all duration-200 cursor-pointer"
          aria-label="Open OKIKE Studio AI Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime group-hover:bg-ink opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime group-hover:bg-ink"></span>
          </span>
          <Sparkles className="h-4 w-4" />
          <span className="text-xs uppercase font-extrabold tracking-wider">Studio AI</span>
        </button>
      )}

      {/* Chat Popover Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-[#0e0e0e] text-[#f5f5f0] border-2 border-[#404040] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#333] bg-[#141414]">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-lime text-ink flex items-center justify-center font-extrabold text-[11px]">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">OKIKE Studio AI</h3>
                <p className="text-[10px] text-lime font-mono">Grounded · Gemini 3.5 Flash</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#888] hover:text-white p-1 cursor-pointer transition-colors"
              aria-label="Close Assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages scroll area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs text-[#e0e0dc]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-start gap-2`}
              >
                {m.role === "assistant" && (
                  <div className="size-5 shrink-0 bg-lime/20 text-lime flex items-center justify-center mt-0.5">
                    <Bot className="h-3 w-3" />
                  </div>
                )}
                <div
                  className={`p-3 max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-lime text-ink font-semibold ml-4"
                      : "bg-[#1c1c1c] text-[#f0f0eb] border border-[#333]"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[#888] text-[11px] font-mono">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-lime" />
                <span>Consulting studio knowledge base…</span>
              </div>
            )}
          </div>

          {/* Quick starter prompts */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#222] bg-[#141414]/50 flex flex-wrap gap-1.5">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="text-[10px] bg-[#222] hover:bg-lime hover:text-ink text-[#bbb] px-2.5 py-1 border border-[#333] transition-colors cursor-pointer text-left font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-[#333] bg-[#141414] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about packages, pricing or stack…"
              disabled={isLoading}
              className="flex-1 bg-[#1e1e1e] border border-[#3a3a3a] px-3 py-2 text-xs text-white placeholder-[#777] outline-none focus:border-lime"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-lime text-ink hover:bg-white px-3 py-2 text-xs font-bold transition-colors disabled:opacity-40 cursor-pointer flex items-center justify-center"
              aria-label="Send Message"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Bottom Direct CTA */}
          <div className="px-4 py-2 bg-[#0a0a0a] border-t border-[#222] flex items-center justify-between text-[10px] text-[#888]">
            <span>Ready to start?</span>
            <Link
              href="/enquiry"
              onClick={() => setIsOpen(false)}
              className="text-lime hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>Submit Project Brief</span>
              <ArrowRight className="h-2.5 w-2.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
