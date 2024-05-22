import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from 'nestjs-redis';
import {AnalystServiceModule} from "./analyst/analyst-service.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // RedisModule.register({
    //   host: 'localhost',
    //   port: 6379,
    // }),
    AnalystServiceModule,
  ],
})
export class AppModule {}
