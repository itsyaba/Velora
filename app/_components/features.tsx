import {
  BadgeCheck,
  Compass,
  Languages,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Languages,
    title: "Bilingual by default",
    body: "Speak Amharic, English, or mix both. The AI keeps up with how Ethiopians actually talk.",
  },
  {
    icon: BadgeCheck,
    title: "Verified providers",
    body: "Every guide, driver, and translator is hand-checked. No bots, no listings without faces.",
  },
  {
    icon: Zap,
    title: "Top 3 in seconds",
    body: "We rank the best matches by language, location, and price — surfaced inside the chat.",
  },
  {
    icon: Wallet,
    title: "Pay later, no upfront",
    body: "Bookings are held as pending until your provider confirms. Settle once you're on the ground.",
  },
  {
    icon: Compass,
    title: "Built for Ethiopia",
    body: "From Lalibela to the Danakil, our coverage and recommendations are tuned for the country.",
  },
  {
    icon: Sparkles,
    title: "Smart intent detection",
    body: "Ask for a driver, log a complaint, or just explore — the concierge knows what you need.",
  },
] as const;

export default function Features() {
  return (
    <section className="relative bg-[#f7f9fc] py-20 sm:py-24">
      <div className="container mx-auto max-w-[100rem] px-5 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[40rem] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e7ebf3] bg-white px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-[#646a76]">
            Why guzoAI
          </span>
          <h2 className="mt-4 text-balance text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-[#090b1a]">
            Built for travel{" "}
            <span className="font-serif italic text-[#2672ff] [font-family:var(--font-cormorant),Georgia,serif]">
              inside
            </span>{" "}
            Ethiopia.
          </h2>
          <p className="mx-auto mt-3 max-w-[34rem] text-sm leading-6 text-[#646a76] sm:text-base">
            Built around the realities of Ethiopian travel — the languages, the
            distances, the providers, and the way bookings actually happen.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#e9edf5] bg-white p-6 shadow-[0_18px_45px_rgba(31,53,92,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(31,53,92,0.08)]"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1f6fff]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-[#090b1a]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#646a76]">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
