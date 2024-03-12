import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './config/env.validation';
import { DbModule } from './db/db.module';

@Module({
  imports: [UsersModule, DbModule, ConfigModule.forRoot({ validate, load: [configuration], isGlobal: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
