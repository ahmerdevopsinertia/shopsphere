import { useCallback } from 'react';

import { getCategories } from '../api/category.api';
import { useCategoryStore } from '../store/category.store';

export function useCategories() {
	const categories =
		useCategoryStore(
			(state) => state.categories,
		);

	const loading =
		useCategoryStore(
			(state) => state.loading,
		);

	const error =
		useCategoryStore(
			(state) => state.error,
		);

	const setCategories =
		useCategoryStore(
			(state) => state.setCategories,
		);

	const setLoading =
		useCategoryStore(
			(state) => state.setLoading,
		);

	const setError =
		useCategoryStore(
			(state) => state.setError,
		);

	const loadCategories =
		useCallback(async () => {
			try {
				setLoading(true);
				setError(null);

				const data =
					await getCategories();

				setCategories(data);

				return data;
			} catch (error) {
				console.error(
					'Failed to load categories:',
					error,
				);

				setError(
					'Unable to load categories.',
				);

				throw error;
			} finally {
				setLoading(false);
			}
		}, [
			setCategories,
			setError,
			setLoading,
		]);

	return {
		categories,
		loading,
		error,
		loadCategories,
	};
}