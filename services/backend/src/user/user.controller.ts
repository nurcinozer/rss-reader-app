import {
  Body,
  CACHE_MANAGER,
  CacheKey,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { UserService } from '@/user/user.service';
import { isHttpException } from '@/common';
import { User as RequestUser } from '@/user/decorators';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto';
import { Cache } from 'cache-manager';

@ApiTags('user')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@Controller({
  version: '1',
  path: 'user',
})
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @CacheKey('currentUser')
  async getCurrentUser(@RequestUser() user: User): Promise<User> {
    const result = await this.userService.getUserByEmail(user.email);

    if (isHttpException(result)) {
      throw result;
    }

    return result;
  }

  @Get('/:email')
  @UseGuards(JwtAuthGuard)
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const result = await this.userService.getUserByEmail(email);

    if (isHttpException(result)) {
      throw result;
    }

    return result;
  }

  @Patch('/')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @RequestUser() user: { userId: number },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    await this.cacheManager.del('currentUser');
    return await this.userService.updateUser(user.userId, dto);
  }
}
