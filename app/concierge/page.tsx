import { ConciergeChat } from "@/components/concierge-chat";

export default async function ConciergePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q;
  return (
    <div className="h-100dvh w-full bg-white flex">
      <ConciergeChat initialPrompt={q} />
    </div>
  );
}
