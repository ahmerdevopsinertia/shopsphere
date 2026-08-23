import { create } from 'zustand';

import type { Cart } from '../types/cart.types';

interface CartState {
	cart: Cart | null;
	isLoading: boolean;

	setCart: (cart: Cart) => void;
	clearCart: () => void;
	setLoading: (loading: boolean) => void;
}

export const useCartStore =
	create<CartState>((set) => ({
		cart: null,
		isLoading: false,

		setCart: (cart) => {
			set({
				cart,
			});
		},

		clearCart: () => {
			set({
				cart: null,
			});
		},

		setLoading: (isLoading) => {
			set({
				isLoading,
			});
		},
	}));