import { apiClient } from '../../../api/client';

import type {
	Product,
	ProductListResponse,
	ProductQuery,
} from '../types/product.types';

import { API_ENDPOINTS } from '../../../api/endpoints';

export async function getProducts(
	query?: ProductQuery,
): Promise<ProductListResponse> {

	const response =
		await apiClient.get<{
			success: boolean;
			data: ProductListResponse;
		}>(
			API_ENDPOINTS.products.list,
			{
				params: query,
			},
		);

	return response.data.data;
}

export async function getProduct(
	id: string,
): Promise<Product> {

	const response =
		await apiClient.get<{
			success: boolean;
			data: Product;
		}>(
			`${API_ENDPOINTS.products.list}/${id}`,
		);

	return response.data.data;
}