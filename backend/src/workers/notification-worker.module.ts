import { Module } from '@nestjs/common';
import { OrderNotificationConsumer } from '../infrastructure/kafka/order-notification.consumer';

@Module({
  controllers: [OrderNotificationConsumer],
})
export class NotificationWorkerModule {}