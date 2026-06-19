import { z } from "zod";

export const getPayrollListValidation = z.object({
  month: z.string().optional(),
  year: z.string().optional(),
  status: z.string().optional(),
  employee_id: z.string().optional(),
});

export type GetPayrollListInput = z.infer<typeof getPayrollListValidation>;