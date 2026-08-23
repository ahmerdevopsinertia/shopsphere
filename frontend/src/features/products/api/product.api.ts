import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	Product,
	ProductsResponse,
	ProductResponse,
} from '../types/product.types';

export async function getProducts(): Promise<Product[]> {
	const response =
		await apiClient.get<ProductsResponse>(
			API_ENDPOINTS.products.list,
		);
	return response.data.data.data;
}

export async function getProduct(
	id: string,
): Promise<Product> {
	const response =
		await apiClient.get<ProductResponse>(
			API_ENDPOINTS.products.detail(id),
		);
	return response.data.data;
}