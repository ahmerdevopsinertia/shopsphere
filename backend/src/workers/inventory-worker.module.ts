import { Module } from '@nestjs/common';
import { OrderInventoryConsumer } from '../infrastructure/kafka/order-inventory.consumer';
import { SqsEmailWorkerModule } from './sqs-email-worker/sqs-email-worker.module';
import { SqsSmsWorkerModule } from './sqs-sms-worker/sqs-sms-worker.module';

@Module({
  controllers: [OrderInventoryConsumer],
})
export class InventoryWorkerModule { }