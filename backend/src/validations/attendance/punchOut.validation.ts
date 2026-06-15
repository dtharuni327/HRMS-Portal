import { z } from "zod";

export const punchOutValidation = z.object({});

export type PunchOutInput = z.infer<typeof punchOutValidation>;