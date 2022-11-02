import { PaginationQueryDto } from '@/feed/dto/pagination-query.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Bookmark, User } from '@prisma/client';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async getBookmarks(
    user: User,
    paginationQuery: PaginationQueryDto,
  ): Promise<Bookmark[]> {
    const { page = 1, size = 10 } = paginationQuery;

    return await this.prisma.bookmark.findMany({
      where: {
        userId: user.id,
      },
      skip: (page - 1) * size,
      take: size,
    });
  }
}
