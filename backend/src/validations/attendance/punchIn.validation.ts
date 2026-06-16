import { z } from "zod";

export const punchInValidation = z.object({
  latitude: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(-90).max(90).optional()
  ),
  longitude: z.preprocess(
    (val) => (typeof val === "string" ? parseFloat(val) : val),
    z.number().min(-180).max(180).optional()
  )
});

export type PunchInInput = z.infer<typeof punchInValidation>;