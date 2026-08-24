import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	Category,
	CreateCategoryRequest,
} from '../types/category.types';

export async function getCategories():
	Promise<Category[]> {

	const response =
		await apiClient.get<{
			success: boolean;
			data: Category[];
		}>(
			API_ENDPOINTS.categories.list,
		);

	return response.data.data;
}

export async function createCategory(
	payload: CreateCategoryRequest,
): Promise<Category> {

	const response =
		await apiClient.post<{
			success: boolean;
			data: Category;
		}>(
			API_ENDPOINTS.categories.list,
			payload,
		);

	return response.data.data;
}