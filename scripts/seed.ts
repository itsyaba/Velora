import { mongoose } from "../lib/db";
import { Provider } from "../models/Provider";
import { Place } from "../models/Place";

const DEMO_PROVIDERS = [
  {
    name: "Dawit Bekele",
    category: "tour_guide",
    languages: ["Amharic", "English"],
    price: 1200,
    bio: "Certified historical guide with 10+ years of experience in Addis Ababa and the Northern Circuit.",
    photo: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=200&q=80",
    email: "dawit.b@example.com",
    vehicle: "",
    licenseType: "",
    experience: "10+ Years",
    isVerified: true,
    available: true,
    rating: 4.8,
    totalBookings: 156,
  },
  {
    name: "Yonas Haile",
    category: "driver",
    languages: ["Amharic", "English"],
    price: 850,
    bio: "Safe and reliable driver with a modern Toyota Corolla. Available for city tours and airport transfers.",
    photo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=200&q=80",
    email: "yonas.h@example.com",
    vehicle: "Toyota Corolla 2023",
    licenseType: "B-Class",
    experience: "5 Years",
    isVerified: true,
    available: true,
    rating: 4.6,
    totalBookings: 89,
  },
  {
    name: "Selamawit Tadesse",
    category: "translator",
    languages: ["Amharic", "English", "French"],
    price: 1500,
    bio: "Professional translator specializing in business and legal documents. Fluent in French and English.",
    photo: "https://images.unsplash.com/photo-1518998053502-53cc83e9c5ec?auto=format&fit=crop&w=200&q=80",
    email: "selam.t@example.com",
    vehicle: "",
    licenseType: "",
    experience: "5 Years",
    isVerified: true,
    available: true,
    rating: 4.9,
    totalBookings: 210,
  },
  {
    name: "Meron Alemu",
    category: "resort_guide",
    languages: ["Amharic", "English", "Italian"],
    price: 3200,
    bio: "Luxury resort guide with deep knowledge of Ethiopia's premium hospitality sector.",
    photo: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=200&q=80",
    email: "meron.a@example.com",
    vehicle: "",
    licenseType: "",
    experience: "7 Years",
    isVerified: false,
    available: true,
    rating: 4.7,
    totalBookings: 42,
  },
];

const DEMO_PLACES = [
  {
    name: "Unity Park",
    type: "cultural_site",
    description: "Located within the National Palace of Ethiopia, Unity Park is a symbol of Ethiopia's unity.",
    address: "Addis Ababa, Ethiopia",
    openingHours: "09:00 AM - 06:00 PM",
    rating: 4.8,
    tags: ["Museum", "History", "Gardens"],
    photos: ["https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=600&q=80"],
  },
  {
    name: "Sheraton Addis",
    type: "hotel",
    description: "Luxury resort featuring world-class amenities and exceptional Ethiopian hospitality.",
    address: "Taitu St, Addis Ababa",
    openingHours: "Open 24 Hours",
    rating: 4.9,
    tags: ["Luxury", "Hotel", "Spa"],
    photos: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"],
  },
  {
    name: "Entoto Park",
    type: "nature",
    description: "A breath of fresh air overlooking the capital with hiking trails and scenic views.",
    address: "Entoto Mountains, Addis Ababa",
    openingHours: "07:00 AM - 08:00 PM",
    rating: 4.7,
    tags: ["Nature", "Hiking", "Viewpoint"],
    photos: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80"],
  },
  {
    name: "Yod Abyssinia",
    type: "restaurant",
    description: "Traditional Ethiopian restaurant offering authentic meals and live cultural performances.",
    address: "Bole Road, Addis Ababa",
    openingHours: "10:00 AM - 11:30 PM",
    rating: 4.6,
    tags: ["Food", "Cultural", "Live Music"],
    photos: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"],
  },
];

async function seed() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is missing in environment");

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);

  console.log("Clearing existing data...");
  await Provider.deleteMany({});
  await Place.deleteMany({});

  console.log("Seeding providers...");
  await Provider.insertMany(DEMO_PROVIDERS);
  console.log(`Inserted ${DEMO_PROVIDERS.length} providers.`);

  console.log("Seeding places...");
  await Place.insertMany(DEMO_PLACES);
  console.log(`Inserted ${DEMO_PLACES.length} places.`);

  console.log("Elevating admin users...");
  const db = mongoose.connection.db;
  if (!db) throw new Error("DB connection failed");
  
  const usersCollection = db.collection("user");
  const res = await usersCollection.updateMany(
    { email: "admin@aiconcierge.com" },
    { $set: { role: "admin" } }
  );
  console.log(`Elevated ${res.modifiedCount} matches to admin.`);

  console.log("Seed complete! Disconnecting...");
  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
