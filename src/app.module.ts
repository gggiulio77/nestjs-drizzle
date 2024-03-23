import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { DbModule } from './db/db.module';
import { LoggerModule } from './config/logger.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        UsersModule,
        DbModule,
        ConfigModule.forRoot({ validate, isGlobal: true }),
        LoggerModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
