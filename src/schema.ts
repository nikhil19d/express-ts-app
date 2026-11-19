import z from "zod";

export const EventData = z.object({
  event: z.string().min(1, "Event name is required"),
  userId: z.number().positive()
})
