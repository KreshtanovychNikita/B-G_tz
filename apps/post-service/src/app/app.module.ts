import { Module } from '@nestjs/common';

import process from "process";
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostServiceModule } from './post/post-service.module';
import { PostEntity } from './post/entities/post.entity';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_POST,
        entities: [PostEntity],
        synchronize: true,
      }),
    }),
    PostServiceModule,
  ],
})
export class AppModule {}
