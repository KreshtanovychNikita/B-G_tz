import {HttpException, HttpStatus, Injectable, Post} from '@nestjs/common';
import {CreateNewPostDto} from "../../../dto/create-new-post.dto";
import {PostEntity} from "./entities/post.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UpdatePostDto} from "../../../dto/update-post.dto";

@Injectable()
export class PostServiceService {

  @InjectRepository(PostEntity)
  private PostRepository: Repository<PostEntity>;
  getData(): { message: string } {
    return { message: 'Hello Posts' };
  }

  async createNewPost(data : CreateNewPostDto) {
    try {
      const newPost =  await this.PostRepository.createQueryBuilder('post')
        .insert()
        .into(PostEntity)
        .values({
          text: data.text,
          name: data.name,
          user_id: data.user_id,
        })
        .execute();
      if(!newPost) {
        throw new HttpException('Post creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        return newPost;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async deletePost(id:number) {
    try {
      const post = await this.PostRepository.findOne({where: {id}});
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      await this.PostRepository.delete(id);
    } catch (e) {
      console.log(e)
    }
  }

  async updatePost(id, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.PostRepository.findOne({where: { id }});
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      await this.PostRepository.update(id, updatePostDto);
      return this.PostRepository.findOne({where : { id } });
    } catch (e) {
      console.log(e)
    }
  }

  async getPostsById(id: number) {
    try {
      const post = await this.PostRepository.findOne({where: { id }});
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (e) {
      console.log(e)
    }
  }

  async getAllPostByUserId(userId: number) {
    try {
      const post = await this.PostRepository.find({where: { user_id: userId }});
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (e) {
      console.log(e)
    }
  }

  async getAllPosts() {
    return this.PostRepository.find();
  }
}
