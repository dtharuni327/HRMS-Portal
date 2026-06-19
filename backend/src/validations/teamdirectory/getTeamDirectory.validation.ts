import { z } from "zod";


export const getTeamDirectorySchema = z
  .object({
    dept:   z.string().trim().min(1).max(100).optional(), // filter by DepartmentName
    search: z.string().trim().min(1).max(100).optional(), // search by name, designation, role
  })
  .strict();

export type GetTeamDirectoryQuery = z.infer<typeof getTeamDirectorySchema>;

// GET /api/team-directory/:empId
// Validates the empId path param — new format CFT20260001
export const getTeamMemberSchema = z.object({
  empId: z
    .string()
    .trim()
    .regex(/^CFT\d{8}$/, "Invalid Employee ID format (expected CFT20260001)"),
});

export type GetTeamMemberParams = z.infer<typeof getTeamMemberSchema>;
