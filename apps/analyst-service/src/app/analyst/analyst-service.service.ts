import {Inject, Injectable } from '@nestjs/common';
import {Cron} from "@nestjs/schedule";
import axios from 'axios';
import {ClientProxy, EventPattern} from "@nestjs/microservices";
import {RedisService} from "nestjs-redis";
import {CACHE_MANAGER} from '@nestjs/cache-manager'
import {Cache} from "@nestjs/cache-manager";

@Injectable()
export class AnalystServiceService {
  constructor(
    // @Inject('ANALYTICS_SERVICE') private readonly clientProxy: ClientProxy,
    // @Inject('USER_SERVICE') private readonly clientUser: ClientProxy
    // private readonly redisService: RedisService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  // @Cron('*/10 * * * * *')
  // async getStats() {
  //   // this.clientUser.emit('user_created', {email: "dfdfs"});
  //   this.clientUser.emit('analytics_user', {});
  // }

  @EventPattern('data')
  async handleUserCreated(data: any) {
    console.log(`data ${data}`);
  }

  @Cron('*/10 * * * * *')
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

  // async handleStats(users: any[] , posts: any[]) {
  //   for (const user of users) {
  //     console.log(user)
  //     // const userId = user.userId;
  //     // const userPostCountKey = `user:${userId}:postCount`;
  //     // const currentPostCount = await this.redisService.getClient().get(userPostCountKey);
  //     // const newPostCount = currentPostCount ? Number(currentPostCount) + 1 : 1;
  //     // await this.redisService.getClient().set(userPostCountKey, newPostCount.toString());
  //   }
  // }

}
