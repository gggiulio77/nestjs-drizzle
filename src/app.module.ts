import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DbModule } from './db/db.module';
import { LoggerModule } from './config/logger.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
    imports: [
        UsersModule,
        DbModule,
        // TODO: review this approach, maybe is more explicit to import ir in each module
        ConfigModule.forRoot({ validate, isGlobal: true }),
        LoggerModule,
        AuthModule,
        HealthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
