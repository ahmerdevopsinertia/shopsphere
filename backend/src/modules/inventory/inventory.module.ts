import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { InventoryRepository } from './inventory.repository';
import { ProductsModule } from '../products/products.module';

@Module({
  imports:[PrismaModule, ProductsModule],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryRepository],
  exports: [InventoryRepository]
})
export class InventoryModule {

}
