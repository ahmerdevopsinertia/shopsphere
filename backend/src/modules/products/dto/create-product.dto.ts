import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
	@Transform(({ value }) => value.trim())
	@IsNotEmpty()
	name: string;

	@Transform(({ value }) => value?.trim())
	@IsOptional()
	description?: string;

	@Transform(({ value }) => value.trim().toUpperCase())
	@IsNotEmpty()
	sku: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	price: number;

	@IsNotEmpty()
	@IsUUID()
	categoryId: string
}