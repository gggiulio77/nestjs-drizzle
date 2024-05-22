import { Module } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { DrizzleService } from './db.service';

export type DatabaseType = PostgresJsDatabase<typeof schema>;

@Module({
    providers: [DrizzleService],
    exports: [DrizzleService],
    imports: [],
})
export class DbModule {}
