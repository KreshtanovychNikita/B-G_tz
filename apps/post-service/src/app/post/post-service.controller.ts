import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put} from '@nestjs/common';

import { PostServiceService } from './post-service.service';
import {CreateNewPostDto} from "../../../dto/create-new-post.dto";
import {UpdatePostDto} from "../../../dto/update-post.dto";
import {EventPattern} from "@nestjs/microservices";

@Controller()
export class PostServiceController {
  constructor(private readonly postService: PostServiceService) {}

  @Get('posts')
  getData() {
    return this.postService.getData();
  }

  @Post('createNewPost')
  async createNewPost(@Body() createNewPostDto: CreateNewPostDto) {
    try {
      return await this.postService.createNewPost(createNewPostDto);
    } catch (e) {
      throw new HttpException('POst creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('deletePost/:id')
  async remove(@Param('id') id: number) {
    return await this.postService.deletePost(id);
  }


  @Put('updatePost/:id')
  async update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return await this.postService.updatePost(id, updatePostDto);
  }

  @Get('getPost/:id')
  findOne(@Param('id') id: number) {
    return this.postService.getPostsById(id);
  }

  @Get('getAllPostsByUserId/:user_id')
  async getAllPostsByUserId(@Param('user_id') userId: number) {
    return await this.postService.getAllPostByUserId(userId);
  }

  @Get('getAllPosts')
  async getAlPosts() {
    return await this.postService.getAllPosts();
  }

  @EventPattern('analytics_request')
  async getStats() {
    return await this.postService.getAllPosts();
  }

}
