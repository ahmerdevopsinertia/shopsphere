import {
  Controller,
  Logger,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class OrderNotificationConsumer {
  private readonly logger = new Logger(
    OrderNotificationConsumer.name,
  );

  @EventPattern('shopsphere.order.events')
  async handleOrderEvent(
    @Payload() event: any,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const message = context.getMessage();

    this.logger.log(
      `Received Kafka event: ${event.eventType}`,
    );

    if (event.eventType === 'order.created') {
      this.logger.log(
        `Notification: Order ${event.data.orderId} created successfully for customer ${event.data.customerId}`,
      );
    }

    this.logger.debug(
      `Kafka partition: ${context.getPartition()}`,
    );

    this.logger.debug(
      `Kafka offset: ${message.offset}`,
    );
  }
}