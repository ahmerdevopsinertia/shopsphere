import {
	IsArray,
	ValidateNested,
	IsUUID,
	IsInt,
	Min,
} from 'class-validator';

import { Type } from 'class-transformer';


class OrderItemDto {

	@IsUUID()
	productId: string;


	@Type(() => Number)
	@IsInt()
	@Min(1)
	quantity: number;
}

export class CreateOrderDto {

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[];
}