import { z } from "zod";

export const getAttendanceHistorySchema = z.object({
  params: z.object({
    empId: z.string().min(1, "Employee ID is required"),
  }),
  query: z.object({
    page: z.string().transform((val) => parseInt(val, 10)).optional(),
    limit: z.string().transform((val) => parseInt(val, 10)).optional(),
  }),
});