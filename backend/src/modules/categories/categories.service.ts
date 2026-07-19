import { ConflictException, Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
	constructor(private readonly categoryRepository: CategoriesRepository) { }
	private generateSlug(name: string): string {
		return name
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-');
	}

	async create(
		dto: CreateCategoryDto,
	): Promise<CategoryResponseDto> {

		const slug =
			this.generateSlug(dto.name);

		const existingCategory =
			await this.categoryRepository.findBySlug(
				slug
			);

		if (existingCategory) {
			throw new ConflictException(
				'Category already exists.'
			);
		}

		const category =
			await this.categoryRepository.create({
				name: dto.name,
				slug,
			});


		return {
			id: category.id,
			name: category.name,
			slug: category.slug,
		};
	}

	async findAll() {
		return this.categoryRepository.findAll();
	}
}
