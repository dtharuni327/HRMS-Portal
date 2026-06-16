import { z } from "zod";

export const getPayrollOwnValidation = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export type GetPayrollOwnInput = z.infer<typeof getPayrollOwnValidation>;