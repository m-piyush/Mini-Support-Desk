import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(2000),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});
