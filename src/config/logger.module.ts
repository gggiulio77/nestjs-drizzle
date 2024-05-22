import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLogger } from 'nestjs-pino';
import { Environment, EnvironmentVariables } from './env.validation';

@Module({
    imports: [
        PinoLogger.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService<EnvironmentVariables>) => {
                // TODO: add a method to generate ids (something like uuid)
                const environment = config.get('NODE_ENV', { infer: true });

                return {
                    pinoHttp: {
                        level:
                            environment === Environment.Development
                                ? 'debug'
                                : 'error',
                        transport:
                            environment !== Environment.Production
                                ? { target: 'pino-pretty' }
                                : undefined,
                    },
                };
            },
        }),
    ],
})
export class LoggerModule {}
