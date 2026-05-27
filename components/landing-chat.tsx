"use client";

import {
  BatteryFull,
  CalendarDays,
  Languages,
  MapPin,
  Send,
  ShieldCheck,
  Signal,
  UsersRound,
  Wifi,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type LandingChatProps = {
  isLoggedIn: boolean;
};

// Picsum photos are always available — IDs chosen for landscape/nature look
const SIDE_TRIPS = [
  {
    city: "Simien Mts.",
    country: "Ethiopia",
    dates: "Apr 30 - May 5",
    image:
      "https://images.pexels.com/photos/10502569/pexels-photo-10502569.jpeg",
    className:
      "left-[10%] top-[6.5rem] z-20 hidden h-[17rem] w-[11.5rem] -rotate-[3deg] md:block lg:left-[14%]",
  },
  {
    city: "Danakil",
    country: "Ethiopia",
    dates: "May 2 - May 7",
    image:
      "https://images.pexels.com/photos/5966509/pexels-photo-5966509.jpeg",
    className:
      "right-[10%] top-[6.5rem] z-20 hidden h-[17rem] w-[11.5rem] rotate-[3deg] md:block lg:right-[14%]",
  },
] as const;

const GHOST_TRIPS = [
  {
    city: "Harar",
    image:
      "https://images.pexels.com/photos/37087442/pexels-photo-37087442.jpeg",
    className: "left-[1%] top-[8rem] -rotate-[6deg] lg:left-[4%]",
  },
  {
    city: "Omo Valley",
    image:
      "https://images.pexels.com/photos/33763173/pexels-photo-33763173.jpeg",
    className: "right-[1%] top-[8rem] rotate-[6deg] lg:right-[4%]",
  },
] as const;

function goToNext(
  router: ReturnType<typeof useRouter>,
  isLoggedIn: boolean,
  prompt: string,
) {
  const trimmed = prompt.trim();
  const qs = trimmed ? `?prompt=${encodeURIComponent(trimmed)}` : "";
  router.push(isLoggedIn ? `/concierge${qs}` : `/signup${qs}`);
}

function TripCard({ trip }: { trip: (typeof SIDE_TRIPS)[number] }) {
  return (
    <article
      className={`absolute overflow-hidden rounded-[1.45rem] bg-neutral-200 shadow-[0_28px_80px_rgba(15,23,42,0.18)] ${trip.className}`}
      aria-label={`${trip.city}, ${trip.country}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(9,15,28,0.02) 0%, rgba(9,15,28,0.08) 45%, rgba(9,15,28,0.78) 100%), url(${trip.image})`,
        }}
      />
      <div className="relative flex h-full flex-col justify-between p-3 text-white">
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/24 px-2 py-1 text-[0.6rem] font-medium backdrop-blur-md">
          🇪🇹 {trip.country}
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {trip.city} <span className="opacity-70">›</span>
          </h2>
          <div className="mt-2 flex items-center gap-1.5 text-[0.6rem] text-white/86">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/18 px-1.5 py-0.5 backdrop-blur-md">
              <CalendarDays className="size-2.5" />
              {trip.dates}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/18 px-1.5 py-0.5 backdrop-blur-md">
              <UsersRound className="size-2.5" />4
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function GhostTripCard({ trip }: { trip: (typeof GHOST_TRIPS)[number] }) {
  return (
    <article
      className={`absolute hidden h-60 w-40 overflow-hidden rounded-[1.35rem] bg-neutral-100 opacity-30 blur-[1px] md:block ${trip.className}`}
      aria-label={trip.city}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(9,15,28,0.5)), url(${trip.image})`,
        }}
      />
      <div className="relative flex h-full items-end p-3 text-white">
        <span className="text-xs font-semibold">{trip.city}</span>
      </div>
    </article>
  );
}

export function LandingChat({ isLoggedIn }: LandingChatProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToNext(router, isLoggedIn, query);
  }

  return (
    <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden bg-white text-[#090b1a]">
      <div className="container relative mx-auto flex max-w-[100rem] flex-col items-center px-5 pb-8 pt-9 text-center sm:pt-12 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[54rem]">
          <h1 className="text-balance text-[clamp(2.45rem,4.45vw,4.25rem)] font-semibold leading-[0.98] tracking-normal">
            Explore Ethiopia{" "}
            <span className="whitespace-nowrap font-serif italic text-[#2672ff] [font-family:var(--font-cormorant),Georgia,serif]">
              stress-free
            </span>{" "}
            with a bilingual AI concierge.
          </h1>

          <p className="mx-auto mt-5 max-w-[33rem] text-sm leading-6 text-[#646a76] sm:text-base">
            Book trusted local guides, drivers, and translators in Amharic or
            English — get matched and confirmed in seconds.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-6 flex h-14 w-full max-w-[27rem] items-center gap-2 rounded-[1.25rem] border border-[#e9edf5] bg-white p-1.5 shadow-[0_18px_60px_rgba(31,53,92,0.08)]"
          >
            <label className="sr-only" htmlFor="landing-prompt">
              Where do you want to go?
            </label>
            <MapPin className="ml-2 size-4 shrink-0 text-[#9aa2b1]" />
            <input
              id="landing-prompt"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to go?"
              autoComplete="off"
              className="min-h-11 flex-1 border-0 bg-transparent px-1 text-sm text-[#1f2430] outline-none placeholder:text-[#9aa2b1]"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send"
              className="size-11 shrink-0 rounded-[1rem] bg-[#1f6fff] text-white shadow-[0_14px_32px_rgba(31,111,255,0.28)] hover:bg-[#175edb]"
            >
              <Send className="size-4" />
            </Button>
          </form>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.72rem] text-[#8a92a3]">
            <span className="inline-flex items-center gap-1.5">
              <Languages className="size-3.5 text-[#a6adb9]" />
              Speaks Amharic &amp; English
            </span>
            <span aria-hidden="true" className="text-[#cdd2dc]">
              •
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#a6adb9]" />
              Verified local providers
            </span>
          </div>
        </div>

        {/* Phone mockup + side cards */}
        <div className="relative mt-9 h-[25rem] w-full max-w-[56rem] md:h-[30rem]">
          <GhostTripCard trip={GHOST_TRIPS[0]} />
          <GhostTripCard trip={GHOST_TRIPS[1]} />

          <TripCard trip={SIDE_TRIPS[0]} />
          <TripCard trip={SIDE_TRIPS[1]} />

          {/* Phone frame */}
          <div className="absolute left-1/2 top-0 z-30 h-[26rem] w-[15.5rem] -translate-x-1/2 rounded-[2.25rem] border border-[#e7ebf3] bg-[#f8fafc] p-2.5 shadow-[0_30px_90px_rgba(24,35,67,0.18)] md:h-[29rem] md:w-[17.5rem]">
            {/* Status bar */}
            <div className="mb-2 flex items-center justify-between px-3 text-[0.7rem] font-semibold text-[#171b26]">
              <span>9:41</span>
              <span className="flex items-center gap-1">
                <Signal className="size-3" />
                <Wifi className="size-3" />
                <BatteryFull className="size-3.5" />
              </span>
            </div>

            {/* Pill tabs */}
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex rounded-full bg-white p-0.5 text-[0.65rem] font-medium shadow-sm">
                <span className="rounded-full px-2.5 py-1 text-[#8a92a3]">
                  Active
                </span>
                <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-[#1f6fff]">
                  Past
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                className="size-7 rounded-full bg-[#1f6fff] text-white hover:bg-[#175edb]"
                aria-label="Add trip"
              >
                +
              </Button>
            </div>

            {/* Trip card inside phone */}
            <div className="relative h-[calc(100%-5.5rem)] overflow-hidden rounded-[1.5rem] bg-neutral-200 shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                backgroundImage: `linear-gradient(180deg, rgba(9,15,28,0) 0%, rgba(9,15,28,0.05) 45%, rgba(9,15,28,0.78) 100%), url(https://images.pexels.com/photos/7438884/pexels-photo-7438884.jpeg)`,
                }}
              />
              <div className="relative flex h-full flex-col justify-between p-3 text-white">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-medium text-[#1b1f2a] shadow-sm">
                  <MapPin className="size-3 fill-[#d33] text-[#d33]" />
                  Ethiopia
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    Lalibela <span className="opacity-70">›</span>
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5 text-[0.62rem] text-white/90">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 backdrop-blur-md">
                      <CalendarDays className="size-2.5" />
                      Apr 30 - May 5
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 backdrop-blur-md">
                      <Languages className="size-2.5" />
                      AM/EN
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-1.5 py-0.5 backdrop-blur-md">
                      <UsersRound className="size-2.5" />4
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 z-40 flex -translate-x-1/2 gap-1.5">
              <span className="size-1.5 rounded-full bg-[#171b26]" />
              <span className="size-1.5 rounded-full bg-[#cfd6e4]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
