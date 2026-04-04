import { mongoose } from "../lib/db";

async function seedAdmin() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is missing");

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) throw new Error("DB connection failed");

  const adminEmail = "admin@aiconcierge.com";
  const password = "admin123"; // In a real app, this should be hashed, but better-auth handles login

  // Better-auth uses a 'user' collection
  const usersCollection = db.collection("user");

  // Check if admin already exists
  const existingAdmin = await usersCollection.findOne({ email: adminEmail });

  if (existingAdmin) {
     const res = await usersCollection.updateOne(
       { email: adminEmail },
       { $set: { role: "admin" } }
     );
     console.log("Admin exists, role updated to admin", res.modifiedCount);
  } else {
     // Note: password won't be hashed here, better-auth needs its own specific hashing.
     // Better solution: Sign up via auth.api.signUpEmail then update role.
     console.log("Admin user missing. Please sign up admin@aiconcierge.com via UI first, then run this script to elevate to admin.");
  }

  await mongoose.disconnect();
}

seedAdmin().catch(console.error);
