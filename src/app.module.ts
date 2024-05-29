import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { LoggerModule } from './config/logger.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { Environment, validate } from '@config/env.validation';

@Module({
    imports: [
        UsersModule,
        DbModule,
        // TODO: review this global approach of instantiating
        ConfigModule.forRoot({
            isGlobal: true,
            // TODO: review this conditional way of doing things, it works but i don't like it
            ...(process.env.NODE_ENV === Environment.Test ? {} : { validate }),
            ignoreEnvFile: process.env.NODE_ENV === Environment.Test,
        }),
        LoggerModule,
        AuthModule,
        HealthModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
