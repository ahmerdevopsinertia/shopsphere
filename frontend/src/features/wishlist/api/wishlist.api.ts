import { apiClient} from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';

import type {
	AddWishlistItemRequest,
	WishlistCheckResponse,
	WishlistItem,
} from '../types/wishlist.types';

export async function getWishlist(): Promise<
	WishlistItem[]
> {
	const response =
		await apiClient.get<{
			success: boolean;
			data: WishlistItem[];
		}>(
			API_ENDPOINTS.wishlist.list,
		);

	return response.data.data;
}

export async function addWishlistItem(
	payload: AddWishlistItemRequest,
): Promise<void> {
	await apiClient.post(
		API_ENDPOINTS.wishlist.add,
		payload,
	);
}

export async function removeWishlistItem(
	productId: string,
): Promise<void> {
	await apiClient.delete(
		API_ENDPOINTS.wishlist.remove(
			productId,
		),
	);
}

export async function checkWishlistItem(
	productId: string,
): Promise<WishlistCheckResponse> {
	const response =
		await apiClient.get<{
			success: boolean;
			data: WishlistCheckResponse;
		}>(
			API_ENDPOINTS.wishlist.check(
				productId,
			),
		);

	return response.data.data;
}