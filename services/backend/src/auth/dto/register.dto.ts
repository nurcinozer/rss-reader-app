import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @MaxLength(255)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email address', example: 'user@test.com' })
  email!: string;

  @MaxLength(256)
  @IsNotEmpty()
  @IsString()
  password!: string;

  @MaxLength(256)
  @IsNotEmpty()
  @IsString()
  confirmPassword!: string;

  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  fullName!: string;
}
