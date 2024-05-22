import {Controller, Get} from '@nestjs/common';

import { AnalystServiceService } from './analyst-service.service';

@Controller()
export class AnalystServiceController {
  constructor(private readonly appService: AnalystServiceService,
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
