import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SnsPublisherService, NotificationRequestedEvent } from './sns-publisher.service';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'crypto';

@Injectable()
export class NotificationOutboxPublisherService {
  private readonly logger = new Logger(
    NotificationOutboxPublisherService.name,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly snsPublisher: SnsPublisherService,
  ) { }

  async publishPendingEvents(batchSize = 10): Promise<void> {
    const events = await this.prisma.notificationOutbox.findMany({
      where: { publishedAt: null },
      orderBy: { createdAt: 'asc' },
      take: batchSize,
    });

    for (const record of events) {
      try {
        await this.snsPublisher.publishNotification(
          record.payload as unknown as NotificationRequestedEvent,
        );

        await this.prisma.notificationOutbox.update({
          where: { id: record.id },
          data: {
            publishedAt: new Date(),
            attempts: { increment: 1 },
            lastError: null,
          },
        });

        this.logger.log(`Published outbox event ${record.eventId}`);
      } catch (error) {
        await this.prisma.notificationOutbox.update({
          where: { id: record.id },
          data: {
            attempts: { increment: 1 },
            lastError:
              error instanceof Error
                ? error.message.slice(0, 2000)
                : 'Unknown publishing error',
          },
        });

        this.logger.error(
          `Failed to publish outbox event ${record.eventId}`,
          error instanceof Error ? error.stack : undefined,
        );
      }
    }
  }

  private isProcessing = false;

  @Cron('0 */5 * * * *')
  async processPendingEvents(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      await this.publishPendingEvents(10);
    } catch (error) {
      this.logger.error(
        'Failed to process notification outbox',
        error instanceof Error ? error.stack : undefined,
      );
    } finally {
      this.isProcessing = false;
    }
  }
}