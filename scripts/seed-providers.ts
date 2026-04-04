import { connectDb } from "@/lib/db";
import { Provider } from "@/lib/models/provider";

const seed = [
  {
    name: "Aster Alemayehu",
    category: "guide" as const,
    languages: ["Amharic", "English"],
    price: 45,
    availability: true,
    description:
      "Historical Addis walking tours, Lalibela trips, and cultural deep dives.",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Samuel Tadesse",
    category: "guide" as const,
    languages: ["English", "French"],
    price: 55,
    availability: true,
    description: "Food tours, nightlife, and hidden spots for Gen Z travelers.",
    featured: false,
    rating: 4.7,
  },
  {
    name: "Yonas Gebre",
    category: "driver" as const,
    languages: ["Amharic", "English"],
    price: 35,
    availability: true,
    description: "Airport transfers and day trips with a comfortable sedan.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Meron Haile",
    category: "driver" as const,
    languages: ["Amharic", "English", "Arabic"],
    price: 40,
    availability: true,
    description: "Long-distance routes and flexible hourly hire.",
    featured: false,
    rating: 4.6,
  },
  {
    name: "Helen Bekele",
    category: "translator" as const,
    languages: ["Amharic", "English", "German"],
    price: 30,
    availability: true,
    description: "On-call medical and business interpretation.",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Daniel Worku",
    category: "translator" as const,
    languages: ["Amharic", "English", "Italian"],
    price: 28,
    availability: true,
    description: "Tour-side translation and document help.",
    featured: false,
    rating: 4.5,
  },
  {
    name: "Fendika Cultural Night",
    category: "experience" as const,
    languages: ["Amharic", "English"],
    price: 25,
    availability: true,
    description: "Live music and traditional dance — tonight’s lineup updated weekly.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Entoto Hills Sunset Hike",
    category: "experience" as const,
    languages: ["Amharic", "English"],
    price: 20,
    availability: true,
    description: "Guided sunset hike with city views — easy difficulty.",
    featured: false,
    rating: 4.6,
  },
  {
    name: "Kuriftu Spa Day Pass",
    category: "spa" as const,
    languages: ["Amharic", "English"],
    price: 85,
    availability: true,
    description: "Pool, sauna, and massage add-ons available.",
    featured: false,
    rating: 4.7,
  },
  {
    name: "Lake Bishoftu Resort & Spa",
    category: "resort" as const,
    languages: ["Amharic", "English"],
    price: 120,
    availability: true,
    description: "Lakeside rooms, pool, and weekend brunch buffet.",
    featured: true,
    rating: 4.8,
  },
];

async function main() {
  await connectDb();
  await Provider.deleteMany({});
  await Provider.insertMany(seed);
  console.log(`Seeded ${seed.length} providers.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
