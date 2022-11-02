import { JwtAuthGuard } from '@/auth/guards';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { User as RequestUser } from '@/user/decorators';
import { Feed, FeedItem, User } from '@prisma/client';
import { CreateFeedDto } from './dto';
import { Cache } from 'cache-manager';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('feed')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '1',
  path: 'feed',
})
export class FeedController {
  constructor(
    private feedService: FeedService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createFeed(
    @RequestUser() user: User,
    @Body() dto: CreateFeedDto,
  ): Promise<Feed> {
    await this.cacheManager.reset();
    return await this.feedService.createFeed(user, dto);
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getFeeds(@RequestUser() user: User): Promise<Feed[]> {
    const feeds = await this.cacheManager.get<Feed[]>(`feeds:${user.id}`);

    if (feeds) {
      return feeds;
    }

    const newFeeds = await this.feedService.getFeeds(user);

    await this.cacheManager.set(`feeds:${user.id}`, newFeeds);

    return newFeeds;
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getFeedById(@Param('id') id: number) {
    return await this.feedService.getFeedById(id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteFeed(@Param('id') id: number): Promise<Feed> {
    await this.cacheManager.reset();
    return await this.feedService.deleteFeed(id);
  }

  @Get('/:id/feed-items')
  @UseGuards(JwtAuthGuard)
  async getFeedItems(
    @Param('id') id: number,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<FeedItem[]> {
    return await this.feedService.getFeedItemsByFeedId(id, paginationQuery);
  }

  @Get('/:id/feed-items/:feedItemId')
  @UseGuards(JwtAuthGuard)
  async getFeedItemsByFeedId(
    @Param('id') id: number,
    @Param('feedItemId') feedItemId: number,
  ): Promise<FeedItem | null> {
    const feedItem = await this.feedService.getFeedItemById(feedItemId);

    if (!feedItem) {
      return null;
    }

    if (feedItem.feedId !== id) {
      return null;
    }

    return feedItem;
  }

  @Post('/:id/feed-items/:feedItemId/bookmark')
  @UseGuards(JwtAuthGuard)
  async addFeedItemToBookmark(
    @RequestUser() user: User,
    @Param('id') id: number,
    @Param('feedItemId') feedItemId: number,
  ): Promise<FeedItem | null> {
    const feedItem = await this.feedService.getFeedItemById(feedItemId);

    if (!feedItem) {
      return null;
    }

    if (feedItem.feedId !== id) {
      return null;
    }

    return await this.feedService.addFeedItemToBookmark(feedItem.id, user.id);
  }

  @Delete('/:id/feed-items/:feedItemId/bookmark')
  @UseGuards(JwtAuthGuard)
  async removeFeedItemFromBookmark(
    @RequestUser() user: User,
    @Param('id') id: number,
    @Param('feedItemId') feedItemId: number,
  ): Promise<FeedItem | null> {
    const feedItem = await this.feedService.getFeedItemById(feedItemId);

    if (!feedItem) {
      return null;
    }

    if (feedItem.feedId !== id) {
      return null;
    }

    return await this.feedService.removeFeedItemFromBookmark(
      feedItem.id,
      user.id,
    );
  }
}
