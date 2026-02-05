import { Schema, model, models } from "mongoose";

const TicketSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 1, maxlength: 80 },
    description: { type: String, required: true, minlength: 1 },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED"],
      default: "OPEN",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
  },
  { timestamps: true }
);

export const Ticket = models.Ticket || model("Ticket", TicketSchema);
