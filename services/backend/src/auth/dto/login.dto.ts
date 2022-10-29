import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MinLength(1)
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
