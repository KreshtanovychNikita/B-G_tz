/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { UserServiceModule } from './app/user/user-service.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {AppModule} from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'user_service',
      queueOptions: {
        durable: false
      },
    },
  });

  await app.startAllMicroservices();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = 3001;
  await app.listen(port);
  Logger.log(
    `🚀 User Service is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
