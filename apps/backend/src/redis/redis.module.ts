import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService, REDIS_CLIENT } from './redis.service';

const logger = new Logger('RedisModule');

@Global()
@Module({
    providers: [
        {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
                const client = new Redis(url, {
                    maxRetriesPerRequest: 3,
                    retryStrategy: (times) => {
                        if (times > 5) return null; // stop retrying after 5 attempts
                        return Math.min(times * 500, 3000);
                    },
                });
                client.on('connect', () => logger.log('Redis connected'));
                client.on('error', (err) => logger.error('Redis error', err.message));
                return client;
            },
        },
        RedisService,
    ],
    exports: [RedisService],
})
export class RedisModule {}
