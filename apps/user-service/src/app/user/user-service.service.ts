import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateNewUserDto} from "../../../dto/create-new-user.dto";
import * as bcrypt from 'bcrypt';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";
import {ClientProxy, EventPattern} from "@nestjs/microservices";
import {UpdateUserDto} from "../../../dto/update-user.dto";
import { createTransport } from 'nodemailer';

@Injectable()
export class UserServiceService {

  @InjectRepository(UserEntity)
  private UserRepository: Repository<UserEntity>;

  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}
  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async sendMail(email: string) {
  //   const transporter = createTransport({
  //
  //
  //   });
  //   await transporter.sendMail({
  //     from: 'test@email.com',
  //     to: email,
  //     subject: 'Welcome to our platform!',
  //     text: 'Hello, welcome to our platform!',
  //   });
  // }
    console.log(`email was send to ${email}`)
  }



  async getAllUsers() {
    return this.UserRepository.find();
  }

  async getUserById(id) {
    return this.UserRepository.findOne({where : { id } });
  }

  async createNewUser(user: CreateNewUserDto) {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const newUser =  await this.UserRepository.createQueryBuilder('user')
        .insert()
        .into(UserEntity)
        .values({
          email: user.email,
          name: user.name,
          password: hashedPassword,
        })
        .execute();
      if(!newUser) {
        throw new HttpException('User creation failed', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        this.client.emit('user_created', {email: user.email});
        return newUser;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async updateUser(id, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.UserRepository.findOne({where: { id }});
      console.log(user)
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
      }

      await this.UserRepository.update(id, updateUserDto);
      return this.UserRepository.findOne({where : { id } });
    } catch (e) {
      console.log(e)
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.UserRepository.findOne({where: {id}});
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      await this.UserRepository.delete(id);
      // this.client.emit('user-deleted', user)
    } catch (e) {
      console.log(e)
    }
  }

}
