import { Injectable } from '@nestjs/common';

@Injectable()
export class PostServiceService {
  getData(): { message: string } {
    return { message: 'Hello Posts' };
  }
}
