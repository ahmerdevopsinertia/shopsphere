import { create } from 'zustand';

import type {
	Order,
	OrderPaginationMeta,
} from '../types/order.types';

interface OrderState {
	orders: Order[];
	currentOrder: Order | null;

	meta: OrderPaginationMeta | null;

	loading: boolean;
	detailLoading: boolean;

	error: string | null;

	setOrders: (
		orders: Order[],
		meta: OrderPaginationMeta,
	) => void;

	setCurrentOrder: (
		order: Order | null,
	) => void;

	setLoading: (
		loading: boolean,
	) => void;

	setDetailLoading: (
		loading: boolean,
	) => void;

	setError: (
		error: string | null,
	) => void;

	clearCurrentOrder: () => void;
}

export const useOrderStore =
	create<OrderState>((set) => ({
		orders: [],

		currentOrder: null,

		meta: null,

		loading: false,

		detailLoading: false,

		error: null,

		setOrders: (
			orders,
			meta,
		) =>
			set({
				orders,
				meta,
				error: null,
			}),

		setCurrentOrder: (
			currentOrder,
		) =>
			set({
				currentOrder,
				error: null,
			}),

		setLoading: (
			loading,
		) =>
			set({
				loading,
			}),

		setDetailLoading: (
			detailLoading,
		) =>
			set({
				detailLoading,
			}),

		setError: (
			error,
		) =>
			set({
				error,
			}),

		clearCurrentOrder: () =>
			set({
				currentOrder: null,
			}),
	}));