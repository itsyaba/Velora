import { getAuth } from "@/lib/auth";
import { headers } from "next/headers";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleDot } from "lucide-react";
import LogoutButton from "@/components/auth/logout-button-icon";
import HeroSection from "./_components/hero";
import HowItWorks from "./_components/how-it-works";
import Features from "./_components/features";
import Destinations from "./_components/destinations";
import CTA from "./_components/cta";
import LandingFooter from "./_components/landing-footer";

export default async function page() {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userInitials =
    session?.user.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";
  return (
    <div className="relative flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl">
        <div className="container mx-auto flex h-[4.5rem] max-w-[100rem] items-center justify-between px-5 md:px-14 lg:px-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-[#eaf2ff] text-[#1f6fff]">
              <CircleDot className="size-5 fill-[#1f6fff]/25" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-bold tracking-tight text-[#1b1f2a]">Guzo AI</span>
          </Link>
          <nav className="flex items-center gap-2">
            {session?.user ? (
              <div className="flex items-center gap-2">
                {session?.user && "role" in session.user && session.user.role === "admin" && (
                  <Link href="/admin">
                    <Button className="rounded-full px-5 " size="default">
                      Admin dashboard
                    </Button>
                  </Link>
                )}
                <Link href="/concierge">
                  <Button
                    className="rounded-full bg-[#1f6fff] px-5 text-white hover:bg-[#175edb]"
                    size="default"
                  >
                    Open chat
                  </Button>
                </Link>
                <Avatar className="size-9 border border-[#e7ebf3]">
                  <AvatarImage src={session.user.image ?? undefined} alt={session.user.name} />
                  <AvatarFallback className="bg-[#eef4ff] text-xs font-semibold text-[#1f6fff]">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <LogoutButton />
              </div>
            ) : (
              <Link href="/signup">
                <Button className="rounded-full bg-[#1f6fff] px-5 text-white shadow-[0_14px_30px_rgba(31,111,255,0.24)] hover:bg-[#175edb]">
                  Join beta
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <HeroSection isLoggedIn={!!session?.user} />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <Features />
        <div id="destinations">
          <Destinations />
        </div>
        <CTA isLoggedIn={!!session?.user} />
      </main>
      <LandingFooter />
    </div>
  );
}
