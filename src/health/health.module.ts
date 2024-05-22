import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DbHealthIndicator } from './db.health';
import { DbModule } from '@db/db.module';

@Module({
    imports: [TerminusModule, DbModule],
    controllers: [HealthController],
    providers: [DbHealthIndicator],
})
export class HealthModule {}
