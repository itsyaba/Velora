import { MessageSquareText, Sparkles, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Tell us where",
    body: "Chat with the concierge in Amharic or English. Describe your trip, dates, and who's coming.",
  },
  {
    icon: Sparkles,
    title: "Get matched",
    body: "We surface the top 3 verified guides, drivers, or translators — with prices and languages upfront.",
  },
  {
    icon: CheckCircle2,
    title: "Book in one click",
    body: "Confirm instantly. Your booking goes pending until your provider accepts — no surprises.",
  },
] as const;

export default function HowItWorks() {
  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="container mx-auto max-w-[100rem] px-5 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[40rem] text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e7ebf3] bg-[#f8fafc] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-[#646a76]">
            How it works
          </span>
          <h2 className="mt-4 text-balance text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-[#090b1a]">
            From idea to itinerary in{" "}
            <span className="font-serif italic text-[#2672ff] [font-family:var(--font-cormorant),Georgia,serif]">
              three
            </span>{" "}
            messages.
          </h2>
          <p className="mx-auto mt-3 max-w-[32rem] text-sm leading-6 text-[#646a76] sm:text-base">
            No tabs, no spreadsheets, no waiting on email replies. Just a
            conversation that ends in a confirmed booking.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="group relative flex flex-col rounded-2xl border border-[#e9edf5] bg-white p-6 shadow-[0_18px_45px_rgba(31,53,92,0.04)] transition-shadow hover:shadow-[0_24px_60px_rgba(31,53,92,0.08)]"
              >
                <span className="absolute right-5 top-5 text-xs font-semibold text-[#cdd2dc]">
                  0{index + 1}
                </span>
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1f6fff]">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-[#090b1a]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#646a76]">
                  {step.body}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
