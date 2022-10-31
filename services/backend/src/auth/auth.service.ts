import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthWithoutPasswordDto, JwtPayload, RegisterDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthWithUser } from './types';
import { AsyncResult, createCookie } from '@/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  public get cookieForLogout(): string {
    return createCookie({
      name: 'jwt-token',
      value: '',
      isHttpOnly: true,
      path: '/',
      maxAge: '0',
    });
  }

  public async doesUserExist(email: string): Promise<boolean> {
    const user = await this.prisma.auth.count({
      where: {
        email,
      },
    });

    return user > 0;
  }

  async saveUser(dto: RegisterDto): AsyncResult<AuthWithoutPasswordDto> {
    try {
      const hashed = await argon2.hash(dto.password, { type: argon2.argon2i });

      const saved = await this.prisma.auth.create({
        data: {
          email: dto.email,
          password: hashed,
          user: {
            create: {
              email: dto.email,
              fullName: dto.fullName,
            },
          },
        },
        include: {
          user: true,
        },
      });

      const { ...rest } = saved;
      const { ...auth } = rest;

      return auth;
    } catch (e) {
      return new InternalServerErrorException('Cannot save user');
    }
  }

  public async findUserByEmail(email: string): AsyncResult<AuthWithUser> {
    const user = await this.prisma.auth.findUnique({
      where: {
        email,
      },
      include: {
        user: true,
      },
    });

    if (!user) {
      return new NotFoundException(`User not found: ${email}`);
    }

    return user;
  }

  public async doPasswordsMatch(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return await argon2.verify(hashed, plain, { type: argon2.argon2i });
  }

  public signJwtPaylod(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  public confirmPassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }
}
