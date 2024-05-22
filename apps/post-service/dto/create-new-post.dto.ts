import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateNewPostDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
