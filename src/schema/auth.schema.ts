import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(2, { message: "Password is required" }),
  remember_me: z.boolean().default(false).optional(),
});

export const ForgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

export const ChangePasswordSchema = z.object({
  current_password: z
    .string({ message: "Current Password is required" })
    .min(8, { message: "Current Password is required" }),
  new_password: z
    .string({ message: "New Password is required" })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
      {
        message:
          "New Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      },
    ),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
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
        },
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
    .refine((val) => ["student", "institution_admin"].includes(val), {
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
    first_name: z
      .string({ message: "FirstName is required" })
      .min(2, { message: "FirstName is required" }),
    last_name: z
      .string({ message: "LastName is required" })
      .min(2, { message: "LastName is required" }),
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
export type ResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailSchema = z.infer<typeof VerifyEmailSchema>;
