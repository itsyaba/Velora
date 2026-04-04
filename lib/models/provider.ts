import mongoose, { Schema, models, model } from "mongoose";

const PROVIDER_CATEGORIES = [
  "guide",
  "driver",
  "translator",
  "experience",
  "spa",
  "resort",
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
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    description: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true },
);

export const Provider =
  models.Provider || model("Provider", ProviderSchema);

export { PROVIDER_CATEGORIES };
