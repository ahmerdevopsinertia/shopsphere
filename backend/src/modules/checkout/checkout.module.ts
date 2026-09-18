import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { OrdersModule } from '../orders/orders.module';
import { CartModule } from '../cart/cart.module';
import { CheckoutRepository } from './checkout.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';
import { KafkaModule } from 'src/infrastructure/kafka/kafka.module';

@Module({
  imports:[PrismaModule, ProductsModule, InventoryModule, OrdersModule, CartModule, KafkaModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutRepository],
  exports: [CheckoutRepository]
})
export class CheckoutModule {}
