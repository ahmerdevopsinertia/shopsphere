import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	CheckoutResponse,
} from '../types/checkout.types';

export async function checkout(): Promise<CheckoutResponse> {
	const response = await apiClient.post<{
		success: boolean;
		data: CheckoutResponse;
	}>(
		API_ENDPOINTS.checkout.create,
	);

	return response.data.data;
}