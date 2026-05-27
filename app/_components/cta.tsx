import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative bg-background py-20 sm:py-24">
      <div className="container mx-auto max-w-[100rem] px-5 md:px-14 lg:px-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1f6fff] via-[#2672ff] to-[#175edb] px-6 py-14 text-center shadow-[0_30px_80px_rgba(31,111,255,0.28)] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-[40rem]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-white backdrop-blur">
              Ready when you are
            </span>
            <h2 className="mt-5 text-balance text-[clamp(1.9rem,3.2vw,2.8rem)] font-semibold leading-tight tracking-tight text-white">
              Your Ethiopia trip,{" "}
              <span className="font-serif italic text-white/90 [font-family:var(--font-cormorant),Georgia,serif]">
                one chat
              </span>{" "}
              away.
            </h2>
            <p className="mx-auto mt-4 max-w-[32rem] text-sm leading-6 text-white/85 sm:text-base">
              Start with a sentence. End with a booking. No credit card needed
              to try the concierge.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href={isLoggedIn ? "/concierge" : "/signup"}>
                <Button
                  size="lg"
                  className="h-12 rounded-full bg-white px-6 text-sm font-semibold text-[#1f6fff] shadow-[0_14px_32px_rgba(0,0,0,0.16)] hover:bg-white/90"
                >
                  {isLoggedIn ? "Open concierge" : "Start for free"}
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </Link>
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="text-sm font-medium text-white/85 underline-offset-4 hover:underline"
                >
                  I already have an account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
