import { create } from 'zustand';

import type {
	Product,
	ProductListMeta,
} from '../types/product.types';

interface ProductState {
	products: Product[];
	meta: ProductListMeta | null;
	loading: boolean;
	error: string | null;

	setProducts: (
		products: Product[],
		meta: ProductListMeta,
	) => void;

	setLoading: (loading: boolean) => void;

	setError: (error: string | null) => void;
}

export const useProductStore =
	create<ProductState>((set) => ({
		products: [],
		meta: null,
		loading: false,
		error: null,

		setProducts: (
			products,
			meta,
		) =>
			set({
				products,
				meta,
			}),

		setLoading: (loading) =>
			set({
				loading,
			}),

		setError: (error) =>
			set({
				error,
			}),
	}));