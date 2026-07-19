import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

export class ProductQueryDto {

	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	page?: number = 1;


	@IsOptional()
	@Type(() => Number)
	@IsPositive()
	@Max(50)
	limit?: number = 10;
}