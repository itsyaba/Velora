import { MapPin } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Lalibela",
    tag: "Rock-hewn churches",
    image:
      "https://images.pexels.com/photos/7438884/pexels-photo-7438884.jpeg",
  },
  {
    name: "Simien Mountains",
    tag: "Highland trekking",
    image:
      "https://images.pexels.com/photos/10502569/pexels-photo-10502569.jpeg",
  },
  {
    name: "Danakil Depression",
    tag: "Otherworldly landscapes",
    image:
      "https://images.pexels.com/photos/5966509/pexels-photo-5966509.jpeg",
  },
  {
    name: "Harar",
    tag: "Ancient walled city",
    image:
      "https://images.pexels.com/photos/37087442/pexels-photo-37087442.jpeg",
  },
  {
    name: "Omo Valley",
    tag: "Cultural journeys",
    image:
      "https://images.pexels.com/photos/33763173/pexels-photo-33763173.jpeg",
  },
  {
    name: "Addis Ababa",
    tag: "City essentials",
    image:
      "https://images.pexels.com/photos/33019023/pexels-photo-33019023.jpeg",
  },
] as const;

export default function Destinations() {
  return (
    <section className="relative bg-white py-20 sm:py-24">
      <div className="container mx-auto max-w-[100rem] px-5 md:px-14 lg:px-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[34rem]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e7ebf3] bg-[#f8fafc] px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wider text-[#646a76]">
              Where to next
            </span>
            <h2 className="mt-4 text-balance text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-tight tracking-tight text-[#090b1a]">
              Pick a place. We'll{" "}
              <span className="font-serif italic text-[#2672ff] [font-family:var(--font-cormorant),Georgia,serif]">
                handle
              </span>{" "}
              the rest.
            </h2>
          </div>
          <p className="max-w-[26rem] text-sm leading-6 text-[#646a76] sm:text-base">
            Popular destinations our travelers ask about most. The concierge
            already knows the best guides and drivers in each one.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <article
              key={destination.name}
              className="group relative h-72 overflow-hidden rounded-2xl bg-neutral-200 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(9, 15, 28, 0) 0%, rgba(9, 15, 28, 0.1) 45%, rgba(9, 15, 28, 0.78) 100%), url(${destination.image})`,
                }}
              />
              <div className="relative flex h-full flex-col justify-end p-5 text-white">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[0.65rem] font-medium text-[#1b1f2a] shadow-sm">
                  <MapPin className="size-3 fill-[#d33] text-[#d33]" />
                  Ethiopia
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {destination.name}
                </h3>
                <p className="text-sm text-white/80">{destination.tag}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
