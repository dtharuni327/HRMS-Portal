import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string().trim().min(1, "Current password is required"),

    newPassword: z
      .string().trim()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "New password must contain an uppercase letter")
      .regex(/[a-z]/, "New password must contain a lowercase letter")
      .regex(/[0-9]/, "New password must contain a number")
      .regex(/[^A-Za-z0-9]/, "New password must contain a special character"),
  })
  .strict();

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
