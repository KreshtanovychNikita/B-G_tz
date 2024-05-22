import {Inject, Injectable } from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import axios from 'axios';
import {EventPattern} from "@nestjs/microservices";
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {Cache} from "@nestjs/cache-manager";

@Injectable()
export class AnalystServiceService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }


  @EventPattern('data')
  async handleUserCreated(data: any) {
    console.log(`data ${data}`);
  }

  @Cron('* */10 * * * *')
  async getStats() {
    try {
      const usersResponse = await axios.get('http://localhost:3001/api/getAllUsers');
      const users = usersResponse.data;

      const postsResponse = await axios.get('http://localhost:3002/api/getAllPosts');
      const posts = postsResponse.data;

       await this.processAndSaveStats(users, posts);

      // console.log(users)
      // console.log(posts)

    } catch (e) {
      console.log(e)
    }
  }

  private async processAndSaveStats(users: any[], posts: any[]) {
    const userPostsMap = new Map();

    for (const post of posts) {
      const userId = post.user_id;
      if (userPostsMap.has(userId)) {
        userPostsMap.set(userId, userPostsMap.get(userId) + 1);
      } else {
        userPostsMap.set(userId, 1);
      }
    }
    for (const [userId, postCount] of userPostsMap) {
      await this.cacheManager.set(userId, postCount);
    }
  }


}
