import {
	IsInt,
	Min,
} from 'class-validator';

import { Type } from 'class-transformer';


export class UpdateCartQuantityDto {
	@Type(() => Number)
	@IsInt()
	@Min(1)
	quantity: number;
}