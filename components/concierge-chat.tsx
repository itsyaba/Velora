"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Plus,
  PanelLeft,
  Search,
  Settings,
  ChevronDown,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  AudioLines,
  ArrowUp,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTextFromUIMessage } from "@/lib/message-text";
import type { ProviderSuggestion } from "@/lib/provider-query";

export type ConciergeUIMessage = UIMessage<
  unknown,
  { suggestions: ProviderSuggestion[] }
>;

const SESSION_KEY = "guzoai-concierge-session";
const LANDING_PROMPT_KEY = "guzoai-landing-prompt";

export function ConciergeChat({
  initialPrompt: initialFromUrl,
  language = "en",
}: {
  initialPrompt?: string;
  language?: string;
}) {
  const [ready, setReady] = useState(false);
  const [chatId, setChatId] = useState("");
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>();

  useEffect(() => {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    setChatId(id);

    const pending = sessionStorage.getItem(LANDING_PROMPT_KEY);
    if (pending) sessionStorage.removeItem(LANDING_PROMPT_KEY);

    const merged =
      initialFromUrl?.trim() ||
      pending?.trim() ||
      undefined;
    setInitialPrompt(merged);

    setReady(true);
  }, [initialFromUrl]);

  if (!ready) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-pulse h-8 w-8 rounded-full bg-muted" />
      </div>
    );
  }

  return (
    <ConciergeChatInner chatId={chatId} initialPrompt={initialPrompt} language={language} />
  );
}

