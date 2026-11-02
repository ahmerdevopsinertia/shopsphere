import { Controller, Get } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

@Controller('kafka')
export class KafkaTestController {
  constructor(
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  @Get('test')
  async testKafka() {
    await this.kafkaProducer.publish(
      'shopsphere.order.events',
      {
        eventId: 'test-event',
        eventType: 'test.message',
        eventVersion: 1,
        occurredAt: new Date().toISOString(),
        source: 'shopsphere-backend',
        data: {
          message: 'Kafka is working!',
        },
      },
    );

    return {
      message: 'Kafka event published successfully',
    };
  }
}