import { FactoryProvider, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from "postgres";
import * as schema from "./schema";
import { EnvironmentVariables } from "src/config/env.validation";

export const DbProvider = 'dbProvider';

const dbProvider: FactoryProvider = {
    provide: DbProvider,
    useFactory(configService: ConfigService<EnvironmentVariables>) {
        // TODO: review this approach, don't error with no connection to DB
        const url = configService.get("DB_URL", { infer: true });

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