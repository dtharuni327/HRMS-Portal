import { z } from "zod";

export const getDashboardSchema = z.object({
  query: z.object({
    date: z.string().optional(),
  }),
});