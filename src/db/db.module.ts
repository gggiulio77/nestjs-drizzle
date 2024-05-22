import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from './schema';
import { DrizzleService } from './db.service';

export type DatabaseType = PostgresJsDatabase<typeof schema>;

@Module({
    providers: [DrizzleService],
    exports: [DrizzleService],
    imports: [ConfigModule],
})
export class DbModule {}
