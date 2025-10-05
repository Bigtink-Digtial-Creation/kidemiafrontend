import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(2, { message: "Password is required" }),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

export const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string({ message: "New Password is required" })
      .min(8, { message: "Password is required" }),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(8, { message: "Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const StepOneSchema = z
  .object({
    first_name: z
      .string({ message: "FirstName is required" })
      .min(2, { message: "FirstName is required" }),
    last_name: z
      .string({ message: "LastName is required" })
      .min(2, { message: "LastName is required" }),
    email: z.email({ message: "Enter a valid email address" }),
    password: z
      .string({ message: "Password is required" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        {
          message:
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(8, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const StepTwoSchema = z.object({
  role: z
    .string()
    .nonempty("Role is required")
    .refine((val) => ["student", "school"].includes(val), {
      message: "Please select either Student or School",
    }),
});

export const StepThreeSchema = z.object({
  examOrSchool: z
    .string()
    .min(1, { message: "This field is required" })
    .refine((val) => ["CE", "JW", "SW"].includes(val) || val.length >= 2, {
      message: "This field is required",
    }),
});

export const StepFourSchema = z.object({
  guardianOrAdminEmail: z
    .string({ message: "This field is required" })
    .min(2, { message: "This field is required" }),
});

export const GuardianSignupSchema = z
  .object({
    email: z.email({ message: "Enter a valid email address" }),
    password: z
      .string({ message: "New Password is required" })
      .min(8, { message: "Password is required" }),

    confirmPassword: z
      .string({ message: "Confirm Password is required" })
      .min(8, { message: "Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof LoginSchema>;
export type ForgotPasswordSchema = z.infer<typeof ForgotPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof ChangePasswordSchema>;
export type StepOneSchema = z.infer<typeof StepOneSchema>;
export type StepTwoSchema = z.infer<typeof StepTwoSchema>;
export type StepThreeSchema = z.infer<typeof StepThreeSchema>;
export type StepFourSchema = z.infer<typeof StepFourSchema>;
export type GuardianSignupSchema = z.infer<typeof GuardianSignupSchema>;
