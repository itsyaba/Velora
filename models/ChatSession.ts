import mongoose, { Schema, models, model } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    content: { type: String, required: true },
    intent: { type: String },
    suggestionIds: [{ type: String }],
  },
  { _id: false },
);

const ChatSessionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true },
    messages: { type: [ChatMessageSchema], default: [] },
    lastIntent: { type: String },
  },
  { timestamps: true },
);

ChatSessionSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export const ChatSession =
  models.ChatSession || model("ChatSession", ChatSessionSchema);
