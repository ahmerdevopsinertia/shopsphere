import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	AddCartItemRequest,
	Cart,
	CartResponse,
	UpdateCartItemQuantityRequest,
	UpdateCartRequest,
} from '../types/cart.types';

export async function getCart(): Promise<Cart> {
	const response =
		await apiClient.get<CartResponse>(
			API_ENDPOINTS.cart.get,
		);

	return response.data.data;
}

export async function addCartItem(
	payload: AddCartItemRequest,
): Promise<Cart> {
	const response =
		await apiClient.post<CartResponse>(
			API_ENDPOINTS.cart.add,
			payload,
		);

	return response.data.data;
}

export async function updateCart(
	payload: UpdateCartRequest,
): Promise<Cart> {
	const response =
		await apiClient.put<CartResponse>(
			API_ENDPOINTS.cart.update,
			payload,
		);

	return response.data.data;
}

export async function updateCartItemQuantity(
	productId: string,
	payload: UpdateCartItemQuantityRequest,
): Promise<Cart> {
	const response =
		await apiClient.patch<CartResponse>(
			API_ENDPOINTS.cart.updateItem(productId),
			payload,
		);

	return response.data.data;
}

export async function deleteCartItems(productId: string): Promise<Cart> {
	const response =
		await apiClient.delete<CartResponse>(
			API_ENDPOINTS.cart.deleteCartItem(productId)
		);

	return response.data.data;
}

export async function deleteCart(): Promise<Cart> {
	const response =
		await apiClient.delete<CartResponse>(
			API_ENDPOINTS.cart.delete
		);

	return response.data.data;
}