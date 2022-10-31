import { OmitType } from '@nestjs/swagger';
import { Auth as PrismaAuth } from '@prisma/client';

class Auth implements PrismaAuth {
  id!: number;
  email!: string;
  password!: string;
  userId!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class AuthWithoutPasswordDto extends OmitType(Auth, [
  'password',
] as const) {}
