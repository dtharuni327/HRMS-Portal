import { z } from "zod";

export const updatePayrollValidation = z.object({
  basic_salary: z.number().positive().optional(),
  allowances: z.number().optional(),
  bonus: z.number().optional(),
  penalty: z.number().optional(),
  tax: z.number().optional(),
  status: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED", "PAID"]).optional(),
});

export type UpdatePayrollInput = z.infer<typeof updatePayrollValidation>;