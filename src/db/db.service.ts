import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { DatabaseType } from './db.module';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@config/env.validation';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as postgres from 'postgres';
import * as schema from './schema';

// TODO: first approach to this "class provider"
@Injectable()
export class DrizzleService implements OnModuleDestroy {
    private readonly client: postgres.Sql;
    public readonly db: DatabaseType;

    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>
    ) {
        const url = this.configService.get('DB_URL', { infer: true });

        this.client = postgres(url);

        this.db = drizzle(this.client, { schema });
    }

    async onModuleDestroy() {
        await this.client.end();
    }
}
