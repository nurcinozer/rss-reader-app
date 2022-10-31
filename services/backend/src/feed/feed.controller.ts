import { JwtAuthGuard } from '@/auth/guards';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { User as RequestUser } from '@/user/decorators';
import { Feed, User } from '@prisma/client';
import { CreateFeedDto, UpdateFeedDto } from './dto';
import { Cache } from 'cache-manager';

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
  async getTodoById(@Param('id') id: number) {
    return await this.feedService.getFeedById(id);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateTodoById(@Param('id') id: number, @Body() dto: UpdateFeedDto) {
    await this.cacheManager.reset();
    return await this.feedService.updateFeedById(id, dto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteFeed(@Param('id') id: number): Promise<Feed> {
    await this.cacheManager.reset();
    return await this.feedService.deleteFeed(id);
  }
}
