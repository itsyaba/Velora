import mongoose, { Schema, models, model, Types } from "mongoose";

const BookingSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true },
);

export const Booking = models.Booking || model("Booking", BookingSchema);

export type BookingDocument = mongoose.InferSchemaType<typeof BookingSchema> & {
  _id: Types.ObjectId;
};
