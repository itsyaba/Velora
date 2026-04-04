import type { ProviderCategory } from "@/lib/models/provider";
import { Provider } from "@/lib/models/provider";

export type ProviderSuggestion = {
  id: string;
  name: string;
  category: string;
  languages: string[];
  price: number;
  description: string;
  availability: boolean;
  featured: boolean;
};

export async function getTopProvidersForCategory(
  category: ProviderCategory | "other",
  limit = 3,
): Promise<ProviderSuggestion[]> {
  let catFilter: any = category;
  if (category === "guide") {
    catFilter = { $in: ["guide", "tour_guide", "resort_guide"] };
  }

  const filter =
    category === "other"
      ? { availability: true }
      : { category: catFilter, availability: true };

  const docs = await Provider.find(filter)
    .sort({ featured: -1, rating: -1, price: 1 })
    .limit(limit)
    .lean();

  return docs.map((p) => ({
    id: String(p._id),
    name: p.name,
    category: p.category,
    languages: p.languages ?? [],
    price: p.price,
    description: p.description ?? "",
    availability: p.availability ?? true,
    featured: p.featured ?? false,
  }));
}
