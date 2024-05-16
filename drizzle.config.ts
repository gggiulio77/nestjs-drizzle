import type { Config } from 'drizzle-kit';

import * as dotenv from 'dotenv';
dotenv.config();

export default {
    schema: './src/db/schema.ts',
    out: './migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB_URL,
    },
} satisfies Config;
