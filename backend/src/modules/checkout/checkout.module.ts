import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { OrdersModule } from '../orders/orders.module';
import { CartModule } from '../cart/cart.module';
import { CheckoutRepository } from './checkout.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartController } from '../cart/cart.controller';
import { CartRepository } from '../cart/cart.repository';
import { CartService } from '../cart/cart.service';
import { InventoryModule } from '../inventory/inventory.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports:[PrismaModule, ProductsModule, InventoryModule, OrdersModule, CartModule],
  controllers: [CheckoutController],
  providers: [CheckoutService, CheckoutRepository],
  exports: [CheckoutRepository]
})
export class CheckoutModule {}
