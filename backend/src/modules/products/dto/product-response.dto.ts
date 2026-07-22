import { ProductInventoryResponseDto } from "./product-inventory-response-dto";

export class ProductResponseDto {
	id: string;
	name: string;
	price: number;
	sku: string;
	description?: string;
	categoryName: string;
	inventory?: ProductInventoryResponseDto | null;
}