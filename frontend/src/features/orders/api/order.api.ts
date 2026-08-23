import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	Order,
	OrderListResponse,
} from '../types/order.types';

export async function getOrders(
	page = 1,
	limit = 10,
	search?: string,
): Promise<OrderListResponse> {
	const response = await apiClient.get<{
		success: boolean;
		data: OrderListResponse;
	}>(API_ENDPOINTS.orders.list, {
		params: {
			page,
			limit,
			...(search
				? {
					search,
				}
				: {}),
		},
	});

	return response.data.data;
}

export async function getOrderById(
	orderId: string,
): Promise<Order> {
	const response = await apiClient.get<{
		success: boolean;
		data: Order;
	}>(
		`${API_ENDPOINTS.orders.detail(orderId)}`,
	);

	return response.data.data;
}