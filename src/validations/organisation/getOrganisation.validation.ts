import { z } from "zod";

export const getOrganisationSchema = z
  .object({
    dept:   z.string().trim().min(1).max(100).optional(), // filter by DepartmentName
    search: z.string().trim().min(1).max(100).optional(), // search by name, role, designation
  })
  .strict();

export type GetOrganisationQuery = z.infer<typeof getOrganisationSchema>;
