import { z } from "zod";

export const deletePayrollValidation = z.object({
  id: z.string(),
});

export type DeletePayrollInput = z.infer<typeof deletePayrollValidation>;