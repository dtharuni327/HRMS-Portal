import { z } from "zod";

export const approvePayrollValidation = z.object({
  id: z.string(),
});

export type ApprovePayrollInput = z.infer<typeof approvePayrollValidation>;