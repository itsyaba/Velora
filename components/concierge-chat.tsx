"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  ArrowUp,
  Car,
  Coffee,
  Languages,
  Mic,
  Moon,
  Plus,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTextFromUIMessage } from "@/lib/message-text";
import type { ProviderSuggestion } from "@/lib/provider-query";
import { cn } from "@/lib/utils";

export type ConciergeUIMessage = UIMessage<
  unknown,
  { suggestions: ProviderSuggestion[] }
>;

const SESSION_KEY = "guzoai-concierge-session";
const LANDING_PROMPT_KEY = "guzoai-landing-prompt";
const QUICK_PROMPTS = [
  { icon: Car, label: "Driver", text: "I need a driver in Addis Ababa today." },
  { icon: Sparkles, label: "Guide", text: "I want a tour guide who speaks English." },
  { icon: Languages, label: "Translator", text: "I need a translator for a meeting." },
  { icon: Moon, label: "Tonight", text: "What can I do tonight in Addis?" },
  { icon: Coffee, label: "Relax", text: "Suggest a relaxing experience nearby." },
] as const;

function FrameLine({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "absolute bg-gradient-to-r from-transparent via-zinc-300 to-transparent dark:via-zinc-700",
        className,
      )}
    />
  );
}

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
  const router = useRouter();
  const pathname = usePathname();
  const isChatPage = pathname === "/concierge/chat";
  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [suggestions, setSuggestions] = useState<ProviderSuggestion[]>([]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<ConciergeUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: { messages, sessionId: id, lang: selectedLanguage },
        }),
      }),
    [selectedLanguage],
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

  function submitPrompt(text: string) {
    const t = text.trim();
    if (!t || busy) return;

    if (!isChatPage) {
      router.push(
        `/concierge/chat?q=${encodeURIComponent(t)}&lang=${encodeURIComponent(selectedLanguage)}`,
      );
      return;
    }

    setInput("");
    setSuggestions([]);
    void sendMessage({ text: t });
  }

  return (
    <section className="relative flex min-h-dvh w-full flex-1 flex-col bg-[#faf8f5] dark:bg-zinc-950">
      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col px-4 py-10 md:px-8",
          isChatPage ? "max-w-6xl" : "max-w-4xl",
        )}
      >
        {!isChatPage && (
        <div className="mb-10 flex flex-col items-center">
          <div className="relative px-10 py-8">
            <FrameLine className="left-0 top-1 h-px w-full" />
            <FrameLine className="bottom-1 left-0 h-px w-full" />
            <div className="absolute inset-y-0 left-1 w-px bg-gradient-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
            <div className="absolute inset-y-0 right-1 w-px bg-gradient-to-b from-transparent via-zinc-300 to-transparent dark:via-zinc-700" />
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Guzo AI
            </h1>
          </div>
        </div>
        )}

        {!isChatPage && (
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <h2 className="text-[2.3rem] leading-tight text-foreground [font-family:var(--font-cormorant),ui-serif,Georgia,serif] md:text-5xl">
            Where shall we explore?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            Book guides, drivers, and translators in Ethiopia — in Amharic or English.
          </p>
        </div>
        )}

        <ScrollArea className="min-h-0 flex-1">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-6">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[82%] rounded-3xl bg-zinc-200 px-5 py-3 text-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                    {getTextFromUIMessage(m)}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3">
                  <div className="markdown-container text-foreground">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getTextFromUIMessage(m)}
                    </ReactMarkdown>
                  </div>
                </div>
              ),
            )}

            {busy && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:120ms]" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-muted-foreground [animation-delay:240ms]" />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error.message}</p>}

            {suggestions.length > 0 && (
              <div className="rounded-2xl border border-border bg-card/80 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top matches
                </p>
                <div className="grid gap-3">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-xl border border-border bg-background/70 p-4"
                    >
                      <div className="mb-1 text-sm font-semibold text-foreground">{s.name}</div>
                      <p className="text-xs text-muted-foreground capitalize">
                        {s.category} • {s.languages.join(", ")}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-foreground">{s.price} ETB</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="rounded-lg"
                            disabled={busy}
                            onClick={() => requestBooking(s.id)}
                          >
                            Book now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            disabled={busy}
                            onClick={() => requestBooking(s.id)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mx-auto mt-4 w-full max-w-3xl">
          <form onSubmit={(e) => { e.preventDefault(); submitPrompt(input); }}>
            <div className="rounded-[1.75rem] border border-stone-200/90 bg-card p-4 shadow-sm ring-1 ring-black/3 dark:border-zinc-800 dark:ring-white/6 md:p-5">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can I help you today?"
                rows={3}
                className="min-h-24 w-full resize-none border-0 bg-transparent text-base text-foreground shadow-none outline-none placeholder:text-muted-foreground/65 focus-visible:ring-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submitPrompt(input);
                  }
                }}
              />

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/50 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Add attachment"
                  disabled
                >
                  <Plus className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-2">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger
                      size="sm"
                      className="h-9 w-[11rem] rounded-full border-0 bg-muted/50 text-xs shadow-none md:text-sm"
                    >
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="am">Amharic</SelectItem>
                      <SelectItem value="both">Amharic + English</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-muted-foreground"
                    aria-label="Voice input (coming soon)"
                    disabled
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    type={busy ? "button" : "submit"}
                    onClick={busy ? () => stop() : undefined}
                    size="icon"
                    className="h-9 w-9 rounded-full bg-foreground text-background hover:opacity-90"
                    aria-label={busy ? "Stop generating" : "Send message"}
                  >
                    {busy ? (
                      <span className="h-3 w-3 rounded-sm bg-current" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground md:text-left">
              Press{" "}
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[0.65rem]">
                Enter
              </kbd>{" "}
              to send · Sign in if you haven&apos;t yet
            </p>
          </form>

          {!isChatPage && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
              <Button
                key={label}
                type="button"
                variant="secondary"
                size="sm"
                className="h-9 rounded-full border border-border/60 bg-background/80 px-3 text-xs font-normal shadow-sm hover:bg-muted/80 dark:bg-zinc-900/80"
                onClick={() => submitPrompt(text)}
              >
                <Icon className="mr-1.5 h-3.5 w-3.5 opacity-70" />
                {label}
              </Button>
            ))}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
