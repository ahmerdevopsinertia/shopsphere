import { create } from 'zustand';

import type {
	WishlistItem,
} from '../types/wishlist.types';

interface WishlistState {
	items: WishlistItem[];
	loading: boolean;

	setItems: (
		items: WishlistItem[],
	) => void;

	addItem: (
		item: WishlistItem,
	) => void;

	removeItem: (
		productId: string,
	) => void;

	setLoading: (
		loading: boolean,
	) => void;
}

export const useWishlistStore =
	create<WishlistState>((set) => ({
		items: [],

		loading: false,

		setItems: (items) =>
			set({
				items,
			}),

		addItem: (item) =>
			set((state) => {
				const exists =
					state.items.some(
						(existingItem) =>
							existingItem.productId ===
							item.productId,
					);

				if (exists) {
					return state;
				}

				return {
					items: [
						...state.items,
						item,
					],
				};
			}),

		removeItem: (productId) =>
			set((state) => ({
				items:
					state.items.filter(
						(item) =>
							item.productId !==
							productId,
					),
			})),

		setLoading: (loading) =>
			set({
				loading,
			}),
	}));