import { z } from "zod";

export const getByIdEmployeeSchema = z.object({
  empId: z.string().trim().min(1, "Employee ID is required"),
});

export type GetByIdEmployeeParams = z.infer<typeof getByIdEmployeeSchema>;
