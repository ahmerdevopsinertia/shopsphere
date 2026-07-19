import { Body, Controller, Get, Param, Post, Query, Search, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductQueryDto } from './dto/product-query-dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {

	constructor(private readonly productService: ProductsService) { }

	@Post()
	@UseGuards(
		JwtAuthGuard,
		RolesGuard,
	)
	@Roles('ADMIN')
	createProduct(@Body() dto: CreateProductDto): Promise<ProductResponseDto> {
		return this.productService.create(dto);
	}

	@Get(':id')
	findById(@Param('id') id: string): Promise<ProductResponseDto> {
		return this.productService.findById(id);
	}

	@Get()
	findAll(@Query() query: ProductQueryDto): Promise<ProductResponseDto> {
		return this.productService.findAll(query.page ?? 1, query.limit ?? 10, query.search ?? '');
	}
}
