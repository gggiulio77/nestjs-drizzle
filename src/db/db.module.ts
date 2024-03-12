import { FactoryProvider, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from "postgres";
import * as schema from "./schema";

export const DbProvider = 'dbProvider';

interface DbConfig {
    database: {
        url: string,
    },
};

const dbProvider: FactoryProvider = {
    provide: DbProvider,
    useFactory(configService: ConfigService<DbConfig>) {
        // TODO: review this approach, don't error with no connection to DB
        const url = configService.get("database.url", { infer: true });

        const client = postgres(url);

        const db = drizzle(client, { schema });

        return db;
    },
    inject: [ConfigService],
};

@Module({
    providers: [dbProvider],
    exports: [dbProvider],
    imports: [],
})
export class DbModule { };