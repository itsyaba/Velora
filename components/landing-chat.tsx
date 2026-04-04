"use client";

import { Car, Coffee, Languages, Mic, Moon, Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PENDING_KEY = "velora-landing-prompt";

const QUICK_PROMPTS = [
  { icon: Car, label: "Driver", text: "I need a driver in Addis Ababa today." },
  { icon: Sparkles, label: "Guide", text: "I want a tour guide who speaks English." },
  { icon: Languages, label: "Translator", text: "I need a translator for a meeting." },
  { icon: Moon, label: "Tonight", text: "What can I do tonight in Addis?" },
  { icon: Coffee, label: "Relax", text: "Suggest a spa or relaxing experience nearby." },
] as const;

const Line = ({ className = "" }) => (
  <div
    className={cn(
      "h-px w-full via-zinc-400 from-1% from-zinc-200 to-zinc-600 absolute z-0 dark:via-zinc-700 dark:from-zinc-900 dark:to-zinc-500",
      className,
    )}
  />
);

function OrangeStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 text-orange-500 md:h-7 md:w-7" aria-hidden>
      <path
        fill="currentColor"
        d="M12 1.5l2.2 6.8h7.1l-5.7 4.4 2.2 6.8-6-4.4-6 4.4 2.2-6.8L4.7 8.3h7.1L12 1.5z"
      />
    </svg>
  );
}

type LandingChatProps = {
  isLoggedIn: boolean;
};

export function LandingChat({ isLoggedIn }: LandingChatProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");

  function goWithMessage(text: string) {
    const t = text.trim();
    if (!t) return;
    if (isLoggedIn) {
      router.push(`/concierge?q=${encodeURIComponent(t)}`);
      return;
    }
    try {
      sessionStorage.setItem(PENDING_KEY, t);
    } catch {
      /* ignore */
    }
    router.push(`/login?callbackUrl=${encodeURIComponent("/concierge")}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goWithMessage(value);
    setValue("");
  }

  return (
    <section className={cn("relative flex flex-1 flex-col", "bg-[#faf8f5] dark:bg-zinc-950")}>
      <div className="bg-radial-gradient text-white flex flex-col">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 border border-zinc-800"></div>
        </div>
        <main
          className="relative z-10 flex-1 flex flex-col 
      items-center justify-center px-4 py-16"
        >
          <div
            className="w-full max-w-4xl mx-auto flex flex-col 
        items-center"
          >
            <div className="relative -mt-10 px-14 py-14">
              <Line
                className="left-0 top-2 bg-zinc-700/30 sm:top-4 
            md:top-6"
              />
              <Line
                className="bottom-2 bg-zinc-700/30  sm:bottom-4 
            md:bottom-6 left-0"
              />
              <Line
                className="w-px bg-zinc-700/30  right-2 sm:right-4 
            md:right-6 h-full inset-y-0"
              />
              <Line
                className="w-px bg-zinc-700/30  left-2 sm:left-4 
            md:left-6 h-full inset-y-0"
              />
              <h1
                className="text-4xl dark:from-zinc-400/10 
            dark:via-white/90 dark:to-white/20  bg-linear-to-tr  
            from-black/70 via-black to-black/60 bg-clip-text 
            text-transparent tracking-tighter md:text-5xl lg:text-6xl 
            font-bold text-center mb-"
              >
                Velora
              </h1>
            </div>
          </div>
        </main>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 relative z-999 ">
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {/* <OrangeStar /> */}
            <h1 className="text-center text-[2rem] font-medium leading-tight tracking-tight text-foreground md:text-5xl md:leading-[1.15] [font-family:var(--font-cormorant),ui-serif,Georgia,serif]">
              Where shall we explore?
            </h1>
          </div>
          <p className="max-w-md text-center text-sm text-muted-foreground md:text-base">
            Book guides, drivers, and translators in Ethiopia — in Amharic or English.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={cn(
              "rounded-[1.75rem] border bg-card p-4 shadow-sm md:p-5",
              "border-stone-200/90 dark:border-zinc-800",
              "ring-1 ring-black/3 dark:ring-white/6",
            )}
          >
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="How can I help you today?"
              rows={3}
              className={cn(
                "w-full resize-none border-0 bg-transparent text-base text-foreground outline-none",
                "placeholder:text-muted-foreground/65",
                "focus-visible:ring-0 min-h-22",
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  goWithMessage(value);
                  setValue("");
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

              <div className="flex items-center gap-1 sm:gap-2">
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger
                    size="sm"
                    className="h-9 w-[min(100%,11rem)] rounded-full border-0 bg-muted/50 text-xs shadow-none md:text-sm"
                  >
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                    <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
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

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
          {QUICK_PROMPTS.map(({ icon: Icon, label, text }) => (
            <Button
              key={label}
              type="button"
              variant="secondary"
              size="sm"
              className={cn(
                "h-9 rounded-full border border-border/60 bg-background/80 px-3 text-xs font-normal shadow-sm",
                "hover:bg-muted/80 dark:bg-zinc-900/80",
              )}
              onClick={() => goWithMessage(text)}
            >
              <Icon className="mr-1.5 h-3.5 w-3.5 opacity-70" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
