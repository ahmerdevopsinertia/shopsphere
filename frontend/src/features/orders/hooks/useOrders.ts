import {
	useCallback,
} from 'react';

import {
	getOrderById,
	getOrders,
} from '../api/order.api';

import {
	useOrderStore,
} from '../store/order.store';

export function useOrders() {
	const orders =
		useOrderStore(
			(state) => state.orders,
		);

	const currentOrder =
		useOrderStore(
			(state) => state.currentOrder,
		);

	const meta =
		useOrderStore(
			(state) => state.meta,
		);

	const loading =
		useOrderStore(
			(state) => state.loading,
		);

	const detailLoading =
		useOrderStore(
			(state) =>
				state.detailLoading,
		);

	const error =
		useOrderStore(
			(state) => state.error,
		);

	const setOrders =
		useOrderStore(
			(state) => state.setOrders,
		);

	const setCurrentOrder =
		useOrderStore(
			(state) =>
				state.setCurrentOrder,
		);

	const setLoading =
		useOrderStore(
			(state) => state.setLoading,
		);

	const setDetailLoading =
		useOrderStore(
			(state) =>
				state.setDetailLoading,
		);

	const setError =
		useOrderStore(
			(state) => state.setError,
		);

	const clearCurrentOrder =
		useOrderStore(
			(state) =>
				state.clearCurrentOrder,
		);

	const loadOrders =
		useCallback(
			async (
				page = 1,
				limit = 10,
				search?: string,
			) => {
				try {
					setLoading(true);
					setError(null);

					const response =
						await getOrders(
							page,
							limit,
							search,
						);

					setOrders(
						response.data,
						response.meta,
					);

					return response;
				} catch (error) {
					console.error(
						'Failed to load orders:',
						error,
					);

					setError(
						'Unable to load orders.',
					);

					throw error;
				} finally {
					setLoading(false);
				}
			},
			[
				setLoading,
				setError,
				setOrders,
			],
		);

	const loadOrder =
		useCallback(
			async (
				orderId: string,
			) => {
				try {
					setDetailLoading(
						true,
					);

					setError(null);

					const order =
						await getOrderById(
							orderId,
						);

					setCurrentOrder(
						order,
					);

					return order;
				} catch (error) {
					console.error(
						'Failed to load order:',
						error,
					);

					setError(
						'Unable to load order.',
					);

					throw error;
				} finally {
					setDetailLoading(
						false,
					);
				}
			},
			[
				setDetailLoading,
				setError,
				setCurrentOrder,
			],
		);

	return {
		orders,
		currentOrder,
		meta,
		loading,
		detailLoading,
		error,
		loadOrders,
		loadOrder,
		clearCurrentOrder,
	};
}