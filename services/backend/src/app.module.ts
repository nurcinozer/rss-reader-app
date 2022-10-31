import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/user/user.module';
import { FeedModule } from '@/feed/feed.module';
import * as redisStore from 'cache-manager-redis-store';
import CustomHttpCacheInterceptor from '@/feed/interceptors/custom-http-cache.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: process.env.NODE_ENV === 'production' ? 120 : 300,
    }),
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      ttl: 5, // seconds
      max: 50, // maximum number of items in cache
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    FeedModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR, // https://docs.nestjs.com/interceptors
      useClass: CustomHttpCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
