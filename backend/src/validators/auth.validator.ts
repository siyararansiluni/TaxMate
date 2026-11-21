
import { z } from "zod";

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "Full name must contain at least 2 characters")
      .max(150, "Full name is too long"),

    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .max(255),

    nic: z
      .string()
      .trim()
      .min(1, "NIC is required")
      .max(20, "NIC is too long"),

    password: z
      .string()
       .min(15, "Password must contain at least 15 characters"),

    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
