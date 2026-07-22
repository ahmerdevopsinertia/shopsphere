import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UpdateInventoryDto {
	@Type(() => Number)
	@IsInt()
	change: number;
}