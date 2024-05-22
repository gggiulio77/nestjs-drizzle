import { DrizzleService } from '@db/db.service';
import { Injectable } from '@nestjs/common';
import {
    HealthCheckError,
    HealthIndicator,
    HealthIndicatorResult,
} from '@nestjs/terminus';
import { sql } from 'drizzle-orm';

@Injectable()
export class DbHealthIndicator extends HealthIndicator {
    constructor(private readonly drizzleService: DrizzleService) {
        super();
    }

    async check(): Promise<HealthIndicatorResult> {
        try {
            const [result] = await this.drizzleService.db.execute<{
                online: boolean;
            }>(sql`SELECT true as online`);

            if (result?.online === true) {
                return this.getStatus('db', true);
            }
        } catch (error) {
            throw new HealthCheckError('Invalid database connection', error);
        }

        throw new HealthCheckError('Invalid database connection', {
            code: 'Invalid query result',
        });
    }
}
