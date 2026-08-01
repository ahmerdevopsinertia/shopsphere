import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Max, MaxLength } from 'class-validator';

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

	@IsOptional()
	@IsString()
	@MaxLength(100)
	search?: string;
}