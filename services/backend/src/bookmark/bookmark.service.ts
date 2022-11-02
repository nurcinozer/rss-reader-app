import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarks(user: User): Promise<Bookmark[]> {
    return await this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
    });
  }
}
