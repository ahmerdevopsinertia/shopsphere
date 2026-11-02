import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { NotificationWorkerModule } from './notification-worker.module';

async function bootstrap() {
  const app =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      NotificationWorkerModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'shopsphere-notification-consumer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'shopsphere-order-notification',
          },
        },
      },
    );

  await app.listen();
}

bootstrap();