import { z } from "zod";
import { WORK_MODE, GENDER } from "../../constants/employee.constants";

const workModeValues = Object.values(WORK_MODE) as [string, ...string[]];
const genderValues   = Object.values(GENDER)    as [string, ...string[]];


export const updateProfileSchema = z
  .object({
    personal_email: z
      .string().trim().toLowerCase().email("Invalid email format")
      .optional(),

    phone: z
      .string().trim().regex(/^[0-9]{10}$/, "Phone must be 10 digits")
      .optional(),

    emergency_contact: z
      .string().trim().regex(/^[0-9]{10}$/, "Emergency contact must be 10 digits")
      .optional(),

    profile_image: z
      .string().trim().url("profile_image must be a valid URL")
      .optional(),

    address: z
      .string().trim().min(2, "Address is too short").max(255, "Address exceeds maximum length")
      .optional(),

    work_mode: z.enum(workModeValues as [string, ...string[]]).optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;