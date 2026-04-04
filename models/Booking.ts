import mongoose, { Schema, models, model } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: { type: String, default: "" },
    scheduledAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Booking =
  models.Booking || model("Booking", BookingSchema);
