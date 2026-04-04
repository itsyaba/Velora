import mongoose, { Schema, models, model } from "mongoose";

export const PLACE_TYPES = [
  "restaurant",
  "hotel",
  "cultural_site",
  "nightlife",
  "nature",
  "other",
] as const;

export type PlaceType = (typeof PLACE_TYPES)[number];

const PlaceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: PLACE_TYPES,
    },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    photos: { type: [String], default: [] }, // array of UploadThing URLs
  },
  { timestamps: true },
);

export const Place =
  models.Place || model("Place", PlaceSchema);
