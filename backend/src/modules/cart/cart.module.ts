import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from './cart.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from '../products/products.module';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports:[PrismaModule, ProductsModule, InventoryModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartRepository]
})
export class CartModule {}
