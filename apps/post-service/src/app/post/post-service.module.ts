import { Module } from '@nestjs/common';

import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'POST_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'post_service',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [PostServiceController],
  providers: [PostServiceService],
})
export class PostServiceModule {}
