import { z } from "zod";

export const createPayrollValidation = z.object({
  Emp_id: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
  basic_salary: z.number().positive(),
  allowances: z.number().optional().default(0),
  bonus: z.number().optional().default(0),
  penalty: z.number().optional().default(0),
  tax: z.number().optional().default(0),
});

export type CreatePayrollInput = z.infer<typeof createPayrollValidation>;