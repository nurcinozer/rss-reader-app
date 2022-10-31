import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AsyncResult } from '@/common';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string): AsyncResult<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return new NotFoundException(`User not found: ${email}`);
    }

    return user;
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
