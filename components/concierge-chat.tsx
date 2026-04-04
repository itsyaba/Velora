"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2, MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getTextFromUIMessage } from "@/lib/message-text";
import type { ProviderSuggestion } from "@/lib/provider-query";
import { cn } from "@/lib/utils";

export type ConciergeUIMessage = UIMessage<
  unknown,
  { suggestions: ProviderSuggestion[] }
>;

const SESSION_KEY = "velora-concierge-session";
const LANDING_PROMPT_KEY = "velora-landing-prompt";

export function ConciergeChat({
  initialPrompt: initialFromUrl,
}: {
  initialPrompt?: string;
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
      <div className="flex h-[min(100dvh,720px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ConciergeChatInner chatId={chatId} initialPrompt={initialPrompt} />
  );
}

function ConciergeChatInner({
  chatId,
  initialPrompt,
}: {
  chatId: string;
  initialPrompt?: string;
}) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<ProviderSuggestion[]>([]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport<ConciergeUIMessage>({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ id, messages }) => ({
          body: { messages, sessionId: id },
        }),
      }),
    [],
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
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
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
    <div className="flex flex-col gap-4 h-[min(100dvh,800px)] max-w-3xl mx-auto w-full px-3 py-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        <div>
          <h1 className="text-xl font-semibold tracking-tight">AI Concierge</h1>
          <p className="text-sm text-muted-foreground">
            Amharic & English · guides, drivers, translators, experiences
          </p>
        </div>
      </div>

      <Card className="flex flex-1 flex-col min-h-0 border shadow-sm">
        <CardHeader className="py-3 border-b">
          <p className="text-sm text-muted-foreground">
            Ask for a driver, say you’re bored tonight, or request a translator.
          </p>
        </CardHeader>
        <CardContent className="flex-1 p-0 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 h-[420px] px-4">
            <div className="space-y-4 py-4">
              {messages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Start typing below — Velora will clarify and suggest local
                  options.
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex",
                    m.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted",
                    )}
                  >
                    {getTextFromUIMessage(m)}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Velora is thinking…
                </div>
              )}
              {error && (
                <p className="text-sm text-destructive">{error.message}</p>
              )}
            </div>
          </ScrollArea>

          {suggestions.length > 0 && (
            <div className="border-t px-4 py-3 space-y-2 bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Top matches
              </p>
              <div className="grid gap-2 sm:grid-cols-1">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    className="flex flex-col gap-2 rounded-md border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {s.category} · {s.languages.join(", ")}
                      </p>
                      <p className="text-xs mt-1 line-clamp-2">{s.description}</p>
                      <p className="text-sm font-semibold mt-1">
                        {s.price} ETB
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="default"
                        type="button"
                        disabled={busy}
                        onClick={() => requestBooking(s.id)}
                      >
                        Book
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={busy}
                        onClick={() => requestBooking(s.id)}
                      >
                        Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2 border-t pt-4">
          <form
            className="flex w-full gap-2"
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
              placeholder="Try English or አማርኛ…"
              className="min-h-[44px] resize-none"
              rows={2}
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
            <div className="flex flex-col gap-2">
              {busy ? (
                <Button type="button" variant="secondary" onClick={() => stop()}>
                  Stop
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
