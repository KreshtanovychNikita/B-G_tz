import {Controller, Get, Post, Put} from '@nestjs/common';

import { PostServiceService } from './post-service.service';

@Controller()
export class PostServiceController {
  constructor(private readonly appService: PostServiceService) {}

  @Get('posts')
  getData() {
    return this.appService.getData();
  }

  @Post('createNewUser')
  async createNewUser() {
    return true;
  }

  @Post()
  async deleteNewUser() {
    return true;
  }

  @Put()
  async editUserById() {
    return true;
  }

  @Get()
  async getUserById() {
    return true;
  }

  @Get()
  async getAllUsers() {
    return true;
  }

}
