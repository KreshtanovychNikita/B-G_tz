import { Module } from '@nestjs/common';

import process from "process";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceModule } from './user/user-service.module';
import { UserEntity } from './user/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),  // Додаємо ConfigModule для роботи з env змінними
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_USER,
        entities: [UserEntity],
        synchronize: true,
      }),
    }),
    UserServiceModule,
  ],
})
export class AppModule {}
