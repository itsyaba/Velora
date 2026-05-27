import { ConciergeChat } from "@/components/concierge-chat";

export default async function ConciergeChatPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lang?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q;
  const lang = sp.lang || "en";

  return (
    <div className="h-100dvh w-full bg-background flex">
      <ConciergeChat initialPrompt={q} language={lang} />
    </div>
  );
}

