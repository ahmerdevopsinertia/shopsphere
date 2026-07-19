import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
	@Transform(({ value }) => value.trim())
	@IsNotEmpty()
	name: string;
}