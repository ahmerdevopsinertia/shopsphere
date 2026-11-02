
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SqsEmailWorkerModule } from './sqs-email-worker.module';
import { SqsNotificationConsumerService } from '../../infrastructure/aws-sqs/sqs-notification-consumer/sqs-notification-consumer.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    SqsEmailWorkerModule,
  );

  const config = app.get(ConfigService);
  const consumer = app.get(SqsNotificationConsumerService);
  const queueUrl = config.get<string>('aws.sqsEmailQueueUrl');

  await consumer.pollQueue(queueUrl ?? '', 'email');
}

bootstrap().catch((error) => {
  console.error('Email worker failed to start:', error);
  process.exitCode = 1;
});