function ConciergeChatInner({
  chatId,
  initialPrompt,
  language,
}: {
  chatId: string;
  initialPrompt?: string;
  language: string;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ProviderSuggestion[]>([]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<ConciergeUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: { messages, sessionId: id, lang: language },
        }),
      }),
    [language],
  );

  const { messages, sendMessage, status, stop, error } =
    useChat<ConciergeUIMessage>({
      id: chatId,
      transport,
      onData: (part) => {
        if (part.type === "data-suggestions") {
          setSuggestions(part.data);
        }
      },
    });

  const sentInitialRef = useRef(false);

  useEffect(() => {
    const t = initialPrompt?.trim();
    if (!t || sentInitialRef.current) return;
    sentInitialRef.current = true;
    void sendMessage({ text: t });
  }, [initialPrompt, sendMessage]);

  const busy = status === "submitted" || status === "streaming";

  async function requestBooking(providerId: string) {
    try {
      const scheduledAt = new Date(Date.now() + 86400000).toISOString(); // Default to tomorrow
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, scheduledAt, notes: "Booked via Concierge" }),
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? res.statusText);
      }
      toast.success("Request sent successfully");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Booking failed");
    }
  }

  return (
    <div className="flex h-dvh w-full bg-[#FCFCFC] text-sm font-sans relative overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-[60px] flex-col justify-between items-center py-4 bg-[#F9F9F9] border-r border-[#E5E5E5] shrink-0">
        <div className="flex flex-col gap-5 items-center text-[#666666]">
          <button className="p-1 hover:text-black hover:bg-[#E5E5E5] rounded-md transition-colors">
            <PanelLeft className="h-[18px] w-[18px]" />
          </button>
          <button className="p-[3px] border border-[#d4d4d4] rounded-full hover:text-black hover:border-black transition-colors">
            <Plus className="h-[12px] w-[12px]" />
          </button>
          <button className="p-1 hover:text-black transition-colors rounded-md hover:bg-[#E5E5E5]">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button className="p-1 hover:text-black transition-colors rounded-md hover:bg-[#E5E5E5]">
            <Settings className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="flex flex-col gap-5 items-center text-[#666666]">
          <button className="h-8 w-8 rounded-full bg-[#464542] text-white flex items-center justify-center text-[13px] font-medium shrink-0">
            Y
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white relative max-w-full">
        {/* Header */}
        <header className="absolute top-0 right-0 left-0 h-[52px] flex items-center justify-between px-4 z-10 bg-white">
          <button className="flex items-center gap-1.5 text-[15px] font-medium text-[#333333] hover:bg-[#F3F3F3] px-2.5 py-1.5 rounded-md transition-colors">
            AI Concierge <ChevronDown className="h-[14px] w-[14px] text-[#999999]" />
          </button>
          
          <button className="border border-[#E5E5E5] px-3.5 py-1.5 rounded-lg text-[13px] font-medium text-[#333333] hover:bg-[#F9F9F9] transition-colors shadow-sm">
            Share
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scroll-smooth">
          <div className="max-w-[800px] mx-auto w-full px-5 md:px-8 pt-[72px] pb-[180px] flex flex-col gap-[32px]">
            {messages.length === 0 && !busy && (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center opacity-0"></div>
            )}
            
            {messages.map((m) => (
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end group pl-10">
                  <div className="bg-[#F3F3F3] text-[#111111] px-5 py-3 rounded-[24px] whitespace-pre-wrap text-[15px] leading-relaxed max-w-[80%] inline-block">
                    {getTextFromUIMessage(m)}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start group overflow-hidden">
                  <div className="max-w-[100%] text-[#111111] leading-[1.6] flex flex-col items-start gap-3 w-full">
                    <div className="markdown-container">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {getTextFromUIMessage(m)}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#999999] opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-[#F4F4F4] hover:text-[#333333] rounded-md transition-colors" title="Copy"><Copy className="h-[15px] w-[15px]" /></button>
                      <button className="p-1.5 hover:bg-[#F4F4F4] hover:text-[#333333] rounded-md transition-colors" title="Good response"><ThumbsUp className="h-[15px] w-[15px]" /></button>
                      <button className="p-1.5 hover:bg-[#F4F4F4] hover:text-[#333333] rounded-md transition-colors" title="Bad response"><ThumbsDown className="h-[15px] w-[15px]" /></button>
                      <button className="p-1.5 hover:bg-[#F4F4F4] hover:text-[#333333] rounded-md transition-colors" title="Retry"><RotateCcw className="h-[15px] w-[15px]" /></button>
                    </div>
                  </div>
                </div>
              )
            ))}

            {busy && (
              <div className="flex justify-start items-center gap-2 pt-2">
                <svg className="animate-spin h-6 w-6 text-[#D2765A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20" />
                  <path d="M2 12h20" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <path d="m19.07 4.93-14.14 14.14" />
                </svg>
              </div>
            )}

            {error && (
              <div className="flex justify-start pt-2">
                <p className="text-[15px] text-destructive">{error.message}</p>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="bg-[#F8F9FA] border border-[#E5E5E5] rounded-xl px-5 py-4 w-full flex flex-col gap-3">
                <p className="text-[12px] font-semibold text-[#666666] tracking-wider uppercase">
                  Top matches
                </p>
                <div className="grid gap-3">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="flex flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-[15px] text-[#111111]">{s.name}</p>
                        <p className="text-[13px] text-[#666666] capitalize font-medium">
                          {s.category} • {s.languages.join(", ")}
                        </p>
                        <p className="text-[14px] text-[#444444] mt-1 leading-relaxed max-w-[500px]">
                          {s.description}
                        </p>
                        <p className="text-[14px] font-semibold text-[#111111] mt-1">
                          {s.price} ETB
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          className="bg-[#111111] text-white hover:bg-[#333333] transition-colors rounded-lg font-medium"
                          disabled={busy}
                          onClick={() => requestBooking(s.id)}
                        >
                          Book Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg font-medium text-[#333333] border-[#E5E5E5]"
                          disabled={busy}
                          onClick={() => requestBooking(s.id)}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input section fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/0 pt-16 pb-4">
          <div className="max-w-[800px] mx-auto w-full px-4 md:px-8">
            <form
              className="flex flex-col bg-white border border-[#E1E1E1] rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)] focus-within:border-[#D4D4D4] transition-all duration-200 overflow-hidden"
              onSubmit={(e) => {
                e.preventDefault();
                const t = input.trim();
                if (!t || busy) return;
                setInput("");
                setSuggestions([]);
                void sendMessage({ text: t });
              }}
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Reply..."
                className="min-h-[52px] px-4 pt-3.5 pb-2 resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent text-[16px] placeholder:text-[#999999]"
                rows={1}
                disabled={busy}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const t = input.trim();
                    if (!t || busy) return;
                    setInput("");
                    setSuggestions([]);
                    void sendMessage({ text: t });
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-2 pt-1">
                <button 
                  type="button" 
                  className="p-1.5 rounded-full text-[#666666] hover:bg-[#F3F3F3] hover:text-[#111111] transition-colors shrink-0"
                >
                  <Plus className="h-[18px] w-[18px]" />
                </button>
                <div className="flex items-center gap-1">
                  <div className="w-1" />
                  
                  {!input.trim() && !busy ? (
                    <button 
                      type="button" 
                      className="p-1.5 rounded-full text-[#666666] hover:bg-[#F3F3F3] hover:text-[#111111] transition-colors ml-1"
                    >
                      <AudioLines className="h-[18px] w-[18px]" />
                    </button>
                  ) : (
                    <button 
                      type={busy ? "button" : "submit"} 
                      onClick={busy ? () => stop() : undefined} 
                      className="w-8 h-8 rounded-full bg-[#111111] text-white flex justify-center items-center hover:bg-[#333333] transition-colors shrink-0 ml-2"
                    >
                      {busy ? (
                        <div className="h-3 w-3 bg-white rounded-sm" />
                      ) : (
                        <ArrowUp className="h-[18px] w-[18px] stroke-[2.5]" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>
            <div className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
