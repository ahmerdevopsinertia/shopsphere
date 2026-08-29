import { useCallback } from 'react';

import {
	addWishlistItem,
	getWishlist,
	removeWishlistItem,
} from '../api/wishlist.api';

import {
	useWishlistStore,
} from '../store/wishlist.store';

import type { WishlistItem } from '../types/wishlist.types';

export function useWishlist() {
	const items = useWishlistStore(
		(state) => state.items,
	);

	const loading = useWishlistStore(
		(state) => state.loading,
	);

	const setItems = useWishlistStore(
		(state) => state.setItems,
	);

	const addItemToStore = useWishlistStore(
		(state) => state.addItem,
	);

	const removeItemFromStore =
		useWishlistStore(
			(state) => state.removeItem,
		);

	const setLoading = useWishlistStore(
		(state) => state.setLoading,
	);

	/*
	 * ============================
	 * Load Wishlist
	 * ============================
	 */

	const loadWishlist = useCallback(
		async () => {
			try {
				setLoading(true);

				const data =
					await getWishlist();

				setItems(data);

				return data;
			} finally {
				setLoading(false);
			}
		},
		[
			setItems,
			setLoading,
		],
	);

	/*
	 * ============================
	 * Add Wishlist Item
	 * ============================
	 */

	const addToWishlist =
		useCallback(
			async (
				product: WishlistItem,
			) => {
				try {
					setLoading(true);

					await addWishlistItem({
						productId:
							product.productId,
					});

					addItemToStore(product);
				} finally {
					setLoading(false);
				}
			},
			[
				addItemToStore,
				setLoading,
			],
		);

	/*
	 * ============================
	 * Remove Wishlist Item
	 * ============================
	 */

	const removeFromWishlist =
		useCallback(
			async (
				productId: string,
			) => {
				try {
					setLoading(true);

					await removeWishlistItem(
						productId,
					);

					removeItemFromStore(
						productId,
					);
				} finally {
					setLoading(false);
				}
			},
			[
				removeItemFromStore,
				setLoading,
			],
		);

	/*
	 * ============================
	 * Check Wishlist
	 * ============================
	 *
	 * IMPORTANT:
	 * This should be synchronous.
	 *
	 * We already loaded the wishlist
	 * into Zustand.
	 */

	const isWishlisted = useCallback(
		(productId: string) => {
			return items.some(
				(item) =>
					item.productId ===
					productId,
			);
		},
		[items],
	);

	return {
		items,
		loading,

		loadWishlist,

		addToWishlist,
		removeFromWishlist,

		isWishlisted,
	};
}