import { Module } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [PrismaModule],
	providers: [
		CategoriesRepository,
		CategoriesService
	],
	controllers: [CategoriesController],
	exports: [
		CategoriesRepository,
	],
})
export class CategoriesModule { }