export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	imageUrl?: string;
	stock?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface ProductsResponse {
	success: boolean;
	data: {
		data: Product[]
	};
}

export interface ProductResponse {
	success: boolean;
	data: Product;
}