import { env } from "@/env";
import { Pool } from "pg";
import { PostgresAdapter } from "sqlkit";

declare global {
  var pgClient: PostgresAdapter | undefined;
}

// Initialize global database connection
if (!globalThis.pgClient) {
  globalThis.pgClient = new PostgresAdapter(
    new Pool({
      connectionString: env.DATABASE_URL,
    })
  );
}

export const pgClient = globalThis.pgClient;
