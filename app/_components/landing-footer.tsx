import Link from "next/link";
import { CircleDot } from "lucide-react";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      { label: "Concierge", href: "/concierge" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Destinations", href: "#destinations" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign up", href: "/signup" },
      { label: "Log in", href: "/login" },
      { label: "Admin", href: "/admin" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#" },
      { label: "Contact", href: "mailto:hello@guzo.ai" },
      { label: "Privacy", href: "#" },
    ],
  },
] as const;

export default function LandingFooter() {
  return (
    <footer className="border-t border-[#e9edf5] bg-white">
      <div className="container mx-auto max-w-[100rem] px-5 py-14 md:px-14 lg:px-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-[#eaf2ff] text-[#1f6fff]">
                <CircleDot
                  className="size-5 fill-[#1f6fff]/25"
                  strokeWidth={2.5}
                />
              </span>
            <span className="text-xl font-bold tracking-tight text-[#1b1f2a]">
              Guzo AI
            </span>
            </Link>
            <p className="mt-4 max-w-[22rem] text-sm leading-6 text-[#646a76]">
              A bilingual AI concierge for Ethiopia. Book trusted guides,
              drivers, and translators — in Amharic or English.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#8a92a3]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#1b1f2a] transition-colors hover:text-[#1f6fff]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#e9edf5] pt-6 text-xs text-[#8a92a3] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} guzoAI — Built for travelers in
            Ethiopia.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Concierge online
          </span>
        </div>
      </div>
    </footer>
  );
}
