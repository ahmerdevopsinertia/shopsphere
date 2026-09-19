import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class OrderInventoryConsumer {
  private readonly logger = new Logger(
    OrderInventoryConsumer.name,
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
        `Inventory: Processing order ${event.data.orderId} for inventory reservation`,
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