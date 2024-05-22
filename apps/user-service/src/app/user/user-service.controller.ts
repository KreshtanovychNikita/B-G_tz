import {Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put} from '@nestjs/common';

import {UserServiceService} from './user-service.service';
import {CreateNewUserDto} from "../../../dto/create-new-user.dto";
import {ClientProxy, EventPattern, MessagePattern} from "@nestjs/microservices";
import {UpdateUserDto} from "../../../dto/update-user.dto";

@Controller()
export class UserServiceController {
  constructor(
    private readonly userService: UserServiceService,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
    @Inject('ANALYTICS_SERVICE') private readonly clientAnalytics: ClientProxy
  ) {}

  @Get()
  getData() {
    return this.userService.getData();
  }

  @Post('createNewUser')
  async createNewUser(@Body() createUserDto: CreateNewUserDto) {
    try {
      return await this.userService.createNewUser(createUserDto);
    } catch (e) {
      throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('deleteUser/:id')
  remove(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }


  @Put('updateUser/:id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get('getUser/:id')
  findOne(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Get('getAllUsers')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @EventPattern('user_created')
  async handleUserCreated(data: any) {
    const { email } = data;
    await this.userService.sendMail(email);
  }

  // @MessagePattern('analytics_user')
  // async getStats() {
  //   const allUsers = await this.userService.getAllUsers();
  //   this.clientAnalytics.emit('analytics_user_data', allUsers)
  // }

}
