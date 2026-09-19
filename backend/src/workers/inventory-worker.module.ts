import { Module } from '@nestjs/common';
import { OrderInventoryConsumer } from '../infrastructure/kafka/order-inventory.consumer';

@Module({
  controllers: [OrderInventoryConsumer],
})
export class InventoryWorkerModule {}