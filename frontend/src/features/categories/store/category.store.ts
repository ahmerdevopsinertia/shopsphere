import { create } from 'zustand';

import type {
	Category,
} from '../types/category.types';

interface CategoryState {

	categories: Category[];

	loading: boolean;

	error: string | null;

	setCategories: (
		categories: Category[],
	) => void;

	setLoading: (
		loading: boolean,
	) => void;

	setError: (
		error: string | null,
	) => void;
}

export const useCategoryStore =
	create<CategoryState>((set) => ({

		categories: [],

		loading: false,

		error: null,

		setCategories: (
			categories,
		) =>
			set({
				categories,
			}),

		setLoading: (
			loading,
		) =>
			set({
				loading,
			}),

		setError: (
			error,
		) =>
			set({
				error,
			}),
	}));