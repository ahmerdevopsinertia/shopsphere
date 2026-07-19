import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoryService: CategoriesService) { }

	@UseGuards(
		JwtAuthGuard,
		RolesGuard,
	)
	@Roles('ADMIN')
	@Post()
	createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
		return this.categoryService.create(dto);
	}

	@Get()
	findAll() {
		return this.categoryService.findAll();
	}
}
