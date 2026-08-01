import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
	@Transform(({ value }) => value.trim())
	@IsNotEmpty()
	@ApiProperty({
		example: 'iPhone 17 Case',
		description: 'Product display name',
	})
	name: string;

	@Transform(({ value }) => value?.trim())
	@IsOptional()
	@ApiProperty({
		example: 'Premium MagSafe compatible case',
		description: 'Product description',
	})
	description?: string;

	@Transform(({ value }) => value.trim().toUpperCase())
	@IsNotEmpty()
	sku: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@ApiProperty({
		example: 39,
		description: 'Product price',
	})
	price: number;

	@IsNotEmpty()
	@IsUUID()
	categoryId: string
}