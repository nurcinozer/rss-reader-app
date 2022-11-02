import {
  Controller,
  Get,
  UseGuards,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiConsumes, ApiProduces } from '@nestjs/swagger';
import { Bookmark, User } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards';
import { BookmarkService } from './bookmark.service';
import { User as RequestUser } from '@/user/decorators';
import { Cache } from 'cache-manager';

@ApiTags('bookmark')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '1',
  path: 'bookmark',
})
export class BookmarkController {
  constructor(
    private bookmarkService: BookmarkService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getFeeds(@RequestUser() user: User): Promise<Bookmark[]> {
    const bookmarks = await this.cacheManager.get<Bookmark[]>(
      `bookmarks:${user.id}`,
    );

    if (bookmarks) {
      return bookmarks;
    }

    const newBookmarks = await this.bookmarkService.getBookmarks(user);

    await this.cacheManager.set(`feeds:${user.id}`, newBookmarks);

    return newBookmarks;
  }
}
