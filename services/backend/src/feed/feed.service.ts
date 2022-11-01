import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Feed, FeedItem, User } from '@prisma/client';
import { CreateFeedDto } from './dto/create-feed.dto';
import Parser = require('rss-parser');

@Injectable()
export class FeedService {
  parser: Parser;

  constructor(private readonly prisma: PrismaService) {
    this.parser = new Parser();
  }

  async createFeed(user: User, dto: CreateFeedDto): Promise<Feed> {
    try {
      const feedInfo = await this.parser.parseURL(dto.link);
      const feed = await this.prisma.feed.create({
        data: {
          user: {
            connect: {
              email: user.email,
            },
          },
          link: dto.link,
          title: feedInfo.title as string,
        },
      });
      await this.updateFeedItem(feed);
      return feed;
    } catch {
      throw new Error('Invalid feed url');
    }
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

  async updateFeedItem(feed: Feed): Promise<void> {
    const rssFeed = await this.parser.parseURL(feed.link);

    for (const item of rssFeed.items) {
      await this.prisma.feedItem.create({
        data: {
          feed: {
            connect: {
              id: feed.id,
            },
          },
          title: item.title as string,
          link: item.link as string,
          content: item.content as string,
        },
      });

      await this.prisma.feed.update({
        where: {
          id: feed.id,
        },
        data: {
          title: rssFeed.title as string,
        },
      });
    }
  }

  async getFeedItemsByFeedId(id: number): Promise<FeedItem[]> {
    return await this.prisma.feedItem.findMany({
      where: {
        feedId: id,
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
