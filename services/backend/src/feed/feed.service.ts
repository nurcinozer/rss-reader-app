import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Feed, User } from '@prisma/client';
import { CreateFeedDto } from './dto/create-feed.dto';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeed(user: User, dto: CreateFeedDto): Promise<Feed> {
    return await this.prisma.feed.create({
      data: {
        user: {
          connect: {
            email: user.email,
          },
        },
        title: dto.title,
        link: dto.link,
      },
    });
  }
}
