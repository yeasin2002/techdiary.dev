import "dotenv/config";
import { PostgresAdapter } from "sqlkit";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas";
import { Pool } from "pg";
import { env } from "@/env";

declare global {
  var pgClient: PostgresAdapter | undefined;
}

export const drizzleClient = drizzle(process.env.DATABASE_URL!, { schema });

// Initialize global database connection
if (!globalThis.pgClient) {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  });

  globalThis.pgClient = new PostgresAdapter(pool);
}

export const pgClient = globalThis.pgClient;
