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
    // localhost:3000/feed/1/feed-items?page=1&limit=10
  }
}
