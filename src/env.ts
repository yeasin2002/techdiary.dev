import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production", "test"]),
    UNSPLASH_CLIENT_ID: z.string(),
    CLOUDINARY_URL: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    GITHUB_CALLBACK_URL: z.string(),
    DATABASE_URL: z.string(),
    MEILISEARCH_API_HOST: z.string().url(),
    MEILISEARCH_ADMIN_API_KEY: z.string(),
    MEILISEARCH_SEARCH_API_KEY: z.string(),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
  },
  experimental__runtimeEnv: {},
});
