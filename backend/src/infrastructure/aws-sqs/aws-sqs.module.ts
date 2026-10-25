
import { Module } from '@nestjs/common';
import { SqsNotificationConsumerService } from './sqs-notification-consumer/sqs-notification-consumer.service';

@Module({
  providers: [SqsNotificationConsumerService],
  exports: [SqsNotificationConsumerService],
})
export class AwsSqsModule {}
