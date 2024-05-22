import { Module } from '@nestjs/common';

import { PostServiceController } from './post-service.controller';
import { PostServiceService } from './post-service.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PostEntity} from "./entities/post.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
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
