import mongoose, { Schema, models, model } from "mongoose";

export const PROVIDER_CATEGORIES = [
  "tour_guide",
  "driver",
  "translator",
  "resort_guide",
] as const;

export type ProviderCategory = (typeof PROVIDER_CATEGORIES)[number];

const ProviderSchema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: PROVIDER_CATEGORIES,
    },
    languages: { type: [String], default: [] },
    price: { type: Number, required: true }, // per hour in ETB
    bio: { type: String, default: "" },
    photo: { type: String, default: "" }, // UploadThing URL
    email: { type: String, default: "" },
    vehicle: { type: String, default: "" },
    licenseType: { type: String, default: "" },
    experience: { type: String, default: "" },
    available: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Provider =
  models.Provider || model("Provider", ProviderSchema);
