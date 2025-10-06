import { z } from "zod";

export const ContactUsSchema = z.object({
  fullName: z.string().min(1, { message: "Fullname is required" }),
  email: z.email({ message: "Enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

export const ProfileSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  first_name: z
    .string({ message: "First Name is required" })
    .min(2, { message: "First Name is required" }),
  last_name: z
    .string({ message: "Last Name is required" })
    .min(2, { message: "Last Name is required" }),
  middle_name: z.string({ message: "Middle Name is required" }).optional(),
  phone_number: z.string({ message: "Phone Number is required" }).optional(),
  profile_picture_url: z.string().optional(),
  date_of_birth: z.string({ message: "DoB is required" }).optional(),
  bio: z.string({ message: "Bio is required" }).optional(),
});
export type ContactUsSchema = z.infer<typeof ContactUsSchema>;
export type ProfileSchema = z.infer<typeof ProfileSchema>;
