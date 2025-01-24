import { z } from "zod";

const emailSchema = z.string().email().min(1).max(256);
const passwordSchema = z.string().min(6).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.optional(z.string()),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(6).max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24)
