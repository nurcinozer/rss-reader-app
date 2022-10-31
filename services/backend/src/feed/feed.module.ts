import { CacheModule, Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [CacheModule.register(), PrismaModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
