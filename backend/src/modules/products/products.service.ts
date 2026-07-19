import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { CategoriesRepository } from '../categories/categories.repository';
import { count } from 'console';

@Injectable()
export class ProductsService {
	constructor(
		private readonly productRepository: ProductsRepository,
		private readonly categoryRepository: CategoriesRepository) { }

	async create(dto: CreateProductDto): Promise<ProductResponseDto> {
		// Check SKU exist
		const existingSku = await this.productRepository.findBySku(dto.sku);

		if (existingSku) {
			throw new ConflictException('Product SKU already exists.');
		}

		// Check cateogry exist
		const existingCategory = await this.categoryRepository.findById(dto.categoryId);

		if (!existingCategory) {
			throw new NotFoundException('Category not found.');
		}

		const product = await this.productRepository.create(dto);

		return {
			id: product.id,
			name: product.name,
			price: Number(product.price),
			sku: product.sku,
			description: product.description ?? undefined,
			categoryName: product.category.name
		}
	}

	async findById(id: string): Promise<ProductResponseDto> {
		let product = await this.productRepository.findById(id);

		if (!product) {
			throw new NotFoundException('Product not found.');
		}

		return {
			id: product.id,
			name: product.name,
			price: Number(product.price),
			sku: product.sku,
			description: product.description ?? undefined,
			categoryName: product.category.name
		};
	}

	async findAll(page: number, limit: number, search: string): Promise<any> {
		const skip = (page - 1) * limit;

		const [products, total] = await Promise.all([
			this.productRepository.findAll(skip, limit, search),
			this.productRepository.count(search)
		]);

		return {
			data: products.map((product: any) => {
				return {
					id: product.id,
					name: product.name,
					price: Number(product.price),
					sku: product.sku,
					description: product.description ?? undefined,
					categoryName: product.category.name
				}
			}),
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit)
			}
		}
	}
}
