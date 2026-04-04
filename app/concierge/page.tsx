import { ConciergeChat } from "@/components/concierge-chat";

export default async function ConciergePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q;
  return (
    <div className="container max-w-4xl py-6">
      <ConciergeChat initialPrompt={q} />
    </div>
  );
}
