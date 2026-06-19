import { z } from "zod";

export const getPayrollSummaryValidation = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export type GetPayrollSummaryInput = z.infer<typeof getPayrollSummaryValidation>;