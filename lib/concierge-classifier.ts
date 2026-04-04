import { z } from "zod";

export const classificationSchema = z.object({
  intent: z.enum([
    "service_request",
    "complaint",
    "exploration",
    "on_demand",
  ]),
  category: z.enum([
    "guide",
    "driver",
    "translator",
    "experience",
    "spa",
    "resort",
    "other",
  ]),
  needsClarification: z.boolean(),
  clarificationHint: z.string().optional(),
});

export type Classification = z.infer<typeof classificationSchema>;

export const classifierSystem = `You classify user messages for Velora, an AI travel concierge in Ethiopia (Amharic + English).
Return JSON matching the schema for the latest user turn in context.

intent:
- service_request: needs a driver, guide, translator, transfer, booking
- complaint: room cold, bad service, problem with hotel or experience
- exploration: what to do tonight, bored, ideas, culture vs nightlife
- on_demand: urgent help, translation session, immediate guide

category: best marketplace match — guide, driver, translator, experience, spa, resort, or other.

needsClarification: true only when you must ask ONE short question to pick category or style (e.g. cultural vs nightlife). Optional clarificationHint in English.`;

export function buildConciergeSystem(
  c: Classification,
  suggestionLines: string[],
): string {
  if (c.needsClarification) {
    return `You are Velora — warm, concise bilingual concierge (Amharic + English) for travelers in Ethiopia.
Ask exactly ONE short clarifying question. Hint: ${c.clarificationHint ?? "narrow what they want"}. Do not list providers yet.`;
  }

  const lines =
    suggestionLines.length > 0
      ? `\nReference these real listings (do not invent names or prices):\n${suggestionLines.join("\n")}`
      : "";

  return `You are Velora — warm bilingual concierge (Amharic + English) for Ethiopia.
User intent: ${c.intent}. Category focus: ${c.category}.
Reply helpfully and concisely. Match the user's language (Amharic, English, or mixed).
${c.intent === "complaint" ? "Acknowledge the issue; offer practical next steps; do not hard-sell bookings." : ""}
${lines}`;
}
