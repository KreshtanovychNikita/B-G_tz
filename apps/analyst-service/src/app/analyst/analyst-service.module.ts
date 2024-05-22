import { Module } from '@nestjs/common';

import { AnalystServiceController } from './analyst-service.controller';
import { AnalystServiceService } from './analyst-service.service';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from 'nestjs-redis';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {CacheModule} from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      ttl: 0,
      isGlobal: true,
      store: redisStore,
      host: '172.17.0.3',
      port: 6379

    }),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_service',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'analytics_service',
          queueOptions: {
            durable: false,
          },
        },
      }
    ]),

  ],
  controllers: [AnalystServiceController],
  providers: [AnalystServiceService],
})
export class AnalystServiceModule {}
