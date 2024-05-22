import { Module } from '@nestjs/common';

import { ScheduleModule } from '@nestjs/schedule';
import {AnalystServiceModule} from "./analyst/analyst-service.module";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AnalystServiceModule,
  ],
})
export class AppModule {}
