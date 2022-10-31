import { JwtAuthGuard } from '@/auth/guards';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { User as RequestUser } from '@/user/decorators';
import { Feed, User } from '@prisma/client';
import { CreateFeedDto } from './dto';
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
}
