
import { Module } from '@nestjs/common';
import { SnsPublisherService } from './sns-publisher.service';
import { NotificationOutboxPublisherService } from './notification-outbox-publisher.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SnsPublisherService, NotificationOutboxPublisherService],
  exports: [SnsPublisherService, NotificationOutboxPublisherService],
})
export class AwsSnsModule { }
