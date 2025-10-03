import { z } from "zod";

export const ContactUsSchema = z.object({
  fullName: z.string().min(1, { message: "Fullname is required" }),
  email: z.email({ message: "Enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export type ContactUsSchema = z.infer<typeof ContactUsSchema>;
