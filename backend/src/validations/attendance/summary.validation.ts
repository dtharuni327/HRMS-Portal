import { z } from "zod";

export const getAttendanceSummarySchema = z.object({
  params: z.object({
    empId: z.string().min(1, "Employee ID is required"),
  }),
  query: z.object({
    month: z.string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 1 && val <= 12, {
        message: "Month must be between 1 and 12",
      }),
    year: z.string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val >= 2020, {
        message: "Year must be 2020 or later",
      }),
  }),
});