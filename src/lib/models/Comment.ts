import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 500,
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },
  },
  { timestamps: true }
);

export const Comment = models.Comment || model("Comment", CommentSchema);
