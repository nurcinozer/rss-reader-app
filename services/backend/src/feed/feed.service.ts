import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Feed, User } from '@prisma/client';
import { UpdateFeedDto } from '@/feed/dto';
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

  async getFeeds(user: User): Promise<Feed[]> {
    return await this.prisma.feed.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async getFeedById(id: number): Promise<Feed | null> {
    return await this.prisma.feed.findUnique({
      where: {
        id,
      },
    });
  }

  async updateFeedById(id: number, dto: UpdateFeedDto): Promise<Feed> {
    return await this.prisma.feed.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteFeed(id: number): Promise<Feed> {
    return await this.prisma.feed.delete({
      where: {
        id,
      },
    });
  }
}
