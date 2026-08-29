export interface WishlistItem {
	productId: string;
	name: string;
	price: number;
	imageUrl?: string | null;
}

export interface AddWishlistItemRequest {
	productId: string;
}

export interface WishlistCheckResponse {
	isFavorite: boolean;
}