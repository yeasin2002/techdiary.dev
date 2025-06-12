import { z } from "zod";

export const UserActionInput = {
  syncSocialUserInput: z.object({
    service: z.enum(["github"]),
    service_uid: z.string(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    profile_photo: z.string().url(),
    bio: z.string().optional().nullable(),
  }),
  updateMyProfileInput: z.object({
    name: z.string(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    profile_photo: z.string().url().optional(),
    education: z.string().optional(),
    designation: z.string().optional(),
    bio: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    location: z.string().optional(),
    social_links: z.record(z.string()).optional(),
    profile_readme: z.string().optional(),
    skills: z.string().optional(),
  }),
};
