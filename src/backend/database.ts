import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas/schemas";
export { Client as PgClient } from "pg";
export const database = drizzle(process.env.DATABASE_URL!, { schema });
