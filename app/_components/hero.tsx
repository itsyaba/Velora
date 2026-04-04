import { LandingChat } from "@/components/landing-chat";

export default function HeroSection({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return <LandingChat isLoggedIn={isLoggedIn} />;
}
