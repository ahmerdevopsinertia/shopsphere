import {
	IsArray,
	ValidateNested,
	IsUUID,
	IsInt,
	Min,
} from 'class-validator';

import { Type } from 'class-transformer';


export class CartItemsDto {

	@IsUUID()
	productId: string;


	@Type(() => Number)
	@IsInt()
	@Min(1)
	quantity: number;
}

export class ReplaceCartItemsDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemsDto)
	items: CartItemsDto[];
}