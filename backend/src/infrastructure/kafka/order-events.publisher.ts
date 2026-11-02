import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { KafkaProducerService } from './kafka-producer.service';
import {
  OrderCreatedEvent,
  OrderCreatedEventData,
} from './events/order-created.event';

@Injectable()
export class OrderEventsPublisher {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async publishOrderCreated(
    data: OrderCreatedEventData,
  ): Promise<void> {
    const event: OrderCreatedEvent = {
      eventId: randomUUID(),
      eventType: 'order.created',
      eventVersion: 1,
      occurredAt: new Date().toISOString(),
      source: 'shopsphere-order-service',
      data,
    };

    await this.kafkaProducer.publish(
      'shopsphere.order.events',
      event, data.orderId
    );
  }
}