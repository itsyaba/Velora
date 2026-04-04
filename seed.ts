import { connectDb } from "./lib/db";
import { Provider, ProviderCategory } from "./lib/models/provider";

const providers = [
  // Drivers
  {
    name: "Yonas Haile",
    category: "driver",
    languages: ["Amharic", "English"],
    price: 1500,
    description: "Reliable airport transfers and full-day city driving. Safe and experienced.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Abebe Bekele",
    category: "driver",
    languages: ["Amharic", "English", "Oromiffa"],
    price: 1800,
    description: "Comfortable SUV driver for out-of-town trips including Bishoftu and Awash.",
    featured: false,
    rating: 4.7,
  },
  {
    name: "Tesfaye Tadesse",
    category: "driver",
    languages: ["Amharic", "Italian", "English"],
    price: 1200,
    description: "City taxi driver with deep knowledge of Addis Ababa's fastest routes.",
    featured: false,
    rating: 4.5,
  },
  {
    name: "Samuel Solomon",
    category: "driver",
    languages: ["Amharic", "English"],
    price: 2500,
    description: "Premium chauffeur service with luxury vehicles for VIPs and business.",
    featured: true,
    rating: 5.0,
  },
  {
    name: "Binyam Alemu",
    category: "driver",
    languages: ["Amharic"],
    price: 900,
    description: "Budget-friendly driver for quick errands around town.",
    featured: false,
    rating: 4.3,
  },

  // Guides
  {
    name: "Dawit Bekele",
    category: "guide",
    languages: ["Amharic", "English", "French"],
    price: 1200,
    description: "Certified national tour guide expert in historical sites and museums.",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Fikerte Amenu",
    category: "guide",
    languages: ["Amharic", "English"],
    price: 1000,
    description: "Specializes in culinary and local market tours in Addis Ababa.",
    featured: false,
    rating: 4.6,
  },
  {
    name: "Meron Alemu",
    category: "guide",
    languages: ["Amharic", "English", "Spanish"],
    price: 1500,
    description: "Adventure guide for hiking and visiting surrounding mountains.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Kaleb Yohannes",
    category: "guide",
    languages: ["Amharic", "English"],
    price: 1100,
    description: "Nightlife and city entertainment guide.",
    featured: false,
    rating: 4.4,
  },

  // Translators
  {
    name: "Selamawit Tadesse",
    category: "translator",
    languages: ["Amharic", "English", "Arabic"],
    price: 2000,
    description: " Professional translator for business meetings and document reviews.",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Elias Worku",
    category: "translator",
    languages: ["Amharic", "English", "Mandarin"],
    price: 2500,
    description: "Fluent Mandarin and English translator for corporate and casual needs.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Hanna Girma",
    category: "translator",
    languages: ["Amharic", "English", "German"],
    price: 1800,
    description: "Consecutive translation for NGOs and small groups.",
    featured: false,
    rating: 4.7,
  },

  // Experiences
  {
    name: "Entoto Park Hiking Experience",
    category: "experience",
    languages: ["English", "Amharic"],
    price: 800,
    description: "Guided 3-hour hike through the eucalyptus forests of Mount Entoto.",
    featured: true,
    rating: 4.9,
  },
  {
    name: "Traditional Coffee Ceremony Masterclass",
    category: "experience",
    languages: ["English"],
    price: 600,
    description: "Learn how to roast, grind, and brew Ethiopian coffee in this interactive class.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Addis Nightlife & Jazz Tour",
    category: "experience",
    languages: ["English", "Amharic"],
    price: 1500,
    description: "Experience the vibrant Ethio-Jazz scene with VIP entrance to 3 top venues.",
    featured: false,
    rating: 4.7,
  },
  {
    name: "Danakil Depression Virtual Prep",
    category: "experience",
    languages: ["English"],
    price: 500,
    description: "Info session and planning experience before taking on the extreme Danakil.",
    featured: false,
    rating: 4.5,
  },

  // Spas
  {
    name: "Abyssinia Renewal Spa",
    category: "spa",
    languages: ["English", "Amharic"],
    price: 4000,
    description: "Full day luxury spa treatment featuring traditional Ethiopian volcanic clay masks.",
    featured: true,
    rating: 5.0,
  },
  {
    name: "Sheba Wellness Center",
    category: "spa",
    languages: ["English"],
    price: 2500,
    description: "Deep tissue massage and steam room access for quick relaxation.",
    featured: false,
    rating: 4.6,
  },
  {
    name: "Entoto Mountain Retreat Spa",
    category: "spa",
    languages: ["Amharic", "English"],
    price: 3500,
    description: "Peaceful scenic spa overlooking the mountains with hot stone therapies.",
    featured: true,
    rating: 4.9,
  },

  // Resorts
  {
    name: "Kuriftu Resort & Spa Bishoftu",
    category: "resort",
    languages: ["English", "Amharic"],
    price: 8500,
    description: "Lakefront resort with luxury amenities, swimming pools, and kayaking.",
    featured: true,
    rating: 4.8,
  },
  {
    name: "Haile Resort Hawassa",
    category: "resort",
    languages: ["English", "Amharic"],
    price: 7000,
    description: "Top-tier resort on Lake Hawassa offering modern rooms and sunset views.",
    featured: true,
    rating: 4.7,
  },
  {
    name: "Babile Elephant Lodge",
    category: "resort",
    languages: ["English"],
    price: 5000,
    description: "Eco-resort allowing unparalleled access to nature and wildlife.",
    featured: false,
    rating: 4.5,
  },
];

async function seed() {
  try {
    await connectDb();
    console.log("Connected to database. Deleting old providers...");
    await Provider.deleteMany({});
    
    console.log("Inserting new dummy providers...");
    const inserted = await Provider.insertMany(providers);
    
    console.log(`Successfully inserted ${inserted.length} providers across categories.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
