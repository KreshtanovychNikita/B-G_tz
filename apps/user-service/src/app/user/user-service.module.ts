import { Module } from '@nestjs/common';

import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MailerModule} from "@nestjs-modules/mailer";

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
    MailerModule.forRoot({
      transport: {
        host: "sandbox.smtp.mailtrap.io",
        auth: {
          user: "1916502ace1e04",
          pass: "d954b3fd935139",
        },
      },
    }),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
