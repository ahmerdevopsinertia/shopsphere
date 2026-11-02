import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaTestController } from './kafka-test.controller';
import { OrderEventsPublisher } from './order-events.publisher';
import { OrderNotificationConsumer } from './order-notification.consumer';
import { OrderInventoryConsumer } from './order-inventory.consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'shopsphere-backend',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'shopsphere-backend',
          },
        },
      },
    ]),
  ],
  controllers: [
    KafkaTestController,
  ],
  providers: [
    KafkaProducerService,
    OrderEventsPublisher
  ],
  exports: [
    KafkaProducerService,
    OrderEventsPublisher
  ],
})
export class KafkaModule { } 