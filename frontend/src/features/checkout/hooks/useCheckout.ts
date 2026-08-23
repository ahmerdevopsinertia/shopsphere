import { useState } from 'react';

import { checkout } from '../api/checkout.api';

import type {
	CheckoutResponse,
} from '../types/checkout.types';

export function useCheckout() {
	const [loading, setLoading] =
		useState(false);

	const [error, setError] =
		useState<string | null>(null);

	const createOrder =
		async (): Promise<CheckoutResponse> => {
			try {
				setLoading(true);
				setError(null);

				const response =
					await checkout();

				return response;
			} catch (error) {
				console.error(
					'Checkout failed:',
					error,
				);

				setError(
					'Unable to complete checkout.',
				);

				throw error;
			} finally {
				setLoading(false);
			}
		};

	return {
		createOrder,
		loading,
		error,
	};
}