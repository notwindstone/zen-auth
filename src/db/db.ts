import { drizzle as neonDriver } from "drizzle-orm/neon-http";
import { drizzle as postgresDriver } from "drizzle-orm/postgres-js";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

let driver;

switch (process.env.DB_TYPE!.toLowerCase()) {
    case "postgres":
        driver = postgresDriver(process.env.DATABASE_URL!);

        break;
    case "neon":
    default:
        const sql = neon(process.env.DATABASE_URL!);
        driver = neonDriver({ client: sql });

        break;
}

export const db = driver;