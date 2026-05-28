import type { LucideIcon } from "lucide-react";
import { Car, Coffee, Languages, Moon, Sparkles } from "lucide-react";

export const LANDING_PROMPT_KEY = "guzoai-landing-prompt";

export const QUICK_PROMPTS: ReadonlyArray<{
  icon: LucideIcon;
  label: string;
  text: string;
}> = [
  { icon: Car, label: "Driver", text: "I need a driver in Addis Ababa today." },
  { icon: Sparkles, label: "Guide", text: "I want a tour guide who speaks English." },
  { icon: Languages, label: "Translator", text: "I need a translator for a meeting." },
  { icon: Moon, label: "Tonight", text: "What can I do tonight in Addis?" },
  { icon: Coffee, label: "Relax", text: "Suggest a relaxing experience nearby." },
];
