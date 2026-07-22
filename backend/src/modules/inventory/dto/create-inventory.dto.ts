import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInventoryDto {
	@IsNotEmpty()
	@IsUUID()
	productId: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	quantity: number;
}