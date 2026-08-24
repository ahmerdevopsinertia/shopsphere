import { useCallback } from 'react';

import { useProductStore } from '../store/product.store';
import { getProducts } from '../api/product.api';

import type {
	ProductQuery,
} from '../types/product.types';

export function useProducts() {

	const products =
		useProductStore(
			(state) => state.products,
		);

	const meta =
		useProductStore(
			(state) => state.meta,
		);

	const loading =
		useProductStore(
			(state) => state.loading,
		);

	const error =
		useProductStore(
			(state) => state.error,
		);

	const setProducts =
		useProductStore(
			(state) => state.setProducts,
		);

	const setLoading =
		useProductStore(
			(state) => state.setLoading,
		);

	const setError =
		useProductStore(
			(state) => state.setError,
		);

	const loadProducts =
		useCallback(
			async (
				query?: ProductQuery,
			) => {

				try {

					setLoading(true);
					setError(null);

					const response =
						await getProducts(
							query,
						);

					setProducts(
						response.data,
						response.meta,
					);

					return response;

				} catch (error) {

					console.error(
						'Failed to load products:',
						error,
					);

					setError(
						'Unable to load products.',
					);

					throw error;

				} finally {

					setLoading(false);

				}
			},
			[
				setError,
				setLoading,
				setProducts,
			],
		);

	return {
		products,
		meta,
		loading,
		error,
		loadProducts,
	};
}