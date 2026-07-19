import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProfileRepository } from '../profile/profile.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsRepository } from './products.repository';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsRepository]
})
export class ProductsModule { }
