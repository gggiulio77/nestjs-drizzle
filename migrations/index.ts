import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as postgres from "postgres"
import * as dotenv from "dotenv";


async function run() {
    dotenv.config();

    const sql = postgres(process.env.DB_URL, { max: 1 })
    const db = drizzle(sql);


    await migrate(db, { migrationsFolder: "migrations" });

    await sql.end();
}

run();