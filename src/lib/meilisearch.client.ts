import { env } from "@/env";
import { Meilisearch } from "meilisearch";

export const meilisearchAdminClient = new Meilisearch({
  host: env.MEILISEARCH_API_HOST,
  apiKey: env.MEILISEARCH_ADMIN_API_KEY,
});

export const meilisearchSearchClient = new Meilisearch({
  host: env.MEILISEARCH_API_HOST,
  apiKey: env.MEILISEARCH_SEARCH_API_KEY,
});
