import { z } from "zod";

export const createCommentSchema = z.object({
  message: z.string().min(1).max(500),
  authorName: z.string().optional(),
});

export const updateCommentSchema = z.object({
  message: z.string().min(1).max(500),
});
