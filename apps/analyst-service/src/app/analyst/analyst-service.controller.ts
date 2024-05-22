import {Controller, Get, Inject} from '@nestjs/common';

import { AnalystServiceService } from './analyst-service.service';
import {ClientProxy, EventPattern, MessagePattern} from "@nestjs/microservices";

@Controller()
export class AnalystServiceController {
  constructor(private readonly appService: AnalystServiceService,
  @Inject('ANALYTICS_SERVICE') private readonly clientAnalytics: ClientProxy
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

   @EventPattern('data')
   async handleUserCreated(data: any) {
    console.log(`data ${data}`);
   }
}
