import { z } from "zod";

export const getPayrollByEmployeeValidation = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
});

export type GetPayrollByEmployeeInput = z.infer<typeof getPayrollByEmployeeValidation>;