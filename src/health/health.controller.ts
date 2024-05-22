import { Public } from '@auth/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckResult,
    HealthCheckService,
} from '@nestjs/terminus';
import { DbHealthIndicator } from './db.health';

@Controller('health')
@ApiTags('health')
@Public()
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly dbHealthIndicator: DbHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    async check(): Promise<HealthCheckResult> {
        return this.healthCheckService.check([]);
    }

    @Get('db')
    async dbCheck(): Promise<HealthCheckResult> {
        return this.healthCheckService.check([
            () => this.dbHealthIndicator.check(),
        ]);
    }
}
