
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SqsSmsWorkerModule } from './sqs-sms-worker.module';
import { SqsNotificationConsumerService } from '../../infrastructure/aws-sqs/sqs-notification-consumer/sqs-notification-consumer.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(
    SqsSmsWorkerModule,
  );

  const config = app.get(ConfigService);
  const consumer = app.get(SqsNotificationConsumerService);
  const queueUrl = config.get<string>('aws.sqsSmsQueueUrl');

  await consumer.pollQueue(queueUrl ?? '', 'sms');
}

bootstrap().catch((error) => {
  console.error('SMS worker failed to start:', error);
  process.exitCode = 1;
});
