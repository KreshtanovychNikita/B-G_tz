import { Module } from '@nestjs/common';

import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
